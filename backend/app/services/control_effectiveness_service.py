import json

from app.services.groq_manager import (
    groq_manager
)

def evaluate_control(event, control, control_context=None):
    control_context = control_context or {}

    prompt = f"""
You are a university ISO 27001 compliance analyst.

Your task is to determine whether a REAL-TIME MONITORING EVENT
violates or is consistent with the university's existing
security control.

CONTROL:
{json.dumps(control, indent=2)}

UNIVERSITY'S CURRENT CONTROL ASSESSMENT:
{json.dumps(control_context, indent=2)}

REAL-TIME MONITORING EVENT:
{json.dumps(event, indent=2)}

IMPORTANT RULES:

1. Use the university's current control assessment and evidence
   as the primary context.

2. Determine whether the monitoring event is consistent with
   the control's expected implementation.

3. Do NOT automatically classify a control as ineffective just
   because a suspicious event occurred.

4. A control should be considered ineffective when the event
   provides reasonable evidence that the implemented control
   failed to prevent, detect, or appropriately handle the
   observed activity.

5. If the available assessment evidence is insufficient to
   determine whether the event violates the control, explain
   why.

6. Do not invent university policies or evidence that are not
   provided.

Analyze:

1. Is the control operating effectively?
2. Updated risk level (Low/Medium/High/Critical)
3. Reason
4. Recommendation

Return ONLY valid JSON:

{{
    "effectiveness": "",
    "updated_risk": "",
    "reason": "",
    "recommendation": ""
}}
"""

    print("\nCONTROL:")
    print(control["id"])

    print("Questionnaire Count:")
    print(
        len(
            control_context.get(
                "questionnaire_answers",
                []
            )
        )
    )

    print("Documents Count:")
    print(
        len(
            control_context.get(
                "documents",
                []
            )
        )
    )

    client = groq_manager.get_client()

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = response.choices[0].message.content

    return json.loads(content)