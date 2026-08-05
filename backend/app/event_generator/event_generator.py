import random
import uuid
import time
from datetime import datetime

import requests

from config import (
    MONITORED_USERS,
    EVENT_TYPES,
    EVENT_WEIGHTS,
    RESOURCES,
    DEVICES,
    LOCATIONS,
    BROWSERS
)

# ============================================================
# API ENDPOINT
# ============================================================

API_URL = "http://127.0.0.1:5000/api/events"


# ============================================================
# RANDOM USER
# ============================================================

def get_random_user():

    return random.choice(
        MONITORED_USERS
    )


# ============================================================
# RANDOM EVENT
# ============================================================

def get_random_event():

    event_keys = list(
        EVENT_WEIGHTS.keys()
    )

    weights = list(
        EVENT_WEIGHTS.values()
    )

    return random.choices(
        event_keys,
        weights=weights,
        k=1
    )[0]


# ============================================================
# RANDOM IP
# ============================================================

def generate_ip():

    return ".".join(

        str(
            random.randint(1, 255)
        )

        for _ in range(4)
    )


# ============================================================
# STATUS BY EVENT
# ============================================================

def generate_status(event_key):

    if event_key in [

        "FAILED_LOGIN",

        "UNKNOWN_DEVICE",

        "UNKNOWN_IP",

        "MALWARE_DETECTED",

        "PRIVILEGE_ESCALATION",

        "FIREWALL_BLOCK"

    ]:

        return random.choice([

            "FAILED",

            "WARNING",

            "BLOCKED"

        ])

    return "SUCCESS"


# ============================================================
# METADATA
# ============================================================

def generate_metadata(event_key):

    if event_key == "FAILED_LOGIN":

        return {

            "attempt_count": random.randint(3, 10),

            "browser": random.choice(BROWSERS)

        }

    elif event_key == "VPN_LOGIN":

        return {

            "vpn_provider": random.choice([

                "Cisco VPN",

                "OpenVPN",

                "Fortinet"

            ])
        }

    elif event_key == "DATABASE_ACCESS":

        return {

            "records_accessed":

            random.randint(
                10,
                500
            )
        }

    elif event_key == "DATABASE_DOWNLOAD":

        return {

            "records_downloaded":

            random.randint(
                100,
                5000
            )
        }

    elif event_key == "FILE_DOWNLOAD":

        return {

            "file_count":

            random.randint(
                1,
                20
            )
        }

    elif event_key == "MALWARE_DETECTED":

        return {

            "severity":

            random.choice([

                "LOW",

                "MEDIUM",

                "HIGH"

            ])
        }

    return {

        "browser":

        random.choice(
            BROWSERS
        )
    }


# ============================================================
# BUILD EVENT
# ============================================================

def generate_event():

    user = get_random_user()

    event_key = get_random_event()

    return {

        "event_id":

        str(
            uuid.uuid4()
        ),

        "user_name":

        user["name"],

        "user_email":

        user["email"],

        "role":

        user["role"],

        "department":

        user["department"],

        "timestamp":

        datetime.now().isoformat(),

        "event_type":

        event_key,

        "event_name":

        EVENT_TYPES[event_key],

        "resource":

        random.choice(
            RESOURCES
        ),

        "ip_address":

        generate_ip(),

        "device":

        random.choice(
            DEVICES
        ),

        "location":

        random.choice(
            LOCATIONS
        ),

        "status":

        generate_status(
            event_key
        ),

        "metadata":

        generate_metadata(
            event_key
        )
    }


# ============================================================
# SEND EVENT
# ============================================================

def send_event():

    event = generate_event()

    try:

        response = requests.post(

            API_URL,

            json=event
        )

        print(

            f"[{response.status_code}] "

            f"{event['event_name']} "

            f"| "

            f"{event['user_email']}"

        )

    except Exception as e:

        print(

            "Error:",

            e
        )


# ============================================================
# MAIN LOOP
# ============================================================

def run_generator():

    print(
        "Event Generator Started..."
    )

    while True:

        send_event()

        time.sleep(3)


if __name__ == "__main__":

    run_generator()