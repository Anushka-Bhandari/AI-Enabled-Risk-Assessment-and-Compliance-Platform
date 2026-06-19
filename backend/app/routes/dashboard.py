from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.database import db
from app.models import Assessment, User

dashboard = Blueprint("dashboard", __name__)


@dashboard.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard_page():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    assessments = (
        Assessment.query
        .filter_by(user_id=user_id)
        .order_by(Assessment.created_at.desc())
        .all()
    )

    history = []
    for a in assessments:
        history.append({
            "assessment_id": a.id,
            "university_id": a.university_id,
            "submitted_at": a.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            # "risk_score": a.risk_score,
            # "risk_level": a.risk_level
        })

    return jsonify({
        "user": user.name,
        "total_assessments": len(history),
        "history": history
    }), 200


@dashboard.route("/dashboard/analytics", methods=["GET"])
@jwt_required()
def get_analytics():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    assessments = (
        Assessment.query
        .filter_by(user_id=user_id)
        .order_by(Assessment.created_at.desc())
        .all()
    )

    total = len(assessments)

    if not assessments:
        return jsonify({"message": "No assessments found for this user"}), 404

    # Future analytics
    # low = sum(1 for a in assessments if a.risk_level == "Low")
    # medium = sum(1 for a in assessments if a.risk_level == "Medium")
    # high = sum(1 for a in assessments if a.risk_level == "High")

    return jsonify({
        "user": user.name,
        "total_assessments": total,
        # "risk_distribution": {
        #     "Low": low,
        #     "Medium": medium,
        #     "High": high
        # }
    }), 200
