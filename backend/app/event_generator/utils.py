"""
Utility functions for the Event Generator.

This module contains reusable helper functions.
It should NEVER contain business logic for event generation.
"""

import random
import uuid

from datetime import datetime

from .event_templates import (
    EVENT_STATUS,
    RESOURCES,
    DEVICES,
    LOCATIONS,
    BROWSERS,
    OPERATING_SYSTEMS,
    DATABASE_TABLES,
    USB_DEVICES,
    MALWARE_NAMES,
    APPLICATIONS,
)


# ============================================================
# EVENT ID
# ============================================================

def generate_event_id():
    """
    Generate a unique event ID.
    """
    return str(uuid.uuid4())


# ============================================================
# TIMESTAMP
# ============================================================

def generate_timestamp():
    """
    Return current UTC timestamp.
    """
    return datetime.utcnow().isoformat()


# ============================================================
# RANDOM RESOURCE
# ============================================================

def random_resource():
    return random.choice(RESOURCES)


# ============================================================
# RANDOM DEVICE
# ============================================================

def random_device():
    return random.choice(DEVICES)


# ============================================================
# RANDOM LOCATION
# ============================================================

def random_location():
    return random.choice(LOCATIONS)


# ============================================================
# RANDOM STATUS
# ============================================================

def random_status():
    return random.choice(EVENT_STATUS)


# ============================================================
# RANDOM IP
# ============================================================

def random_ip():
    """
    Generate private IPv4 addresses.
    """

    network = random.choice([
        "10",
        "172",
        "192"
    ])

    if network == "10":
        return f"10.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}"

    if network == "172":
        return f"172.{random.randint(16,31)}.{random.randint(0,255)}.{random.randint(1,254)}"

    return f"192.168.{random.randint(0,255)}.{random.randint(1,254)}"


# ============================================================
# LOGIN METADATA
# ============================================================

def login_metadata():

    return {

        "browser": random.choice(BROWSERS),

        "operating_system": random.choice(OPERATING_SYSTEMS),

        "session_id": str(uuid.uuid4()),

        "login_method": random.choice(
            [
                "PASSWORD",
                "SSO",
                "MFA"
            ]
        ),

        "successful": random.choice(
            [
                True,
                True,
                True,
                False
            ]
        )

    }


# ============================================================
# DATABASE ACCESS METADATA
# ============================================================

def database_metadata():

    return {

        "table": random.choice(DATABASE_TABLES),

        "records_accessed": random.randint(10, 500),

        "is_sensitive_table": random.choice(
            [
                True,
                False
            ]
        ),

        "query_status": random.choice(
            [
                "SUCCESS",
                "FAILED"
            ]
        )

    }


# ============================================================
# DATABASE DOWNLOAD METADATA
# ============================================================

def database_download_metadata():

  return {

    "table": random.choice(DATABASE_TABLES),

    "records_accessed": random.randint(1000, 5000),

    "records_downloaded": random.randint(500, 5000),

    "is_sensitive_table": random.choice(
        [
            True,
            False
        ]
    )

}


# ============================================================
# FILE DOWNLOAD
# ============================================================

def file_download_metadata():

    return {

        "file_name": f"document_{random.randint(1,500)}.pdf",

        "file_size_mb": round(
            random.uniform(0.5, 700.0),
            2
        ),

        "file_type": random.choice(
            [
                "pdf",
                "docx",
                "xlsx",
                "pptx",
                "zip"
            ]
        ),

        "is_sensitive": random.choice(
            [
                True,
                False
            ]
        )

    }


# ============================================================
# FILE UPLOAD
# ============================================================

def file_upload_metadata():

    return {

        "file_name": f"upload_{random.randint(1,500)}.pdf",

        "file_size_mb": round(
            random.uniform(0.5, 500.0),
            2
        ),

        "file_type": random.choice(
            [
                "pdf",
                "docx",
                "xlsx",
                "pptx",
                "zip"
            ]
        )

    }


# ============================================================
# PASSWORD CHANGE
# ============================================================

def password_metadata():

    return {

        "password_policy": "University Standard",

        "password_strength": random.choice(
            [
                "Weak",
                "Medium",
                "Strong"
            ]
        )

    }

# ============================================================
# USB
# ============================================================

def usb_metadata():

    return {

        "device_name": random.choice(USB_DEVICES),

        "capacity": random.choice(
            [
                "16GB",
                "32GB",
                "64GB",
                "128GB",
                "256GB",
                "1TB"
            ]
        )

    }


# ============================================================
# MALWARE
# ============================================================

def malware_metadata():

    return {

        "malware_name": random.choice(MALWARE_NAMES),

        "severity": random.choice(
            [
                "Medium",
                "High",
                "Critical"
            ]
        )

    }


# ============================================================
# APPLICATION
# ============================================================

def application_metadata():

    return {

        "application": random.choice(APPLICATIONS),

        "version": f"{random.randint(1,10)}.{random.randint(0,9)}",

        "authorized": random.choice(
            [
                True,
                True,
                True,
                False
            ]
        )

    }


# ============================================================
# EMAIL
# ============================================================

def email_metadata():

    recipient_count = random.randint(1, 10)

    attachment = random.choice(
        [
            True,
            False
        ]
    )

    return {

        "recipient_count": recipient_count,

        "external_recipient_count": random.randint(
            0,
            recipient_count
        ),

        "attachment": attachment,

        "attachment_count": random.randint(
            1,
            5
        ) if attachment else 0

    }


# ============================================================
# BULK EMAIL
# ============================================================

def bulk_email_metadata():

    recipient_count = random.randint(500, 5000)

    attachment = random.choice(
        [
            True,
            False
        ]
    )

    return {

        "recipient_count": recipient_count,

        "external_recipient_count": random.randint(
            100,
            recipient_count
        ),

        "attachment": attachment,

        "attachment_count": random.randint(
            20,
            200
        ) if attachment else 0

    }


# ============================================================
# FIREWALL
# ============================================================

def firewall_metadata():

    return {

        "destination_port": random.choice(
            [
                22,
                80,
                443,
                3389,
                8080
            ]
        ),

        "protocol": random.choice(
            [
                "TCP",
                "UDP"
            ]
        )

    }


# ============================================================
# ANTIVIRUS
# ============================================================

def antivirus_metadata():

    return {

        "action": random.choice(
            [
                "DISABLED",
                "ENABLED"
            ]
        )

    }


# ============================================================
# PRIVILEGE ESCALATION
# ============================================================

def privilege_metadata():

    roles = [
        "Student",
        "Faculty",
        "Administrator",
        "System Administrator"
    ]

    before = random.choice(roles[:-1])

    after = random.choice(
        roles[
            roles.index(before) + 1:
        ]
    )

    return {

        "privilege_before": before,

        "privilege_after": after

    }


# ============================================================
# AUDIT LOG
# ============================================================

def audit_log_metadata():

    return {

        "action": random.choice(
            [
                "MODIFIED",
                "DELETED",
                "TAMPERED"
            ]
        )

    }

# ============================================================
# FILE DELETE
# ============================================================

def file_delete_metadata():

    return {

        "file_name": f"document_{random.randint(1,500)}.pdf",

        "file_size_mb": round(
            random.uniform(0.5, 700.0),
            2
        ),

        "file_type": random.choice(
            [
                "pdf",
                "docx",
                "xlsx",
                "pptx",
                "zip"
            ]
        ),

        "is_sensitive": random.choice(
            [
                True,
                False
            ]
        )

    }

# ============================================================
# UNIVERSITY-SPECIFIC EVENTS
# ============================================================

def exam_record_metadata():
    return {
        "exam_id": f"EXAM-{random.randint(1000, 9999)}",
        "record_count": random.randint(1, 50),
        "access_type": random.choice(["VIEW", "SEARCH"]),
    }

def exam_result_modify_metadata():
    fields = ["marks", "grade", "remarks", "attendance_status"]
    return {
        "exam_id": f"EXAM-{random.randint(1000, 9999)}",
        "student_count": random.randint(1, 20),
        "action": "UPDATE",
        "fields_changed": random.sample(fields, k=random.randint(1, 2)),
    }

def student_record_metadata():
    return {
        "record_count": random.randint(1, 25),
        "access_type": random.choice(["VIEW", "SEARCH"]),
        "record_category": random.choice([
            "Profile", "Academic", "Contact", "Enrollment"
        ]),
    }

def student_record_modify_metadata():
    return {
        "record_count": random.randint(1, 10),
        "action": "UPDATE",
        "fields_changed": random.sample(
            ["contact", "department", "enrollment_status", "academic_status"],
            k=random.randint(1, 2),
        ),
    }

def attendance_metadata():
    return {
        "class_count": random.randint(1, 8),
        "student_count": random.randint(5, 80),
        "semester": random.choice(["I", "II"]),
    }

def attendance_modify_metadata():
    return {
        "class_id": f"CLASS-{random.randint(100, 999)}",
        "student_count": random.randint(1, 40),
        "action": random.choice(["MARK", "CORRECT", "OVERRIDE"]),
    }

def financial_record_metadata():
    return {
        "record_count": random.randint(1, 50),
        "record_type": random.choice(["Fee", "Payment", "Scholarship", "Payroll"]),
        "access_type": random.choice(["VIEW", "SEARCH"]),
    }

def financial_record_modify_metadata():
    return {
        "record_type": random.choice(["Fee", "Payment", "Scholarship", "Payroll"]),
        "record_count": random.randint(1, 10),
        "action": random.choice(["UPDATE", "APPROVE", "CORRECT"]),
    }

def admission_record_metadata():
    return {
        "application_count": random.randint(1, 25),
        "access_type": random.choice(["VIEW", "SEARCH"]),
        "admission_cycle": random.choice(["2026-27", "2027-28"]),
    }

def bulk_data_export_metadata():
    return {
        "dataset": random.choice([
            "Student Records", "Attendance Records", "Results",
            "Finance Records", "Admissions"
        ]),
        "records_exported": random.randint(500, 5000),
        "export_format": random.choice(["CSV", "XLSX", "JSON"]),
        "destination": random.choice([
            "Network Drive", "Local Workstation", "Secure Archive"
        ]),
    }


# ============================================================
# DEFAULT
# ============================================================

def default_metadata():

    return {}