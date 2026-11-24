import asyncio
from pathlib import Path
import sys

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.services.cloudflare_service import CloudflareService


async def main():
    service = CloudflareService()
    print(f"Cloudflare Configured: {service.is_configured}")
    if not service.is_configured:
        print("ERROR: Cloudflare credentials are missing from environment.")
        sys.exit(1)

    print("Sending live test prompt to Cloudflare Workers AI (@cf/black-forest-labs/flux-1-schnell)...")
    try:
        result = await service.generate_image(
            prompt="A minimalist technical architecture diagram showing a React client communicating with a FastAPI backend",
            steps=4,
            seed=42,
        )
        print("Live Generation Result:")
        print(f" - Model: {result['model']}")
        print(f" - Seed: {result['seed']}")
        print(f" - Steps: {result['steps']}")
        print(f" - MIME Type: {result['imageMimeType']}")
        print(f" - Data URL length: {len(result['imageDataUrl'])} bytes")
        print(f" - Starts with data:image: {result['imageDataUrl'].startswith('data:image/')}")
        print("LIVE GENERATION TEST PASSED!")
    except Exception as e:
        print(f"Live Generation Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
