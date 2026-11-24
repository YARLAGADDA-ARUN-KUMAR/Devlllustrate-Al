# DevIllustrate AI – Backend Service

FastAPI-powered image generation service integrating Cloudflare Workers AI with the DevIllustrate AI React application.

---

## 1. Tutorials (Learning-Oriented)

### Quickstart

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
   Copy `.env.example` to `.env` and configure your credentials:
   ```powershell
   Copy-Item .env.example .env
   ```
4. **Run Server**:
   ```powershell
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
5. **Open Docs**:
   Visit `http://127.0.0.1:8000/docs` for Swagger UI.

---

## 2. How-To Guides (Problem-Oriented)

### Running Pytest Unit Tests
```powershell
.\.venv\Scripts\python.exe -m pytest tests
```

### Running Live Cloudflare Verification
```powershell
.\.venv\Scripts\python.exe -m tests.verify_live_api
```

---

## 3. Reference (Information-Oriented)

### Directory Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── health.py        # GET /api/health
│   │   │   ├── models.py        # GET /api/models
│   │   │   └── generation.py    # POST /api/generate
│   │   └── router.py            # API router aggregator
│   ├── core/
│   │   └── config.py            # Pydantic Settings configuration
│   ├── schemas/
│   │   └── generation.py        # Request & Response schemas
│   ├── services/
│   │   ├── prompt_service.py    # Technical prompt engineering
│   │   ├── image_service.py     # Binary detection & base64 formatting
│   │   └── cloudflare_service.py# Cloudflare Workers AI integration
│   ├── utils/
│   │   └── exceptions.py        # Typed exception classes
│   └── main.py                  # FastAPI app & CORS middleware
├── tests/
│   ├── test_health.py           # Health endpoint tests
│   ├── test_generation.py       # Generation endpoint tests
│   ├── test_services.py         # Service layer tests
│   └── verify_live_api.py       # Live API script
├── pytest.ini
├── requirements.txt
├── .env.example
└── README.md
```

### Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID | *(Required)* |
| `CLOUDFLARE_API_TOKEN` | Workers AI Read/Run API Token | *(Required)* |
| `CLOUDFLARE_MODEL` | Default model tag | `@cf/black-forest-labs/flux-1-schnell` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173,http://localhost:3000` |
| `API_TIMEOUT` | Timeout in seconds for AI generation | `60` |

---

## 4. Explanation (Understanding-Oriented)

- **Prompt Engineering**: Technical diagrams require strict styling directives to avoid photorealistic noise. `prompt_service.py` injects style templates based on category (e.g. database, cloud) and visual aesthetic (e.g. isometric, blueprint).
- **MIME & Byte Inspection**: Workers AI can return either JSON containing a base64 string or raw image bytes. `image_service.py` inspects magic bytes (`\xFF\xD8\xFF` for JPEG, `\x89PNG` for PNG, `RIFF...WEBP` for WEBP) to reliably output standard browser data URIs.
- **Resilience**: Network timeouts and rate limits map to standard HTTP status codes (`504`, `429`, `502`) with clear user explanations.
