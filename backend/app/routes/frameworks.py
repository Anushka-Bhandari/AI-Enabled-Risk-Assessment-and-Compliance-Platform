from flask import Blueprint, jsonify

from app.services.framework_service import FrameworkService


framework_bp = Blueprint(
    "frameworks",
    __name__,
    url_prefix="/frameworks"
)


@framework_bp.route(
    "/<int:assessment_id>",
    methods=["GET"]
)
def framework_scores(assessment_id):

    try:

        framework_scores = FrameworkService(
            assessment_id
        ).calculate_scores()

        return jsonify({

            "success": True,

            "assessment_id": assessment_id,

            "framework_scores": framework_scores

        }), 200

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500