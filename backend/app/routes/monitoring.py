from flask import Blueprint, jsonify, request

from app.models import User

from app.services.monitoring_risk_engine import (
    process_event
)


monitoring_bp = Blueprint(
    "monitoring",
    __name__
)


@monitoring_bp.route("/actors")
def get_actors():

    users = User.query.all()

    actors = []

    for user in users:

        actors.append({
            "university_id": user.university_id,
            "actor_type": "user",
            "actor_id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": "General"
        })

    return jsonify(actors)


@monitoring_bp.route(
    "/events",
    methods=["POST"]
)
def receive_event():

    event = request.get_json()

    # ----------------------------------------
    # Get assessment ID
    # ----------------------------------------

    assessment_id = event.get(
        "assessment_id"
    )

    if not assessment_id:

        return jsonify({
            "error": "assessment_id is required"
        }), 400

    # ----------------------------------------
    # Process monitoring event
    # ----------------------------------------

    analyses = process_event(
        assessment_id,
        event
    )

    return jsonify({
        "event": event,
        "analyses": analyses
    })