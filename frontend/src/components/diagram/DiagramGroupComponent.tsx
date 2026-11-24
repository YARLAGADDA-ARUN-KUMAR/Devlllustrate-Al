import React from 'react';
import type { IllustrationStyle } from '../../types';
import { THEME_CONFIGS } from './diagramTheme';

interface GroupNodeData {
  id: string;
  label: string;
  styleTheme?: IllustrationStyle;
  color?: string;
  width?: number;
  height?: number;
}

export const DiagramGroupComponent: React.FC<{ data: GroupNodeData }> = ({ data }) => {
  const styleTheme: IllustrationStyle = data.styleTheme || 'flat-vector';
  const theme = THEME_CONFIGS[styleTheme] || THEME_CONFIGS['flat-vector'];
  const borderColor = data.color || theme.groupBorder;
  const textColor = data.color || theme.groupText;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        borderRadius: styleTheme === 'line-art' ? '0px' : styleTheme === 'blueprint' ? '6px' : '16px',
        border: borderColor.startsWith('1') || borderColor.startsWith('2') ? borderColor : `1.5px dashed ${borderColor}`,
        background: theme.groupBg,
        position: 'relative',
        pointerEvents: 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-12px',
          left: '16px',
          background: theme.nodeBg.includes('gradient') ? '#0f172a' : theme.canvasBg,
          border: `1px solid ${textColor}`,
          borderRadius: styleTheme === 'line-art' ? '0px' : '6px',
          padding: '2px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: textColor,
            fontFamily: theme.fontFamily,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {data.label}
        </span>
      </div>
    </div>
  );
};
