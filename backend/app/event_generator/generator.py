"""
Core Event Generator.

This module creates a complete security event by combining
random data with the event templates.
"""

import random

from .event_templates import (
    EVENT_TYPES,
    EVENT_WEIGHTS,
)

from .utils import (
    generate_event_id,
    generate_timestamp,
    random_user,
    random_resource,
    random_device,
    random_location,
    random_status,
    random_ip,
    login_metadata,
    database_metadata,
    database_download_metadata,
    file_download_metadata,
    file_upload_metadata,
    password_metadata,
    usb_metadata,
    malware_metadata,
    application_metadata,
    email_metadata,
    bulk_email_metadata,
    firewall_metadata,
    default_metadata,
)


# ============================================================
# CHOOSE EVENT TYPE
# ============================================================

def choose_event_type():
    """
    Select an event using weighted probabilities.
    """

    event_names = list(EVENT_WEIGHTS.keys())

    weights = list(EVENT_WEIGHTS.values())

    return random.choices(
        event_names,
        weights=weights,
        k=1
    )[0]


# ============================================================
# BUILD METADATA
# ============================================================

def build_metadata(event_type):
    """
    Return metadata based on the event type.
    """

    metadata_builders = {

        "LOGIN": login_metadata,

        "VPN_LOGIN": login_metadata,

        "FAILED_LOGIN": login_metadata,

        "DATABASE_ACCESS": database_metadata,

        "DATABASE_DOWNLOAD": database_download_metadata,

        "FILE_DOWNLOAD": file_download_metadata,

        "FILE_UPLOAD": file_upload_metadata,

        "PASSWORD_CHANGE": password_metadata,

        "USB_CONNECTED": usb_metadata,

        "MALWARE_DETECTED": malware_metadata,

        "APPLICATION_INSTALL": application_metadata,

        "EMAIL_SENT": email_metadata,

        "BULK_EMAIL": bulk_email_metadata,

        "FIREWALL_BLOCK": firewall_metadata

    }

    builder = metadata_builders.get(
        event_type,
        default_metadata
    )

    return builder()


# ============================================================
# GENERATE EVENT
# ============================================================

def generate_event():
    """
    Generate one complete security event.
    """

    user = random_user()

    event_type = choose_event_type()

    event = {
        "event_id": generate_event_id(),

        "user_name": user["name"],

        "user_email": user["email"],

        "role": user["role"],

        "department": user["department"],

        "timestamp": generate_timestamp(),

        "event_type": event_type,

        "event_name": EVENT_TYPES[event_type],

        "resource": random_resource(),

        "ip_address": random_ip(),

        "device": random_device(),

        "location": random_location(),

        "status": random_status(),

        "metadata": build_metadata(event_type)

    }

    return event