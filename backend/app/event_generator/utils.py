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
    MONITORED_USERS,
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
# RANDOM USER
# ============================================================

def random_user():
    """
    Return one monitored user.
    """
    return random.choice(MONITORED_USERS)


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
        "operating_system": random.choice(OPERATING_SYSTEMS)
    }


# ============================================================
# DATABASE ACCESS METADATA
# ============================================================

def database_metadata():

    return {
        "table": random.choice(DATABASE_TABLES),
        "records_accessed": random.randint(10, 500)
    }


# ============================================================
# DATABASE DOWNLOAD METADATA
# ============================================================

def database_download_metadata():

    return {
        "table": random.choice(DATABASE_TABLES),
        "records_downloaded": random.randint(500, 5000)
    }


# ============================================================
# FILE DOWNLOAD
# ============================================================

def file_download_metadata():

    return {

        "file_name": f"document_{random.randint(1,500)}.pdf",

        "file_size_mb": round(random.uniform(0.5, 150.0), 2)

    }


# ============================================================
# FILE UPLOAD
# ============================================================

def file_upload_metadata():

    return {

        "file_name": f"upload_{random.randint(1,500)}.pdf",

        "file_size_mb": round(random.uniform(0.5, 100.0), 2)

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

        "version": f"{random.randint(1,10)}.{random.randint(0,9)}"

    }


# ============================================================
# EMAIL
# ============================================================

def email_metadata():

    return {

        "recipient_count": random.randint(1, 10),

        "attachment": random.choice(
            [
                True,
                False
            ]
        )

    }


# ============================================================
# BULK EMAIL
# ============================================================

def bulk_email_metadata():

    return {

        "recipient_count": random.randint(500, 5000),

        "attachment": random.choice(
            [
                True,
                False
            ]
        )

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
# DEFAULT
# ============================================================

def default_metadata():

    return {}