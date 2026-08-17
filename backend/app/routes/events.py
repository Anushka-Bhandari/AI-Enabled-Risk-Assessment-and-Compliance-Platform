from flask import (
    Blueprint,
    jsonify,
    request
)

from app.services.log_collector import process_event
from app.extensions import socketio


events = Blueprint(
    "events",
    __name__
)


@events.route(
    "/events",
    methods=["POST"]
)
def receive_event():


    event = request.get_json()


    if event is None:

        return jsonify({

            "success": False,
            "message": "No event data received."

        }),400


    try:

        # 1. SAVE INTO DATABASE
        activity_log = process_event(event)


        # 2. SEND LIVE STREAM
        socketio.emit(
            "new_event",
            {
                "event_id": activity_log.event_id,

                "university_id": activity_log.university_id,

                "actor_type": activity_log.actor_type,
                "actor_id": activity_log.actor_id,

                "user_name": activity_log.user_name,
                "user_email": activity_log.user_email,
                "role": activity_log.role,
                "department": activity_log.department,

                "event_type": activity_log.event_type,
                "event_name": activity_log.event_name,
                "resource": activity_log.resource,

                "ip_address": activity_log.ip_address,
                "status": activity_log.status,
                "timestamp": str(activity_log.timestamp)
            }
        )


        return jsonify({

            "success": True,

            "message": "Event stored successfully.",

            "event_id": activity_log.event_id

        }),201


    except ValueError as e:


        return jsonify({

            "success":False,

            "message":str(e)

        }),400


    except Exception as e:

        print(e)

        return jsonify({

            "success":False,

            "message":"Internal server error."

        }),500