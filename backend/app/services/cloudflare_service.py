import logging
import random
from typing import Any, Dict
import httpx

from app.core.config import settings
from app.services.image_service import ImageService
from app.utils.exceptions import (
    CloudflareAuthException,
    CloudflareGenerationException,
    CloudflareRateLimitException,
    CloudflareTimeoutException,
)

logger = logging.getLogger(__name__)


class CloudflareService:
    def __init__(self, account_id: str | None = None, api_token: str | None = None):
        self.account_id = settings.CLOUDFLARE_ACCOUNT_ID if account_id is None else account_id
        self.api_token = settings.CLOUDFLARE_API_TOKEN if api_token is None else api_token
        self.model = settings.CLOUDFLARE_IMAGE_MODEL
        self.timeout = settings.API_TIMEOUT

    @property
    def is_configured(self) -> bool:
        return bool(self.account_id.strip() and self.api_token.strip())

    async def generate_image(
        self,
        prompt: str,
        steps: int = 4,
        seed: int | None = None,
    ) -> Dict[str, Any]:
        """
        Calls Cloudflare Workers AI REST API for @cf/black-forest-labs/flux-1-schnell.
        Returns a dict containing:
          - imageDataUrl: str
          - imageMimeType: str
          - seed: int
          - steps: int
          - model: str
        """
        if not self.is_configured:
            raise CloudflareAuthException(
                "Cloudflare credentials not configured on backend. Ensure CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are set in backend/.env"
            )

        # FLUX.1 Schnell parameter constraints:
        # Steps typically range from 1 to 8 (default 4 for fastest high-quality result)
        mapped_steps = min(max(1, steps), 8) if steps <= 8 else 4
        effective_seed = seed if seed is not None and seed > 0 else random.randint(10000, 999999)

        url = f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/ai/run/{self.model}"
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json",
        }
        # Cloudflare Workers AI flux-1-schnell schema accepts 'prompt' and 'steps'.
        # Note: 'seed' is not accepted by flux-1-schnell schema and results in 400 Bad Request.
        payload: Dict[str, Any] = {
            "prompt": prompt,
            "steps": mapped_steps,
        }

        logger.info("Calling Cloudflare Workers AI model: %s (steps=%d, seed=%d)", self.model, mapped_steps, effective_seed)

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, headers=headers, json=payload)
        except httpx.TimeoutException:
            logger.error("Cloudflare Workers AI request timed out after %s seconds", self.timeout)
            raise CloudflareTimeoutException()
        except httpx.RequestError as exc:
            logger.error("Network error communicating with Cloudflare: %s", exc.__class__.__name__)
            raise CloudflareGenerationException(
                "Failed to connect to Cloudflare Workers AI. Check network connectivity."
            )

        # Inspect HTTP Status
        if response.status_code == 401 or response.status_code == 403:
            logger.error("Cloudflare authorization failed (status=%d)", response.status_code)
            raise CloudflareAuthException()
        elif response.status_code == 429:
            logger.warning("Cloudflare Workers AI rate limited (status=429)")
            raise CloudflareRateLimitException()
        elif response.status_code >= 400:
            error_detail = "Cloudflare Workers AI error"
            try:
                err_data = response.json()
                if "errors" in err_data and err_data["errors"]:
                    err_msg = err_data["errors"][0].get("message", "Unknown error")
                    error_detail = f"Cloudflare error: {err_msg}"
            except Exception:
                error_detail = f"Cloudflare error (HTTP {response.status_code})"
            logger.error("Cloudflare returned error status %d: %s", response.status_code, error_detail)
            raise CloudflareGenerationException(error_detail)

        # Process successful response
        content_type = response.headers.get("content-type", "").lower()
        image_data_str: str | bytes

        if "application/json" in content_type:
            try:
                res_json = response.json()
            except Exception:
                raise CloudflareGenerationException("Invalid JSON response from Cloudflare Workers AI")

            # Validate success flag if present
            if isinstance(res_json, dict) and not res_json.get("success", True):
                errors = res_json.get("errors", [])
                msg = errors[0].get("message", "Generation failed") if errors else "Generation failed"
                raise CloudflareGenerationException(f"Workers AI error: {msg}")

            result = res_json.get("result", {})
            if isinstance(result, dict) and "image" in result:
                image_data_str = result["image"]
            elif isinstance(res_json, dict) and "image" in res_json:
                image_data_str = res_json["image"]
            else:
                raise CloudflareGenerationException(
                    "Cloudflare response did not contain an image in the expected format"
                )
        else:
            # Direct binary image response
            image_data_str = response.content

        # Format to browser data URI
        data_url, mime_type = ImageService.format_to_data_url(image_data_str)

        return {
            "imageDataUrl": data_url,
            "imageMimeType": mime_type,
            "seed": effective_seed,
            "steps": mapped_steps,
            "model": self.model,
        }
