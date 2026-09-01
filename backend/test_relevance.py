# test_relevance.py

from app.services.control_relevance_service import (
    find_relevant_categories
)

event = {
    "event_type": "exam_record_access",
    "role": "finance",
    "resource": "exam_records"
}

print(find_relevant_categories(event))