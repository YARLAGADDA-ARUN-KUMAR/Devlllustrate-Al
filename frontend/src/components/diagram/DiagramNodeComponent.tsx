import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Monitor,
  Server,
  Database,
  Zap,
  ArrowRightLeft,
  Globe,
  Cpu,
  KeyRound,
  HardDrive,
  Network,
  ShieldCheck,
  BrainCircuit,
  Activity,
  Terminal,
  User,
  ExternalLink,
  Box,
  Edit2,
  Trash2,
  Check,
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
  service: Cpu,
  auth: KeyRound,
  storage: HardDrive,
  network: Network,
  firewall: ShieldCheck,
  security: ShieldCheck,
  ai_model: BrainCircuit,
  process: Activity,
  kernel: Terminal,
  user: User,
  external: ExternalLink,
  generic: Box,
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
  generic: '#cbd5e1',
};

export const DiagramNodeComponent: React.FC<{ data: NodeData; targetPosition?: Position; sourcePosition?: Position }> = ({
  data,
  targetPosition = Position.Left,
  sourcePosition = Position.Right,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);

  const styleTheme: IllustrationStyle = data.styleTheme || 'flat-vector';
  const theme = THEME_CONFIGS[styleTheme] || THEME_CONFIGS['flat-vector'];
  const IconComponent = TYPE_ICONS[data.type] || Box;
  const accentColor = data.color || TYPE_COLORS[data.type] || theme.accent;

  const handleSaveLabel = () => {
    if (editLabel.trim() && data.onUpdateLabel) {
      data.onUpdateLabel(data.id, editLabel.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveLabel();
    } else if (e.key === 'Escape') {
      setEditLabel(data.label);
      setIsEditing(false);
    }
  };

  // Shape specific border radius or styling
  const isCylinder = data.shape === 'cylinder';

  return (
    <div
      style={{
        width: '240px',
        minHeight: '92px',
        padding: '12px 14px',
        backgroundColor: theme.nodeBg,
        background: theme.nodeBg,
        border: theme.nodeBorder,
        borderRadius: isCylinder ? '20px / 8px' : theme.borderRadius,
        boxShadow: theme.shadow,
        fontFamily: theme.fontFamily,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        cursor: 'grab',
      }}
      className="diagram-node-card group"
    >
      {/* Handles for Flow connections */}
      <Handle
        type="target"
        position={targetPosition}
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: accentColor,
          border: '2px solid #080c14',
          borderRadius: '50%',
        }}
      />

      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: `${accentColor}22`,
              border: `1px solid ${accentColor}55`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent size={14} color={accentColor} />
          </div>

          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: accentColor,
            }}
          >
            {data.type.replace('_', ' ')}
          </span>
        </div>

        {/* Action icons (Edit / Delete) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {!isEditing ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              title="Edit component label"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '2px',
                borderRadius: '4px',
              }}
            >
              <Edit2 size={12} />
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveLabel();
              }}
              title="Save label"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-emerald)',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <Check size={13} />
            </button>
          )}

          {data.onDeleteNode && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                data.onDeleteNode!(data.id);
              }}
              title="Delete component"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-rose)',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Main Label */}
      <div style={{ margin: '4px 0' }}>
        {isEditing ? (
          <input
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={handleSaveLabel}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: `1px solid ${accentColor}`,
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#ffffff',
              outline: 'none',
            }}
          />
        ) : (
          <div
            onDoubleClick={() => setIsEditing(true)}
            style={{
              fontSize: '13.5px',
              fontWeight: 600,
              color: theme.nodeText,
              lineHeight: '1.3',
              wordBreak: 'break-word',
            }}
          >
            {data.label}
          </div>
        )}

        {data.description && (
          <div
            style={{
              fontSize: '11px',
              color: theme.nodeDesc,
              marginTop: '4px',
              lineHeight: '1.3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.description}
          </div>
        )}
      </div>

      {/* Bottom Group/Layer Badge */}
      {data.group && (
        <div style={{ marginTop: '4px' }}>
          <span
            style={{
              fontSize: '9.5px',
              padding: '1px 6px',
              borderRadius: '3px',
              backgroundColor: theme.badgeBg,
              color: accentColor,
              fontWeight: 500,
              border: `1px solid ${accentColor}33`,
            }}
          >
            {data.group}
          </span>
        </div>
      )}

      {/* Source Connection Handle */}
      <Handle
        type="source"
        position={sourcePosition}
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: accentColor,
          border: '2px solid #080c14',
          borderRadius: '50%',
        }}
      />
    </div>
  );
};
