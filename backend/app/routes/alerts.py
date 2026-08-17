from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from app import db
from app.models import Alert, User

alerts_bp = Blueprint(
    "alerts",
    __name__,
    url_prefix="/alerts"
)

def get_current_user():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return None

    return user

# ==========================================================
# ALERT STATISTICS
# ==========================================================

@alerts_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_alert_stats():

    user = get_current_user()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    university_id = user.university_id

    return jsonify({
        "total": Alert.query.filter_by(
            university_id=university_id
        ).count(),

        "status": {
            "open": Alert.query.filter_by(
                university_id=university_id,
                status="OPEN"
            ).count(),

            "in_progress": Alert.query.filter_by(
                university_id=university_id,
                status="IN_PROGRESS"
            ).count(),

            "resolved": Alert.query.filter_by(
                university_id=university_id,
                status="RESOLVED"
            ).count(),

            "false_positive": Alert.query.filter_by(
                university_id=university_id,
                status="FALSE_POSITIVE"
            ).count()
        },

        "severity": {
            "critical": Alert.query.filter_by(
                university_id=university_id,
                severity="CRITICAL"
            ).count(),

            "high": Alert.query.filter_by(
                university_id=university_id,
                severity="HIGH"
            ).count(),

            "medium": Alert.query.filter_by(
                university_id=university_id,
                severity="MEDIUM"
            ).count(),

            "low": Alert.query.filter_by(
                university_id=university_id,
                severity="LOW"
            ).count()
        }
    }), 200


# ==========================================================
# GET ALL ALERTS
# ==========================================================

@alerts_bp.route("", methods=["GET"])
@jwt_required()
def get_all_alerts():

    user = get_current_user()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    alerts = Alert.query.filter_by(university_id=user.university_id
    ).order_by(Alert.created_at.desc()).all()

    return jsonify([
        alert.to_dict()
        for alert in alerts
    ]), 200


# ==========================================================
# GET SINGLE ALERT
# ==========================================================

@alerts_bp.route("/<int:alert_id>", methods=["GET"])
@jwt_required()
def get_alert(alert_id):

    user = get_current_user()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    alert = Alert.query.filter_by(
        id=alert_id,
        university_id=user.university_id
    ).first()

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
@jwt_required()
def update_alert_status(alert_id):

    user = get_current_user()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    alert = Alert.query.filter_by(
        id=alert_id,
        university_id=user.university_id
    ).first()

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
@jwt_required()
def get_recent_alerts():

    user = get_current_user()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    alerts = (
        Alert.query
        .filter_by(university_id=user.university_id)
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