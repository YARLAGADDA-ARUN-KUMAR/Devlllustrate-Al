from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    """Health check endpoint confirming backend status and safe configuration availability."""
    return {
        "status": "healthy",
        "service": "DevIllustrate AI Backend",
        "version": "1.0.0",
        "isCloudflareConfigured": settings.is_configured,
        "defaultModel": settings.CLOUDFLARE_IMAGE_MODEL,
        "textModel": settings.CLOUDFLARE_TEXT_MODEL,
        "environment": settings.ENVIRONMENT,
    }
