"""
Log Collector Service.

Receives security events from the Event Generator,
validates them, normalizes the incoming data and
prepares them for database storage.

After successful storage, the Detection Engine
will be triggered.
"""

from datetime import datetime
from app.extensions import socketio

from app.models import ActivityLog
from app.database import db


# ============================================================
# REQUIRED EVENT FIELDS
# ============================================================

REQUIRED_FIELDS = [

    "event_id",

    "user_name",

    "user_email",

    "role",

    "department",

    "timestamp",

    "event_type",

    "event_name",

    "resource",

    "ip_address",

    "device",

    "location",

    "status",

    "metadata"

]


# ============================================================
# VALIDATE EVENT
# ============================================================

def validate_event(event):
    """
    Validate the incoming event payload.
    """

    if not isinstance(event, dict):

        raise ValueError(
            "Invalid event payload."
        )

    missing_fields = [

        field

        for field in REQUIRED_FIELDS

        if field not in event

    ]

    if missing_fields:

        raise ValueError(

            f"Missing required fields: {', '.join(missing_fields)}"

        )

    return event


# ============================================================
# NORMALIZE EVENT
# ============================================================

def normalize_event(event):
    """
    Normalize incoming event values before
    storing them in the database.
    """

    return {

        "event_id": event["event_id"],

        "user_name": event["user_name"].strip(),

        "user_email": event["user_email"].strip().lower(),

        "role": event["role"].strip(),

        "department": event["department"].strip(),

        "timestamp": datetime.fromisoformat(
            event["timestamp"]
        ),

        "event_type": event["event_type"].strip(),

        "event_name": event["event_name"].strip(),

        "resource": event["resource"].strip(),

        "ip_address": event["ip_address"].strip(),

        "device": event["device"].strip(),

        "location": event["location"].strip(),

        "status": event["status"].strip(),

        "event_metadata": event["metadata"]

    }

# ============================================================
# CHECK DUPLICATE EVENT
# ============================================================

def event_exists(event_id):
    """
    Check whether an event with the given event_id
    already exists.
    """

    return ActivityLog.query.filter_by(
        event_id=event_id
    ).first()


# ============================================================
# SAVE ACTIVITY LOG
# ============================================================

def save_activity_log(normalized_event):
    """
    Store a normalized event into the ActivityLog table.
    """

    existing_event = event_exists(
        normalized_event["event_id"]
    )

    if existing_event:

        raise ValueError(
            "Event already exists."
        )

    activity_log = ActivityLog(

        event_id=normalized_event["event_id"],

        user_name=normalized_event["user_name"],

        user_email=normalized_event["user_email"],

        role=normalized_event["role"],

        department=normalized_event["department"],

        timestamp=normalized_event["timestamp"],

        event_type=normalized_event["event_type"],

        event_name=normalized_event["event_name"],

        resource=normalized_event["resource"],

        ip_address=normalized_event["ip_address"],

        device=normalized_event["device"],

        location=normalized_event["location"],

        status=normalized_event["status"],

        event_metadata=normalized_event["event_metadata"],

        created_at=datetime.now()

    )

    try:

        db.session.add(activity_log)

        db.session.commit()

        socketio.emit(
            "new_event",
            {
                "event_id": activity_log.event_id,
                "user_name": activity_log.user_name,
                "event_name": activity_log.event_name,
                "event_type": activity_log.event_type,
                "status": activity_log.status,
                "department": activity_log.department,
                "ip_address": activity_log.ip_address,
                "device": activity_log.device,
                "location": activity_log.location,
                "timestamp": activity_log.timestamp.isoformat()
            }
        )

        print(
            "SOCKET EMIT:",
            activity_log.event_id
        )

    except Exception:

        db.session.rollback()

        raise

    return activity_log

# ============================================================
# TRIGGER DETECTION ENGINE
# ============================================================

def trigger_detection_engine(activity_log):
    """
    Trigger the Detection Engine after the event
    has been successfully stored.

    The Detection Engine implementation will be
    connected in the next module.
    """

    #
    # Future Implementation:
    #
    # from app.services.detection_engine import analyze_event
    #
    # analyze_event(activity_log)
    #

    return


# ============================================================
# PROCESS EVENT
# ============================================================

def process_event(event):
    """
    Complete Log Collector workflow.

    1. Validate event
    2. Normalize event
    3. Store Activity Log
    4. Trigger Detection Engine
    """

    # --------------------------------------------------------
    # Validate Event
    # --------------------------------------------------------

    validate_event(event)

    # --------------------------------------------------------
    # Normalize Event
    # --------------------------------------------------------

    normalized_event = normalize_event(event)

    # --------------------------------------------------------
    # Save Event
    # --------------------------------------------------------

    activity_log = save_activity_log(
        normalized_event
    )

    # --------------------------------------------------------
    # Trigger Detection Engine
    # --------------------------------------------------------

    trigger_detection_engine(
        activity_log
    )

    return activity_log