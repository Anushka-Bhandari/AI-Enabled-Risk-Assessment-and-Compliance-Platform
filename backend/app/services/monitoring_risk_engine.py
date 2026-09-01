from app.services.control_library import CONTROL_LIBRARY
from app.services.control_selector_service import (
    find_relevant_categories
)
from app.services.control_effectiveness_service import (
    evaluate_control
)
from app.services.control_context_service import (
    get_control_context
)


CATEGORY_MAP = {
    "IAM": "Identity & Access Management",
    "INFOSEC": "Information Security",
    "PRIVACY": "Privacy & Data Governance",
    "NETWORK": "Network & Infrastructure Security",
    "MONITORING": "Monitoring & Incident Management",
    "GOVERNANCE": "Governance & Compliance",
    "UNIVERSITY": "University-Specific Controls",
    "PHYSICAL": "Physical & Environmental Security",
    "PEOPLE": "People Security",
    "SUPPLIER": "Supplier & Third-Party Security",
    "APPSEC": "Application & Development Security"
}


def process_event(
    assessment_id,
    event
):

    # ==========================================================
    # 1. LOAD UNIVERSITY ASSESSMENT CONTEXT
    # ==========================================================

    control_contexts = get_control_context(
        assessment_id
    )

    print("\nUniversity Control Context:")
    print(control_contexts)

    controls_context = control_contexts.get(
        "controls",
        {}
    )

    questionnaire_answers = control_contexts.get(
        "questionnaire_answers",
        []
    )

    documents = control_contexts.get(
        "documents",
        []
    )

    print("\nLoaded Controls:")
    print(len(controls_context))

    print("\nQuestionnaire Answers:")
    print(len(questionnaire_answers))

    print("\nDocuments:")
    print(len(documents))


    # ==========================================================
    # 2. FIND RELEVANT CATEGORIES FROM EVENT
    # ==========================================================

    category_result = find_relevant_categories(
        event
    )

    categories = category_result.get(
        "categories",
        []
    )

    print("\nAI Categories:")
    print(categories)


    # ==========================================================
    # 3. MAP CATEGORY CODES TO CONTROL LIBRARY CATEGORIES
    # ==========================================================

    categories = [
        CATEGORY_MAP.get(
            category,
            category
        )
        for category in categories
    ]

    print("\nMapped Categories:")
    print(categories)


    # ==========================================================
    # 4. FIND CONTROLS BELONGING TO THOSE CATEGORIES
    # ==========================================================

    candidate_controls = [
        control
        for control in CONTROL_LIBRARY
        if control["category"] in categories
    ]

    print(
        "\nCandidate Controls:",
        len(candidate_controls)
    )

    print(
        "Candidate IDs:",
        [control["id"] for control in candidate_controls]
    )


    # ==========================================================
    # 5. ONLY KEEP CONTROLS THAT EXIST IN UNIVERSITY ASSESSMENT
    # ==========================================================

    print("\nControl IDs in Assessment:")
    print(list(controls_context.keys())[:50])

    relevant_controls = candidate_controls

    print(
        "\nAnalyzing:",
        len(relevant_controls),
        "controls"
    )

    print(
        "Relevant IDs:",
        [control["id"] for control in relevant_controls]
    )


    # ==========================================================
    # 6. ANALYZE EACH CONTROL AGAINST MONITORING EVENT
    # ==========================================================

    results = []

    for control in relevant_controls:

        control_id = control["id"]

        university_context = controls_context.get(
            control_id,
            {
                "compliance_status": "UNKNOWN",
                "risk_level": "Medium",
                "evidence": ""
            }
        )

        university_context["questionnaire_answers"] = (
            questionnaire_answers
        )

        university_context["documents"] = (
            documents
        )

        analysis = evaluate_control(
            event,
            control,
            university_context
        )

        results.append({
            "control_id": control_id,
            "control_name": control["name"],
            "analysis": analysis
        })


    return results