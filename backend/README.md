# DevIllustrate AI – Backend Service

FastAPI-powered structured technical diagram and image generation service integrating Cloudflare Workers AI with the DevIllustrate AI React application.

---

## 1. Tutorials (Learning-Oriented)

### Quickstart: Running the Backend

1. **Activate Virtual Environment**:
   ```powershell
   cd backend
   .\.venv\Scripts\Activate.ps1
   ```

2. **Install Requirements**:
   ```powershell
   pip install -r requirements.txt
   ```

3. **Configure Environment**:
   Ensure `backend/.env` is configured with your Cloudflare credentials:
   ```env
   CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
   CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
   CLOUDFLARE_MODEL=@cf/black-forest-labs/flux-1-schnell
   CLOUDFLARE_TEXT_MODEL=@cf/meta/llama-3.1-8b-instruct
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   API_TIMEOUT=60
   ```

4. **Run Server**:
   ```powershell
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

5. **Verify API Docs**:
   Visit `http://127.0.0.1:8000/docs` for interactive Swagger UI documentation.

---

## 2. How-To Guides (Problem-Oriented)

### How to Run Automated Unit Tests
Run the mock-isolated Pytest suite inside the local environment:
```powershell
.\.venv\Scripts\python.exe -m pytest tests
```

### How to Run the Phase 9 Acceptance Test Suite
Execute the 6 end-to-end acceptance tests connecting to Cloudflare Workers AI:
```powershell
.\.venv\Scripts\python.exe tests/verify_acceptance_tests.py
```

### How to Test Diagram Understanding via Curl
```powershell
curl -X POST "http://127.0.0.1:8000/api/diagrams/understand" `
  -H "Content-Type: application/json" `
  -d '{"prompt": "Microservices with API Gateway, Auth Service, and PostgreSQL", "category": "software-architecture", "style": "flat-vector"}'
```

### How to Validate a Structured Diagram
```powershell
curl -X POST "http://127.0.0.1:8000/api/diagrams/validate" `
  -H "Content-Type: application/json" `
  -d '{"title": "Test", "nodes": [{"id": "n1", "label": "Client", "type": "frontend"}], "edges": []}'
```

---

## 3. Reference (Information-Oriented)

### Directory Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── health.py              # GET /api/health
│   │   │   ├── models.py              # GET /api/models
│   │   │   ├── generation.py          # POST /api/generate (FLUX.1 Schnell)
│   │   │   └── diagrams.py            # POST /api/diagrams/{understand,validate,generate}
│   │   └── router.py                  # API router aggregator
│   ├── core/
│   │   └── config.py                  # Pydantic Settings & environment variables
│   ├── schemas/
│   │   ├── generation.py              # Raster generation schemas
│   │   └── diagram.py                 # Structured diagram schemas (Nodes, Edges, Groups)
│   ├── services/
│   │   ├── diagram_service.py         # LLM prompt understanding & JSON graph extraction
│   │   ├── diagram_validator.py       # Graph integrity validation & deduplication
│   │   ├── prompt_service.py          # FLUX prompt enrichment
│   │   ├── image_service.py           # Magic-byte detection & Base64 encoding
│   │   └── cloudflare_service.py      # Cloudflare Workers AI HTTPX client
│   ├── utils/
│   │   └── exceptions.py              # Typed API exceptions
│   └── main.py                        # FastAPI application entry point
├── tests/
│   ├── test_diagrams.py               # Unit tests for diagrams & validator
│   ├── test_generation.py             # Unit tests for FLUX generation
│   ├── test_health.py                 # Unit tests for health endpoints
│   ├── test_services.py               # Unit tests for core services
│   ├── verify_acceptance_tests.py     # Live 6-scenario acceptance test suite
│   ├── verify_live_api.py             # Live FLUX API verification
│   └── verify_llm_model.py            # Live LLM connectivity test
├── pytest.ini
├── requirements.txt
└── README.md
```

### REST API Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/diagrams/understand` | Converts text prompt to validated diagram graph | `DiagramUnderstandRequest` | `DiagramDefinition` |
| `POST` | `/api/diagrams/validate` | Validates and sanitizes a diagram graph | `DiagramDefinition` or `dict` | `DiagramValidationResult` |
| `POST` | `/api/diagrams/generate` | Generates structured diagram and metadata | `DiagramUnderstandRequest` | `DiagramGenerateResponse` |
| `POST` | `/api/generate` | Generates artistic raster image via FLUX.1 | `GenerationRequest` | `GenerationResponse` |
| `GET` | `/api/models` | Lists available AI models | None | `ModelsResponse` |
| `GET` | `/api/health` | Service health and Cloudflare status | None | `HealthResponse` |

### Supported Component Node Types
`frontend`, `backend`, `database`, `cache`, `queue`, `gateway`, `service`, `auth`, `storage`, `network`, `firewall`, `security`, `ai_model`, `process`, `kernel`, `user`, `external`, `generic`.

---

## 4. Explanation (Understanding-Oriented)

### The AI-to-Structured-Diagram Architecture

1. **The Limitations of Pure Diffusion Models**:
   Diffusion models like FLUX.1 Schnell generate impressive artistic graphics, but they treat technical diagrams as pixel rasters rather than connected graphs. As a result, text labels become garbled, arrows point in arbitrary directions, architecture topologies hallucinate non-existent connections, and the generated output cannot be edited.

2. **The Structured Diagram Pipeline**:
   DevIllustrate AI addresses this limitation by separating **semantic diagram understanding** from **graph rendering**:
   - **Step 1 (LLM Semantic Extraction)**: Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`) parses the user's natural-language description into a structured JSON graph specifying nodes, edges, labels, node categories, shapes, and layout directions.
   - **Step 2 (Pydantic Graph Validation & Sanitization)**: `DiagramValidator` verifies the output graph:
     - Deduplicates node IDs while mapping references.
     - Prunes dangling edges whose source or target nodes do not exist.
     - Deduplicates parallel identical edges.
     - Guarantees valid directional flows (`unidirectional`, `bidirectional`).
   - **Step 3 (Client-Side Vector Rendering)**: The React frontend renders the validated graph using `@xyflow/react` (React Flow) and `@dagrejs/dagre` for deterministic, clean, collision-free automatic layout.

3. **Security Architecture**:
   All Cloudflare account identifiers and API tokens reside exclusively in `backend/.env`. The frontend client communicates solely with the local FastAPI server through typed endpoints, ensuring that credentials are never exposed in browser bundles.
