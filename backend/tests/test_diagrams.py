import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.diagram import DiagramDefinition, DiagramNode, DiagramEdge
from app.services.diagram_validator import DiagramValidator
from app.api.routes.diagrams import get_diagram_service


@pytest.fixture
def client():
    return TestClient(app)


def test_diagram_validator_valid():
    raw = {
        "title": "Web Architecture",
        "diagram_type": "software_architecture",
        "nodes": [
            {"id": "client", "label": "Web Client", "type": "frontend"},
            {"id": "api", "label": "API Gateway", "type": "gateway"},
            {"id": "db", "label": "PostgreSQL", "type": "database"},
        ],
        "edges": [
            {"source": "client", "target": "api", "label": "HTTPS"},
            {"source": "api", "target": "db", "label": "SQL"},
        ],
    }

    result = DiagramValidator.validate_and_sanitize(raw)
    assert result.is_valid is True
    assert result.sanitized_diagram is not None
    assert len(result.sanitized_diagram.nodes) == 3
    assert len(result.sanitized_diagram.edges) == 2
    assert result.sanitized_diagram.title == "Web Architecture"


def test_diagram_validator_dangling_edge():
    raw = {
        "title": "Dangling Test",
        "diagram_type": "software_architecture",
        "nodes": [
            {"id": "service_a", "label": "Service A", "type": "service"},
        ],
        "edges": [
            {"source": "service_a", "target": "non_existent", "label": "RPC"},
        ],
    }

    result = DiagramValidator.validate_and_sanitize(raw)
    assert result.is_valid is True
    assert len(result.sanitized_diagram.nodes) == 1
    # Dangling edge must be safely pruned
    assert len(result.sanitized_diagram.edges) == 0
    assert len(result.warnings) > 0


def test_diagram_validator_duplicate_ids():
    raw = {
        "title": "Duplicate ID Test",
        "diagram_type": "software_architecture",
        "nodes": [
            {"id": "node_x", "label": "Node 1", "type": "backend"},
            {"id": "node_x", "label": "Node 2", "type": "backend"},
        ],
        "edges": [
            {"source": "node_x", "target": "node_x_2", "label": "Internal"},
        ],
    }

    result = DiagramValidator.validate_and_sanitize(raw)
    assert result.is_valid is True
    node_ids = [n.id for n in result.sanitized_diagram.nodes]
    assert len(set(node_ids)) == 2
    assert "node_x" in node_ids
    assert "node_x_2" in node_ids


def test_diagram_validator_empty_nodes():
    raw = {
        "title": "Empty Test",
        "nodes": [],
        "edges": [],
    }

    result = DiagramValidator.validate_and_sanitize(raw)
    assert result.is_valid is False
    assert len(result.errors) > 0


def test_api_diagram_validate(client):
    payload = {
        "title": "API Gateway Topology",
        "diagram_type": "software_architecture",
        "nodes": [
            {"id": "ui", "label": "React UI", "type": "frontend"},
            {"id": "gateway", "label": "Kong Gateway", "type": "gateway"},
        ],
        "edges": [
            {"source": "ui", "target": "gateway", "label": "REST API"},
        ],
    }

    response = client.post("/api/diagrams/validate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert data["sanitized_diagram"]["title"] == "API Gateway Topology"


def test_api_diagram_generate_mocked(client):
    mock_def = DiagramDefinition(
        title="Mock Architecture",
        diagram_type="software_architecture",
        description="Mocked test diagram",
        nodes=[
            DiagramNode(id="fe", label="Frontend", type="frontend"),
            DiagramNode(id="be", label="Backend", type="backend"),
        ],
        edges=[
            DiagramEdge(source="fe", target="be", label="HTTP"),
        ],
        layout_direction="LR",
    )

    mock_service = AsyncMock()
    mock_service.understand_diagram.return_value = mock_def
    mock_service.model = "@cf/meta/llama-3.1-8b-instruct"

    app.dependency_overrides[get_diagram_service] = lambda: mock_service

    try:
        response = client.post(
            "/api/diagrams/generate",
            json={
                "prompt": "Create a diagram showing frontend and backend",
                "category": "software-architecture",
                "style": "flat-vector",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Mock Architecture"
        assert len(data["diagram"]["nodes"]) == 2
        assert len(data["diagram"]["edges"]) == 1
        assert data["isAIGenerated"] is True
    finally:
        app.dependency_overrides.clear()
