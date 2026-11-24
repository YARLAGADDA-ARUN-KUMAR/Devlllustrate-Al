import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Monitor,
  Server,
  Database,
  Zap,
  ArrowRightLeft,
  Globe,
  KeyRound,
  HardDrive,
  Network,
  ShieldCheck,
  ShieldAlert,
  BrainCircuit,
  Terminal,
  User,
  ExternalLink,
  Box,
  Edit2,
  Trash2,
  Check,
  X,
  Boxes,
  Workflow,
} from 'lucide-react';
import type { DiagramNodeType, DiagramNodeShape, IllustrationStyle } from '../../types';
import { THEME_CONFIGS } from './diagramTheme';

interface NodeData {
  id: string;
  label: string;
  type: DiagramNodeType;
  description?: string;
  group?: string;
  shape?: DiagramNodeShape;
  color?: string;
  styleTheme?: IllustrationStyle;
  onUpdateLabel?: (id: string, newLabel: string) => void;
  onDeleteNode?: (id: string) => void;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  frontend: Monitor,
  backend: Server,
  database: Database,
  cache: Zap,
  queue: ArrowRightLeft,
  gateway: Globe,
  service: Boxes,
  auth: KeyRound,
  storage: HardDrive,
  network: Network,
  firewall: ShieldAlert,
  security: ShieldCheck,
  ai_model: BrainCircuit,
  process: Workflow,
  kernel: Terminal,
  user: User,
  external: ExternalLink,
  generic: Box,
};

const TYPE_BADGES: Record<string, string> = {
  frontend: 'FRONTEND',
  backend: 'BACKEND API',
  database: 'DATABASE',
  cache: 'IN-MEMORY CACHE',
  queue: 'MESSAGE QUEUE',
  gateway: 'API GATEWAY',
  service: 'MICROSERVICE',
  auth: 'AUTH & IDP',
  storage: 'OBJECT STORAGE',
  network: 'NETWORK',
  firewall: 'WAF / FIREWALL',
  security: 'SECURITY ENCLAVE',
  ai_model: 'AI / ML MODEL',
  process: 'PIPELINE STAGE',
  kernel: 'OS KERNEL',
  user: 'CLIENT / USER',
  external: 'EXTERNAL API',
  generic: 'COMPONENT',
};

const TYPE_COLORS: Record<string, string> = {
  frontend: '#38bdf8',
  backend: '#818cf8',
  database: '#34d399',
  cache: '#fbbf24',
  queue: '#fb923c',
  gateway: '#60a5fa',
  service: '#a78bfa',
  auth: '#f43f5e',
  storage: '#2dd4bf',
  network: '#38bdf8',
  firewall: '#ef4444',
  security: '#ef4444',
  ai_model: '#c084fc',
  process: '#a3e635',
  kernel: '#f59e0b',
  user: '#e2e8f0',
  external: '#94a3b8',
  generic: '#94a3b8',
};

export const DiagramNodeComponent: React.FC<{
  data: NodeData;
}> = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);

  const styleTheme: IllustrationStyle = data.styleTheme || 'flat-vector';
  const theme = THEME_CONFIGS[styleTheme] || THEME_CONFIGS['flat-vector'];
  const IconComponent = TYPE_ICONS[data.type] || Box;
  const accentColor = data.color || TYPE_COLORS[data.type] || theme.accent;
  const badgeLabel = TYPE_BADGES[data.type] || 'COMPONENT';

  const handleSaveLabel = () => {
    if (editLabel.trim() && data.onUpdateLabel) {
      data.onUpdateLabel(data.id, editLabel.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveLabel();
    if (e.key === 'Escape') {
      setEditLabel(data.label);
      setIsEditing(false);
    }
  };

  // Cylinder/Database visual effect
  const isCylinder = data.shape === 'cylinder' || data.type === 'database' || data.type === 'storage';

  return (
    <div
      className="group relative select-none transition-all duration-200"
      style={{
        minWidth: '250px',
        maxWidth: '320px',
        padding: '14px 16px',
        borderRadius: styleTheme === 'line-art' ? '0px' : styleTheme === 'blueprint' ? '4px' : theme.borderRadius,
        background: theme.nodeBg,
        border: theme.nodeBorder,
        boxShadow: theme.shadow,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Top handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        style={{
          width: 8,
          height: 8,
          background: theme.handleColor,
          border: `1.5px solid ${theme.canvasBg}`,
          borderRadius: styleTheme === 'line-art' ? '0px' : '50%',
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="source-top"
        style={{
          width: 8,
          height: 8,
          background: theme.handleColor,
          border: `1.5px solid ${theme.canvasBg}`,
          borderRadius: styleTheme === 'line-art' ? '0px' : '50%',
        }}
      />

      {/* Left handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        style={{
          width: 8,
          height: 8,
          background: theme.handleColor,
          border: `1.5px solid ${theme.canvasBg}`,
          borderRadius: styleTheme === 'line-art' ? '0px' : '50%',
        }}
      />

      {/* Right handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        style={{
          width: 8,
          height: 8,
          background: theme.handleColor,
          border: `1.5px solid ${theme.canvasBg}`,
          borderRadius: styleTheme === 'line-art' ? '0px' : '50%',
        }}
      />

      {/* Bottom handles */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="target-bottom"
        style={{
          width: 8,
          height: 8,
          background: theme.handleColor,
          border: `1.5px solid ${theme.canvasBg}`,
          borderRadius: styleTheme === 'line-art' ? '0px' : '50%',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        style={{
          width: 8,
          height: 8,
          background: theme.handleColor,
          border: `1.5px solid ${theme.canvasBg}`,
          borderRadius: styleTheme === 'line-art' ? '0px' : '50%',
        }}
      />

      {/* Cylinder visual indicator (if database/storage) */}
      {isCylinder && styleTheme !== 'line-art' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '4px',
            background: accentColor,
            opacity: 0.6,
            borderRadius: '2px',
          }}
        />
      )}

      {/* Node Header: Category Chip + Quick Action Buttons */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
          style={{
            background: theme.badgeBg,
            border: `1px solid ${theme.badgeBorder}`,
            color: styleTheme === 'line-art' ? '#ffffff' : accentColor,
          }}
        >
          <IconComponent className="w-3.5 h-3.5" style={{ color: styleTheme === 'line-art' ? '#ffffff' : accentColor }} />
          <span>{badgeLabel}</span>
        </div>

        {/* Action icons (show on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              title="Edit label"
              className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}
          {data.onDeleteNode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onDeleteNode?.(data.id);
              }}
              title="Delete node"
              className="p-1 rounded hover:bg-red-900/40 text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Component Title (Editable) */}
      {isEditing ? (
        <div className="flex items-center gap-1 my-1">
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full px-2 py-1 text-xs bg-slate-900 text-white rounded border border-blue-500 focus:outline-none"
          />
          <button onClick={handleSaveLabel} className="p-1 bg-emerald-600 rounded text-white hover:bg-emerald-500">
            <Check className="w-3 h-3" />
          </button>
          <button onClick={() => setIsEditing(false)} className="p-1 bg-slate-700 rounded text-slate-300 hover:bg-slate-600">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <h4
          className="font-bold text-[13.5px] leading-snug tracking-tight break-words"
          style={{ color: theme.nodeText }}
        >
          {data.label}
        </h4>
      )}

      {/* Description */}
      {data.description && (
        <p
          className="mt-1 text-[11px] leading-relaxed break-words font-normal"
          style={{ color: theme.nodeDesc }}
        >
          {data.description}
        </p>
      )}

      {/* Group or Layer Tag */}
      {data.group && (
        <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex items-center gap-1.5 text-[9.5px]">
          <span className="text-slate-500 uppercase tracking-widest font-semibold">Tier:</span>
          <span className="font-medium text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60">
            {data.group.replace(/_/g, ' ')}
          </span>
        </div>
      )}
    </div>
  );
};
