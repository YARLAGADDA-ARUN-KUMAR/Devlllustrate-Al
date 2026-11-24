import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';
import { MarkerType, Position } from '@xyflow/react';
import type { DiagramDefinition, DiagramNodeData, IllustrationStyle } from '../../types';
import { THEME_CONFIGS } from './diagramTheme';

export const DEFAULT_NODE_WIDTH = 270;
export const DEFAULT_NODE_HEIGHT = 110;

/**
 * Computes dynamic node dimensions based on label, description, and group presence
 * to prevent text truncation and ensure optimal breathing room.
 */
export function getNodeDimensions(node: DiagramNodeData): { width: number; height: number } {
  const labelLen = (node.label || '').length;
  const descLen = (node.description || '').length;

  let width = DEFAULT_NODE_WIDTH;
  if (labelLen > 24) width = 295;
  if (labelLen > 36) width = 325;

  let height = DEFAULT_NODE_HEIGHT;
  if (descLen > 35) height = 125;
  if (descLen > 70) height = 145;
  if (node.group) height += 28;

  return { width, height };
}

/**
 * Computes an intelligent, hierarchical directed graph layout using Dagre with compound grouping.
 * Prevents overlapping nodes, dynamically scales spacing, supports orthogonal routing,
 * and renders group enclosures.
 */
export function layoutDiagram(
  diagram: DiagramDefinition,
  style: IllustrationStyle = 'flat-vector',
  customDirection?: 'LR' | 'TB' | 'RL' | 'BT'
): { nodes: Node[]; edges: Edge[] } {
  const theme = THEME_CONFIGS[style] || THEME_CONFIGS['flat-vector'];
  const direction = customDirection || diagram.layout_direction || 'LR';
  const isHorizontal = direction === 'LR' || direction === 'RL';

  const dagreGraph = new dagre.graphlib.Graph({ compound: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Dynamic spacing based on graph complexity
  const nodeCount = diagram.nodes.length;
  const nodeSep = Math.max(50, Math.min(85, 45 + nodeCount * 2));
  const rankSep = Math.max(90, Math.min(145, 80 + nodeCount * 3));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSep,
    ranksep: rankSep,
    marginx: 70,
    marginy: 70,
  });

  // Collect distinct groups
  const groupMap = new Map<string, { id: string; label: string; color?: string }>();
  if (diagram.groups) {
    diagram.groups.forEach((g) => groupMap.set(g.id, g));
  }
  diagram.nodes.forEach((n) => {
    if (n.group && !groupMap.has(n.group)) {
      groupMap.set(n.group, {
        id: n.group,
        label: n.group.replace(/_/g, ' ').toUpperCase(),
      });
    }
  });

  // Register compound group clusters in Dagre
  groupMap.forEach((g, gId) => {
    dagreGraph.setNode(gId, { label: g.label, clusterNode: true });
  });

  // Add component nodes with dynamic dimensions
  const nodeDimensionMap = new Map<string, { width: number; height: number }>();
  diagram.nodes.forEach((node) => {
    const dims = getNodeDimensions(node);
    nodeDimensionMap.set(node.id, dims);

    dagreGraph.setNode(node.id, {
      width: dims.width,
      height: dims.height,
    });

    // Assign parent cluster if grouped
    if (node.group && groupMap.has(node.group)) {
      dagreGraph.setParent(node.id, node.group);
    }
  });

  // Add edges to Dagre
  diagram.edges.forEach((edge, index) => {
    dagreGraph.setEdge(edge.source, edge.target, {
      id: edge.id || `e_${edge.source}_${edge.target}_${index}`,
    });
  });

  dagre.layout(dagreGraph);

  // Connection handles matching flow direction
  const targetHandleId = isHorizontal ? 'target-left' : 'target-top';
  const sourceHandleId = isHorizontal ? 'source-right' : 'source-bottom';
  const targetPosition = isHorizontal ? Position.Left : Position.Top;
  const sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

  // Map to React Flow Component Nodes
  const componentNodes: Node[] = diagram.nodes.map((node) => {
    const nodeWithPos = dagreGraph.node(node.id);
    const dims = nodeDimensionMap.get(node.id) || { width: DEFAULT_NODE_WIDTH, height: DEFAULT_NODE_HEIGHT };
    const x = nodeWithPos ? nodeWithPos.x - dims.width / 2 : 100;
    const y = nodeWithPos ? nodeWithPos.y - dims.height / 2 : 100;

    return {
      id: node.id,
      type: 'technicalNode',
      position: { x, y },
      targetPosition,
      sourcePosition,
      zIndex: 5,
      data: {
        ...node,
        styleTheme: style,
      },
    };
  });

  // Compute Group Enclosure Containers (Bounding Boxes)
  const groupNodes: Node[] = [];
  groupMap.forEach((group, gId) => {
    const childNodes = componentNodes.filter((cn) => cn.data.group === gId);
    if (childNodes.length === 0) return;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    childNodes.forEach((cn) => {
      const dims = nodeDimensionMap.get(cn.id) || { width: DEFAULT_NODE_WIDTH, height: DEFAULT_NODE_HEIGHT };
      minX = Math.min(minX, cn.position.x);
      minY = Math.min(minY, cn.position.y);
      maxX = Math.max(maxX, cn.position.x + dims.width);
      maxY = Math.max(maxY, cn.position.y + dims.height);
    });

    const padding = 28;
    const boxX = minX - padding;
    const boxY = minY - padding - 8;
    const boxWidth = maxX - minX + padding * 2;
    const boxHeight = maxY - minY + padding * 2 + 8;

    groupNodes.push({
      id: `group_box_${gId}`,
      type: 'groupNode',
      position: { x: boxX, y: boxY },
      style: {
        width: boxWidth,
        height: boxHeight,
      },
      zIndex: 1,
      selectable: false,
      draggable: false,
      data: {
        id: gId,
        label: group.label,
        color: group.color,
        styleTheme: style,
        width: boxWidth,
        height: boxHeight,
      },
    });
  });

  // Combine Group Container Nodes (background) with Component Nodes (foreground)
  const allNodes: Node[] = [...groupNodes, ...componentNodes];

  // Map to React Flow Edges with Professional Markers & Styling
  const edges: Edge[] = diagram.edges.map((edge, index) => {
    const edgeId = edge.id || `e_${edge.source}_${edge.target}_${index}`;
    const isBidirectional = edge.direction === 'bidirectional';

    return {
      id: edgeId,
      source: edge.source,
      target: edge.target,
      sourceHandle: sourceHandleId,
      targetHandle: targetHandleId,
      label: edge.label || '',
      type: 'smoothstep',
      animated: edge.animated || false,
      style: {
        stroke: theme.edgeColor,
        strokeWidth: style === 'line-art' ? 1.5 : 2,
        strokeDasharray:
          edge.style === 'dashed' ? '6 4' : edge.style === 'dotted' ? '2 3' : undefined,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: theme.edgeColor,
        width: 18,
        height: 18,
      },
      markerStart: isBidirectional
        ? {
            type: MarkerType.ArrowClosed,
            color: theme.edgeColor,
            width: 18,
            height: 18,
          }
        : undefined,
      labelStyle: {
        fill: theme.edgeLabelText,
        fontWeight: 600,
        fontSize: 10.5,
        fontFamily: theme.fontFamily,
      },
      labelBgStyle: {
        fill: theme.edgeLabelBg,
        fillOpacity: 0.96,
        stroke: theme.edgeLabelBorder,
        strokeWidth: 1,
        rx: 5,
        ry: 5,
      },
      labelBgPadding: [6, 4] as [number, number],
    };
  });

  return { nodes: allNodes, edges };
}
