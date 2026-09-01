import os

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

API_KEYS = [
    os.getenv("GROQ_API_KEY_1"),
    os.getenv("GROQ_API_KEY_2"),
    os.getenv("GROQ_API_KEY_3"),
]

API_KEYS = [k for k in API_KEYS if k]


class GroqManager:

    def __init__(self):
        self.current_index = 0

    def get_client(self):

        return Groq(
            api_key=API_KEYS[self.current_index]
        )

    def rotate_key(self):

        self.current_index = (
            self.current_index + 1
        ) % len(API_KEYS)


groq_manager = GroqManager()