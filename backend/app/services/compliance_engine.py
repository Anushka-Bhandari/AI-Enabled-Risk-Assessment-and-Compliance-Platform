import json

from app.services.control_requirements import (
    CONTROL_REQUIREMENTS
)

from collections import defaultdict

from app.database import db
from app.models import (
    Assessment,
    AssessmentAnswer,
    AssessmentControlResult,
)

from app.services.control_library import CONTROL_LIBRARY
from app.services.control_frameworks import (
    CONTROL_FRAMEWORKS,
    SUPPORTED_FRAMEWORKS,
)


class ComplianceEngine:
    """
    Production Compliance Engine.

    Input:
        assessment_id

    Output:
        Structured compliance result.
    """

    IMPLEMENTED = "Implemented"
    PARTIAL = "Partially Implemented"
    NOT_IMPLEMENTED = "Not Implemented"
    NOT_APPLICABLE = "Not Applicable"

    QUESTIONNAIRE = "QUESTIONNAIRE"
    DOCUMENT = "DOCUMENT"
    COMBINED = "COMBINED"

    def __init__(self, assessment_id: int):

        self.assessment_id = assessment_id

        self.assessment = None

        self.answers = {}

        self.documents = []

        self.document_text = ""

        self.control_results = []

        self.framework_scores = defaultdict(
            lambda: {
                "implemented": 0,
                "partial": 0,
                "missing": 0,
                "total": 0,
                "score": 0.0,
            }
        )

        self.overall_score = 0.0

    # ==========================================================
    # Public API
    # ==========================================================

    def run(self):

        self._load_assessment()

        self._load_questionnaire_answers()

        self._load_documents()

        self._evaluate_controls()

        self._calculate_framework_scores()

        self._calculate_overall_score()

        self._update_assessment()

        return self._build_result()

    # ==========================================================
    # Database Loading
    # ==========================================================

    def _load_assessment(self):

        self.assessment = db.session.get(
            Assessment,
            self.assessment_id,
        )

        if self.assessment is None:
            raise ValueError(
                f"Assessment {self.assessment_id} not found."
            )

    def _load_questionnaire_answers(self):

        records = (
            AssessmentAnswer.query.filter_by(
                assessment_id=self.assessment_id
            ).all()
        )

        self.answers = {
            answer.question_id: answer.answer
            for answer in records
        }

    def _load_documents(self):

        self.documents = self.assessment.documents

        self.document_text = "\n".join(
            [
                document.extracted_text
                for document in self.documents
                if document.extracted_text
            ]
        )

    # ==========================================================
    # Control Evaluation
    # ==========================================================

    def _evaluate_controls(self):

        mode = self.assessment.assessment_mode

        for index, control in enumerate(
            CONTROL_LIBRARY,
            start=1,
        ):

            questionnaire_status = None
            document_status = None

            evidence_source = None

            if mode in (
                self.QUESTIONNAIRE,
                self.COMBINED,
            ):

                questionnaire_status = self.answers.get(
                    str(index),
                    self.NOT_IMPLEMENTED,
                )

            if mode in (
                self.DOCUMENT,
                self.COMBINED,
            ):

                document_status = self._evaluate_document(
                    control
                )

            if mode == self.QUESTIONNAIRE:

                final_status = questionnaire_status
                evidence_source = "Questionnaire"

            elif mode == self.DOCUMENT:

                final_status = document_status
                evidence_source = "Documents"

            else:

                final_status = self._merge_results(
                    questionnaire_status,
                    document_status,
                )

                if questionnaire_status and document_status:
                    evidence_source = "Both"

                elif questionnaire_status:
                    evidence_source = "Questionnaire"

                else:
                    evidence_source = "Documents"

            requirements = CONTROL_REQUIREMENTS.get(
                control,
                []
            )

            implemented_requirements = []
            missing_requirements = []

            # =====================================================
            # Questionnaire Assessment
            # =====================================================

            if final_status == self.IMPLEMENTED:

                implemented_requirements = requirements.copy()

            elif final_status == self.PARTIAL:

                midpoint = len(requirements) // 2

                implemented_requirements = requirements[:midpoint]

                missing_requirements = requirements[midpoint:]

            elif final_status == self.NOT_IMPLEMENTED:

                missing_requirements = requirements.copy()

            self.control_results.append(
                {

                    "control": control,

                    "status": final_status,

                    "evidence_source": evidence_source,

                    "affected_frameworks": CONTROL_FRAMEWORKS[
                        control
                    ],

                    "implemented_requirements": implemented_requirements,

                    "missing_requirements": missing_requirements
                }
            )


    # ==========================================================
    # Document Evaluation
    # ==========================================================

    def _evaluate_document(self, control):

        if not self.document_text:
            return self.NOT_IMPLEMENTED

        text = self.document_text.lower()

        keywords = (
            control.replace("(", "")
            .replace(")", "")
            .replace("/", " ")
            .lower()
            .split()
        )

        matches = sum(
            1
            for keyword in keywords
            if keyword in text
        )

        if matches == len(keywords):
            return self.IMPLEMENTED

        if matches > 0:
            return self.PARTIAL

        return self.NOT_IMPLEMENTED


    # ==========================================================
    # Combined Mode
    # ==========================================================

    def _merge_results(
        self,
        questionnaire_status,
        document_status,
    ):

        if (
            questionnaire_status == self.IMPLEMENTED
            and
            document_status == self.IMPLEMENTED
        ):
            return self.IMPLEMENTED

        if (
            questionnaire_status == self.NOT_APPLICABLE
            and
            document_status == self.NOT_APPLICABLE
        ):
            return self.NOT_APPLICABLE

        if (
            questionnaire_status == self.PARTIAL
            or
            document_status == self.PARTIAL
        ):
            return self.PARTIAL

        if (
            questionnaire_status == self.IMPLEMENTED
            or
            document_status == self.IMPLEMENTED
        ):
            return self.PARTIAL

        return self.NOT_IMPLEMENTED


    # ==========================================================
    # Framework Scoring
    # ==========================================================

    def _calculate_framework_scores(self):

        for result in self.control_results:

            status = result["status"]

            for framework in result["frameworks"]:

                framework_score = self.framework_scores[
                    framework
                ]

                framework_score["total"] += 1

                if status == self.IMPLEMENTED:

                    framework_score["implemented"] += 1

                elif status == self.PARTIAL:

                    framework_score["partial"] += 1

                elif status == self.NOT_IMPLEMENTED:

                    framework_score["missing"] += 1

        for framework in SUPPORTED_FRAMEWORKS:

            score = self.framework_scores[
                framework
            ]

            if score["total"] == 0:
                continue

            earned = (
                score["implemented"]
                +
                score["partial"] * 0.5
            )

            score["score"] = round(
                earned / score["total"] * 100,
                2,
            )


    # ==========================================================
    # Overall Compliance
    # ==========================================================

    def _calculate_overall_score(self):

        total = len(self.control_results)

        if total == 0:
            self.overall_score = 0
            return

        earned = 0

        for result in self.control_results:

            if result["status"] == self.IMPLEMENTED:

                earned += 1

            elif result["status"] == self.PARTIAL:

                earned += 0.5

        self.overall_score = round(
            earned / total * 100,
            2,
        )


    # ==========================================================
    # Database Update
    # ==========================================================

    def _update_assessment(self):

        self.assessment.compliance_score = self.overall_score

        AssessmentControlResult.query.filter_by(
            assessment_id=self.assessment.id
        ).delete()

        for result in self.control_results:

            db.session.add(

                AssessmentControlResult(

                    assessment_id=self.assessment.id,

                    control_name=result["control"],

                    status=result["status"],

                    evidence_source=result["evidence_source"],

                    affected_frameworks=json.dumps(
                        result["affected_frameworks"]
                    ),

                    implemented_requirements=json.dumps(
                        result["implemented_requirements"]
                    ),

                    missing_requirements=json.dumps(
                        result["missing_requirements"]
                    )

                )

            )

        db.session.commit()


    # ==========================================================
    # Final Response
    # ==========================================================


    def _build_result(self):

        implemented = [
            control
            for control in self.control_results
            if control["status"] == self.IMPLEMENTED
        ]

        partial = [
            control
            for control in self.control_results
            if control["status"] == self.PARTIAL
        ]

        missing = [
            control
            for control in self.control_results
            if control["status"] == self.NOT_IMPLEMENTED
        ]

        return {

            "assessment_id": self.assessment.id,

            "assessment_mode": self.assessment.assessment_mode,

            "overall_compliance_score": self.overall_score,

            "overall_compliance_status": (
                "Compliant"
                if self.overall_score >= 80
                else "Needs Improvement"
            ),

            "framework_scores": dict(
                self.framework_scores
            ),

            "summary": {

                "implemented_controls": len(
                    implemented
                ),

                "partially_implemented_controls": len(
                    partial
                ),

                "not_implemented_controls": len(
                    missing
                )

            },

            "implemented_controls": implemented,

            "partially_implemented_controls": partial,

            "not_implemented_controls": missing,

            "control_results": self.control_results

        }