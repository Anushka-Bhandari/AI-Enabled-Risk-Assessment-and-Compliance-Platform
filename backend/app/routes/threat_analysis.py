from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.services.threat_analyzer import (
    ThreatAnalyzer,
)

from app.services.threat_analysis_service import (
    ThreatAnalysisService,
)


threat_analysis_bp = Blueprint(
    "threat_analysis",
    __name__,
    url_prefix="/threat-analysis"
)

@threat_analysis_bp.route(
    "/generate/<int:alert_id>",
    methods=["POST"]
)
@jwt_required()
def generate_threat_analysis(alert_id):

    try:

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