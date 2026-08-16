import json
import logging
import re
import time
from typing import Dict, Any

from app.database import db

from app.models import (
    Alert,
    ActivityLog,
    ThreatAnalysis,
)

from app.prompts.threat_analysis_prompt import (
    build_threat_analysis_prompt,
)

from app.services.llm_client import (
    LLMClient,
)

logger = logging.getLogger(__name__)


class ThreatAnalyzer:
    """
    Generates AI-powered threat analysis for an alert.

    Flow

    Alert
        ↓
    Activity Log
        ↓
    Prompt Builder
        ↓
    Groq LLM
        ↓
    Structured Threat Analysis
        ↓
    Database
    """

    MAX_RETRIES = 3
    RETRY_DELAY = 2

    def __init__(self, alert_id: int):

        self.alert_id = alert_id

        self.alert = None

        self.activity_log = None

        self.analysis = None

        self.llm = LLMClient()


    # =====================================================
    # Database Loading
    # =====================================================

    def _load_existing_analysis(self):

        self.analysis = (
            ThreatAnalysis.query.filter_by(
                alert_id=self.alert_id
            ).first()
        )

        return self.analysis

    def _load_alert(self):

        self.alert = db.session.get(
            Alert,
            self.alert_id
        )

        if not self.alert:

            raise ValueError(
                f"Alert {self.alert_id} not found."
            )

    def _load_activity_log(self):
        """
        Load the Activity Log associated with the alert.
        """
        self.activity_log = db.session.get(
            ActivityLog,
            self.alert.activity_log_id
        )

        if not self.activity_log:
            raise ValueError(
                f"Activity log {self.alert.activity_log_id} "
                f"not found for Alert {self.alert.id}."
            )

    # =====================================================
    # Context Builder
    # =====================================================

    def _build_context(self):

        return {

            "alert": {

                "id": self.alert.id,

                "source_event_id": self.alert.source_event_id,

                "university_id": self.alert.university_id,

                "rule_id": self.alert.rule_id,

                "title": self.alert.title,

                "description": self.alert.description,

                "severity": self.alert.severity,

                "status": self.alert.status,

                "assigned_role": self.alert.assigned_role,

                "created_at": (
                    self.alert.created_at.isoformat()
                    if self.alert.created_at else None
                )
            },

            "activity_log": {

                "event_id": self.activity_log.event_id,

                "university_id": self.activity_log.university_id,

                "user_name": self.activity_log.user_name,

                "user_email": self.activity_log.user_email,

                "role": self.activity_log.role,

                "department": self.activity_log.department,

                "timestamp": (
                    self.activity_log.timestamp.isoformat()
                    if self.activity_log.timestamp else None
                ),

                "event_type": self.activity_log.event_type,

                "event_name": self.activity_log.event_name,

                "resource": self.activity_log.resource,

                "ip_address": self.activity_log.ip_address,

                "device": self.activity_log.device,

                "location": self.activity_log.location,

                "status": self.activity_log.status,

                "event_metadata": (
                    self.activity_log.event_metadata
                    if self.activity_log.event_metadata
                    else {}
                )
            }

        }

    # =====================================================
    # Prompt Builder
    # =====================================================

    def _build_prompt(self, context):

        return build_threat_analysis_prompt(

            alert=context["alert"],

            activity_log=context["activity_log"]

        )

    # =====================================================
    # LLM
    # =====================================================

    def _call_llm(self, context):

        prompt = self._build_prompt(context)

        last_exception = None

        for attempt in range(self.MAX_RETRIES):

            try:

                logger.info(
                    "Threat Analyzer: Calling LLM (Attempt %s)",
                    attempt + 1
                )

                response = self.llm.generate(
                    system_prompt=prompt["system_prompt"],
                    user_prompt=prompt["user_prompt"]
                )

                return response

            except Exception as exc:

                last_exception = exc

                logger.exception(
                    "Threat Analyzer LLM call failed (Attempt %s)",
                    attempt + 1
                )

                if attempt < self.MAX_RETRIES - 1:

                    time.sleep(
                        self.RETRY_DELAY
                    )

        raise RuntimeError(
            "Threat Analyzer failed after "
            f"{self.MAX_RETRIES} attempts."
        ) from last_exception

    # =====================================================
    # JSON Parsing
    # =====================================================

    def _parse_response(self, response):

        try:

            return json.loads(response)

        except json.JSONDecodeError:

            cleaned = re.sub(
                r"```json|```",
                "",
                response,
                flags=re.IGNORECASE
            ).strip()

            match = re.search(
                r"\{.*\}",
                cleaned,
                flags=re.DOTALL
            )

            if not match:

                raise ValueError(
                    "Threat Analyzer returned invalid JSON."
                )

            return json.loads(
                match.group()
            )


    # =====================================================
    # Response Validation
    # =====================================================

    def _validate_response(self, parsed):

        required_fields = {

            "summary",

            "likely_attack_type",

            "risk_level",

            "impact",

            "recommended_actions",

            "investigation_steps",

            "confidence_score"

        }

        missing = required_fields - parsed.keys()

        if missing:

            raise ValueError(

                f"Threat analysis missing fields: {missing}"

            )

        if parsed["risk_level"] not in {

            "LOW",

            "MEDIUM",

            "HIGH",

            "CRITICAL"

        }:

            raise ValueError(

                "Invalid risk level returned by AI."

            )

        if not isinstance(

            parsed["recommended_actions"],

            list

        ):

            raise ValueError(

                "recommended_actions must be a list."

            )

        if not isinstance(

            parsed["investigation_steps"],

            list

        ):

            raise ValueError(

                "investigation_steps must be a list."

            )

        if not isinstance(

            parsed["confidence_score"],

            (float, int)

        ):

            raise ValueError(

                "confidence_score must be numeric."

            )

        if not (

            0.0 <=

            float(parsed["confidence_score"])

            <= 1.0

        ):

            raise ValueError(

                "confidence_score must be between 0 and 1."

            )

        return parsed


    # =====================================================
    # Database Persistence
    # =====================================================

    def _save_analysis(self, parsed):

        analysis = ThreatAnalysis(

            alert_id=self.alert.id,

            summary=parsed["summary"],

            likely_attack_type=parsed["likely_attack_type"],

            risk_level=parsed["risk_level"],

            impact=parsed["impact"],

            recommended_actions=parsed["recommended_actions"],

            investigation_steps=parsed["investigation_steps"],

            confidence_score=float(
                parsed["confidence_score"]
            ),

            model_name="llama-3.3-70b-versatile",

            analysis_version="v1"

        )

        try:

            db.session.add(analysis)

            db.session.commit()

        except Exception:

            db.session.rollback()

            raise

        self.analysis = analysis

        logger.info(
            "Threat analysis saved for Alert %s",
            self.alert.id
        )

        return analysis

    # =====================================================
    # Public API
    # =====================================================

    def run(self):

        logger.info(
            "Threat Analyzer started for Alert %s",
            self.alert_id
        )

        # ----------------------------------
        # Return cached analysis if exists
        # ----------------------------------

        existing = self._load_existing_analysis()

        if existing:

            logger.info(
                "Threat analysis already exists for Alert %s",
                self.alert_id
            )

            return existing.to_dict()

        # ----------------------------------
        # Load Database Records
        # ----------------------------------

        self._load_alert()

        self._load_activity_log()

        logger.info(
            "Alert and Activity Log loaded successfully."
        )

        # ----------------------------------
        # Build Context
        # ----------------------------------

        context = self._build_context()

        logger.info(
            "Threat analysis context prepared."
        )

        # ----------------------------------
        # Call LLM
        # ----------------------------------

        response = self._call_llm(context)

        logger.info(
            "LLM response received."
        )

        # ----------------------------------
        # Parse & Validate
        # ----------------------------------

        parsed = self._parse_response(
            response
        )

        self._validate_response(
            parsed
        )

        logger.info(
            "LLM response validated successfully."
        )

        # ----------------------------------
        # Save Analysis
        # ----------------------------------

        analysis = self._save_analysis(
            parsed
        )

        logger.info(
            "Threat Analyzer completed successfully."
        )

        return analysis.to_dict()