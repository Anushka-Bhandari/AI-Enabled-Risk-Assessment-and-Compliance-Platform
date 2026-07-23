"""
Event Simulator.

Continuously generates security events and sends them
to the Log Collector API.
"""

import random
import time

import requests

from .generator import generate_event


# ============================================================
# CONFIGURATION
# ============================================================

LOG_COLLECTOR_URL = "http://localhost:5000/api/events"

MIN_DELAY = 1

MAX_DELAY = 5


# ============================================================
# SEND EVENT
# ============================================================

def send_event(event):
    """
    Send one event to the Log Collector.
    """

    try:

        response = requests.post(
            LOG_COLLECTOR_URL,
            json=event,
            timeout=10
        )

        if response.status_code == 201:

            print(
                f"[SUCCESS] {event['event_type']} -> {event['user_email']}"
            )

        else:

            print(
                f"[FAILED] {response.status_code}"
            )

    except Exception as e:

        print(f"[ERROR] {e}")


# ============================================================
# START SIMULATOR
# ============================================================

def start_simulator():
    """
    Continuously generate events.
    """

    print("Event Simulator Started...")

    while True:

        event = generate_event()

        send_event(event)

        delay = random.randint(
            MIN_DELAY,
            MAX_DELAY
        )

        time.sleep(delay)


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    start_simulator()