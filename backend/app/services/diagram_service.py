import json
import logging
import re
from typing import Any, Dict
import httpx

from app.core.config import settings
from app.schemas.diagram import DiagramDefinition
from app.services.diagram_validator import DiagramValidator
from app.utils.exceptions import (
    CloudflareAuthException,
    CloudflareGenerationException,
    CloudflareRateLimitException,
    CloudflareTimeoutException,
)

logger = logging.getLogger(__name__)

CATEGORY_INSTRUCTIONS: Dict[str, str] = {
    "software-architecture": (
        "Focus on system components: Frontend, API Gateway, Backend Microservices, "
        "Databases, Caches, Message Queues, Authentication. Show clear communication protocols on edges."
    ),
    "cloud-computing": (
        "Focus on cloud infrastructure: Cloud Regions, Availability Zones, VPC, Public/Private Subnets, "
        "Load Balancers, Compute Instances, Storage Buckets, NAT Gateways."
    ),
    "database-systems": (
        "Focus on database topology: Primary/Leader nodes, Replica/Follower nodes, Sharding partitions, "
        "Write-Ahead Logs (WAL), Consensus protocol links (Raft/Paxos), Replication streams."
    ),
    "cybersecurity": (
        "Focus on defensive security architecture: Internet, Edge Firewalls, WAF, API Gateway, "
        "Zero Trust boundaries, Mutual TLS, Authentication Enclave, Encrypted Data Store."
    ),
    "artificial-intelligence": (
        "Focus on ML pipeline stages: Data Ingestion, Preprocessing, Feature Store, "
        "Neural Network Model, Training/Inference Engine, Evaluation, Prediction Output."
    ),
    "networking": (
        "Focus on network topology: Edge Routers, Core Switches, Subnets, Servers, Clients, "
        "Firewalls, Network links with IP/protocol labels and directional traffic."
    ),
    "operating-systems": (
        "Focus on OS internals: User Space applications, System Call Interface, Process Scheduler, "
        "Virtual Memory Manager, Virtual File System (VFS), Kernel Space, Device Drivers, Hardware."
    ),
    "general": (
        "Focus on clean modular components with clear functional hierarchy and directional connections."
    ),
}

SYSTEM_PROMPT_TEMPLATE = """You are an expert technical system architect and visual diagram engineer.
Your task is to analyze the user's technical description and generate a complete, accurate, structured graph diagram representation.

Domain Focus: {domain_focus}

You MUST output ONLY a valid JSON object matching this exact schema:
{{
  "title": "Clear Diagram Title",
  "diagram_type": "{diagram_type}",
  "description": "Short summary of the system architecture",
  "layout_direction": "LR",
  "nodes": [
    {{
      "id": "unique_snake_case_id",
      "label": "Display Label",
      "type": "frontend|backend|database|cache|queue|gateway|service|auth|storage|network|firewall|security|ai_model|process|kernel|user|external|generic",
      "description": "Short explanation of role",
      "group": "optional_layer_or_boundary_name",
      "shape": "rounded|rectangle|cylinder|cloud|diamond|hexagon|circle"
    }}
  ],
  "edges": [
    {{
      "id": "e_source_target",
      "source": "exact_source_node_id",
      "target": "exact_target_node_id",
      "label": "Protocol or action (e.g. REST API, SQL Queries, Raft Heartbeat)",
      "direction": "unidirectional|bidirectional|none",
      "style": "solid|dashed|dotted"
    }}
  ]
}}

CRITICAL RULES:
1. Every component mentioned in the user prompt MUST have a distinct node with a clean, readable label.
2. Every edge MUST reference an exact 'source' and 'target' ID that exists in 'nodes'.
3. Data flow direction must accurately reflect the technical direction (e.g., Client -> Server, Server -> Database).
4. Do NOT output any markdown, explanations, or backticks outside the JSON. Output pure raw JSON only.
"""


class DiagramUnderstandingService:
    def __init__(
        self,
        account_id: str | None = None,
        api_token: str | None = None,
        model: str | None = None,
        timeout: float | None = None,
    ):
        self.account_id = account_id if account_id is not None else settings.CLOUDFLARE_ACCOUNT_ID
        self.api_token = api_token if api_token is not None else settings.CLOUDFLARE_API_TOKEN
        self.model = model or settings.CLOUDFLARE_TEXT_MODEL
        self.timeout = timeout or settings.API_TIMEOUT

    @property
    def is_configured(self) -> bool:
        return bool(self.account_id.strip() and self.api_token.strip())

    @staticmethod
    def _extract_json(raw_text: str) -> dict:
        """
        Extracts and parses JSON from LLM response, handling markdown fences and trailing commas.
        """
        text = raw_text.strip()

        # Remove markdown code fences if present
        if "```" in text:
            match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
            if match:
                text = match.group(1).strip()

        # Extract content between first { and last }
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            text = text[start : end + 1]

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Attempt trailing comma cleanup
            cleaned = re.sub(r",\s*([}\]])", r"\1", text)
            try:
                return json.loads(cleaned)
            except json.JSONDecodeError as exc:
                logger.error("Failed to parse JSON from LLM text: %s", text[:200])
                raise CloudflareGenerationException(
                    f"LLM did not return a valid structured diagram JSON: {exc}"
                )

    async def understand_diagram(
        self,
        prompt: str,
        category: str = "software-architecture",
        style: str = "flat-vector",
    ) -> DiagramDefinition:
        """
        Calls Cloudflare Workers AI LLM to analyze user prompt and returns a validated DiagramDefinition.
        """
        if not self.is_configured:
            raise CloudflareAuthException(
                "Cloudflare credentials not configured on backend. Ensure CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are set."
            )

        cat_key = category.lower().replace("_", "-")
        domain_focus = CATEGORY_INSTRUCTIONS.get(cat_key, CATEGORY_INSTRUCTIONS["general"])
        diagram_type = cat_key.replace("-", "_")

        system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
            domain_focus=domain_focus,
            diagram_type=diagram_type,
        )

        url = f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/ai/run/{self.model}"
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json",
        }
        payload = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": f"Create a technical architecture diagram for: {prompt.strip()}",
                },
            ],
            "max_tokens": 1800,
            "temperature": 0.15,
        }

        logger.info("Calling Cloudflare Workers AI LLM model '%s' for diagram understanding", self.model)

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, headers=headers, json=payload)
        except httpx.TimeoutException:
            logger.error("Cloudflare LLM request timed out after %s seconds", self.timeout)
            raise CloudflareTimeoutException("Diagram understanding request timed out. Please retry.")
        except httpx.RequestError as exc:
            logger.error("Network error communicating with Cloudflare LLM: %s", exc.__class__.__name__)
            raise CloudflareGenerationException("Failed to connect to Cloudflare Workers AI LLM service.")

        if response.status_code in (401, 403):
            raise CloudflareAuthException("Cloudflare API authentication failed. Verify credentials in backend/.env")
        elif response.status_code == 429:
            raise CloudflareRateLimitException("Cloudflare Workers AI rate limited. Please wait a moment.")
        elif response.status_code >= 400:
            logger.error("Cloudflare LLM returned status %d: %s", response.status_code, response.text[:200])
            raise CloudflareGenerationException(f"Cloudflare Workers AI error (HTTP {response.status_code})")

        # Parse Cloudflare response structure
        data = response.json()
        raw_content = ""

        # Cloudflare chat completions standard: result.response or result.choices[0].message.content
        result_obj = data.get("result", {})
        if isinstance(result_obj, dict):
            if "response" in result_obj and isinstance(result_obj["response"], str):
                raw_content = result_obj["response"]
            elif "choices" in result_obj and result_obj["choices"]:
                msg = result_obj["choices"][0].get("message", {})
                raw_content = msg.get("content", "")

        if not raw_content and isinstance(result_obj, dict) and "response" in result_obj:
            if isinstance(result_obj["response"], dict):
                # Model returned pre-parsed dict directly!
                parsed_json = result_obj["response"]
                validation = DiagramValidator.validate_and_sanitize(parsed_json)
                if validation.is_valid and validation.sanitized_diagram:
                    return validation.sanitized_diagram
                raise CloudflareGenerationException(
                    f"Diagram validation failed: {', '.join(validation.errors)}"
                )

        if not raw_content:
            raise CloudflareGenerationException("Cloudflare LLM returned an empty response.")

        # Extract and parse JSON
        parsed_json = self._extract_json(raw_content)

        # Validate & sanitize through DiagramValidator
        validation = DiagramValidator.validate_and_sanitize(parsed_json)
        if not validation.is_valid or not validation.sanitized_diagram:
            error_msg = "; ".join(validation.errors) if validation.errors else "Unknown validation failure"
            raise CloudflareGenerationException(f"Generated diagram failed structural validation: {error_msg}")

        return validation.sanitized_diagram
