import os
import requests


class LLMClient:

    def __init__(self):

        self.api_keys = [
            os.getenv("GROQ_API_KEY_1"),
            os.getenv("GROQ_API_KEY_2"),
            os.getenv("GROQ_API_KEY_3"),
        ]

        self.api_keys = [
            key for key in self.api_keys
            if key
        ]

        if not self.api_keys:
            raise ValueError(
                "No Groq API keys configured."
            )

        self.url = (
            "https://api.groq.com/openai/v1/chat/completions"
        )

    def generate(
    self,
    system_prompt,
    user_prompt,
    model="openai/gpt-oss-120b"
):

        payload = {
            "model": model,
            "temperature": 0.2,
            "max_tokens": 4000,
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

        last_error = None

        for index, api_key in enumerate(
            self.api_keys,
            start=1
        ):

            try:

                headers = {
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                }

                print(
                    f"Trying API Key #{index}"
                )

                response = requests.post(
                    self.url,
                    headers=headers,
                    json=payload,
                    timeout=60
                )

                print(
                    "Status:",
                    response.status_code
                )

                response.raise_for_status()

                data = response.json()

                return data["choices"][0][
                    "message"
                ]["content"]

            except Exception as error:

                print(
                    f"API Key #{index} failed:"
                )
                print(error)

                last_error = error

        print("=" * 80)
        print("SYSTEM PROMPT CHARS:", len(system_prompt))
        print("USER PROMPT CHARS:", len(user_prompt))
        print("TOTAL CHARS:", len(system_prompt) + len(user_prompt))
        print("=" * 80)

        raise last_error

            