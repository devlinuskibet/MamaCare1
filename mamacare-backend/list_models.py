import os
import requests
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("OPENROUTER_API_KEY")

response = requests.get(
    "https://openrouter.ai/api/v1/models",
    headers={"Authorization": f"Bearer {key}"}
)

if response.status_code == 200:
    models = response.json()['data']
    print("Available Embedding models:")
    for m in models:
        if 'embed' in m['id'].lower():
            print(f"- {m['id']}")
else:
    print(f"Error: {response.text}")
