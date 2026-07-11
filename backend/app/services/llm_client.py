import os
from urllib import response
import requests


class LLMClient:
    """
    Wrapper around Grok (xAI) Chat Completions API.
    Can be replaced with GPT/Gemini/Claude later without
    changing the rest of the backend.
    """

    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")

        if not self.api_key:
            raise ValueError(
                "GROQ_API_KEY environment variable is not configured."
            )

        self.url = "https://api.groq.com/openai/v1/chat/completions"

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def generate(
        self,
        system_prompt,
        user_prompt,
        model="llama-3.3-70b-versatile"
    ):
        payload = {
            "model": model,
            "temperature": 0.2,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ]
        }

        response = requests.post(
            self.url,
            headers=self.headers,
            json=payload,
            timeout=60
        )

        print("Status:", response.status_code)
        print(response.text)

        response.raise_for_status()

        data = response.json()

        return (
            data["choices"][0]
            ["message"]
            ["content"]
        )