import time
import uuid
from datetime import datetime, timezone
from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException

from app.schemas.diagram import (
    DiagramDefinition,
    DiagramGenerateResponse,
    DiagramUnderstandRequest,
    DiagramValidationResult,
)
from app.services.diagram_service import DiagramUnderstandingService
from app.services.diagram_validator import DiagramValidator

router = APIRouter(prefix="/diagrams", tags=["Diagrams"])


def get_diagram_service() -> DiagramUnderstandingService:
    return DiagramUnderstandingService()


@router.post("/understand", response_model=DiagramDefinition)
async def understand_diagram_prompt(
    payload: DiagramUnderstandRequest,
    service: DiagramUnderstandingService = Depends(get_diagram_service),
) -> DiagramDefinition:
    """
    Transforms natural language description into a structured, validated diagram definition
    using Cloudflare Workers AI LLM.
    """
    diagram = await service.understand_diagram(
        prompt=payload.prompt,
        category=payload.category or "software-architecture",
        style=payload.style or "flat-vector",
    )
    return diagram


@router.post("/validate", response_model=DiagramValidationResult)
async def validate_diagram_structure(payload: Dict[str, Any]) -> DiagramValidationResult:
    """
    Validates and sanitizes a diagram structure, ensuring node uniqueness,
    edge endpoint existence, and structural graph coherence.
    """
    result = DiagramValidator.validate_and_sanitize(payload)
    return result


@router.post("/generate", response_model=DiagramGenerateResponse)
async def generate_diagram(
    payload: DiagramUnderstandRequest,
    service: DiagramUnderstandingService = Depends(get_diagram_service),
) -> DiagramGenerateResponse:
    """
    End-to-end diagram generation pipeline:
    1. Text understanding & structure extraction via LLM
    2. Structural graph validation & sanitization
    3. Packaging with tracking ID and metadata
    """
    diagram = await service.understand_diagram(
        prompt=payload.prompt,
        category=payload.category or "software-architecture",
        style=payload.style or "flat-vector",
    )

    creation_id = f"diag_{int(time.time())}_{uuid.uuid4().hex[:6]}"

    return DiagramGenerateResponse(
        id=creation_id,
        title=diagram.title,
        prompt=payload.prompt.strip(),
        category=payload.category or "software-architecture",
        style=payload.style or "flat-vector",
        diagram=diagram,
        model=service.model,
        createdAt=datetime.now(timezone.utc).isoformat(),
        isAIGenerated=True,
    )
