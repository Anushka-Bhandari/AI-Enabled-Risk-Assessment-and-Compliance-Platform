from app.services.llm_client import LLMClient

client = LLMClient()

response = client.generate(
    system_prompt="You are a cybersecurity expert.",
    user_prompt="Say hello."
)

print(response)