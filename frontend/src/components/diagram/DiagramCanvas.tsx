import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  Download,
  Plus,
  RotateCcw,
  Maximize2,
  Minimize2,
  FileCode,
  CheckCircle2,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';

import type { DiagramDefinition, DiagramNodeData, IllustrationStyle } from '../../types';
import { DiagramNodeComponent } from './DiagramNodeComponent';
import { layoutDiagram } from './diagramLayout';
import { THEME_CONFIGS } from './diagramTheme';

interface DiagramCanvasProps {
  diagram: DiagramDefinition;
  style: IllustrationStyle;
  onDiagramChange?: (updated: DiagramDefinition) => void;
  isEditable?: boolean;
}

const nodeTypes = {
  technicalNode: DiagramNodeComponent,
};

function DiagramFlowInner({
  diagram,
  style,
  onDiagramChange,
  isEditable = true,
}: DiagramCanvasProps) {
  const { fitView } = useReactFlow();
  const flowWrapperRef = useRef<HTMLDivElement>(null);
  const theme = THEME_CONFIGS[style] || THEME_CONFIGS['flat-vector'];

  const [direction, setDirection] = useState<'LR' | 'TB'>(
    diagram.layout_direction === 'TB' ? 'TB' : 'LR'
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Compute initial layout from DiagramDefinition
  const initialLayout = useMemo(() => {
    return layoutDiagram(diagram, style, direction);
  }, [diagram, style, direction]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialLayout.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialLayout.edges);

  // Re-layout when diagram or style changes
  useEffect(() => {
    const fresh = layoutDiagram(diagram, style, direction);
    setNodes(fresh.nodes);
    setEdges(fresh.edges);
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
  }, [diagram, style, direction, fitView, setNodes, setEdges]);

  // Sync edits back to parent DiagramDefinition
  const notifyChange = useCallback(
    (currentNodes: Node[], currentEdges: Edge[]) => {
      if (!onDiagramChange) return;

      const updatedNodes: DiagramNodeData[] = currentNodes.map((n) => ({
        id: n.id,
        label: (n.data?.label as string) || n.id,
        type: (n.data?.type as any) || 'generic',
        description: (n.data?.description as string) || '',
        group: (n.data?.group as string) || undefined,
        shape: (n.data?.shape as any) || 'rounded',
        color: (n.data?.color as string) || undefined,
      }));

      const updatedEdges = currentEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: typeof e.label === 'string' ? e.label : '',
        direction: 'unidirectional' as const,
        style: 'solid' as const,
      }));

      onDiagramChange({
        ...diagram,
        nodes: updatedNodes,
        edges: updatedEdges,
        layout_direction: direction,
      });
    },
    [diagram, direction, onDiagramChange]
  );

  // Rename node label
  const handleUpdateLabel = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((prevNodes) => {
        const next = prevNodes.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              data: { ...n.data, label: newLabel },
            };
          }
          return n;
        });
        notifyChange(next, edges);
        return next;
      });
    },
    [edges, notifyChange, setNodes]
  );

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((prevNodes) => {
        const nextNodes = prevNodes.filter((n) => n.id !== nodeId);
        setEdges((prevEdges) => {
          const nextEdges = prevEdges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          );
          notifyChange(nextNodes, nextEdges);
          return nextEdges;
        });
        return nextNodes;
      });
    },
    [notifyChange, setEdges, setNodes]
  );

  // Connect two nodes
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        id: `e_${params.source}_${params.target}_${Date.now()}`,
        source: params.source,
        target: params.target,
        type: 'smoothstep',
        label: 'Connects',
        style: { stroke: theme.edgeColor, strokeWidth: 2 },
        labelStyle: { fill: theme.edgeLabelText, fontWeight: 600, fontSize: 11 },
        labelBgStyle: { fill: theme.edgeLabelBg, fillOpacity: 0.95, rx: 4, ry: 4 },
      };
      setEdges((eds) => {
        const next = addEdge(newEdge, eds);
        notifyChange(nodes, next);
        return next;
      });
    },
    [nodes, notifyChange, setEdges, theme]
  );

  // Add new component node
  const handleAddNode = useCallback(() => {
    const id = `node_${Date.now().toString(36)}`;
    const newNode: Node = {
      id,
      type: 'technicalNode',
      position: { x: 150 + Math.random() * 80, y: 150 + Math.random() * 80 },
      data: {
        id,
        label: 'New Component',
        type: 'service',
        description: 'Custom component',
        shape: 'rounded',
        styleTheme: style,
        onUpdateLabel: handleUpdateLabel,
        onDeleteNode: handleDeleteNode,
      },
    };
    setNodes((nds) => {
      const next = [...nds, newNode];
      notifyChange(next, edges);
      return next;
    });
  }, [edges, handleDeleteNode, handleUpdateLabel, notifyChange, setNodes, style]);

  // Re-run automatic layout
  const handleAutoLayout = useCallback(() => {
    const fresh = layoutDiagram(
      {
        ...diagram,
        nodes: nodes.map((n) => ({
          id: n.id,
          label: (n.data?.label as string) || n.id,
          type: (n.data?.type as any) || 'generic',
          description: (n.data?.description as string) || '',
        })),
        edges: edges.map((e) => ({
          source: e.source,
          target: e.target,
          label: typeof e.label === 'string' ? e.label : '',
        })),
      },
      style,
      direction
    );
    setNodes(fresh.nodes);
    setEdges(fresh.edges);
    setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50);
  }, [diagram, direction, edges, fitView, nodes, setEdges, setNodes, style]);

  // Toggle layout direction (LR <-> TB)
  const handleToggleDirection = () => {
    const nextDir = direction === 'LR' ? 'TB' : 'LR';
    setDirection(nextDir);
  };

  // Attach callbacks to nodes
  const nodesWithCallbacks = useMemo(() => {
    return nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        styleTheme: style,
        onUpdateLabel: handleUpdateLabel,
        onDeleteNode: handleDeleteNode,
      },
    }));
  }, [nodes, style, handleUpdateLabel, handleDeleteNode]);

  // Copy structured JSON
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(diagram, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Download raw SVG snapshot of diagram
  const handleExportSvg = () => {
    const element = flowWrapperRef.current;
    if (!element) return;
    const svgEl = element.querySelector('svg.react-flow__edges') || element.querySelector('svg');
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagram.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'diagram'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={flowWrapperRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: theme.canvasBg,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        minHeight: isFullscreen ? '100vh' : '520px',
      }}
      className={isFullscreen ? 'diagram-fullscreen-canvas' : ''}
    >
      {/* Top Floating Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        {/* Left Diagram Info Badge */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(11, 17, 28, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 12px',
          }}
        >
          <Sparkles size={13} color="var(--accent-cyan)" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
            {diagram.title}
          </span>
          <span
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              color: 'var(--accent-cyan)',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              padding: '1px 6px',
              borderRadius: '4px',
            }}
          >
            {nodes.length} Nodes · {edges.length} Edges
          </span>
        </div>

        {/* Right Action Tools */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(11, 17, 28, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '4px 6px',
          }}
        >
          {isEditable && (
            <>
              <button
                type="button"
                className="btn-ghost"
                onClick={handleAddNode}
                title="Add new component node"
                style={{ fontSize: '11.5px', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={13} /> Add Node
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={handleToggleDirection}
                title={`Switch layout direction (current: ${direction})`}
                style={{ fontSize: '11.5px', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <LayoutGrid size={13} /> {direction}
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={handleAutoLayout}
                title="Clean & Re-align layout automatically (Dagre)"
                style={{ fontSize: '11.5px', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RotateCcw size={13} /> Auto Align
              </button>
            </>
          )}

          <button
            type="button"
            className="btn-ghost"
            onClick={handleCopyJson}
            title="Copy structured graph JSON"
            style={{ padding: '5px 8px' }}
          >
            {copiedJson ? <CheckCircle2 size={13} color="var(--accent-emerald)" /> : <FileCode size={13} />}
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={handleExportSvg}
            title="Export diagram SVG"
            style={{ padding: '5px 8px' }}
          >
            <Download size={13} />
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
            style={{ padding: '5px 8px' }}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Main React Flow Graph Canvas */}
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2.5}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color={theme.gridColor}
          gap={theme.gridPattern === 'lines' ? 24 : 16}
          variant={
            theme.gridPattern === 'lines'
              ? BackgroundVariant.Lines
              : theme.gridPattern === 'cross'
              ? BackgroundVariant.Cross
              : BackgroundVariant.Dots
          }
        />
        <Controls
          position="bottom-right"
          showInteractive={false}
          style={{
            backgroundColor: 'rgba(11, 17, 28, 0.9)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
          }}
        />
      </ReactFlow>
    </div>
  );
}

export function DiagramCanvas(props: DiagramCanvasProps) {
  return (
    <ReactFlowProvider>
      <DiagramFlowInner {...props} />
    </ReactFlowProvider>
  );
}
