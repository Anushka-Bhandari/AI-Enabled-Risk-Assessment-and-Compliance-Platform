from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models import ActivityLog, User

activity_logs_bp = Blueprint(
    "activity_logs",
    __name__,
    url_prefix="/activity-logs"
)

def get_current_user():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return None

    return user

@activity_logs_bp.route("", methods=["GET"])
@jwt_required()
def get_all_activity_logs():

    user = get_current_user()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    logs = ActivityLog.query.filter_by(university_id=user.university_id).order_by(ActivityLog.timestamp.desc()).all()

    return jsonify([
        log.to_dict()
        for log in logs
    ]), 200

@activity_logs_bp.route("/<int:log_id>", methods=["GET"])
@jwt_required()
def get_activity_log(log_id):

    user = get_current_user()
    
    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    log = ActivityLog.query.filter_by(
        id=log_id,
        university_id=user.university_id).first()

    if not log:
        return jsonify({
            "message": "Activity log not found"
        }), 404

    return jsonify(
        log.to_dict()
    ), 200

@activity_logs_bp.route("/recent", methods=["GET"])
@jwt_required()
def recent_activity_logs():

    user = get_current_user()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    logs = (
        ActivityLog.query
        .filter_by(university_id=user.university_id)
        .order_by(ActivityLog.timestamp.desc())
        .limit(50)
        .all()
    )

    return jsonify([
        log.to_dict()
        for log in logs
    ]), 200