import type { DiagramDefinition, IllustrationStyle } from '../../types';
import { layoutDiagram, NODE_HEIGHT, NODE_WIDTH } from './diagramLayout';
import { THEME_CONFIGS } from './diagramTheme';

export function renderDiagramToSvg(
  diagram: DiagramDefinition,
  style: IllustrationStyle = 'flat-vector'
): string {
  const theme = THEME_CONFIGS[style] || THEME_CONFIGS['flat-vector'];
  const { nodes, edges } = layoutDiagram(diagram, style);

  if (nodes.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="100%" height="100%" fill="${theme.canvasBg}"/></svg>`;
  }

  // Calculate bounding box
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + NODE_WIDTH);
    maxY = Math.max(maxY, n.position.y + NODE_HEIGHT);
  });

  const padding = 60;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const width = Math.max(600, maxX - minX);
  const height = Math.max(400, maxY - minY);

  // Generate node map for edge routing
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Generate SVG Edges
  const edgeElements = edges
    .map((e) => {
      const srcNode = nodeMap.get(e.source);
      const tgtNode = nodeMap.get(e.target);
      if (!srcNode || !tgtNode) return '';

      const sx = srcNode.position.x + NODE_WIDTH;
      const sy = srcNode.position.y + NODE_HEIGHT / 2;
      const tx = tgtNode.position.x;
      const ty = tgtNode.position.y + NODE_HEIGHT / 2;

      const midX = (sx + tx) / 2;
      const d = `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`;

      const labelElem = e.label
        ? `<rect x="${midX - 45}" y="${(sy + ty) / 2 - 11}" width="90" height="20" rx="4" fill="${theme.edgeLabelBg}" fill-opacity="0.95" stroke="${theme.edgeColor}33"/>
           <text x="${midX}" y="${(sy + ty) / 2 + 3}" fill="${theme.edgeLabelText}" font-size="10.5" font-family="${theme.fontFamily}" font-weight="600" text-anchor="middle">${escapeXml(String(e.label))}</text>`
        : '';

      return `
        <g class="diagram-edge">
          <path d="${d}" fill="none" stroke="${theme.edgeColor}" stroke-width="${style === 'line-art' ? 1.5 : 2}" marker-end="url(#arrow-${style})" stroke-dasharray="${e.style?.strokeDasharray || 'none'}"/>
          ${labelElem}
        </g>
      `;
    })
    .join('\n');

  // Generate SVG Nodes
  const nodeElements = nodes
    .map((n) => {
      const x = n.position.x;
      const y = n.position.y;
      const label = escapeXml(String(n.data?.label || n.id));
      const desc = escapeXml(String(n.data?.description || ''));
      const type = escapeXml(String(n.data?.type || 'generic')).toUpperCase();
      const group = n.data?.group ? escapeXml(String(n.data?.group)) : '';

      return `
        <g class="diagram-node" transform="translate(${x}, ${y})">
          <rect width="${NODE_WIDTH}" height="${NODE_HEIGHT}" rx="${theme.borderRadius.replace('px', '')}" fill="${theme.canvasBg === '#03132e' ? '#041738' : '#0f172a'}" stroke="${theme.edgeColor}" stroke-width="1.5" filter="url(#node-shadow)"/>
          <rect x="12" y="10" width="60" height="16" rx="3" fill="${theme.badgeBg}" stroke="${theme.edgeColor}44"/>
          <text x="42" y="21.5" fill="${theme.edgeColor}" font-size="9" font-family="${theme.fontFamily}" font-weight="700" text-anchor="middle">${type}</text>
          <text x="14" y="52" fill="${theme.nodeText}" font-size="13.5" font-family="${theme.fontFamily}" font-weight="600">${label}</text>
          ${desc ? `<text x="14" y="70" fill="${theme.nodeDesc}" font-size="11" font-family="${theme.fontFamily}">${desc}</text>` : ''}
          ${group ? `<rect x="12" y="${NODE_HEIGHT - 22}" width="70" height="14" rx="2" fill="${theme.badgeBg}"/><text x="47" y="${NODE_HEIGHT - 11}" fill="${theme.edgeColor}" font-size="8.5" font-family="${theme.fontFamily}" text-anchor="middle">${group}</text>` : ''}
        </g>
      `;
    })
    .join('\n');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${width} ${height}">
      <defs>
        <marker id="arrow-${style}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="${theme.edgeColor}"/>
        </marker>
        <filter id="node-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
        </filter>
        <pattern id="grid-${style}" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="${theme.gridColor}"/>
        </pattern>
      </defs>
      <rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="${theme.canvasBg}"/>
      <rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="url(#grid-${style})"/>
      <g class="diagram-edges">${edgeElements}</g>
      <g class="diagram-nodes">${nodeElements}</g>
    </svg>
  `;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
