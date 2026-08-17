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
    default_metadata,
)

import requests

ACTORS_API_URL = "http://127.0.0.1:5000/api/monitoring/actors"


def get_random_actor():
    response = requests.get(ACTORS_API_URL, timeout=10)
    response.raise_for_status()

    actors = response.json()

    if not actors:
        raise RuntimeError("No monitored actors available")

    return random.choice(actors)


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
# UNIVERSITY-SPECIFIC RESOURCE MAPPING
# ============================================================
#
# Generic events keep using random_resource() from utils.py.
# University-specific events instead resolve to a resource (or a
# small, semantically-appropriate set of resources) so that the
# generated event stays logically consistent
# (e.g. EXAM_RECORD_ACCESS -> Examination System).
#
# Events not present in this map fall back to random_resource().

EVENT_RESOURCE_MAP = {

    "EXAM_RECORD_ACCESS": "Examination System",

    "EXAM_RECORD_DOWNLOAD": "Examination System",

    "RESULT_ACCESS": "Results Database",

    "RESULT_MODIFICATION": "Results Database",

    "STUDENT_RECORD_ACCESS": "Student Database",

    "STUDENT_RECORD_DOWNLOAD": "Student Database",

    "ATTENDANCE_ACCESS": "Attendance Portal",

    "ATTENDANCE_MODIFICATION": "Attendance Portal",

    "FACULTY_HR_RECORD_ACCESS": [
        "Faculty Database",
        "HR Database"
    ],

    "ADMISSION_RECORD_ACCESS": "Admissions Portal",

    "SCHOLARSHIP_RECORD_ACCESS": "Scholarship System",

    "FEE_RECORD_ACCESS": "Fee Management System",

    "BULK_STUDENT_DATA_EXPORT": "Student Database",

    "ADMINISTRATIVE_DOCUMENT_ACCESS": "Administrative Documents",

}


def resolve_resource(event_type):
    """
    Return the resource associated with an event type.

    University-specific events resolve via EVENT_RESOURCE_MAP
    (a single resource, or a random pick from a short list of
    appropriate resources). Any event not in the map - including
    all existing generic/security events, plus SUSPICIOUS_LOGIN,
    UNAUTHORIZED_ACCESS and PRIVILEGE_ACTIVITY, which are not tied
    to one specific system - keeps the original random_resource()
    behavior.
    """

    mapped = EVENT_RESOURCE_MAP.get(event_type)

    if mapped is None:
        return random_resource()

    if isinstance(mapped, list):
        return random.choice(mapped)

    return mapped


# ============================================================
# UNIVERSITY-SPECIFIC METADATA BUILDERS
# ============================================================
#
# These live in generator.py (not utils.py) because they encode
# event-generation business logic, consistent with the existing
# metadata builders that live alongside choose_event_type() /
# build_metadata(). No severity/RBAC decisions are made here -
# that belongs to the later detection-rule implementation.

def exam_record_access_metadata():

    return {

        "record_type": random.choice(
            [
                "Question Paper",
                "Answer Sheet",
                "Exam Schedule",
                "Exam Result Sheet"
            ]
        ),

        "records_accessed": random.randint(1, 200),

        "access_type": random.choice(
            [
                "VIEW",
                "SEARCH",
                "EXPORT_VIEW"
            ]
        )

    }


def exam_record_download_metadata():

    return {

        "record_type": random.choice(
            [
                "Question Paper",
                "Answer Sheet",
                "Exam Result Sheet"
            ]
        ),

        "records_downloaded": random.randint(1, 200),

        "file_format": random.choice(
            [
                "pdf",
                "xlsx",
                "docx",
                "csv"
            ]
        )

    }


def result_access_metadata():

    return {

        "record_type": random.choice(
            [
                "Semester Result",
                "Final Result",
                "Backlog Result"
            ]
        ),

        "records_accessed": random.randint(1, 300),

        "access_type": random.choice(
            [
                "VIEW",
                "SEARCH"
            ]
        )

    }


def result_modification_metadata():

    return {

        "modification_type": random.choice(
            [
                "Grade Update",
                "Marks Correction",
                "Result Recompilation"
            ]
        ),

        "records_affected": random.randint(1, 50)

    }


def student_record_access_metadata():

    return {

        "record_type": random.choice(
            [
                "Personal Details",
                "Academic History",
                "Enrollment Record"
            ]
        ),

        "records_accessed": random.randint(1, 300),

        "access_type": random.choice(
            [
                "VIEW",
                "SEARCH"
            ]
        )

    }


def student_record_download_metadata():

    return {

        "record_type": random.choice(
            [
                "Personal Details",
                "Academic History",
                "Enrollment Record"
            ]
        ),

        "records_downloaded": random.randint(1, 300),

        "file_format": random.choice(
            [
                "pdf",
                "xlsx",
                "csv"
            ]
        )

    }


def attendance_access_metadata():

    return {

        "records_accessed": random.randint(1, 500),

        "access_type": random.choice(
            [
                "VIEW",
                "SEARCH",
                "REPORT_GENERATION"
            ]
        )

    }


def attendance_modification_metadata():

    return {

        "modification_type": random.choice(
            [
                "Manual Correction",
                "Bulk Update",
                "Leave Adjustment"
            ]
        ),

        "records_affected": random.randint(1, 100)

    }


def faculty_hr_record_access_metadata():

    return {

        "record_type": random.choice(
            [
                "Payroll",
                "Personal File",
                "Appraisal Record",
                "Leave Record"
            ]
        ),

        "records_accessed": random.randint(1, 100),

        "access_type": random.choice(
            [
                "VIEW",
                "SEARCH"
            ]
        )

    }


def admission_record_access_metadata():

    return {

        "records_accessed": random.randint(1, 300),

        "access_type": random.choice(
            [
                "VIEW",
                "SEARCH",
                "VERIFICATION"
            ]
        )

    }


def scholarship_record_access_metadata():

    return {

        "records_accessed": random.randint(1, 200),

        "access_type": random.choice(
            [
                "VIEW",
                "SEARCH",
                "ELIGIBILITY_CHECK"
            ]
        )

    }


def fee_record_access_metadata():

    return {

        "records_accessed": random.randint(1, 300),

        "access_type": random.choice(
            [
                "VIEW",
                "SEARCH",
                "PAYMENT_HISTORY"
            ]
        )

    }


def bulk_student_data_export_metadata():

    return {

        "records_exported": random.randint(500, 5000),

        "export_format": random.choice(
            [
                "csv",
                "xlsx",
                "pdf"
            ]
        ),

        "data_scope": random.choice(
            [
                "Full Student Database",
                "Department-wise",
                "Batch-wise"
            ]
        )

    }


def administrative_document_access_metadata():

    return {

        "document_type": random.choice(
            [
                "Circular",
                "Policy Document",
                "Meeting Minutes",
                "Audit Report"
            ]
        ),

        "access_type": random.choice(
            [
                "VIEW",
                "DOWNLOAD",
                "SEARCH"
            ]
        )

    }


def suspicious_login_metadata():

    return {

        "login_method": random.choice(
            [
                "PASSWORD",
                "SSO",
                "MFA"
            ]
        ),

        "reason": random.choice(
            [
                "Unusual login time",
                "Login from new location",
                "Multiple failed attempts before success",
                "Impossible travel pattern"
            ]
        ),

        "successful": random.choice(
            [
                True,
                False
            ]
        )

    }


def unauthorized_access_metadata():

    return {

        "attempted_resource": random.choice(
            [
                "Student Database",
                "Faculty Database",
                "Finance Database",
                "HR Database",
                "Results Database",
                "Examination System"
            ]
        ),

        "access_type": random.choice(
            [
                "VIEW",
                "MODIFY",
                "DOWNLOAD"
            ]
        ),

        "authorization_status": "DENIED"

    }


def privilege_activity_metadata():

    return {

        "activity_type": random.choice(
            [
                "Role Change",
                "Permission Grant",
                "Permission Revoke",
                "Access Level Review"
            ]
        ),

        "privilege_action": random.choice(
            [
                "GRANTED",
                "REVOKED",
                "MODIFIED",
                "REVIEWED"
            ]
        )

    }


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

        # --------------------------------------------------------
        # University-specific events
        # --------------------------------------------------------

        "EXAM_RECORD_ACCESS": exam_record_access_metadata,

        "EXAM_RECORD_DOWNLOAD": exam_record_download_metadata,

        "RESULT_ACCESS": result_access_metadata,

        "RESULT_MODIFICATION": result_modification_metadata,

        "STUDENT_RECORD_ACCESS": student_record_access_metadata,

        "STUDENT_RECORD_DOWNLOAD": student_record_download_metadata,

        "ATTENDANCE_ACCESS": attendance_access_metadata,

        "ATTENDANCE_MODIFICATION": attendance_modification_metadata,

        "FACULTY_HR_RECORD_ACCESS": faculty_hr_record_access_metadata,

        "ADMISSION_RECORD_ACCESS": admission_record_access_metadata,

        "SCHOLARSHIP_RECORD_ACCESS": scholarship_record_access_metadata,

        "FEE_RECORD_ACCESS": fee_record_access_metadata,

        "BULK_STUDENT_DATA_EXPORT": bulk_student_data_export_metadata,

        "ADMINISTRATIVE_DOCUMENT_ACCESS": administrative_document_access_metadata,

        "SUSPICIOUS_LOGIN": suspicious_login_metadata,

        "UNAUTHORIZED_ACCESS": unauthorized_access_metadata,

        "PRIVILEGE_ACTIVITY": privilege_activity_metadata,

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

    actor = get_random_actor()

    event_type = choose_event_type()

    event = {
        "event_id": generate_event_id(),

        "university_id": actor["university_id"],
        "actor_type": actor["actor_type"],
        "actor_id": actor["actor_id"],

        "user_name": actor["name"],
        "user_email": actor["email"],
        "role": actor["role"],
        "department": actor["department"],

        "timestamp": generate_timestamp(),

        "event_type": event_type,

        "event_name": EVENT_TYPES[event_type],

        "resource": resolve_resource(event_type),

        "ip_address": random_ip(),

        "device": random_device(),

        "location": random_location(),

        "status": random_status(),

        "metadata": build_metadata(event_type)

    }

    return event
