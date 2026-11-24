import asyncio
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
        "Focus on system architecture: Frontend clients, API Gateways, Microservices, "
        "Databases, Caches, Message Queues, Authentication. Show clear communication protocols on edges "
        "(e.g., 'REST API (HTTPS)', 'gRPC Call', 'SQL Queries (Read/Write)', 'Cache Lookup (Redis)', 'Publish Event')."
    ),
    "cloud-computing": (
        "Focus on cloud infrastructure: Cloud Regions, Availability Zones (e.g. 'Zone A', 'Zone B'), "
        "Virtual Private Cloud (VPC), Global Load Balancers, Application Clusters, Shared Managed Databases, "
        "Object Storage Buckets (S3/GCS), In-Memory Caches. Use 'group' to place components inside distinct zones or tiers."
    ),
    "database-systems": (
        "Focus on database clustering: Primary/Leader nodes, Secondary/Follower replicas, "
        "Consensus coordination (Raft/Paxos), Write-Ahead Logs (WAL), Read/Write client routing, "
        "Heartbeat healthchecks, and data replication streams."
    ),
    "cybersecurity": (
        "Focus on defensive security architecture: Untrusted Internet, Edge WAF, API Gateway, "
        "Zero Trust perimeter, Identity Provider (IdP / OAuth2 / OIDC), Application Servers, and Encrypted Database. "
        "Show explicit data flows: 'TLS Handshake', 'Filtered Requests', 'Token Exchange', 'Authenticated Tunnel'."
    ),
    "artificial-intelligence": (
        "Focus on end-to-end ML / AI pipelines: Raw Data Sources -> Data Preprocessing -> "
        "Feature Extraction / Feature Store -> Deep Learning / Transformer Model -> Post-processing -> "
        "Prediction & Evaluation Output. Arrange in sequential execution order."
    ),
    "networking": (
        "Focus on network topology: Edge Routers, Core Switches, DMZ, Firewalls, Application Subnets, "
        "Database Subnets, Clients. Label links with IP subnets, VLANs, and protocol directions."
    ),
    "operating-systems": (
        "Focus on OS architecture: User Space (Applications, Libraries), System Call Interface (Syscall), "
        "Kernel Space (Process Scheduler, VFS, Memory Manager, Network Stack), Device Drivers, and Hardware Layer."
    ),
    "general": (
        "Focus on clean modular components with intuitive functional tiers, logical grouping, and directional flow."
    ),
}

SYSTEM_PROMPT_TEMPLATE = """You are an expert technical system architect and senior visual diagram engineer.
Your task is to analyze the user's technical description and generate a highly accurate, professional, publication-quality structured graph diagram representation.

Domain Focus: {domain_focus}

You MUST output ONLY a valid JSON object matching this exact schema:
{{
  "title": "Clear, Professional Diagram Title",
  "diagram_type": "{diagram_type}",
  "description": "Concise technical overview of this architecture",
  "layout_direction": "LR",
  "groups": [
    {{
      "id": "group_snake_id",
      "label": "Human Readable Boundary (e.g. Availability Zone 1, VPC, DMZ, Zero Trust Enclave)",
      "color": "#38bdf8"
    }}
  ],
  "nodes": [
    {{
      "id": "unique_snake_case_id",
      "label": "Exact Component Name",
      "type": "frontend|backend|database|cache|queue|gateway|service|auth|storage|network|firewall|security|ai_model|process|kernel|user|external|generic",
      "description": "Specific technical role or technology (e.g. 'React 19 SPA', 'FastAPI REST API', 'PostgreSQL v16', 'Redis Cluster')",
      "group": "optional_group_id_matching_groups_list",
      "shape": "rounded|rectangle|cylinder|cloud|diamond|hexagon|circle"
    }}
  ],
  "edges": [
    {{
      "id": "e_source_target_1",
      "source": "exact_source_node_id",
      "target": "exact_target_node_id",
      "label": "Accurate protocol or data action (e.g. 'HTTPS Request', 'SQL Query', 'Heartbeat', 'Replication')",
      "direction": "unidirectional|bidirectional|none",
      "style": "solid|dashed|dotted"
    }}
  ]
}}

CRITICAL RULES:
1. PRESERVE ALL REQUESTED ENTITIES: Every single component mentioned in the user prompt MUST have a dedicated node with its exact technical name (e.g. React, FastAPI, MySQL, Redis, WAF, Raft Leader). Never invent random extra components or drop requested ones.
2. ACCURATE NODE TYPES & SHAPES:
   - Use 'frontend' or 'user' (shape: rounded/circle) for clients/frontends.
   - Use 'gateway' (shape: diamond/rounded) for API Gateways and Load Balancers.
   - Use 'backend' or 'service' (shape: rounded/rectangle) for application servers/microservices.
   - Use 'database' or 'storage' or 'cache' (shape: cylinder) for databases, caches, and object stores.
   - Use 'security' or 'firewall' or 'auth' (shape: hexagon) for firewalls, WAF, and identity providers.
   - Use 'ai_model' or 'process' (shape: rounded/hexagon) for neural networks, pipelines, or ML inference.
3. LOGICAL GROUPS & LAYERS: If the prompt describes zones, tiers, or enclaves (e.g. 'two availability zones', 'public/private subnet', 'Zero Trust boundary'), create matching 'groups' and assign nodes to their respective 'group' id.
4. MEANINGFUL CONNECTIONS:
   - Every edge must connect existing 'source' and 'target' IDs.
   - Use 'solid' for synchronous communication (REST API, SQL, HTTP).
   - Use 'dashed' for asynchronous flows (events, replication, heartbeats, logs).
   - Label every edge with a concise, descriptive protocol or action.
5. STRICT JSON ONLY: Do not output markdown, preambles, or conversational commentary outside the JSON. Return pure valid JSON.
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

        response = None
        last_error = None
        backoffs = [1.5, 3.0, 5.0, 8.0]
        for attempt in range(len(backoffs)):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(url, headers=headers, json=payload)
                    if response.status_code < 500:
                        break
                    logger.warning("Cloudflare server error %d on attempt %d/%d", response.status_code, attempt + 1, len(backoffs))
                    last_error = CloudflareGenerationException(f"Cloudflare server error ({response.status_code})")
            except httpx.TimeoutException as exc:
                logger.error("Cloudflare LLM request timed out after %s seconds (attempt %d/%d)", self.timeout, attempt + 1, len(backoffs))
                last_error = CloudflareTimeoutException("Diagram understanding request timed out. Please retry.")
            except httpx.RequestError as exc:
                logger.warning("Transient network error communicating with Cloudflare LLM (attempt %d/%d): %s", attempt + 1, len(backoffs), exc)
                last_error = CloudflareGenerationException("Failed to connect to Cloudflare Workers AI LLM service.")

            if attempt < len(backoffs) - 1:
                await asyncio.sleep(backoffs[attempt])

        if response is None:
            raise last_error or CloudflareGenerationException("Failed to communicate with Cloudflare Workers AI.")

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
