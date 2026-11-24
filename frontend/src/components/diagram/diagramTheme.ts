import type { IllustrationStyle } from '../../types';

export interface ThemeConfig {
  canvasBg: string;
  gridColor: string;
  gridPattern: 'dots' | 'lines' | 'cross';
  nodeBg: string;
  nodeBorder: string;
  nodeText: string;
  nodeDesc: string;
  badgeBg: string;
  edgeColor: string;
  edgeLabelBg: string;
  edgeLabelText: string;
  fontFamily: string;
  shadow: string;
  borderRadius: string;
  accent: string;
}

export const THEME_CONFIGS: Record<IllustrationStyle, ThemeConfig> = {
  'flat-vector': {
    canvasBg: '#090d16',
    gridColor: 'rgba(56, 189, 248, 0.08)',
    gridPattern: 'dots',
    nodeBg: '#0f172a',
    nodeBorder: '1px solid #334155',
    nodeText: '#f8fafc',
    nodeDesc: '#94a3b8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    edgeColor: '#38bdf8',
    edgeLabelBg: '#0f172a',
    edgeLabelText: '#38bdf8',
    fontFamily: 'Inter, system-ui, sans-serif',
    shadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    borderRadius: '12px',
    accent: '#38bdf8',
  },
  'isometric': {
    canvasBg: '#080c14',
    gridColor: 'rgba(99, 102, 241, 0.1)',
    gridPattern: 'lines',
    nodeBg: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
    nodeBorder: '1.5px solid #6366f1',
    nodeText: '#ffffff',
    nodeDesc: '#c7d2fe',
    badgeBg: 'rgba(99, 102, 241, 0.25)',
    edgeColor: '#818cf8',
    edgeLabelBg: '#1e1b4b',
    edgeLabelText: '#a5b4fc',
    fontFamily: 'Inter, system-ui, sans-serif',
    shadow: '4px 6px 0px rgba(99, 102, 241, 0.35), 0 10px 25px rgba(0, 0, 0, 0.6)',
    borderRadius: '10px',
    accent: '#818cf8',
  },
  'blueprint': {
    canvasBg: '#03132e',
    gridColor: 'rgba(56, 189, 248, 0.18)',
    gridPattern: 'lines',
    nodeBg: 'rgba(6, 26, 61, 0.95)',
    nodeBorder: '1.5px solid #38bdf8',
    nodeText: '#ffffff',
    nodeDesc: '#7dd3fc',
    badgeBg: 'rgba(56, 189, 248, 0.2)',
    edgeColor: '#38bdf8',
    edgeLabelBg: '#03193f',
    edgeLabelText: '#bae6fd',
    fontFamily: '"JetBrains Mono", Consolas, monospace',
    shadow: '0 0 15px rgba(56, 189, 248, 0.25)',
    borderRadius: '4px',
    accent: '#38bdf8',
  },
  'minimalist': {
    canvasBg: '#05070c',
    gridColor: 'rgba(255, 255, 255, 0.04)',
    gridPattern: 'dots',
    nodeBg: '#0c1017',
    nodeBorder: '1px solid #1e293b',
    nodeText: '#f1f5f9',
    nodeDesc: '#64748b',
    badgeBg: 'rgba(255, 255, 255, 0.06)',
    edgeColor: '#94a3b8',
    edgeLabelBg: '#0c1017',
    edgeLabelText: '#cbd5e1',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    shadow: 'none',
    borderRadius: '8px',
    accent: '#cbd5e1',
  },
  '3d-technical': {
    canvasBg: '#070a12',
    gridColor: 'rgba(168, 85, 247, 0.08)',
    gridPattern: 'cross',
    nodeBg: 'linear-gradient(180deg, #181d33 0%, #0d1120 100%)',
    nodeBorder: '1.5px solid #a855f7',
    nodeText: '#ffffff',
    nodeDesc: '#d8b4fe',
    badgeBg: 'rgba(168, 85, 247, 0.2)',
    edgeColor: '#c084fc',
    edgeLabelBg: '#181d33',
    edgeLabelText: '#e9d5ff',
    fontFamily: 'Inter, system-ui, sans-serif',
    shadow: '0 12px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(168, 85, 247, 0.2)',
    borderRadius: '16px',
    accent: '#c084fc',
  },
  'line-art': {
    canvasBg: '#05070a',
    gridColor: 'rgba(255, 255, 255, 0.06)',
    gridPattern: 'dots',
    nodeBg: '#000000',
    nodeBorder: '1px solid #ffffff',
    nodeText: '#ffffff',
    nodeDesc: '#a3a3a3',
    badgeBg: 'transparent',
    edgeColor: '#ffffff',
    edgeLabelBg: '#000000',
    edgeLabelText: '#ffffff',
    fontFamily: '"JetBrains Mono", monospace',
    shadow: 'none',
    borderRadius: '2px',
    accent: '#ffffff',
  },
};
