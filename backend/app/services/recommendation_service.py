from app.models import Recommendation


class RecommendationService:
    """
    Loads stored recommendations from the database.

    This service never calls the LLM.
    It simply reconstructs the recommendation JSON
    expected by the PDFService and future APIs.
    """

    def __init__(self, assessment_id):

        self.assessment_id = assessment_id

    def load(self):

        recommendations = (
            Recommendation.query.filter_by(
                assessment_id=self.assessment_id
            ).all()
        )

        if not recommendations:

            return {

                "executive_summary": None,

                "overall_priority": None,

                "immediate_actions": [],

                "recommendations": []

            }

        overall_priority = recommendations[0].priority

        immediate_actions = [
            recommendation.recommendation
            for recommendation in recommendations[:3]
        ]

        executive_summary = (
            f"{len(recommendations)} security controls "
            f"require implementation."
        )

        return {

            "executive_summary": executive_summary,

            "overall_priority": overall_priority,

            "immediate_actions": immediate_actions,

            "recommendations": [

                {

                    "control_id":
                        recommendation.control_id,

                    "control_name":
                        recommendation.control_name,

                    "priority":
                        recommendation.priority,

                    "estimated_effort":
                        recommendation.estimated_effort,

                    "implementation_timeline":
                        recommendation.implementation_timeline,

                    "implementation_cost":
                        recommendation.implementation_cost,

                    "root_cause":
                        recommendation.root_cause,

                    "recommendation":
                        recommendation.recommendation,

                    "technical_steps":
                        recommendation.technical_steps,

                    "policy_steps":
                        recommendation.policy_steps,

                    "business_impact":
                        recommendation.business_impact,

                    "success_metrics":
                        recommendation.success_metrics,

                    "reference":
                        recommendation.reference

                }

                for recommendation in recommendations

            ]

        }