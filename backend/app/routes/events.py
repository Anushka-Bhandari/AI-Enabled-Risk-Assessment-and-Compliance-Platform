"""
Event Routes.

Receives security events from the Event Generator.
"""

from flask import (
    Blueprint,
    jsonify,
    request
)

from app.services.log_collector import process_event


events = Blueprint(
    "events",
    __name__
)


# ============================================================
# RECEIVE EVENT
# ============================================================

@events.route(
    "/events",
    methods=["POST"]
)
def receive_event():
    """
    Receive one security event from the
    Event Generator.
    """

    event = request.get_json()

    if event is None:

        return jsonify({

            "success": False,

            "message": "No event data received."

        }), 400

    try:

        activity_log = process_event(
            event
        )

        return jsonify({

            "success": True,

            "message": "Event stored successfully.",

            "event_id": activity_log.event_id

        }), 201

    except ValueError as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 400

    except Exception:

        return jsonify({

            "success": False,

            "message": "Internal server error."

        }), 500