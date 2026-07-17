import json
import logging
import re
from multiprocessing import context
import time
from typing import Any, Dict, List

from app.database import db

from app.models import (
    Assessment,
    ComplianceResult,
    ControlRiskResult,
    CategoryRiskResult,
    Recommendation,
)

from app.prompts.recommendation_prompt import (
    build_recommendation_prompt,
)

from app.services.control_library import (
    get_control,
)

from app.services.llm_client import (
    LLMClient,
)

from app.services.recommendation_metadata import (
    get_priority,
    get_estimated_effort,
    get_implementation_timeline,
    get_implementation_cost
)

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """
    Generates AI-powered cybersecurity recommendations
    from completed assessment results.

    Flow

    Assessment
        ↓
    Compliance Results
        ↓
    Risk Results
        ↓
    Control Library
        ↓
    Prompt Builder
        ↓
    Groq LLM
        ↓
    Structured JSON Recommendations
    """

    MAX_RETRIES = 3
    RETRY_DELAY = 2

    def __init__(self, assessment_id: int):

        self.assessment_id = assessment_id

        self.assessment = None

        self.compliance_results: List[ComplianceResult] = []

        self.control_risks: List[ControlRiskResult] = []

        self.category_risks: List[CategoryRiskResult] = []

        self.control_metadata: Dict[str, Dict] = {}

        self.llm = LLMClient()

    # =====================================================
    # Database Loading
    # =====================================================

    def _load_assessment(self):

        self.assessment = db.session.get(
            Assessment,
            self.assessment_id
        )

        if not self.assessment:
            raise ValueError(
                f"Assessment {self.assessment_id} not found."
            )

    def _load_compliance_results(self):

        self.compliance_results = (
            ComplianceResult.query.filter_by(
                assessment_id=self.assessment_id
            ).all()
        )

        if not self.compliance_results:
            raise ValueError(
                "No compliance results found."
            )

    def _load_control_risks(self):

        self.control_risks = (
            ControlRiskResult.query.filter_by(
                assessment_id=self.assessment_id
            ).all()
        )

    def _load_category_risks(self):

        self.category_risks = (
            CategoryRiskResult.query.filter_by(
                assessment_id=self.assessment_id
            ).all()
        )

    # =====================================================
    # Control Library
    # =====================================================

    def _load_control_metadata(self):

        self.control_metadata = {}

        for result in self.compliance_results:

            control = get_control(
                result.control_id
            )

            self.control_metadata[
                result.control_id
            ] = control

    # =====================================================
    # Context Builder
    # =====================================================

    def _build_context(self):

        controls_requiring_action = []

        for compliance_result in self.compliance_results:

            # Skip controls that are already implemented
            if compliance_result.compliance_status == "IMPLEMENTED":
                continue

            control = self.control_metadata[
                compliance_result.control_id
            ]

            risk = next(
                (
                    item
                    for item in self.control_risks
                    if item.control_id == compliance_result.control_id
                ),
                None
            )

            controls_requiring_action.append({

                "control_id":
                    control["id"],

                "control_name":
                    control["name"],

                "category":
                    control["category"],

                "status":
                    compliance_result.compliance_status,

                "risk_level":
                    risk.risk_level if risk else "Unknown",

                "risk_score":
                    round(risk.risk_score, 2) if risk else 0,

                "weight":
                    control["weight"],

                "priority":
                    get_priority(
                        risk.risk_level if risk else "Low"
                    ),

                "estimated_effort":
                    get_estimated_effort(
                        control["weight"]
                    ),

                "implementation_timeline":
                    get_implementation_timeline(
                        control["weight"]
                    ),

                "implementation_cost":
                    get_implementation_cost(
                        control["weight"]
                    ),

                "risk_description":
                    control["risk_description"],

                **(
                    {
                        "frameworks": control["frameworks"]
                    }
                    if control.get("frameworks")
                    else {}
                ),

                **(
                    {
                        "missing_requirements": control["missing_requirements"]
                    }
                    if control.get("missing_requirements")
                    else {}
                ),

                **(
                    {
                        "implementation_guidance": control["implementation_guidance"]
                    }
                    if control.get("implementation_guidance")
                    else {}
                )
            })

        category_summary = [

            {

                "category":
                    category.category,

                "risk_score":
                    round(category.risk_score, 2),

                "risk_level":
                    category.risk_level

            }

            for category in self.category_risks

        ]

        controls_requiring_action.sort(
            key=lambda item: (
                item["risk_score"],
                item["weight"],
            ),
            reverse=True,
        )

        controls_requiring_action = controls_requiring_action[:10]

        return {

            "assessment": {

                "assessment_id":
                    self.assessment.id,

                "assessment_mode":
                    self.assessment.assessment_mode,

                "overall_compliance_score":
                    self.assessment.compliance_score,

                "overall_risk_score":
                    self.assessment.overall_risk_score,

                "overall_risk_level":
                    self.assessment.risk_level

            },

            "category_risks":
                category_summary,

            "controls_requiring_action":
                controls_requiring_action

        }
    
    # =====================================================
    # Prompt Builder
    # =====================================================

    def _build_prompt(self, context):

        return build_recommendation_prompt(context)

    # =====================================================
    # LLM
    # =====================================================

    def _call_llm(self, context):

        prompt = self._build_prompt(context)

        last_exception = None

        for attempt in range(self.MAX_RETRIES):

            try:

                logger.info(
                    "Recommendation Engine: Calling LLM (Attempt %s)",
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
                    "LLM call failed (Attempt %s)",
                    attempt + 1
                )

                if attempt < self.MAX_RETRIES - 1:

                    time.sleep(
                        self.RETRY_DELAY
                    )

        raise RuntimeError(
            f"Unable to obtain LLM response. {last_exception}"
        )

    # =====================================================
    # JSON Parsing
    # =====================================================

    import json

    def _parse_response(self, response):

        # -----------------------------
        # Step 1: Try parsing directly
        # -----------------------------

        try:

            parsed = json.loads(response)

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
                    "Recommendation engine received invalid JSON."
                )

            parsed = json.loads(
                match.group()
            )

        # -----------------------------
        # Step 2: Validate top-level keys
        # -----------------------------

        required = {

            "executive_summary",

            "overall_priority",

            "immediate_actions",

            "recommendations"

        }

        missing = required - parsed.keys()

        if missing:

            raise ValueError(
                f"LLM response missing keys: {missing}"
            )

        # -----------------------------
        # Step 3: Validate recommendations
        # -----------------------------

        for recommendation in parsed["recommendations"]:

            required_fields = {

                "control_id",

                "control_name",

                "priority",

                "estimated_effort",

                "implementation_timeline",

                "implementation_cost",

                "root_cause",

                "recommendation",

                "technical_steps",

                "policy_steps",

                "business_impact",

                "success_metrics",

                "reference"

            }

            missing_fields = (

                required_fields
                - recommendation.keys()

            )

            if missing_fields:

                raise ValueError(

                    f"Recommendation for "

                    f"{recommendation.get('control_id')} "

                    f"is missing "

                    f"{missing_fields}"

                )

        return parsed
    

    def _save_recommendations(self, parsed):

        Recommendation.query.filter_by(
            assessment_id=self.assessment_id
        ).delete()

        for item in parsed["recommendations"]:

            db.session.add(

                Recommendation(

                    assessment_id=self.assessment_id,

                    control_id=item["control_id"],

                    control_name=item["control_name"],

                    priority=item["priority"],

                    estimated_effort=item["estimated_effort"],

                    implementation_timeline=item["implementation_timeline"],

                    implementation_cost=item["implementation_cost"],

                    root_cause=item["root_cause"],

                    recommendation=item["recommendation"],

                    technical_steps=item["technical_steps"],

                    policy_steps=item["policy_steps"],

                    business_impact=item["business_impact"],

                    success_metrics=item["success_metrics"],

                    reference=item["reference"],

                )

            )

        db.session.commit()


    # =====================================================
    # Public API
    # =====================================================

    def run(self):
        print("========== ENTERED RecommendationEngine.run() ==========")

        logger.info(
            "Recommendation Engine started for Assessment %s",
            self.assessment_id
        )

        self._load_assessment()
        print("Assessment loaded")

        self._load_compliance_results()
        print("Compliance results loaded")

        self._load_control_risks()
        print("Control risks loaded")

        self._load_category_risks()
        print("Category risks loaded")

        self._load_control_metadata()
        print("Metadata loaded")

        context = self._build_context()
        print("Context built")

        logger.info(
            "Recommendation context prepared."
        )

        response = self._call_llm(context)
        print("LLM response received")

        # Currently build_recommendation_prompt()
        # rebuilds the prompt from models.
        #
        # Later we can pass `context` directly into
        # the prompt builder if we want to avoid
        # duplicate processing.

        parsed = self._parse_response(response)
        print("Response parsed")

        self._save_recommendations(parsed)
        print("Recommendations saved")
        
        logger.info(
            "Recommendation Engine completed successfully."
        )

        return parsed