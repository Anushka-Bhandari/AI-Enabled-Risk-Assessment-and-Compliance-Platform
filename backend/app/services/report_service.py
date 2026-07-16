from app.database import db

from app.models import (
    Assessment,
    AssessmentAnswer,
    User,
    University,
    ComplianceResult,
    ControlRiskResult,
    CategoryRiskResult,
)



class ReportService:

    def __init__(self, assessment_id):

        self.assessment_id = assessment_id

        self.assessment = None
        self.user = None
        self.university = None

        self.compliance_results = []
        self.control_risks = []
        self.category_risks = []
        self.answers = []
        self.framework_scores = {}

    # =====================================================
    # Load Data
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

    def _load_user(self):

        self.user = db.session.get(
            User,
            self.assessment.user_id
        )

    def _load_university(self):

        self.university = db.session.get(
            University,
            self.assessment.university_id
        )

    def _load_compliance_results(self):

        self.compliance_results = (
            ComplianceResult.query.filter_by(
                assessment_id=self.assessment_id
            ).all()
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


    def _load_framework_scores(self):

        from app.services.framework_service import FrameworkService

        self.framework_scores = FrameworkService(
            self.assessment_id
        ).calculate_scores()

    def _load_answers(self):

        self.answers = (
            AssessmentAnswer.query.filter_by(
                assessment_id=self.assessment_id
            ).all()
        )

    def _build_source_context(self):

        mode = self.assessment.assessment_mode
        answered_control_ids = {
            answer.question_id
            for answer in self.answers
        }
        total_controls = len(self.compliance_results)
        document_filenames = [
            document.original_filename
            for document in self.assessment.documents
        ]

        questionnaire_context = {
            "answered_controls": len(answered_control_ids),
            "total_controls": total_controls,
            "unanswered_controls": max(
                total_controls - len(answered_control_ids),
                0,
            ),
            "summary": (
                f"{len(answered_control_ids)} of {total_controls} "
                "controls were answered through the questionnaire."
            ),
        }

        document_context = {
            "uploaded_document_count": len(document_filenames),
            "original_filenames": document_filenames,
            "evidence_note": (
                "Compliance findings are based on evidence extracted from "
                "the selected uploaded documents."
            ),
        }

        if mode == "QUESTIONNAIRE":
            source_type = "Questionnaire"
        elif mode == "DOCUMENT":
            source_type = "Document Analysis"
        else:
            source_type = "Combined Assessment"

        return {
            "assessment_mode": mode,
            "source_type": source_type,
            "questionnaire": questionnaire_context,
            "documents": document_context,
        }

    # =====================================================
    # Public API
    # =====================================================

    def build_report_data(self):

        self._load_assessment()
        self._load_user()
        self._load_university()

        self._load_compliance_results()
        self._load_control_risks()
        self._load_category_risks()
        self._load_framework_scores()
        self._load_answers()

        report_data = {

            "assessment": {

                "assessment_id":
                    self.assessment.id,

                "assessment_mode":
                    self.assessment.assessment_mode,

                "created_at":
                    self.assessment.created_at.strftime(
                        "%d-%m-%Y %H:%M"
                    ),

                "status":
                    self.assessment.status,

                "compliance_score":
                    self.assessment.compliance_score,

                "overall_risk_score":
                    self.assessment.overall_risk_score,

                "risk_level":
                    self.assessment.risk_level,
            },

            "user": {

                "name": self.user.name,
                "email": self.user.email,
            },

            "university": {

                "id": self.university.id,
                "name": self.university.university_name,
                "email_domain": self.university.email_domain,
            },

            "compliance_results": [

                {
                    "control_id": item.control_id,
                    "status": item.compliance_status
                }

                for item in self.compliance_results
            ],

            "control_risks": [

                {
                    "control_id": item.control_id,
                    "risk_score": item.risk_score,
                    "risk_level": item.risk_level
                }

                for item in self.control_risks
            ],

            "category_risks": [

                {
                    "category": item.category,
                    "risk_score": item.risk_score,
                    "risk_level": item.risk_level
                }

                for item in self.category_risks
            ],

            "framework_scores": self.framework_scores,

            "source": self._build_source_context()

        }

        return report_data
