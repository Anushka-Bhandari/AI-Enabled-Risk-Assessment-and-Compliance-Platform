from app import create_app

from app.services.monitoring_risk_engine import (
    process_event
)

app = create_app()

event = {
    "assessment_id": 1,

    "event_type": "exam_record_access",

    "role": "finance",

    "resource": "exam_records"
}

with app.app_context():

    results = process_event(
        1,
        event
    )

    print(results)

