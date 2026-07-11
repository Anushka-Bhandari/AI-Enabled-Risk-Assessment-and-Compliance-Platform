def get_priority(risk_level):

    mapping = {
        "High": "CRITICAL",
        "Medium": "HIGH",
        "Low": "MEDIUM",
        "None": "LOW"
    }

    return mapping.get(risk_level, "MEDIUM")


def get_estimated_effort(weight):

    if weight == 3:
        return "High"

    if weight == 2:
        return "Medium"

    return "Low"


def get_implementation_timeline(weight):

    if weight == 3:
        return "60-90 Days"

    if weight == 2:
        return "30-60 Days"

    return "15-30 Days"


def get_implementation_cost(weight):

    if weight == 3:
        return "High"

    if weight == 2:
        return "Medium"

    return "Low"