import asyncio
from pathlib import Path
import sys
import httpx

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.core.config import settings


async def test_llm_model(model_name: str):
    print(f"\n--- Testing model: {model_name} ---")
    url = f"https://api.cloudflare.com/client/v4/accounts/{settings.CLOUDFLARE_ACCOUNT_ID}/ai/run/{model_name}"
    headers = {
        "Authorization": f"Bearer {settings.CLOUDFLARE_API_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messages": [
            {
                "role": "system",
                "content": "You are a software architect. Respond with a JSON object: {\"status\": \"ok\", \"name\": \"test\"}",
            },
            {"role": "user", "content": "Ping test"},
        ],
        "max_tokens": 150,
        "temperature": 0.1,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.post(url, headers=headers, json=payload)
            print(f"Status Code: {resp.status_code}")
            if resp.status_code == 200:
                data = resp.json()
                print("Success! Response JSON:")
                print(data)
                return True
            else:
                print(f"Error ({resp.status_code}): {resp.text[:300]}")
                return False
        except Exception as e:
            print(f"Exception calling {model_name}: {e}")
            return False


async def main():
    if not settings.is_configured:
        print("ERROR: Cloudflare credentials not found.")
        sys.exit(1)

    candidates = [
        "@cf/meta/llama-3.1-8b-instruct",
        "@cf/meta/llama-3-8b-instruct",
        "@cf/mistral/mistral-7b-instruct-v0.2",
        "@cf/qwen/qwen1.5-7b-chat",
    ]

    working_model = None
    for model in candidates:
        success = await test_llm_model(model)
        if success:
            working_model = model
            break

    print(f"\nSelected working LLM model: {working_model}")


if __name__ == "__main__":
    asyncio.run(main())
