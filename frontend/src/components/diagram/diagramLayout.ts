import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';
import { MarkerType, Position } from '@xyflow/react';
import type { DiagramDefinition, IllustrationStyle } from '../../types';
import { THEME_CONFIGS } from './diagramTheme';

export const NODE_WIDTH = 250;
export const NODE_HEIGHT = 105;

/**
 * Computes an automatic directed graph layout using Dagre.
 * Prevents overlapping nodes, aligns tiers/layers, and routes edges cleanly.
 */
export function layoutDiagram(
  diagram: DiagramDefinition,
  style: IllustrationStyle = 'flat-vector',
  customDirection?: 'LR' | 'TB' | 'RL' | 'BT'
): { nodes: Node[]; edges: Edge[] } {
  const theme = THEME_CONFIGS[style] || THEME_CONFIGS['flat-vector'];
  const direction = customDirection || diagram.layout_direction || 'LR';

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 45,
    ranksep: 75,
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to Dagre
  diagram.nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  // Add edges to Dagre
  diagram.edges.forEach((edge, index) => {
    dagreGraph.setEdge(edge.source, edge.target, {
      id: edge.id || `e_${edge.source}_${edge.target}_${index}`,
    });
  });

  dagre.layout(dagreGraph);

  const isHorizontal = direction === 'LR' || direction === 'RL';
  const targetPos = isHorizontal ? Position.Left : Position.Top;
  const sourcePos = isHorizontal ? Position.Right : Position.Bottom;

  // Map to React Flow Nodes
  const nodes: Node[] = diagram.nodes.map((node) => {
    const nodeWithPos = dagreGraph.node(node.id);
    const x = nodeWithPos ? nodeWithPos.x - NODE_WIDTH / 2 : 100;
    const y = nodeWithPos ? nodeWithPos.y - NODE_HEIGHT / 2 : 100;

    return {
      id: node.id,
      type: 'technicalNode',
      position: { x, y },
      targetPosition: targetPos,
      sourcePosition: sourcePos,
      data: {
        ...node,
        styleTheme: style,
      },
    };
  });

  // Map to React Flow Edges
  const edges: Edge[] = diagram.edges.map((edge, index) => {
    const edgeId = edge.id || `e_${edge.source}_${edge.target}_${index}`;
    const isBidirectional = edge.direction === 'bidirectional';

    return {
      id: edgeId,
      source: edge.source,
      target: edge.target,
      label: edge.label || '',
      type: 'smoothstep',
      animated: edge.animated || false,
      style: {
        stroke: theme.edgeColor,
        strokeWidth: style === 'line-art' ? 1.5 : 2,
        strokeDasharray: edge.style === 'dashed' ? '5 5' : edge.style === 'dotted' ? '2 2' : undefined,
      },
      labelStyle: {
        fill: theme.edgeLabelText,
        fontWeight: 600,
        fontSize: 11,
        fontFamily: theme.fontFamily,
      },
      labelBgStyle: {
        fill: theme.edgeLabelBg,
        fillOpacity: 0.95,
        rx: 4,
        ry: 4,
      },
      labelBgPadding: [6, 3],
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 16,
        color: theme.edgeColor,
      },
      markerStart: isBidirectional
        ? {
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
            color: theme.edgeColor,
          }
        : undefined,
    };
  });

  return { nodes, edges };
}
