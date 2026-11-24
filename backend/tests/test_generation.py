from unittest.mock import AsyncMock
import pytest
from httpx import ASGITransport, AsyncClient

from app.api.routes.generation import get_cloudflare_service
from app.main import app
from app.services.cloudflare_service import CloudflareService
from app.utils.exceptions import CloudflareAuthException, CloudflareTimeoutException


@pytest.mark.asyncio
async def test_generation_validation_error():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Prompt too short (< 3 characters)
        response = await client.post("/api/generate", json={"prompt": "hi"})
        assert response.status_code == 422


@pytest.mark.asyncio
async def test_generation_successful_mocked():
    fake_png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    mock_cf_service = AsyncMock(spec=CloudflareService)
    mock_cf_service.generate_image.return_value = {
        "imageDataUrl": f"data:image/png;base64,{fake_png_base64}",
        "imageMimeType": "image/png",
        "seed": 42,
        "steps": 4,
        "model": "@cf/black-forest-labs/flux-1-schnell",
    }

    app.dependency_overrides[get_cloudflare_service] = lambda: mock_cf_service

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "prompt": "A modern software architecture with React, FastAPI, and MySQL database",
                "category": "software-architecture",
                "style": "flat-vector",
                "settings": {
                    "method": "api",
                    "dimensions": "1024x1024",
                    "inferenceSteps": 4,
                    "guidanceScale": 7.5,
                    "seed": 42,
                },
            }
            response = await client.post("/api/generate", json=payload)
            assert response.status_code == 200
            data = response.json()
            assert data["isAIGenerated"] is True
            assert data["imageDataUrl"].startswith("data:image/")
            assert "React, FastAPI" in data["prompt"]
            assert data["category"] == "software-architecture"
            assert data["style"] == "flat-vector"
            assert data["seed"] == 42
            assert "enhancedPrompt" in data
            assert len(data["enhancedPrompt"]) > len(data["prompt"])
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_generation_cloudflare_auth_error():
    mock_cf_service = AsyncMock(spec=CloudflareService)
    mock_cf_service.generate_image.side_effect = CloudflareAuthException(
        "Cloudflare authentication failed. Verify API token permissions."
    )

    app.dependency_overrides[get_cloudflare_service] = lambda: mock_cf_service

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "prompt": "Kubernetes cluster architecture",
                "category": "cloud-computing",
                "style": "blueprint",
            }
            response = await client.post("/api/generate", json=payload)
            assert response.status_code == 401
            assert "authentication failed" in response.json()["detail"].lower()
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_generation_cloudflare_timeout():
    mock_cf_service = AsyncMock(spec=CloudflareService)
    mock_cf_service.generate_image.side_effect = CloudflareTimeoutException()

    app.dependency_overrides[get_cloudflare_service] = lambda: mock_cf_service

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "prompt": "Microservices network topology",
                "category": "networking",
                "style": "isometric",
            }
            response = await client.post("/api/generate", json=payload)
            assert response.status_code == 504
            assert "timed out" in response.json()["detail"].lower()
    finally:
        app.dependency_overrides.clear()
