import uuid
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field, field_validator

DiagramType = Literal[
    "software_architecture",
    "cloud_computing",
    "database_systems",
    "cybersecurity",
    "artificial_intelligence",
    "networking",
    "operating_systems",
    "general_technical",
]

NodeType = Literal[
    "frontend",
    "backend",
    "database",
    "cache",
    "queue",
    "gateway",
    "service",
    "auth",
    "storage",
    "network",
    "firewall",
    "security",
    "ai_model",
    "process",
    "kernel",
    "user",
    "external",
    "generic",
]

NodeShape = Literal[
    "rectangle",
    "cylinder",
    "cloud",
    "diamond",
    "hexagon",
    "circle",
    "rounded",
]

EdgeDirection = Literal["unidirectional", "bidirectional", "none"]
EdgeLineStyle = Literal["solid", "dashed", "dotted"]


class DiagramNode(BaseModel):
    id: str = Field(..., min_length=1, max_length=64, description="Unique node identifier")
    label: str = Field(..., min_length=1, max_length=120, description="Display label for node")
    type: NodeType = Field(default="generic", description="Architectural component type")
    description: Optional[str] = Field(default="", max_length=200, description="Short secondary description")
    group: Optional[str] = Field(default=None, max_length=64, description="Parent group/layer key")
    shape: NodeShape = Field(default="rounded", description="Visual shape representation")
    color: Optional[str] = Field(default=None, description="Accent color theme override")
    icon: Optional[str] = Field(default=None, description="Icon hint")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

    @field_validator("id")
    @classmethod
    def clean_id(cls, v: str) -> str:
        cleaned = v.strip().lower().replace(" ", "_")
        return cleaned or f"node_{uuid.uuid4().hex[:6]}"


class DiagramEdge(BaseModel):
    id: Optional[str] = Field(default=None, description="Unique edge identifier")
    source: str = Field(..., min_length=1, description="Source node ID")
    target: str = Field(..., min_length=1, description="Target node ID")
    label: Optional[str] = Field(default="", max_length=100, description="Connection/protocol label")
    direction: EdgeDirection = Field(default="unidirectional", description="Data flow direction")
    style: EdgeLineStyle = Field(default="solid", description="Line stroke style")
    animated: bool = Field(default=False, description="Whether connector indicates active stream")

    @field_validator("source", "target")
    @classmethod
    def clean_endpoints(cls, v: str) -> str:
        return v.strip().lower().replace(" ", "_")


class DiagramGroup(BaseModel):
    id: str = Field(..., min_length=1, max_length=64)
    label: str = Field(..., min_length=1, max_length=100)
    color: Optional[str] = None


class DiagramDefinition(BaseModel):
    title: str = Field(..., min_length=1, max_length=120, description="Diagram title")
    diagram_type: DiagramType = Field(default="software_architecture", description="Domain classification")
    description: Optional[str] = Field(default="", max_length=500, description="Overview of the architecture")
    nodes: List[DiagramNode] = Field(..., min_length=1, max_length=60, description="Graph components")
    edges: List[DiagramEdge] = Field(default_factory=list, max_length=120, description="Connections between nodes")
    groups: Optional[List[DiagramGroup]] = Field(default_factory=list)
    layout_direction: Literal["TB", "LR", "RL", "BT"] = Field(default="LR", description="Graph flow direction")


class DiagramUnderstandRequest(BaseModel):
    prompt: str = Field(..., min_length=3, max_length=2000, description="User's natural language architecture description")
    category: Optional[str] = Field(default="software-architecture")
    style: Optional[str] = Field(default="flat-vector")


class DiagramValidationResult(BaseModel):
    is_valid: bool
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    sanitized_diagram: Optional[DiagramDefinition] = None


class DiagramGenerateResponse(BaseModel):
    id: str
    title: str
    prompt: str
    category: str
    style: str
    diagram: DiagramDefinition
    model: str
    createdAt: str
    isAIGenerated: bool = True
