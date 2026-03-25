import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("OPENROUTER_API_KEY")
print(f"Key: {key[:10]}...")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=key,
)

try:
    print("Testing embedding...")
    response = client.embeddings.create(
        model="nomic-ai/nomic-embed-text-v1.5",
        input=["Hello world"]
    )
    print("Success!")
    print(f"Dim: {len(response.data[0].embedding)}")
except Exception as e:
    print(f"Error: {e}")
