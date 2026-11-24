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
  MiniMap,
  useReactFlow,
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  Download,
  Plus,
  Maximize2,
  Minimize2,
  FileCode,
  CheckCircle2,
  LayoutGrid,
  Sparkles,
  Map,
  ArrowRight,
  ArrowDown,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

import type { DiagramDefinition, DiagramNodeData, IllustrationStyle } from '../../types';
import { DiagramNodeComponent } from './DiagramNodeComponent';
import { DiagramGroupComponent } from './DiagramGroupComponent';
import { layoutDiagram } from './diagramLayout';
import { THEME_CONFIGS } from './diagramTheme';
import { renderDiagramToSvg } from './diagramSvgExport';

interface DiagramCanvasProps {
  diagram: DiagramDefinition;
  style: IllustrationStyle;
  onDiagramChange?: (updated: DiagramDefinition) => void;
  isEditable?: boolean;
}

const nodeTypes = {
  technicalNode: DiagramNodeComponent,
  groupNode: DiagramGroupComponent,
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
  const [showMinimap, setShowMinimap] = useState(true);
  const [isExportingPng, setIsExportingPng] = useState(false);

  // Compute initial layout from DiagramDefinition
  const initialLayout = useMemo(() => {
    return layoutDiagram(diagram, style, direction);
  }, [diagram, style, direction]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialLayout.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialLayout.edges);

  // Re-layout when diagram, style, or direction changes
  useEffect(() => {
    const fresh = layoutDiagram(diagram, style, direction);
    setNodes(fresh.nodes);
    setEdges(fresh.edges);
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 60);
  }, [diagram, style, direction, fitView, setNodes, setEdges]);

  // Current Diagram Definition snapshot
  const getCurrentDiagramDef = useCallback((): DiagramDefinition => {
    const componentNodes = nodes.filter((n) => n.type === 'technicalNode');
    const updatedNodes: DiagramNodeData[] = componentNodes.map((n) => ({
      id: n.id,
      label: (n.data?.label as string) || n.id,
      type: (n.data?.type as any) || 'generic',
      description: (n.data?.description as string) || '',
      group: (n.data?.group as string) || undefined,
      shape: (n.data?.shape as any) || 'rounded',
      color: (n.data?.color as string) || undefined,
    }));

    const updatedEdges = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: typeof e.label === 'string' ? e.label : '',
      direction: ((e as any).markerStart ? 'bidirectional' : 'unidirectional') as 'bidirectional' | 'unidirectional',
      style: (e.style?.strokeDasharray ? 'dashed' : 'solid') as 'dashed' | 'solid',
    }));

    return {
      ...diagram,
      nodes: updatedNodes,
      edges: updatedEdges,
      layout_direction: direction,
    };
  }, [diagram, direction, edges, nodes]);

  // Sync edits back to parent DiagramDefinition
  const notifyChange = useCallback(
    (currentNodes: Node[], currentEdges: Edge[]) => {
      if (!onDiagramChange) return;

      const componentNodes = currentNodes.filter((n) => n.type === 'technicalNode');
      const updatedNodes: DiagramNodeData[] = componentNodes.map((n) => ({
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
          const nextEdges = prevEdges.filter((e) => e.source !== nodeId && e.target !== nodeId);
          notifyChange(nextNodes, nextEdges);
          return nextEdges;
        });
        return nextNodes;
      });
    },
    [notifyChange, setEdges, setNodes]
  );

  // Connect new edge
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      const newEdge: Edge = {
        id: `e_${params.source}_${params.target}_${Date.now()}`,
        source: params.source,
        target: params.target,
        type: 'smoothstep',
        label: 'Connects',
        style: { stroke: theme.edgeColor, strokeWidth: 2 },
        labelStyle: { fill: theme.edgeLabelText, fontWeight: 600, fontSize: 10.5 },
        labelBgStyle: { fill: theme.edgeLabelBg, fillOpacity: 0.96, rx: 4, ry: 4 },
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
      position: { x: 120 + Math.random() * 80, y: 120 + Math.random() * 80 },
      data: {
        id,
        label: 'New Component',
        type: 'service',
        description: 'Microservice component',
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
    const currentDef = getCurrentDiagramDef();
    const fresh = layoutDiagram(currentDef, style, direction);
    setNodes(fresh.nodes);
    setEdges(fresh.edges);
    setTimeout(() => fitView({ padding: 0.2, duration: 350 }), 50);
  }, [direction, fitView, getCurrentDiagramDef, setEdges, setNodes, style]);

  // Toggle layout direction (LR <-> TB)
  const handleToggleDirection = () => {
    const nextDir = direction === 'LR' ? 'TB' : 'LR';
    setDirection(nextDir);
  };

  // Attach callbacks to nodes
  const nodesWithCallbacks = useMemo(() => {
    return nodes.map((n) => {
      if (n.type === 'technicalNode') {
        return {
          ...n,
          data: {
            ...n.data,
            styleTheme: style,
            onUpdateLabel: handleUpdateLabel,
            onDeleteNode: handleDeleteNode,
          },
        };
      }
      return {
        ...n,
        data: {
          ...n.data,
          styleTheme: style,
        },
      };
    });
  }, [nodes, style, handleUpdateLabel, handleDeleteNode]);

  // Copy structured JSON
  const handleCopyJson = () => {
    const currentDef = getCurrentDiagramDef();
    navigator.clipboard.writeText(JSON.stringify(currentDef, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Export clean SVG snapshot
  const handleExportSvg = () => {
    const currentDef = getCurrentDiagramDef();
    const svgMarkup = renderDiagramToSvg(currentDef, style);
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagram.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'diagram'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export 2x high-resolution PNG
  const handleExportPng = async () => {
    setIsExportingPng(true);
    try {
      const currentDef = getCurrentDiagramDef();
      const svgMarkup = renderDiagramToSvg(currentDef, style);
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        const scale = 2; // High-DPI 2x resolution
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth * scale || 2048;
        canvas.height = img.naturalHeight * scale || 1200;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(scale, scale);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0);

          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `${diagram.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'diagram'}-2x.png`;
          a.click();
        }
        URL.revokeObjectURL(url);
        setIsExportingPng(false);
      };
      img.src = url;
    } catch {
      setIsExportingPng(false);
    }
  };

  const componentCount = nodes.filter((n) => n.type === 'technicalNode').length;

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
        minHeight: isFullscreen ? '100vh' : '560px',
      }}
      className={isFullscreen ? 'diagram-fullscreen-canvas' : ''}
    >
      {/* Top Floating Header & Toolbar */}
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
        {/* Left Diagram Info Banner */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(11, 17, 28, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 14px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <Sparkles size={14} color={theme.accent} />
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#ffffff' }}>
            {diagram.title}
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: theme.accent,
              backgroundColor: theme.badgeBg,
              border: `1px solid ${theme.badgeBorder}`,
              padding: '2px 7px',
              borderRadius: '4px',
              letterSpacing: '0.04em',
            }}
          >
            {(diagram.diagram_type || 'architecture').replace(/_/g, ' ')}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Layers size={11} />
            {componentCount} Nodes · {edges.length} Edges
          </span>
        </div>

        {/* Right Action Tools */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'rgba(11, 17, 28, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '4px 6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          {isEditable && (
            <>
              <button
                type="button"
                className="btn-ghost"
                onClick={handleAddNode}
                title="Add new component node"
                style={{ fontSize: '11.5px', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={13} /> Add Node
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={handleToggleDirection}
                title={`Switch layout direction to ${direction === 'LR' ? 'Vertical (Top to Bottom)' : 'Horizontal (Left to Right)'}`}
                style={{ fontSize: '11.5px', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {direction === 'LR' ? <ArrowRight size={13} /> : <ArrowDown size={13} />}
                {direction} Flow
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={handleAutoLayout}
                title="Re-run automatic Dagre graph layout"
                style={{ fontSize: '11.5px', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <LayoutGrid size={13} /> Auto Align
              </button>

              <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-medium)' }} />
            </>
          )}

          <button
            type="button"
            className="btn-ghost"
            onClick={() => setShowMinimap(!showMinimap)}
            title={showMinimap ? 'Hide Minimap' : 'Show Minimap'}
            style={{
              padding: '5px 8px',
              color: showMinimap ? theme.accent : 'var(--text-muted)',
            }}
          >
            <Map size={14} />
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={handleCopyJson}
            title="Copy structured diagram JSON"
            style={{ fontSize: '11.5px', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {copiedJson ? (
              <>
                <CheckCircle2 size={13} color="var(--accent-green)" />
                <span style={{ color: 'var(--accent-green)' }}>Copied!</span>
              </>
            ) : (
              <>
                <FileCode size={13} /> JSON
              </>
            )}
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={handleExportSvg}
            title="Download vector SVG"
            style={{ fontSize: '11.5px', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Download size={13} /> SVG
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={handleExportPng}
            disabled={isExportingPng}
            title="Download high-resolution 2x PNG"
            style={{ fontSize: '11.5px', padding: '5px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ImageIcon size={13} /> {isExportingPng ? 'Exporting...' : 'PNG (2x)'}
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
            style={{ padding: '5px 8px' }}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* React Flow Core Engine */}
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={isEditable ? onConnect : undefined}
        fitView
        minZoom={0.2}
        maxZoom={2.5}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={
            theme.gridPattern === 'lines'
              ? BackgroundVariant.Lines
              : theme.gridPattern === 'cross'
              ? BackgroundVariant.Cross
              : BackgroundVariant.Dots
          }
          gap={24}
          size={1.5}
          color={theme.gridColor}
        />

        <Controls
          showInteractive={false}
          style={{
            bottom: '16px',
            left: '16px',
            backgroundColor: 'rgba(11, 17, 28, 0.92)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        />

        {showMinimap && (
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'groupNode') return 'transparent';
              return (n.data?.color as string) || theme.accent;
            }}
            nodeStrokeColor={theme.edgeColor}
            nodeStrokeWidth={1}
            maskColor="rgba(0, 0, 0, 0.65)"
            position="bottom-right"
            style={{
              background: theme.canvasBg,
              border: `1px solid ${theme.edgeColor}44`,
              borderRadius: '8px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.55)',
              width: 140,
              height: 95,
            }}
          />
        )}
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
