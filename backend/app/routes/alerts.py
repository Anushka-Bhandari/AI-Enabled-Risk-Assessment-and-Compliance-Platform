from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from datetime import datetime
from app import db
from app.models import Alert

alerts_bp = Blueprint(
    "alerts",
    __name__,
    url_prefix="/alerts"
)

@alerts_bp.route("", methods=["GET"])
@jwt_required()
def get_all_alerts():
    alerts = Alert.query.order_by(Alert.created_at.desc()).all()

    return jsonify([
        alert.to_dict() for alert in alerts
    ]), 200


@alerts_bp.route("/<int:alert_id>", methods=["GET"])
@jwt_required()
def get_alert(alert_id):
    alert = Alert.query.get(alert_id)

    if not alert:
        return jsonify({
            "message": "Alert not found"
        }), 404

    return jsonify(alert.to_dict()), 200


@alerts_bp.route("/<int:alert_id>/status", methods=["PATCH"])
@jwt_required()
def update_alert_status(alert_id):
    alert = Alert.query.get(alert_id)

    if not alert:
        return jsonify({
            "message": "Alert not found"
        }), 404

    data = request.get_json()

    if not data or "status" not in data:
        return jsonify({
            "message": "Status is required"
        }), 400

    allowed_statuses = [
        "OPEN",
        "IN_PROGRESS",
        "RESOLVED",
        "FALSE_POSITIVE"
    ]

    status = data["status"].upper()

    if status not in allowed_statuses:
        return jsonify({
            "message": "Invalid status"
        }), 400

    alert.status = status

    if status == "RESOLVED":
        alert.resolved_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "Alert status updated successfully",
        "alert": alert.to_dict()
    }), 200