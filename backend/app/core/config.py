import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

# Search for .env file in backend/ or root
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ROOT_DIR = BACKEND_DIR.parent
ENV_FILE = BACKEND_DIR / ".env"
if not ENV_FILE.exists():
    ENV_FILE = ROOT_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE) if ENV_FILE.exists() else None,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Cloudflare Credentials (read exclusively on backend)
    CLOUDFLARE_ACCOUNT_ID: str = Field(default="", description="Cloudflare Account ID")
    CLOUDFLARE_API_TOKEN: str = Field(default="", description="Cloudflare Workers AI API Token")

    # Model Configuration
    CLOUDFLARE_IMAGE_MODEL: str = Field(
        default="@cf/black-forest-labs/flux-1-schnell",
        description="Target Cloudflare Workers AI diffusion model",
    )

    # CORS & Server
    FRONTEND_ORIGIN: str = Field(default="http://localhost:5173", description="Allowed CORS origin")
    API_TIMEOUT: float = Field(default=60.0, description="HTTP request timeout in seconds")
    ENVIRONMENT: str = Field(default="development", description="App environment")

    @property
    def is_configured(self) -> bool:
        """Returns True if essential Cloudflare credentials are provided."""
        return bool(self.CLOUDFLARE_ACCOUNT_ID.strip() and self.CLOUDFLARE_API_TOKEN.strip())

    @property
    def cloudflare_api_url(self) -> str:
        """Construct the Cloudflare Workers AI REST API endpoint."""
        model = self.CLOUDFLARE_IMAGE_MODEL.strip()
        account_id = self.CLOUDFLARE_ACCOUNT_ID.strip()
        return f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}"


settings = Settings()
