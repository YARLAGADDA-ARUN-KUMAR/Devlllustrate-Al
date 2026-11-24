from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, models, generation, diagrams

app = FastAPI(
    title="DevIllustrate AI Backend",
    description="FastAPI service for technical diagram and illustration generation via Cloudflare Workers AI",
    version="1.0.0",
)

# Configure CORS for frontend access
origins = [
    settings.FRONTEND_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health.router, prefix="/api")
app.include_router(models.router, prefix="/api")
app.include_router(generation.router, prefix="/api")
app.include_router(diagrams.router, prefix="/api")


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "DevIllustrate AI Backend",
        "description": "Technical Documentation Graphic Generator",
        "status": "online",
        "documentation": "/docs",
        "health": "/api/health",
        "models": "/api/models",
    }
