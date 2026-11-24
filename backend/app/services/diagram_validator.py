import logging
from typing import Dict, List, Set, Tuple
from app.schemas.diagram import DiagramDefinition, DiagramEdge, DiagramNode, DiagramValidationResult

logger = logging.getLogger(__name__)


class DiagramValidator:
    @staticmethod
    def validate_and_sanitize(data: dict | DiagramDefinition) -> DiagramValidationResult:
        """
        Validates a diagram definition dictionary or instance, resolving duplicate IDs,
        sanitizing dangling edge references, and guaranteeing structural graph integrity.
        """
        errors: List[str] = []
        warnings: List[str] = []

        # If already a DiagramDefinition, dump to dict for comprehensive inspection
        if isinstance(data, DiagramDefinition):
            raw = data.model_dump()
        elif isinstance(data, dict):
            raw = data
        else:
            return DiagramValidationResult(
                is_valid=False,
                errors=["Input must be a valid JSON dictionary or DiagramDefinition"],
            )

        title = str(raw.get("title", "")).strip() or "Technical Diagram"
        diagram_type = raw.get("diagram_type", "software_architecture")
        description = raw.get("description", "")
        layout_direction = raw.get("layout_direction", "LR")
        if layout_direction not in ("TB", "LR", "RL", "BT"):
            layout_direction = "LR"

        raw_nodes = raw.get("nodes", [])
        raw_edges = raw.get("edges", [])

        if not raw_nodes:
            errors.append("Diagram must contain at least one component node.")
            return DiagramValidationResult(is_valid=False, errors=errors)

        # 1. Sanitize & Deduplicate Nodes
        sanitized_nodes: List[DiagramNode] = []
        node_id_map: Dict[str, str] = {}  # original_clean -> unique_id
        seen_ids: Set[str] = set()

        for idx, item in enumerate(raw_nodes):
            if not isinstance(item, dict):
                continue
            orig_id = str(item.get("id", f"node_{idx+1}")).strip().lower().replace(" ", "_")
            if not orig_id:
                orig_id = f"node_{idx+1}"

            label = str(item.get("label", "")).strip() or f"Component {idx+1}"
            node_type = str(item.get("type", "generic")).lower()
            desc = str(item.get("description", ""))
            group = item.get("group")
            shape = str(item.get("shape", "rounded")).lower()
            color = item.get("color")
            icon = item.get("icon")

            # Handle duplicate ID
            unique_id = orig_id
            counter = 2
            while unique_id in seen_ids:
                unique_id = f"{orig_id}_{counter}"
                counter += 1
                warnings.append(f"Duplicate node ID '{orig_id}' renamed to '{unique_id}'")

            seen_ids.add(unique_id)
            node_id_map[orig_id] = unique_id

            try:
                node_obj = DiagramNode(
                    id=unique_id,
                    label=label,
                    type=node_type if node_type in DiagramNode.model_fields["type"].annotation.__args__ else "generic",
                    description=desc[:200],
                    group=str(group).strip() if group else None,
                    shape=shape if shape in DiagramNode.model_fields["shape"].annotation.__args__ else "rounded",
                    color=str(color) if color else None,
                    icon=str(icon) if icon else None,
                )
                sanitized_nodes.append(node_obj)
            except Exception as e:
                warnings.append(f"Failed to parse node {orig_id}: {e}")

        if not sanitized_nodes:
            errors.append("No valid component nodes could be parsed.")
            return DiagramValidationResult(is_valid=False, errors=errors, warnings=warnings)

        # 2. Sanitize Edges (Ensure source and target exist)
        sanitized_edges: List[DiagramEdge] = []
        edge_seen: Set[Tuple[str, str, str]] = set()

        for idx, edge_item in enumerate(raw_edges):
            if not isinstance(edge_item, dict):
                continue

            src = str(edge_item.get("source", "")).strip().lower().replace(" ", "_")
            tgt = str(edge_item.get("target", "")).strip().lower().replace(" ", "_")
            label = str(edge_item.get("label", "")).strip()
            direction = str(edge_item.get("direction", "unidirectional")).lower()
            style = str(edge_item.get("style", "solid")).lower()
            animated = bool(edge_item.get("animated", False))

            # Remap through node_id_map if renamed
            resolved_src = node_id_map.get(src, src)
            resolved_tgt = node_id_map.get(tgt, tgt)

            # Check if source or target missing
            if resolved_src not in seen_ids:
                warnings.append(f"Edge dropped: source node '{src}' does not exist in diagram nodes.")
                continue
            if resolved_tgt not in seen_ids:
                warnings.append(f"Edge dropped: target node '{tgt}' does not exist in diagram nodes.")
                continue

            # Deduplicate parallel edges with same label
            edge_signature = (resolved_src, resolved_tgt, label)
            if edge_signature in edge_seen:
                continue
            edge_seen.add(edge_signature)

            edge_id = str(edge_item.get("id") or f"e_{resolved_src}_{resolved_tgt}_{idx+1}")

            try:
                edge_obj = DiagramEdge(
                    id=edge_id,
                    source=resolved_src,
                    target=resolved_tgt,
                    label=label[:100],
                    direction=direction if direction in ("unidirectional", "bidirectional", "none") else "unidirectional",
                    style=style if style in ("solid", "dashed", "dotted") else "solid",
                    animated=animated,
                )
                sanitized_edges.append(edge_obj)
            except Exception as e:
                warnings.append(f"Failed to parse edge {edge_id}: {e}")

        # 3. Build validated DiagramDefinition
        try:
            sanitized_def = DiagramDefinition(
                title=title[:120],
                diagram_type=diagram_type if diagram_type in DiagramDefinition.model_fields["diagram_type"].annotation.__args__ else "software_architecture",
                description=description[:500],
                nodes=sanitized_nodes,
                edges=sanitized_edges,
                layout_direction=layout_direction,
            )
            return DiagramValidationResult(
                is_valid=True,
                errors=[],
                warnings=warnings,
                sanitized_diagram=sanitized_def,
            )
        except Exception as e:
            errors.append(f"Final diagram definition validation failed: {e}")
            return DiagramValidationResult(is_valid=False, errors=errors, warnings=warnings)
