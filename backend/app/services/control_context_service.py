from app.models import Assessment


def get_control_context(assessment_id):

    print("CONTROL CONTEXT FILE LOADED")

    assessment = Assessment.query.get(assessment_id)

    if not assessment:
        return {}

    controls = {}

    # ==========================================================
    # 1. COMPLIANCE RESULTS
    # ==========================================================

    for compliance in assessment.compliance_results:

        controls[compliance.control_id] = {
            "compliance_status": compliance.compliance_status,
            "confidence": compliance.confidence,
            "evidence": compliance.evidence,
        }

    # ==========================================================
    # 2. RISK RESULTS
    # ==========================================================

    for risk in assessment.control_risk_results:

        if risk.control_id not in controls:
            controls[risk.control_id] = {}

        controls[risk.control_id].update({
            "risk_level": risk.risk_level,
            "risk_score": risk.risk_score,
        })

    # ==========================================================
    # 3. QUESTIONNAIRE ANSWERS
    # ==========================================================

    questionnaire_answers = []

    for answer in assessment.answers:

        questionnaire_answers.append({
            "question_id": answer.question_id,
            "answer": answer.answer
        })

    # ==========================================================
    # 4. DOCUMENT EVIDENCE
    # ==========================================================

    documents = []

    for document in assessment.documents:

        documents.append({
            "document_id": document.id,
            "filename": document.original_filename,
            "extracted_text": document.extracted_text
        })

    # ==========================================================
    # 5. RETURN COMPLETE CONTEXT
    # ==========================================================

    for control_id in controls:

        controls[control_id]["questionnaire_answers"] = (
            questionnaire_answers
        )

        controls[control_id]["documents"] = (
            documents
        )

    return controls