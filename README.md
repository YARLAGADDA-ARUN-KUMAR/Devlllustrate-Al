# DevIllustrate AI – Technical Documentation Graphic Generator

> An AI-powered platform for generating high-quality technical documentation graphics, software architecture diagrams, and system visuals using Cloudflare Workers AI and FLUX.1 Schnell.

---

## 1. Tutorials (Learning-Oriented)

### Quickstart: Running DevIllustrate AI Locally

Follow these step-by-step instructions to get both the Python FastAPI backend and the React frontend running on Windows PowerShell.

#### Prerequisites
- **Node.js**: v18+ (tested with v22 / v24)
- **Python**: 3.11+ (tested with Python 3.13)
- **Cloudflare Account**: with Workers AI enabled (`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`)

#### Step 1: Clone and Set Up Environment Variables
Create a `backend/.env` file with your Cloudflare Workers AI credentials:
```env
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id_here
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
CLOUDFLARE_MODEL=@cf/black-forest-labs/flux-1-schnell
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```
*(Reference: see `backend/.env.example`)*

#### Step 2: Set Up and Start the FastAPI Backend
Open a PowerShell terminal:
```powershell
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
The backend API is now running at `http://127.0.0.1:8000`. You can inspect the interactive OpenAPI documentation at `http://127.0.0.1:8000/docs`.

#### Step 3: Set Up and Start the React Frontend
Open a second PowerShell terminal:
```powershell
# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```
Open your browser to `http://localhost:5173`. The application is ready to generate illustrations.

---

## 2. How-To Guides (Problem-Oriented)

### How to Generate a Technical Illustration
1. Navigate to the **Generate** tab in the sidebar navigation.
2. Enter a description of your graphic (e.g., *"Event-driven microservices architecture communicating via Apache Kafka and Redis cache"*).
3. Select an **Illustration Category** (e.g., *Software Architecture*, *Cloud Computing*, *Database Systems*).
4. Select an **Illustration Style** (e.g., *Flat Vector*, *Isometric*, *Blueprint*, *Minimalist*).
5. Adjust **Generation Settings** if needed (diffusion steps: 1–8, default 4).
6. Click **Generate Illustration**. The request is sent to the FastAPI backend, which enriches the prompt and calls Cloudflare Workers AI.
7. Once generated, preview the full-resolution image, download as PNG/SVG, or save to your local library.

### How to Run Automated Tests
```powershell
# Backend Unit Tests (Pytest)
cd backend
.\.venv\Scripts\python.exe -m pytest tests

# Live Cloudflare Integration Verification (requires network)
.\.venv\Scripts\python.exe -m tests.verify_live_api

# Frontend Linting & Production Build
cd ..\frontend
npm run lint
npm run build
```

### How to Check Backend Health
Check `GET http://localhost:8000/api/health` directly in your browser, or visit the **Settings** page in the frontend dashboard. The settings page displays the live connection status, backend version, and Cloudflare configuration status.

---

## 3. Reference (Information-Oriented)

### REST API Endpoints

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health & configuration status | None | `{"status": "healthy", "version": "1.0.0", "cloudflareConfigured": bool}` |
| `GET` | `/api/models` | List available generation models | None | `{"models": [...], "defaultModel": "..."}` |
| `POST` | `/api/generate` | Generate illustration using FLUX.1 Schnell | `GenerationRequest` | `GenerationResponse` |

#### `POST /api/generate` Schema

**Request Body:**
```json
{
  "prompt": "A modern software architecture diagram showing React, FastAPI, and PostgreSQL",
  "category": "software-architecture",
  "style": "flat-vector",
  "aspectRatio": "16:9",
  "steps": 4,
  "seed": 42
}
```

**Response Body:**
```json
{
  "id": "gen_1732450800000",
  "imageDataUrl": "data:image/jpeg;base64,...",
  "imageMimeType": "image/jpeg",
  "prompt": "A modern software architecture diagram...",
  "enrichedPrompt": "Professional technical documentation illustration of...",
  "category": "software-architecture",
  "style": "flat-vector",
  "model": "@cf/black-forest-labs/flux-1-schnell",
  "steps": 4,
  "seed": 42,
  "createdAt": "2026-11-24T12:00:00.000Z"
}
```

### Error Codes and Responses

| HTTP Status | Exception / Reason | User-Facing Message |
| :--- | :--- | :--- |
| `400` | Validation error (empty prompt, invalid steps) | Input validation details |
| `401` / `403` | Invalid or expired Cloudflare API token | *"Cloudflare API authentication failed. Verify credentials in backend/.env"* |
| `429` | Cloudflare rate limit exceeded | *"Cloudflare rate limit exceeded. Please wait a moment."* |
| `502` | Network failure reaching Cloudflare Workers AI | *"Failed to communicate with Cloudflare Workers AI"* |
| `504` | Request timed out after 60s | *"Image generation request timed out. Please retry."* |

---

## 4. Explanation (Understanding-Oriented)

### Architecture Overview

```
┌─────────────────────────────────┐
│     React 19 Frontend (Vite)    │
│  - Generation Workspace UI      │
│  - IndexedDB Image Storage      │
│  - SVG & Raster Preview/Export  │
└────────────────┬────────────────┘
                 │ HTTP REST (JSON)
                 ▼
┌─────────────────────────────────┐
│       FastAPI Backend           │
│  - Prompt Enrichment Service    │
│  - Credential Protection        │
│  - MIME & Data-URL Formatter    │
└────────────────┬────────────────┘
                 │ HTTPS (Bearer Token)
                 ▼
┌─────────────────────────────────┐
│   Cloudflare Workers AI         │
│  - FLUX.1 Schnell Model         │
│  - Distilled Rectified Flow     │
│  - Sub-second / Low-latency     │
└─────────────────────────────────┘
```

### Key Architectural Decisions

1. **Security & Zero Frontend Secret Exposure**:
   Cloudflare API credentials (`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`) reside exclusively on the FastAPI backend. No frontend environment variables or client-side bundles ever touch or expose these secrets.

2. **Prompt Enrichment for Technical Graphics**:
   General diffusion models tend to generate photographic or artistic imagery. `PromptService` automatically analyzes the selected technical category and style, prepending explicit technical design directives (e.g. *clean vector lines, high contrast, clean white background, professional technical schematic layout, no photo noise*).

3. **Distilled FLUX.1 Schnell Performance**:
   FLUX.1 Schnell uses a 4-step distilled rectified flow architecture, delivering sharp technical diagrams in seconds compared to legacy 25-50 step diffusion models.

4. **IndexedDB Client Storage**:
   Raw Base64 raster images exceed standard `localStorage` limits (typically 5MB). DevIllustrate AI uses IndexedDB (`devillustrate_db`) with automatic transparent migration from legacy `localStorage`, ensuring thousands of creations can be saved locally without browser storage quotas or crashes.

---

## 5. Technology Stack Deep-Dive

### React 19 + TypeScript (Vite)
- **Component Architecture**: Modular page components (`Dashboard`, `Generate`, `Creations`, `Templates`, `Settings`, `HelpDocs`) communicating via typed React state.
- **Client Performance**: Sub-second hot-module replacement (HMR) powered by Vite 8 with strict TypeScript typing across all generation interfaces.
- **Modern Dark UI**: Professional SaaS theme inspired by developer workstations, featuring custom CSS variables, subtle glassmorphism overlays, and Lucide React iconography.

### FastAPI + Uvicorn (Python 3.13)
- **High-Performance Async I/O**: Non-blocking `async`/`await` request pipeline via HTTPX connecting directly to Cloudflare's serverless edge.
- **Pydantic Validation**: Strict input validation ensuring prompt lengths (3–1000 chars), valid categories, and normalized step ranges.
- **CORS Protection**: Scoped origins allowing local Vite client access (`http://localhost:5173`) while rejecting arbitrary external origins.

### Cloudflare Workers AI & FLUX.1 Schnell
- **Architecture**: 12-billion parameter flow-matching model developed by Black Forest Labs, hosted on Cloudflare's distributed GPU edge infrastructure.
- **Inference Optimization**: Rectified flow formulation trained to synthesize full-resolution images in 1 to 8 steps (4 steps optimal).
- **MIME & Byte Pipeline**: Magic byte detection on the backend accurately identifies image headers (`JPEG`, `PNG`, `WEBP`) and formats them into high-resolution browser data URIs.

### IndexedDB Storage Engine (`devillustrate_db`)
- **Quota Resilience**: Browser `localStorage` is restricted to ~5MB, which fails after saving 10-20 high-resolution base64 images.
- **Asynchronous Storage**: IndexedDB provides multi-hundred megabyte persistent client storage with zero main-thread freezing.
- **Transparent Migration**: Automatically detects existing legacy creations in `localStorage`, seeds them into IndexedDB, and maintains backward compatibility.

---

## 6. Model Limitations & Parameter Handling

| Parameter | FLUX.1 Schnell Support | How DevIllustrate AI Handles It |
| :--- | :--- | :--- |
| **`prompt`** | Supported (Required, max 2048 chars) | Backend prepends domain topology directives and visual style guidelines. |
| **`steps`** | Supported (1–8, default 4) | Clamped between 1 and 8. The UI slider offers 1 (Fast), 4 (Recommended), and 8 (Max). |
| **`seed`** | Not Accepted by Cloudflare REST API | Cloudflare returns `400 Bad Request` if `seed` is included in payload. The backend omits it from the Cloudflare payload and maintains it as a client session reference tag. |
| **`guidance_scale`** | Not Accepted (Built-in Distilled Weights) | Distilled rectified flow models have baked-in guidance. The UI clearly marks this parameter as non-applicable. |
| **`negative_prompt`** | Not Accepted | FLUX.1 Schnell does not use negative prompting. The backend uses positive technical prompt directives to avoid visual artifacts. |
| **`dimensions`** | Fixed Tensor Resolution (1024×1024) | Cloudflare outputs standard high-res square images. Dimensions selected in the UI are applied for aspect ratio framing and SVG export scaling. |

---

## 7. AI Raster Images vs. Vector SVG Engine

| Feature | Cloudflare AI (FLUX.1 Schnell) | Vector Engine (SVG Blueprint) |
| :--- | :--- | :--- |
| **Engine** | 12B Parameter Neural Diffusion Model | Programmatic Deterministic TypeScript/SVG |
| **Network Required** | Yes (Cloudflare Workers AI REST API) | No (100% Offline in Browser) |
| **Output Type** | Raster Bitmap (`image/jpeg` or `image/png`) | Pure Vector Markup (`<svg>...</svg>`) |
| **Zoom Behavior** | High resolution (1024×1024) with zoom | Infinite geometric scaling without pixelation |
| **Download Formats** | PNG, JPEG | SVG (Vector), PNG, JPEG |
| **Best For** | Complex creative concepts, 3D technical graphics, isometric illustrations | Precise architectural wireframes, clean system flowcharts |

