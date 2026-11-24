from fastapi import HTTPException, status


class DevIllustrateException(HTTPException):
    """Base exception for application errors."""

    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)


class CloudflareAuthException(DevIllustrateException):
    """Raised when Cloudflare API credentials are missing, invalid, or unauthorized."""

    def __init__(self, detail: str = "Cloudflare authentication failed. Verify API token permissions."):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


class CloudflareRateLimitException(DevIllustrateException):
    """Raised when Cloudflare rate limits are reached."""

    def __init__(self, detail: str = "Cloudflare API rate limit exceeded. Please wait a moment and try again."):
        super().__init__(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=detail)


class CloudflareGenerationException(DevIllustrateException):
    """Raised when Workers AI fails to generate an image."""

    def __init__(self, detail: str = "Failed to generate illustration with Cloudflare Workers AI."):
        super().__init__(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail)


class CloudflareTimeoutException(DevIllustrateException):
    """Raised when Cloudflare request times out."""

    def __init__(self, detail: str = "Cloudflare AI request timed out. Please retry with fewer inference steps."):
        super().__init__(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=detail)
