import React from 'react';
import {
  Square,
  Box,
  Compass,
  CircleDot,
  Layers3,
  PenTool,
  Check,
} from 'lucide-react';
import type { IllustrationStyle } from '../types';

interface StyleSelectorProps {
  selected: IllustrationStyle;
  onSelect: (style: IllustrationStyle) => void;
  disabled?: boolean;
}

interface StyleOption {
  id: IllustrationStyle;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accent: string;
}

const STYLES: StyleOption[] = [
  {
    id: 'flat-vector',
    name: 'Flat Vector',
    description: 'Modern 2D shapes with clean colors and clear service boundaries.',
    icon: Square,
    accent: 'var(--accent-cyan)',
  },
  {
    id: 'isometric',
    name: 'Isometric',
    description: '30-degree axonometric angle highlighting spatial depth and cloud stacks.',
    icon: Box,
    accent: 'var(--accent-indigo)',
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Schematic grid with dashed dimension lines and engineering annotations.',
    icon: Compass,
    accent: 'var(--accent-blue)',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Monochrome high-contrast lines with generous breathing room.',
    icon: CircleDot,
    accent: 'var(--text-primary)',
  },
  {
    id: '3d-technical',
    name: '3D Technical',
    description: 'Dimensional depth with pseudo-volumetric shadows and hardware styling.',
    icon: Layers3,
    accent: 'var(--accent-violet)',
  },
  {
    id: 'line-art',
    name: 'Line Art',
    description: 'Single-weight vector linework with architectural drafting precision.',
    icon: PenTool,
    accent: 'var(--accent-emerald)',
  },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selected,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Illustration Style
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Choose a visual design language for consistent documentation graphics.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        {STYLES.map((style) => {
          const isSelected = selected === style.id;
          const Icon = style.icon;

          return (
            <div
              key={style.id}
              onClick={() => !disabled && onSelect(style.id)}
              style={{
                position: 'relative',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? 'var(--bg-active)' : 'var(--bg-input)',
                border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.2)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} color={isSelected ? 'var(--accent-cyan)' : style.accent} />
                </div>

                {isSelected && (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={12} color="#080c14" strokeWidth={3} />
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {style.name}
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {style.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
