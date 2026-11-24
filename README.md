# DevIllustrate AI – Technical Diagram & Graphic Generator

> An AI-powered platform for generating accurate, structured, and editable technical documentation diagrams, software architecture schematics, and system visuals. Built with FastAPI, React Flow, and Cloudflare Workers AI.

---

## 1. Tutorials (Learning-Oriented)

### Quickstart: Running DevIllustrate AI Locally

Follow these step-by-step instructions to get both the Python FastAPI backend and the React frontend running on Windows PowerShell.

#### Prerequisites
- **Node.js**: v18+ (tested with v22 / v24)
- **Python**: 3.11+ (tested with Python 3.13)
- **Cloudflare Account**: Workers AI enabled (`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`)

#### Step 1: Configure Backend Environment Variables
Create or verify `backend/.env` with your Cloudflare Workers AI credentials:
```env
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id_here
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
CLOUDFLARE_MODEL=@cf/black-forest-labs/flux-1-schnell
CLOUDFLARE_TEXT_MODEL=@cf/meta/llama-3.1-8b-instruct
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
API_TIMEOUT=60
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
Open your browser to `http://localhost:5173`. The application is ready to generate diagrams.

---

## 2. How-To Guides (Problem-Oriented)

### How to Generate an AI Structured Technical Diagram
1. Navigate to the **Generate** page in the sidebar.
2. Verify that **AI Structured Diagram** is selected as the Generation Method (default).
3. Select an **Illustration Category** (e.g., *Software Architecture*, *Cybersecurity*, *Database Systems*, *Cloud Computing*, *Artificial Intelligence*).
4. Select a **Visual Style** (e.g., *Flat Vector*, *Isometric*, *Blueprint*, *Minimalist*, *3D Technical*, or *Line Art*).
5. Enter a prompt describing your system architecture, such as:
   > *"Zero Trust security architecture with Internet, WAF, API Gateway, Identity Provider, Application Server, and Encrypted Database."*
6. Click **Generate Illustration**. The LLM infers the graph structure, validates it, and mounts it into the interactive canvas.

### How to Edit Diagrams Interactively
- **Reposition Components**: Click and drag any node to reposition it. Connected edges adjust automatically.
- **Edit Node Labels**: Click the edit pencil icon on any node or double-click to rename the component directly.
- **Add Components**: Click **+ Add Node** in the canvas toolbar to insert a new component.
- **Create Connections**: Click and drag from any node handle (circle connector) to another node to establish a new directed edge.
- **Delete Components**: Hover over a node and click the trash icon.
- **Change Layout Direction**: Click **Direction (LR/TB)** in the canvas toolbar to switch between horizontal (Left-to-Right) and vertical (Top-to-Bottom) flow.
- **Auto-Align Graph**: Click **Auto Align** to re-execute the Dagre directed graph layout algorithm.
- **Fullscreen Mode**: Click **Fullscreen** in the toolbar to enter a distraction-free editing canvas.

### How to Export and Reopen Diagrams
- **Export Formats**: Click **Download PNG** or **Export SVG** to save your diagram for documentation and presentations.
- **Copy Graph JSON**: Click **Copy JSON** in the toolbar to copy the validated `DiagramDefinition` schema to your clipboard.
- **Save to Library**: Click **Save to Creations** to store the creation in IndexedDB.
- **Reopen in Workspace**: Navigate to **My Creations**, open any structured diagram, and click **Open in Workspace** to reload the interactive graph into the Generate canvas with full editability.

### How to Run Automated Tests
```powershell
# Backend Mock Unit Tests (Pytest)
cd backend
.\.venv\Scripts\python.exe -m pytest tests

# Live Acceptance Test Suite (All 6 Scenarios)
.\.venv\Scripts\python.exe tests/verify_acceptance_tests.py

# Frontend Linting & Production Build
cd ..\frontend
npm run lint
npm run build
```

---

## 3. Reference (Information-Oriented)

### REST API Endpoints

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/diagrams/understand` | LLM text prompt to validated diagram graph | `DiagramUnderstandRequest` | `DiagramDefinition` |
| `POST` | `/api/diagrams/validate` | Validates and sanitizes diagram graph | `DiagramDefinition` | `DiagramValidationResult` |
| `POST` | `/api/diagrams/generate` | Generates structured diagram and metadata | `DiagramUnderstandRequest` | `DiagramGenerateResponse` |
| `POST` | `/api/generate` | Generates artistic raster image via FLUX.1 | `GenerationRequest` | `GenerationResponse` |
| `GET` | `/api/models` | Lists available AI models | None | `{"models": [...], "defaultModel": "...", "textModel": "..."}` |
| `GET` | `/api/health` | Service health and Cloudflare status | None | `{"status": "healthy", "cloudflareConfigured": true}` |

### Structured Diagram JSON Schema (`DiagramDefinition`)

```json
{
  "title": "React Frontend with FastAPI Backend and MySQL Database",
  "diagram_type": "software_architecture",
  "description": "Standard three-tier software architecture",
  "layout_direction": "LR",
  "nodes": [
    {
      "id": "react_frontend",
      "label": "React Frontend",
      "type": "frontend",
      "description": "Client-side SPA",
      "shape": "rounded",
      "color": "#3b82f6"
    },
    {
      "id": "fastapi_backend",
      "label": "FastAPI Backend",
      "type": "backend",
      "description": "REST API service",
      "shape": "rounded",
      "color": "#10b981"
    }
  ],
  "edges": [
    {
      "id": "e_react_fastapi_1",
      "source": "react_frontend",
      "target": "fastapi_backend",
      "label": "REST API",
      "direction": "unidirectional",
      "style": "solid"
    }
  ],
  "groups": []
}
```

### Visual Style Palettes

| Style | Aesthetic Direction | Background | Edge Color | Node Colors |
| :--- | :--- | :--- | :--- | :--- |
| **Flat Vector** | Modern clean SaaS | Slate navy (`#0f172a`) | Electric blue (`#38bdf8`) | Vibrant accents (Cyan, Emerald, Violet) |
| **Isometric** | Technical isometric projection | Deep charcoal (`#090d16`) | Cyan accent (`#06b6d4`) | Layered elevation with 3D bevels |
| **Blueprint** | Engineering blueprint | Technical dark cyan (`#031926`) | Blueprint cyan (`#38bdf8`) | Grid overlay, monospaced typography |
| **Minimalist** | Monochromatic clarity | Pure slate (`#020617`) | Clean gray (`#94a3b8`) | High contrast, refined wireframes |
| **3D Technical** | Gradient depth and glassmorphism | Dark violet navy (`#0b0d1b`) | Neon violet (`#8b5cf6`) | Gradient borders, glow effects |
| **Line Art** | Ultra-fine precision line schematic | Pitch black (`#050505`) | Crisp white (`#ffffff`) | Crisp dashed/solid white stroke geometry |

---

## 4. Explanation (Understanding-Oriented)

### The AI-to-Structured-Diagram-to-Rendering Architecture

```
┌────────────────────────────────────────────────────────┐
│               Natural Language User Prompt             │
│  "Zero Trust architecture with WAF, API Gateway, DB"   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            Cloudflare Workers AI (LLM)                 │
│         @cf/meta/llama-3.1-8b-instruct                 │
│  - Extracts topology, node types, shapes, and edges    │
│  - Emits typed JSON conforming to graph grammar        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│           DiagramValidator (FastAPI Service)           │
│  - Deduplicates node IDs and cleans identifiers        │
│  - Eliminates dangling edges without target endpoints  │
│  - Sanitizes and enforces directed acyclic/cyclic flow │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│         Interactive Vector Engine (@xyflow/react)      │
│  - Dagre automatic directed layout (LR / TB)           │
│  - Inline label editing, node drag, edge connection    │
│  - 6 distinct visual themes (Blueprint, Isometric,...) │
│  - SVG and PNG vector/raster export                    │
└────────────────────────────────────────────────────────┘
```

### Why Pure Diffusion Models Fail for Technical Diagrams
- **Unreliable Text & Labels**: Diffusion models synthesize pixels via latent denoising. They do not comprehend spelling or typography, frequently producing pseudo-alphabetic gibberish.
- **Hallucinated or Ambiguous Connections**: Arrows in diffusion images often terminate in empty space, lack clear directionality, or form impossible physical topologies.
- **Zero Editability**: An image generated by a diffusion model is a flattened matrix of pixels. Changing a single label or moving a service requires regenerating the entire image, altering the visual aesthetic and topology unpredictably.

### How DevIllustrate AI Solves This
1. **Separation of Understanding and Rendering**: Text comprehension is handled by an LLM trained for structured instruction following (`Llama 3.1 8B Instruct`), while visual layout and rendering are handled deterministically by graph algorithms (`Dagre`) and vector canvas engines (`React Flow`).
2. **Deterministic Graph Validation**: Before any graph is presented to the user, `DiagramValidator` verifies that every edge connects valid nodes, resolves duplicate identifiers, and formats data into standard Pydantic models.
3. **True Interactivity**: The user can modify node titles, insert components, re-route edges, change flow directions, and switch visual themes in real time without calling the AI again.
4. **Hybrid Persistence**: Diagrams are saved in IndexedDB as both structured graph definitions (enabling future re-editing) and self-contained SVG vectors (for fast previews and instant exports).
5. **Preservation of Alternative Modes**: FLUX.1 Schnell is preserved as "Artistic Illustration" mode for decorative conceptual art, and the local Vector Engine is preserved as "Vector Blueprint" mode for offline generation.
