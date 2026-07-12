# from flask import Blueprint, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity

# from app.database import db
# from app.models import Assessment, User

# dashboard = Blueprint("dashboard", __name__)


# @dashboard.route("/dashboard", methods=["GET"])
# @jwt_required()
# def dashboard_page():
#     user_id = get_jwt_identity()

#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     assessments = (
#         Assessment.query
#         .filter_by(user_id=user_id)
#         .order_by(Assessment.created_at.desc())
#         .all()
#     )

#     history = []
#     for a in assessments:
#         history.append({
#             "assessment_id": a.id,
#             "university_id": a.university_id,
#             "submitted_at": a.created_at.strftime("%Y-%m-%d %H:%M:%S"),
#             # "risk_score": a.risk_score,
#             # "risk_level": a.risk_level
#         })

#     return jsonify({
#         "user": user.name,
#         "total_assessments": len(history),
#         "history": history
#     }), 200


# @dashboard.route("/dashboard/analytics", methods=["GET"])
# @jwt_required()
# def get_analytics():
#     user_id = get_jwt_identity()

#     user = User.query.get(user_id)

#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     assessments = (
#         Assessment.query
#         .filter_by(user_id=user_id)
#         .order_by(Assessment.created_at.desc())
#         .all()
#     )

#     total = len(assessments)

#     return jsonify({
#         "user": user.name,
#         "total_assessments": total
#     }), 200

from collections import defaultdict

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.database import db
from app.models import Assessment, User

dashboard = Blueprint("dashboard", __name__)

# Risk levels are stored on the Assessment row itself (risk_score / risk_level).
# Anything outside this set is treated as "Unknown" so bad/legacy data can't
# silently break the breakdown math below.
VALID_RISK_LEVELS = ("High", "Medium", "Low")


def _get_current_user():
    """Resolve the JWT identity to a User row, or None if not found.

    get_jwt_identity() returns whatever was stored at login time — usually a
    string — so we coerce it back to int before hitting the primary key
    lookup instead of trusting the raw value.
    """
    raw_identity = get_jwt_identity()
    try:
        user_id = int(raw_identity)
    except (TypeError, ValueError):
        return None, None
    return user_id, User.query.get(user_id)


def _serialize_assessment(a: Assessment) -> dict:
    return {
        "assessment_id": a.id,
        "university_id": a.university_id,
        "submitted_at": a.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "compliance_score": a.compliance_score,
        "risk_level": a.risk_level if a.risk_level in VALID_RISK_LEVELS else "Unknown",
    }


@dashboard.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard_page():
    user_id, user = _get_current_user()
    if user_id is None:
        return jsonify({"error": "Invalid user identity"}), 401
    if not user:
        return jsonify({"error": "User not found"}), 404

    # --- pagination -----------------------------------------------------
    try:
        page = max(int(request.args.get("page", 1)), 1)
        per_page = min(max(int(request.args.get("per_page", 20)), 1), 100)
    except ValueError:
        return jsonify({"error": "page and per_page must be integers"}), 400

    query = Assessment.query.filter_by(user_id=user_id)

    # --- optional filters -------------------------------------------------
    university_id = request.args.get("university_id")
    if university_id:
        try:
            query = query.filter(Assessment.university_id == int(university_id))
        except ValueError:
            return jsonify({"error": "university_id must be an integer"}), 400

    risk_level = request.args.get("risk_level")
    if risk_level:
        if risk_level not in VALID_RISK_LEVELS:
            return jsonify({"error": f"risk_level must be one of {VALID_RISK_LEVELS}"}), 400
        query = query.filter(Assessment.risk_level == risk_level)

    query = query.order_by(Assessment.created_at.desc())

    total = query.count()
    assessments = query.offset((page - 1) * per_page).limit(per_page).all()

    history = [_serialize_assessment(a) for a in assessments]

    return jsonify({
        "user": user.name,
        "total_assessments": total,
        "history": history,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page if total else 0,
        },
    }), 200


@dashboard.route("/dashboard/analytics", methods=["GET"])
@jwt_required()
def get_analytics():
    user_id, user = _get_current_user()
    if user_id is None:
        return jsonify({"error": "Invalid user identity"}), 401
    if not user:
        return jsonify({"error": "User not found"}), 404

    assessments = (
        Assessment.query
        .filter_by(user_id=user_id)
        .order_by(Assessment.created_at.asc())
        .all()
    )

    total = len(assessments)

    # --- risk breakdown ---------------------------------------------------
    risk_breakdown = {"High": 0, "Medium": 0, "Low": 0}
    risk_scores = []
    monthly = defaultdict(lambda: {"High": 0, "Medium": 0, "Low": 0, "total": 0})

    for a in assessments:
        level = a.risk_level if a.risk_level in VALID_RISK_LEVELS else None
        if level:
            risk_breakdown[level] += 1
        if a.compliance_score is not None:
            risk_scores.append(a.compliance_score)

        month_key = a.created_at.strftime("%Y-%m")
        monthly[month_key]["total"] += 1
        if level:
            monthly[month_key][level] += 1

    average_compliance_score = round(sum(risk_scores) / len(risk_scores), 1) if risk_scores else None

    # Compliance score: penalize High/Medium risk assessments. Falls back to
    # 100 when there's no history yet, and never drops below 58 so a single
    # bad quarter doesn't tank the score to zero.
    if total:
        penalty = risk_breakdown["High"] * 4 + risk_breakdown["Medium"] * 2
        compliance_score = max(58, min(100, 100 - penalty))
    else:
        compliance_score = 100

    monthly_trend = [
        {"month": month, **counts}
        for month, counts in sorted(monthly.items())
    ]

    latest_assessment = assessments[-1] if assessments else None

    return jsonify({
        "user": user.name,
        "total_assessments": total,
        "risk_breakdown": risk_breakdown,
        "average_risk_score": average_compliance_score,
        "compliance_score": compliance_score,
        "monthly_trend": monthly_trend,
        "latest_assessment_at": (
            latest_assessment.created_at.strftime("%Y-%m-%d %H:%M:%S")
            if latest_assessment else None
        ),
    }), 200

@dashboard.route("/dashboard/recent-assessments", methods=["GET"])
@jwt_required()
def recent_assessments():

    user_id, user = _get_current_user()

    if user_id is None:
        return jsonify({"error": "Invalid user identity"}), 401

    assessments = (
        Assessment.query
        .filter_by(user_id=user_id)
        .order_by(Assessment.created_at.desc())
        .limit(5)
        .all()
    )

    history = [_serialize_assessment(a) for a in assessments]

    return jsonify({
        "history": history
    }), 200