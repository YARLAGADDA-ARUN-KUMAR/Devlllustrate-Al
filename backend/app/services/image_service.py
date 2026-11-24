import base64
from typing import Tuple


class ImageService:
    @staticmethod
    def detect_mime_type(raw_bytes: bytes) -> str:
        """Detect image MIME type from initial magic bytes."""
        if raw_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
            return "image/png"
        elif raw_bytes.startswith(b"\xff\xd8\xff"):
            return "image/jpeg"
        elif raw_bytes.startswith(b"RIFF") and b"WEBP" in raw_bytes[:16]:
            return "image/webp"
        return "image/jpeg"  # Default for FLUX Schnell

    @classmethod
    def format_to_data_url(cls, image_data: str | bytes) -> Tuple[str, str]:
        """
        Converts base64 string or raw bytes into a browser-ready data URI.
        Returns: (data_url, mime_type)
        """
        if isinstance(image_data, bytes):
            raw_bytes = image_data
            mime_type = cls.detect_mime_type(raw_bytes)
            b64_str = base64.b64encode(raw_bytes).decode("utf-8")
            return f"data:{mime_type};base64,{b64_str}", mime_type

        # String input
        cleaned_str = image_data.strip()
        if cleaned_str.startswith("data:"):
            # Already formatted data url
            mime = "image/jpeg"
            if "image/png" in cleaned_str:
                mime = "image/png"
            elif "image/webp" in cleaned_str:
                mime = "image/webp"
            return cleaned_str, mime

        # Plain base64 string - decode first few bytes to sniff MIME type
        try:
            head_bytes = base64.b64decode(cleaned_str[:64])
            mime_type = cls.detect_mime_type(head_bytes)
        except Exception:
            mime_type = "image/jpeg"

        return f"data:{mime_type};base64,{cleaned_str}", mime_type
