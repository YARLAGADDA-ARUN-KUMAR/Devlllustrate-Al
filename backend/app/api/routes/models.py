from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Models"])


@router.get("/models")
async def get_models():
    """Returns available models, capabilities, and parameters supported by the backend."""
    return {
        "activeModel": {
            "id": settings.CLOUDFLARE_IMAGE_MODEL,
            "name": "FLUX.1 Schnell",
            "provider": "Cloudflare Workers AI",
            "type": "Diffusion Transformer (12B rectified flow)",
            "status": "ready" if settings.is_configured else "needs_credentials",
            "optimalSteps": 4,
            "maxSteps": 8,
            "supportedAspectRatios": ["1:1 (Square)", "16:9 (Landscape)", "4:3 (Technical)"],
            "features": [
                "Technical architecture diagram enhancement",
                "Sub-second distilled inference",
                "Domain-specific aesthetic prompting",
            ],
        },
        "availableCategories": [
            "software-architecture",
            "cloud-computing",
            "database-systems",
            "cybersecurity",
            "artificial-intelligence",
            "networking",
            "operating-systems",
            "general",
        ],
        "availableStyles": [
            "flat-vector",
            "isometric",
            "blueprint",
            "minimalist",
            "3d-technical",
            "line-art",
        ],
    }
