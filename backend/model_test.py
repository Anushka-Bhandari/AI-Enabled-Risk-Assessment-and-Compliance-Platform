from app.services.groq_manager import (
    groq_manager
)

client = groq_manager.get_client()

models = client.models.list()

for model in models.data:
    print(model.id)