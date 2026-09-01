from app.services.control_effectiveness_service import (
    evaluate_control
)

control = {
    "id": "C011",
    "name": "Access Control",
    "category": "IAM",
    "risk_description":
        "Unauthorized access risk"
}

context = {
    "compliance_status":
        "Implemented",

    "risk_level":
        "Low",

    "risk_score":
        2.0,

    "evidence":
        "RBAC policy exists"
}

event = {
    "event_type":
        "exam_record_access",

    "role":
        "finance",

    "resource":
        "exam_records"
}

print(
    evaluate_control(
        control,
        context,
        event
    )
)