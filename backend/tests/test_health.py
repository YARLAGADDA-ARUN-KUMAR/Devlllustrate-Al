import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_root_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"
        assert "DevIllustrate" in data["service"]


@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "isCloudflareConfigured" in data
        assert "defaultModel" in data
        # Ensure credentials are NOT leaked
        assert "api_token" not in str(data).lower()
        assert "secret" not in str(data).lower()


@pytest.mark.asyncio
async def test_models_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/models")
        assert response.status_code == 200
        data = response.json()
        assert "activeModel" in data
        assert data["activeModel"]["name"] == "FLUX.1 Schnell"
        assert "software-architecture" in data["availableCategories"]
        assert "flat-vector" in data["availableStyles"]
