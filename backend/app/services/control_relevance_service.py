import json

from app.services.groq_manager import groq_manager


def find_relevant_categories(event):

    prompt = f"""
You are a university cybersecurity analyst.

Event:
{json.dumps(event, indent=2)}

Available Categories:

PRIVACY
IAM
INFOSEC
NETWORK
MONITORING
GOVERNANCE
UNIVERSITY
PHYSICAL
PEOPLE
SUPPLIER
APPSEC

Return ONLY JSON:

{{
    "categories": []
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