from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.threat_analyzer import (
    ThreatAnalyzer,
)

from app.services.threat_analysis_service import (
    ThreatAnalysisService,
)

from app.models import Alert, User


threat_analysis_bp = Blueprint(
    "threat_analysis",
    __name__,
    url_prefix="/threat-analysis"
)

def get_current_user():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return None

    return user

@threat_analysis_bp.route(
    "/generate/<int:alert_id>",
    methods=["POST"]
)
@jwt_required()
def generate_threat_analysis(alert_id):

    try:

        user = get_current_user()

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        alert = Alert.query.filter_by(
            id=alert_id,
            university_id=user.university_id
        ).first()

        if not alert:
            return jsonify({
                "success": False,
                "message": "Alert not found"
            }), 404

        analysis = ThreatAnalyzer(
            alert_id
        ).run()

        return jsonify({

            "success": True,

            "message":
                "Threat analysis generated successfully.",

            "alert_id":
                alert_id,

            "data":
                analysis

        }), 201

    except Exception as e:

        return jsonify({

            "success": False,

            "message":
                str(e)

        }), 500



@threat_analysis_bp.route(
    "/<int:alert_id>",
    methods=["GET"]
)
@jwt_required()
def get_threat_analysis(alert_id):

    try:

        user = get_current_user()

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        alert = Alert.query.filter_by(
            id=alert_id,
            university_id=user.university_id
        ).first()

        if not alert:
            return jsonify({
                "success": False,
                "message": "Alert not found"
            }), 404

        analysis = ThreatAnalysisService(
            alert_id
        ).load()

        return jsonify({

            "success": True,

            "alert_id":
                alert_id,

            "data":
                analysis

        }), 200

    except Exception as e:

        return jsonify({

            "success": False,

            "message":
                str(e)

        }), 404