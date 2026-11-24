import type { IllustrationStyle } from '../../types';

export interface ThemeConfig {
  id: IllustrationStyle;
  name: string;
  canvasBg: string;
  gridColor: string;
  gridPattern: 'dots' | 'lines' | 'cross';
  nodeBg: string;
  nodeBorder: string;
  nodeText: string;
  nodeDesc: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  edgeColor: string;
  edgeLabelBg: string;
  edgeLabelBorder: string;
  edgeLabelText: string;
  fontFamily: string;
  shadow: string;
  borderRadius: string;
  accent: string;
  groupBg: string;
  groupBorder: string;
  groupText: string;
  handleColor: string;
}

export const THEME_CONFIGS: Record<IllustrationStyle, ThemeConfig> = {
  'flat-vector': {
    id: 'flat-vector',
    name: 'Flat Vector',
    canvasBg: '#090d16',
    gridColor: 'rgba(56, 189, 248, 0.08)',
    gridPattern: 'dots',
    nodeBg: '#0f172a',
    nodeBorder: '1.5px solid #334155',
    nodeText: '#f8fafc',
    nodeDesc: '#94a3b8',
    badgeBg: 'rgba(56, 189, 248, 0.12)',
    badgeBorder: 'rgba(56, 189, 248, 0.3)',
    badgeText: '#38bdf8',
    edgeColor: '#38bdf8',
    edgeLabelBg: '#0f172a',
    edgeLabelBorder: '#1e293b',
    edgeLabelText: '#38bdf8',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    shadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
    borderRadius: '12px',
    accent: '#38bdf8',
    groupBg: 'rgba(56, 189, 248, 0.04)',
    groupBorder: '1.5px dashed rgba(56, 189, 248, 0.35)',
    groupText: '#38bdf8',
    handleColor: '#38bdf8',
  },
  'isometric': {
    id: 'isometric',
    name: 'Isometric 2.5D',
    canvasBg: '#080c14',
    gridColor: 'rgba(99, 102, 241, 0.12)',
    gridPattern: 'lines',
    nodeBg: 'linear-gradient(145deg, #1a1b38 0%, #0d1222 100%)',
    nodeBorder: '1.5px solid #6366f1',
    nodeText: '#ffffff',
    nodeDesc: '#c7d2fe',
    badgeBg: 'rgba(99, 102, 241, 0.25)',
    badgeBorder: 'rgba(99, 102, 241, 0.5)',
    badgeText: '#a5b4fc',
    edgeColor: '#818cf8',
    edgeLabelBg: '#13182e',
    edgeLabelBorder: '#6366f1',
    edgeLabelText: '#c7d2fe',
    fontFamily: 'Inter, system-ui, sans-serif',
    shadow: '5px 7px 0px rgba(99, 102, 241, 0.4), 0 12px 28px rgba(0, 0, 0, 0.65)',
    borderRadius: '10px',
    accent: '#818cf8',
    groupBg: 'rgba(99, 102, 241, 0.05)',
    groupBorder: '2px dashed rgba(99, 102, 241, 0.4)',
    groupText: '#a5b4fc',
    handleColor: '#818cf8',
  },
  'blueprint': {
    id: 'blueprint',
    name: 'Blueprint CAD',
    canvasBg: '#02142e',
    gridColor: 'rgba(56, 189, 248, 0.16)',
    gridPattern: 'lines',
    nodeBg: 'rgba(4, 28, 66, 0.95)',
    nodeBorder: '1.5px solid #38bdf8',
    nodeText: '#ffffff',
    nodeDesc: '#7dd3fc',
    badgeBg: 'rgba(56, 189, 248, 0.2)',
    badgeBorder: '#38bdf8',
    badgeText: '#bae6fd',
    edgeColor: '#38bdf8',
    edgeLabelBg: '#02183b',
    edgeLabelBorder: '#38bdf8',
    edgeLabelText: '#e0f2fe',
    fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
    shadow: '0 0 18px rgba(56, 189, 248, 0.22)',
    borderRadius: '4px',
    accent: '#38bdf8',
    groupBg: 'rgba(56, 189, 248, 0.06)',
    groupBorder: '1.5px dashed #38bdf8',
    groupText: '#7dd3fc',
    handleColor: '#38bdf8',
  },
  'minimalist': {
    id: 'minimalist',
    name: 'Minimalist Wireframe',
    canvasBg: '#030712',
    gridColor: 'rgba(255, 255, 255, 0.04)',
    gridPattern: 'dots',
    nodeBg: '#0b0f19',
    nodeBorder: '1px solid #1f2937',
    nodeText: '#f9fafb',
    nodeDesc: '#6b7280',
    badgeBg: 'rgba(255, 255, 255, 0.06)',
    badgeBorder: '#374151',
    badgeText: '#9ca3af',
    edgeColor: '#9ca3af',
    edgeLabelBg: '#0b0f19',
    edgeLabelBorder: '#374151',
    edgeLabelText: '#e5e7eb',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    accent: '#e5e7eb',
    groupBg: 'rgba(255, 255, 255, 0.02)',
    groupBorder: '1px dashed #374151',
    groupText: '#9ca3af',
    handleColor: '#9ca3af',
  },
  '3d-technical': {
    id: '3d-technical',
    name: '3D Technical',
    canvasBg: '#070a14',
    gridColor: 'rgba(168, 85, 247, 0.1)',
    gridPattern: 'cross',
    nodeBg: 'linear-gradient(180deg, #191c33 0%, #0d1020 100%)',
    nodeBorder: '1.5px solid #a855f7',
    nodeText: '#ffffff',
    nodeDesc: '#d8b4fe',
    badgeBg: 'rgba(168, 85, 247, 0.22)',
    badgeBorder: 'rgba(168, 85, 247, 0.5)',
    badgeText: '#e9d5ff',
    edgeColor: '#c084fc',
    edgeLabelBg: '#15172b',
    edgeLabelBorder: '#a855f7',
    edgeLabelText: '#f3e8ff',
    fontFamily: 'Inter, system-ui, sans-serif',
    shadow: '0 8px 30px rgba(168, 85, 247, 0.25), 0 0 15px rgba(192, 132, 252, 0.15)',
    borderRadius: '12px',
    accent: '#c084fc',
    groupBg: 'rgba(168, 85, 247, 0.05)',
    groupBorder: '1.5px dashed rgba(168, 85, 247, 0.45)',
    groupText: '#e9d5ff',
    handleColor: '#c084fc',
  },
  'line-art': {
    id: 'line-art',
    name: 'Line Art CAD',
    canvasBg: '#000000',
    gridColor: 'rgba(255, 255, 255, 0.08)',
    gridPattern: 'cross',
    nodeBg: '#050505',
    nodeBorder: '1.5px solid #ffffff',
    nodeText: '#ffffff',
    nodeDesc: '#a3a3a3',
    badgeBg: 'transparent',
    badgeBorder: '#ffffff',
    badgeText: '#ffffff',
    edgeColor: '#ffffff',
    edgeLabelBg: '#000000',
    edgeLabelBorder: '#ffffff',
    edgeLabelText: '#ffffff',
    fontFamily: '"JetBrains Mono", Consolas, monospace',
    shadow: 'none',
    borderRadius: '0px',
    accent: '#ffffff',
    groupBg: 'transparent',
    groupBorder: '1px dashed #ffffff',
    groupText: '#ffffff',
    handleColor: '#ffffff',
  },
};
