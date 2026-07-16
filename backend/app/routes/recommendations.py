from flask import Blueprint, jsonify

from app.services.recommendation_engine import RecommendationEngine
from app.services.recommendation_service import RecommendationService


recommendation_bp = Blueprint(
    "recommendation",
    __name__,
    url_prefix="/recommendations"
)


@recommendation_bp.route(
    "/generate/<int:assessment_id>",
    methods=["POST"]
)
def generate_recommendations(assessment_id):

    try:

        RecommendationEngine(
            assessment_id
        ).run()

        return jsonify({

            "success": True,

            "message": "Recommendations generated successfully.",

            "assessment_id": assessment_id

        }), 201

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


@recommendation_bp.route(
    "/<int:assessment_id>",
    methods=["GET"]
)
def get_recommendations(assessment_id):

    try:

        recommendations = RecommendationService(
            assessment_id
        ).load()

        return jsonify({

            "success": True,

            "assessment_id": assessment_id,

            "data": recommendations

        }), 200

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500