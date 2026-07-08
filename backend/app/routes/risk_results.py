from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.models import (
    Assessment,
    ControlRiskResult,
    CategoryRiskResult
)

risk_results = Blueprint(
    "risk_results",
    __name__
)

@risk_results.route(
    "/assessment/<int:assessment_id>/risk",
    methods=["GET"]
)
@jwt_required()
def get_risk_results(assessment_id):

    assessment = Assessment.query.get(
        assessment_id
    )

    if not assessment:
        return jsonify({
            "error": "Assessment not found."
        }), 404

    control_results = (
        ControlRiskResult.query.filter_by(
            assessment_id=assessment_id
        ).all()
    )

    category_results = (
        CategoryRiskResult.query.filter_by(
            assessment_id=assessment_id
        ).all()
    )

    return jsonify({

        "assessment_id":
            assessment.id,

        "overall_risk_score":
            assessment.overall_risk_score,

        "overall_risk_level":
            assessment.risk_level,

        "control_risks": [

            {
                "control_id":
                    result.control_id,

                "risk_score":
                    result.risk_score,

                "risk_level":
                    result.risk_level
            }

            for result in control_results
        ],

        "category_risks": [

            {
                "category":
                    result.category,

                "risk_score":
                    result.risk_score,

                "risk_level":
                    result.risk_level
            }

            for result in category_results
        ]
    }), 200