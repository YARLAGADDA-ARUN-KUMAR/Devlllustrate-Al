import time
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends

from app.schemas.generation import GenerationRequest, GenerationResponse
from app.services.cloudflare_service import CloudflareService
from app.services.prompt_service import PromptService

router = APIRouter(tags=["Generation"])


def get_cloudflare_service() -> CloudflareService:
    return CloudflareService()


@router.post("/generate", response_model=GenerationResponse)
async def generate_illustration(
    payload: GenerationRequest,
    cloudflare: CloudflareService = Depends(get_cloudflare_service),
):
    """
    Accepts technical illustration description and settings, enhances prompt for technical
    documentation clarity, and generates a real illustration using Cloudflare Workers AI FLUX.1 Schnell.
    """
    # 1. Enhance prompt for technical graphics
    enhanced_prompt = PromptService.enhance_prompt(
        user_prompt=payload.prompt,
        category=payload.category,
        style=payload.style,
    )

    # 2. Call Cloudflare Workers AI
    gen_result = await cloudflare.generate_image(
        prompt=enhanced_prompt,
        steps=payload.settings.inferenceSteps,
        seed=payload.settings.seed,
    )

    # 3. Construct response object
    creation_id = f"ill_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    clean_title = payload.prompt.strip()
    if len(clean_title) > 60:
        clean_title = clean_title[:57] + "..."

    return GenerationResponse(
        id=creation_id,
        title=clean_title,
        prompt=payload.prompt.strip(),
        enhancedPrompt=enhanced_prompt,
        category=payload.category,
        style=payload.style,
        method="api",
        dimensions=payload.settings.dimensions,
        inferenceSteps=gen_result["steps"],
        guidanceScale=payload.settings.guidanceScale,
        seed=gen_result["seed"],
        negativePrompt=payload.settings.negativePrompt or "",
        createdAt=datetime.now(timezone.utc).isoformat(),
        imageDataUrl=gen_result["imageDataUrl"],
        imageMimeType=gen_result["imageMimeType"],
        model=gen_result["model"],
        isAIGenerated=True,
    )
