import json

from app.services.groq_manager import (
    groq_manager
)

def analyze_control_event(
    control,
    control_context,
    event
):

    questionnaire_answers = (
        control_context.get(
            "questionnaire_answers",
            []
        )
    )

    documents = (
        control_context.get(
            "documents",
            []
        )
    )

    questionnaire_text = json.dumps(
        questionnaire_answers[:20],
        indent=2
    )

    document_text = ""

    for doc in documents:

        document_text += (
            doc.get(
                "extracted_text",
                ""
            )[:1000]
        )

        document_text += "\n\n"

    prompt = f"""
You are a university compliance analyst.

Control Name:
{control['name']}

Category:
{control['category']}

Risk Description:
{control['risk_description']}

Current Compliance Status:
{control_context.get('compliance_status')}

Current Risk:
{control_context.get('risk_level')}

Evidence:
{control_context.get('evidence')}

Questionnaire Answers:
{questionnaire_text}

Document Evidence:
{document_text}

Monitoring Event:
{json.dumps(event, indent=2)}

Determine:

1. Is the control operating effectively?
2. Updated risk level
3. Reason
4. Recommendation

Return ONLY JSON:

{{
  "effectiveness": "",
  "updated_risk": "",
  "reason": "",
  "recommendation": ""
}}
"""

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

    return json.loads(
        response.choices[0].message.content
    )