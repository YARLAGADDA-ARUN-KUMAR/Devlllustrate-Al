import asyncio
from pathlib import Path
import sys

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.services.diagram_service import DiagramUnderstandingService


async def main():
    service = DiagramUnderstandingService()
    if not service.is_configured:
        print("ERROR: Cloudflare credentials missing from backend/.env")
        sys.exit(1)

    prompt = (
        "Create a software architecture diagram showing a React frontend communicating with a FastAPI backend. "
        "The backend communicates with a MySQL database and Redis cache. "
        "Show REST API, SQL query and cache operation labels."
    )

    print("Sending live test prompt to Cloudflare Workers AI LLM (@cf/meta/llama-3.1-8b-instruct)...")
    print(f"Prompt: {prompt}")

    try:
        diagram = await service.understand_diagram(
            prompt=prompt,
            category="software-architecture",
            style="flat-vector",
        )

        print("\n--- LIVE STRUCTURED DIAGRAM RESULT ---")
        print(f"Title: {diagram.title}")
        print(f"Diagram Type: {diagram.diagram_type}")
        print(f"Description: {diagram.description}")
        print(f"Total Nodes: {len(diagram.nodes)}")
        for node in diagram.nodes:
            print(f"  • [{node.type}] id='{node.id}' label='{node.label}' shape='{node.shape}'")

        print(f"\nTotal Edges: {len(diagram.edges)}")
        for edge in diagram.edges:
            print(f"  → {edge.source} -> {edge.target} [{edge.label}] ({edge.direction})")

        assert len(diagram.nodes) >= 3, "Expected at least 3 nodes"
        assert len(diagram.edges) >= 2, "Expected at least 2 edges"

        print("\nLIVE DIAGRAM UNDERSTANDING TEST PASSED!")
    except Exception as e:
        print(f"Live Diagram Generation Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
