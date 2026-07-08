from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.models import (
    Assessment
)

summary_results = Blueprint(
    "summary_results",
    __name__
)

@summary_results.route(
    "/assessment/<int:assessment_id>/summary",
    methods=["GET"]
)
@jwt_required()
def get_assessment_summary(
    assessment_id
):

    assessment = Assessment.query.get(
        assessment_id
    )

    if not assessment:
        return jsonify({
            "error": "Assessment not found."
        }), 404

    return jsonify({

        "assessment_id":
            assessment.id,

        "assessment_mode":
            assessment.assessment_mode,

        "compliance_score":
            assessment.compliance_score,

        "risk_score":
            assessment.overall_risk_score,

        "risk_level":
            assessment.risk_level,

        "status":
            assessment.status,

        "created_at":
            assessment.created_at
    }), 200