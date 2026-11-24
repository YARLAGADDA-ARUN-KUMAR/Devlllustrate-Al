from typing import Literal, Optional
from pydantic import BaseModel, Field

IllustrationCategory = Literal[
    "software-architecture",
    "cloud-computing",
    "database-systems",
    "cybersecurity",
    "artificial-intelligence",
    "networking",
    "operating-systems",
    "general",
]

IllustrationStyle = Literal[
    "flat-vector",
    "isometric",
    "blueprint",
    "minimalist",
    "3d-technical",
    "line-art",
]

GenerationMethod = Literal["api", "stable-diffusion-v14"]
ImageDimension = Literal["512x512", "768x768", "1024x1024"]


class SettingsPayload(BaseModel):
    method: GenerationMethod = "api"
    dimensions: ImageDimension = "1024x1024"
    inferenceSteps: int = Field(default=4, ge=1, le=50)
    guidanceScale: float = Field(default=7.5, ge=1.0, le=15.0)
    seed: Optional[int] = Field(default=None)
    negativePrompt: Optional[str] = Field(default="")


class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=3, max_length=1000, description="Technical illustration description")
    category: IllustrationCategory = "software-architecture"
    style: IllustrationStyle = "flat-vector"
    settings: SettingsPayload = Field(default_factory=SettingsPayload)


class GenerationResponse(BaseModel):
    id: str
    title: str
    prompt: str
    enhancedPrompt: str
    category: IllustrationCategory
    style: IllustrationStyle
    method: GenerationMethod
    dimensions: ImageDimension
    inferenceSteps: int
    guidanceScale: float
    seed: int
    negativePrompt: Optional[str] = ""
    createdAt: str
    imageDataUrl: str
    imageMimeType: str
    model: str
    svgData: Optional[str] = None
    isAIGenerated: bool = True
