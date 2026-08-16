from flask import Blueprint, jsonify, request
from app.services.rbac import role_required
from datetime import datetime

from app import db
from app.models import Alert

alerts_bp = Blueprint(
    "alerts",
    __name__,
    url_prefix="/alerts"
)

# ==========================================================
# ALERT STATISTICS
# ==========================================================

@alerts_bp.route("/stats", methods=["GET"])
@role_required(
    "SECURITY_OFFICER",
    "IT_ADMIN",
    "DIRECTOR",
    "PRINCIPAL"
)
def get_alert_stats():

    return jsonify({
        "total": Alert.query.count(),

        "status": {
            "open": Alert.query.filter_by(
                status="OPEN"
            ).count(),

            "in_progress": Alert.query.filter_by(
                status="IN_PROGRESS"
            ).count(),

            "resolved": Alert.query.filter_by(
                status="RESOLVED"
            ).count(),

            "false_positive": Alert.query.filter_by(
                status="FALSE_POSITIVE"
            ).count()
        },

        "severity": {
            "critical": Alert.query.filter_by(
                severity="CRITICAL"
            ).count(),

            "high": Alert.query.filter_by(
                severity="HIGH"
            ).count(),

            "medium": Alert.query.filter_by(
                severity="MEDIUM"
            ).count(),

            "low": Alert.query.filter_by(
                severity="LOW"
            ).count()
        }
    }), 200


# ==========================================================
# GET ALL ALERTS
# ==========================================================

@alerts_bp.route("", methods=["GET"])
@role_required(
    "SECURITY_OFFICER",
    "IT_ADMIN",
    "DIRECTOR",
    "PRINCIPAL"
)
def get_all_alerts():

    alerts = Alert.query.order_by(
        Alert.created_at.desc()
    ).all()

    return jsonify([
        alert.to_dict()
        for alert in alerts
    ]), 200


# ==========================================================
# GET SINGLE ALERT
# ==========================================================

@alerts_bp.route("/<int:alert_id>", methods=["GET"])
@role_required(
    "SECURITY_OFFICER",
    "IT_ADMIN",
    "DIRECTOR",
    "PRINCIPAL"
)
def get_alert(alert_id):

    alert = Alert.query.get(alert_id)

    if not alert:
        return jsonify({
            "message": "Alert not found"
        }), 404

    return jsonify(
        alert.to_dict()
    ), 200


# ==========================================================
# UPDATE ALERT STATUS
# ==========================================================

@alerts_bp.route("/<int:alert_id>/status", methods=["PATCH"])
@role_required(
    "SECURITY_OFFICER",
    "IT_ADMIN",
    "DIRECTOR",
    "PRINCIPAL"
)
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

# ==========================================================
# RECENT ALERTS
# ==========================================================

@alerts_bp.route("/recent", methods=["GET"])
@role_required(
    "SECURITY_OFFICER",
    "IT_ADMIN",
    "DIRECTOR",
    "PRINCIPAL"
)
def get_recent_alerts():

    alerts = (
        Alert.query
        .order_by(Alert.triggered_at.desc())
        .limit(5)
        .all()
    )

    return jsonify([
        {
            "id": alert.id,
            "title": alert.title,
            "severity": alert.severity,
            "status": alert.status,
            "category": alert.category,
            "user_name": alert.user_name,
            "triggered_at": alert.triggered_at.isoformat()
                if alert.triggered_at else None
        }
        for alert in alerts
    ]), 200