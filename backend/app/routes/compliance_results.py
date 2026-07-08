from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.models import (
    Assessment,
    ComplianceResult
)

compliance_results = Blueprint(
    "compliance_results",
    __name__
)

@compliance_results.route(
    "/assessment/<int:assessment_id>/compliance",
    methods=["GET"]
)
@jwt_required()
def get_compliance_results(assessment_id):

    assessment = Assessment.query.get(
        assessment_id
    )

    if not assessment:
        return jsonify({
            "error": "Assessment not found."
        }), 404

    results = ComplianceResult.query.filter_by(
        assessment_id=assessment_id
    ).all()

    return jsonify({

        "assessment_id": assessment.id,

        "compliance_score":
            assessment.compliance_score,

        "results": [
            {
                "control_id": r.control_id,
                "status": r.compliance_status
            }
            for r in results
        ]
    }), 200