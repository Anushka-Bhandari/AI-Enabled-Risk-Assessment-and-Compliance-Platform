from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.models import ActivityLog

activity_logs_bp = Blueprint(
    "activity_logs",
    __name__,
    url_prefix="/activity-logs"
)

@activity_logs_bp.route("", methods=["GET"])
@jwt_required()
def get_all_activity_logs():

    logs = ActivityLog.query.order_by(
        ActivityLog.timestamp.desc()
    ).all()

    return jsonify([
        log.to_dict()
        for log in logs
    ]), 200

@activity_logs_bp.route("/<int:log_id>", methods=["GET"])
@jwt_required()
def get_activity_log(log_id):

    log = ActivityLog.query.get(log_id)

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

    logs = (
        ActivityLog.query
        .order_by(ActivityLog.timestamp.desc())
        .limit(50)
        .all()
    )

    return jsonify([
        log.to_dict()
        for log in logs
    ]), 200