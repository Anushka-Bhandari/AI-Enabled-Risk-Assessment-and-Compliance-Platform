"""
Core Event Generator.

This module creates a complete security event by combining
random data with the event templates.
"""

import random

from .event_templates import (
    EVENT_TYPES,
    EVENT_WEIGHTS,
    EVENT_RESOURCES,
    ROLE_EVENT_WEIGHTS,
    UNIVERSITY_EVENT_RATE,
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
    file_delete_metadata,
    password_metadata,
    usb_metadata,
    malware_metadata,
    application_metadata,
    email_metadata,
    bulk_email_metadata,
    firewall_metadata,
    antivirus_metadata,
    privilege_metadata,
    audit_log_metadata,
    exam_record_metadata,
    exam_result_modify_metadata,
    student_record_metadata,
    student_record_modify_metadata,
    attendance_metadata,
    attendance_modify_metadata,
    financial_record_metadata,
    financial_record_modify_metadata,
    admission_record_metadata,
    bulk_data_export_metadata,
    default_metadata,
)


# ============================================================
# CHOOSE EVENT TYPE
# ============================================================

def choose_event_type(role):
    """
    Select an event while keeping university-specific activities
    consistent with the monitored user's role.
    """

    role_events = ROLE_EVENT_WEIGHTS.get(role)

    if role_events and random.random() < UNIVERSITY_EVENT_RATE:
        event_names = list(role_events.keys())
        weights = list(role_events.values())

        return random.choices(
            event_names,
            weights=weights,
            k=1
        )[0]

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

        "FIREWALL_BLOCK": firewall_metadata,

        "FILE_DELETE": file_delete_metadata,

        "ANTIVIRUS_DISABLED": antivirus_metadata,

        "PRIVILEGE_ESCALATION": privilege_metadata,

        "AUDIT_LOG_TAMPERING": audit_log_metadata,

        # University-specific events
        "EXAM_RECORD_ACCESS": exam_record_metadata,
        "EXAM_RECORD_DOWNLOAD": exam_record_metadata,
        "EXAM_RESULT_MODIFY": exam_result_modify_metadata,
        "STUDENT_RECORD_ACCESS": student_record_metadata,
        "STUDENT_RECORD_DOWNLOAD": student_record_metadata,
        "STUDENT_RECORD_MODIFY": student_record_modify_metadata,
        "ATTENDANCE_ACCESS": attendance_metadata,
        "ATTENDANCE_MODIFY": attendance_modify_metadata,
        "FINANCIAL_RECORD_ACCESS": financial_record_metadata,
        "FINANCIAL_RECORD_MODIFY": financial_record_modify_metadata,
        "ADMISSION_RECORD_ACCESS": admission_record_metadata,
        "BULK_DATA_EXPORT": bulk_data_export_metadata,
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

    event_type = choose_event_type(user["role"])

    resource = EVENT_RESOURCES.get(
        event_type,
        random_resource()
    )

    event = {
        "event_id": generate_event_id(),

        "user_name": user["name"],

        "user_email": user["email"],

        "role": user["role"],

        "department": user["department"],

        "timestamp": generate_timestamp(),

        "event_type": event_type,

        "event_name": EVENT_TYPES[event_type],

        "resource": resource,

        "ip_address": random_ip(),

        "device": random_device(),

        "location": random_location(),

        "status": random_status(),

        "metadata": build_metadata(event_type)

    }

    return event