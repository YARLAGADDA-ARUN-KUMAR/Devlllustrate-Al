import asyncio
from pathlib import Path
import sys

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.services.cloudflare_service import CloudflareService
from app.services.prompt_service import PromptService


async def test_scenarios():
    service = CloudflareService()
    if not service.is_configured:
        print("ERROR: Cloudflare credentials not configured.")
        sys.exit(1)

    scenarios = [
        {
            "category": "database-systems",
            "style": "isometric",
            "prompt": "Distributed database cluster with Raft consensus leader, follower replicas, and write-ahead log",
        },
        {
            "category": "cybersecurity",
            "style": "blueprint",
            "prompt": "Zero-trust network perimeter with WAF firewall, mutual TLS authentication, and encrypted KMS enclave",
        },
    ]

    print(f"Executing {len(scenarios)} live AI image generation scenario(s)...")

    for i, sc in enumerate(scenarios, 1):
        enhanced = PromptService.enhance_prompt(sc["prompt"], sc["category"], sc["style"])
        print(f"\n--- Scenario {i}: Category={sc['category']}, Style={sc['style']} ---")
        print(f"Prompt: {sc['prompt']}")
        print(f"Enhanced Prompt (first 100 chars): {enhanced[:100]}...")

        start_time = asyncio.get_event_loop().time()
        result = await service.generate_image(
            prompt=enhanced,
            steps=4,
        )
        elapsed = asyncio.get_event_loop().time() - start_time

        data_url = result["imageDataUrl"]
        mime = result["imageMimeType"]
        size_bytes = len(data_url)

        print(f"Generated successfully in {elapsed:.2f}s!")
        print(f" - Model: {result['model']}")
        print(f" - MIME Type: {mime}")
        print(f" - Data URI Length: {size_bytes} chars")
        print(f" - Starts with valid data:image: {data_url.startswith('data:image/')}")

        assert data_url.startswith("data:image/"), "Output must be valid data URI"
        assert size_bytes > 10000, "Image must have realistic payload size"
        assert mime in ("image/jpeg", "image/png", "image/webp"), f"Unexpected MIME: {mime}"

    print("\nALL LIVE SCENARIO TESTS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    asyncio.run(test_scenarios())
