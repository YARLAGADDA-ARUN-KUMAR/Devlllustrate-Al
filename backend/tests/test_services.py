from unittest.mock import AsyncMock, MagicMock, patch
import httpx
import pytest

from app.services.cloudflare_service import CloudflareService
from app.services.prompt_service import PromptService
from app.utils.exceptions import CloudflareAuthException, CloudflareGenerationException, CloudflareRateLimitException


def test_prompt_enhancement():
    user_prompt = "A microservices architecture with Redis and PostgreSQL"
    enhanced = PromptService.enhance_prompt(
        user_prompt=user_prompt,
        category="software-architecture",
        style="flat-vector",
    )
    assert user_prompt in enhanced
    assert "software architecture diagram" in enhanced
    assert "flat vector" in enhanced


@pytest.mark.asyncio
async def test_cloudflare_service_unconfigured():
    service = CloudflareService(account_id="", api_token="")
    with pytest.raises(CloudflareAuthException):
        await service.generate_image("Test prompt")


@pytest.mark.asyncio
async def test_cloudflare_service_success_json():
    fake_png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    service = CloudflareService(account_id="test_acc", api_token="test_tok")

    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.headers = {"content-type": "application/json"}
    mock_resp.json.return_value = {
        "result": {"image": fake_png_base64},
        "success": True,
    }

    with patch.object(httpx.AsyncClient, "post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_resp
        result = await service.generate_image("Software diagram", steps=4, seed=12345)

        assert result["seed"] == 12345
        assert result["steps"] == 4
        assert result["imageDataUrl"].startswith("data:image/png;base64,")


@pytest.mark.asyncio
async def test_cloudflare_service_rate_limit():
    service = CloudflareService(account_id="test_acc", api_token="test_tok")

    mock_resp = MagicMock()
    mock_resp.status_code = 429
    mock_resp.headers = {"content-type": "application/json"}

    with patch.object(httpx.AsyncClient, "post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_resp
        with pytest.raises(CloudflareRateLimitException):
            await service.generate_image("Software diagram")


@pytest.mark.asyncio
async def test_cloudflare_service_error_response():
    service = CloudflareService(account_id="test_acc", api_token="test_tok")

    mock_resp = MagicMock()
    mock_resp.status_code = 500
    mock_resp.headers = {"content-type": "application/json"}
    mock_resp.json.return_value = {"errors": [{"message": "Inference server error"}]}

    with patch.object(httpx.AsyncClient, "post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_resp
        with pytest.raises(CloudflareGenerationException) as excinfo:
            await service.generate_image("Software diagram")
        assert "Inference server error" in str(excinfo.value.detail)
