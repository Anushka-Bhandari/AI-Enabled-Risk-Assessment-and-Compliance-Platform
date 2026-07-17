from app.models import (
    Assessment,
    ComplianceResult,
    ControlRiskResult,
    CategoryRiskResult
)

from app.database import db
from app.services.control_library import get_control
from collections import defaultdict

MAX_CONTROL_WEIGHT = 3


def run_risk_engine(assessment_id):
    """
    Calculate risk for a completed assessment.
    """

    ControlRiskResult.query.filter_by(
    assessment_id=assessment_id
).delete()

    CategoryRiskResult.query.filter_by(
        assessment_id=assessment_id
    ).delete()

    db.session.commit()

    compliance_results = ComplianceResult.query.filter_by(
        assessment_id=assessment_id
    ).all()

    if not compliance_results:
        raise ValueError("Compliance Engine did not produce any results.")

    for result in compliance_results:

        control = get_control(result.control_id)

        weight = control["weight"]
        status = result.compliance_status

        if status in (
            "IMPLEMENTED",
            "NOT_APPLICABLE"
        ):
            multiplier = 0.0

        elif status == "PARTIALLY_IMPLEMENTED":
            multiplier = 0.5

        else:  # NOT_IMPLEMENTED
            multiplier = 1.0

        raw_risk = weight * multiplier

        risk_score = (
            raw_risk / MAX_CONTROL_WEIGHT
        ) * 100

        if risk_score == 0:
            risk_level = "None"

        elif risk_score <= 33:
            risk_level = "Low"

        elif risk_score <= 66:
            risk_level = "Medium"

        else:
            risk_level = "High"

        control_risk_result = ControlRiskResult(
            assessment_id=assessment_id,
            control_id=result.control_id,
            risk_score=risk_score,
            risk_level=risk_level
        )

        db.session.add(control_risk_result)

    db.session.commit()

    control_risk_results = ControlRiskResult.query.filter_by(
        assessment_id=assessment_id
    ).all()

    category_scores = defaultdict(list)

    for result in control_risk_results:
        control = get_control(result.control_id)
        category = control["category"]

        category_scores[category].append(result.risk_score)

    for category, scores in category_scores.items():
        average_score = sum(scores) / len(scores)

        if average_score == 0:
            risk_level = "None"

        elif average_score <= 33:
            risk_level = "Low"

        elif average_score <= 66:
            risk_level = "Medium"

        else:
            risk_level = "High"

        category_result = CategoryRiskResult(
            assessment_id=assessment_id,
            category=category,
            risk_score=average_score,
            risk_level=risk_level
        )

        db.session.add(category_result)

    db.session.commit()

    category_risk_results = CategoryRiskResult.query.filter_by(
        assessment_id=assessment_id
    ).all()

    overall_risk_score = (
        sum(result.risk_score for result in category_risk_results)/ len(category_risk_results)
    )

    if overall_risk_score == 0:
        overall_risk_level = "None"

    elif overall_risk_score <= 33:
        overall_risk_level = "Low"

    elif overall_risk_score <= 66:
        overall_risk_level = "Medium"

    else:
        overall_risk_level = "High"

    assessment = Assessment.query.get(assessment_id)

    assessment.overall_risk_score = overall_risk_score
    assessment.risk_level = overall_risk_level

    db.session.commit()

    return {
        "assessment_id": assessment_id,
        "overall_risk_score": overall_risk_score,
        "overall_risk_level": overall_risk_level
    }