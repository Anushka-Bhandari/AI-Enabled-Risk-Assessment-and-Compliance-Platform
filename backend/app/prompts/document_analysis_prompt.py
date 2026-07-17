import json


def build_document_analysis_prompt(document_text, controls):
    """
    Build prompts for AI-based document compliance analysis.

    Parameters
    ----------
    document_text : str
        Extracted text from uploaded university documents.

    controls : list
        CONTROL_LIBRARY

    Returns
    -------
    dict
        {
            "system_prompt": "...",
            "user_prompt": "..."
        }
    """

    controls_summary = []

    for control in controls:
        controls_summary.append(
            {
                "control_id": control["id"],
                "control_name": control["name"],
                "category": control["category"],
            }
        )

    system_prompt = """
You are an expert cybersecurity auditor specializing in university compliance.

Your task is to analyse university policy documents and determine whether
each security control is implemented based ONLY on documentary evidence.

Instructions:

1. Read the uploaded document carefully.
2. Evaluate every control independently.
3. Never assume implementation if evidence is missing.
4. Use ONLY these statuses:
   - IMPLEMENTED
   - PARTIALLY_IMPLEMENTED
   - NOT_IMPLEMENTED
   - NOT_APPLICABLE
5. Use NOT_APPLICABLE only if the control cannot reasonably be evaluated
   from the uploaded document because it is outside the document's scope.
6. If the document should contain evidence but none is found,
   return NOT_IMPLEMENTED.
7. Return ONLY valid JSON.
8. Do NOT include explanations outside the JSON.
9. Do NOT wrap the JSON inside markdown (```json).
10. Every control must appear exactly once.

Return JSON in the following format:

{
    "controls": [
        {
            "control_id": "C001",
            "control_name": "Privacy Notice",
            "status": "IMPLEMENTED",
            "confidence": 96,
            "evidence": "Quote or summarize the exact document text that supports your decision."
        }
    ]
}
"""

    user_prompt = f"""
Security Controls

{json.dumps(controls_summary, indent=2)}

=====================================================

University Documents

{document_text}

=====================================================

Analyse every control and return ONLY valid JSON.
"""

    return {
        "system_prompt": system_prompt.strip(),
        "user_prompt": user_prompt.strip(),
    }