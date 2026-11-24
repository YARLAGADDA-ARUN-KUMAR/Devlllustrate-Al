import type { DiagramDefinition, IllustrationStyle } from '../../types';
import { layoutDiagram, getNodeDimensions, DEFAULT_NODE_WIDTH, DEFAULT_NODE_HEIGHT } from './diagramLayout';
import { THEME_CONFIGS } from './diagramTheme';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function renderDiagramToSvg(
  diagram: DiagramDefinition,
  style: IllustrationStyle = 'flat-vector'
): string {
  const theme = THEME_CONFIGS[style] || THEME_CONFIGS['flat-vector'];
  const { nodes, edges } = layoutDiagram(diagram, style);

  if (nodes.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="100%" height="100%" fill="${theme.canvasBg}"/></svg>`;
  }

  // Calculate bounding box across both group nodes and component nodes
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    const isGroup = n.type === 'groupNode';
    const width = isGroup
      ? (n.data?.width as number) || DEFAULT_NODE_WIDTH
      : getNodeDimensions(n.data as any).width;
    const height = isGroup
      ? (n.data?.height as number) || DEFAULT_NODE_HEIGHT
      : getNodeDimensions(n.data as any).height;

    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + width);
    maxY = Math.max(maxY, n.position.y + height);
  });

  const padding = 70;
  minX -= padding;
  minY -= padding + 40; // extra space for title header
  maxX += padding;
  maxY += padding;

  const width = Math.max(750, Math.round(maxX - minX));
  const height = Math.max(480, Math.round(maxY - minY));

  // Separate group nodes from component nodes
  const groupNodes = nodes.filter((n) => n.type === 'groupNode');
  const componentNodes = nodes.filter((n) => n.type === 'technicalNode');

  const nodeMap = new Map(componentNodes.map((n) => [n.id, n]));

  // 1. Render Group Enclosures
  const groupElements = groupNodes
    .map((g) => {
      const gx = g.position.x;
      const gy = g.position.y;
      const gw = (g.data?.width as number) || 300;
      const gh = (g.data?.height as number) || 200;
      const glabel = escapeXml(String(g.data?.label || 'Boundary'));
      const gColor = (g.data?.color as string) || theme.accent;

      return `
        <g class="diagram-group" transform="translate(${gx}, ${gy})">
          <rect width="${gw}" height="${gh}" rx="${style === 'line-art' ? 0 : 12}" fill="${theme.groupBg}" stroke="${gColor}" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.85"/>
          <rect x="16" y="-11" width="${glabel.length * 7.5 + 24}" height="22" rx="4" fill="${theme.canvasBg}" stroke="${gColor}" stroke-width="1"/>
          <text x="${16 + (glabel.length * 7.5 + 24) / 2}" y="4" fill="${gColor}" font-size="10.5" font-family="${theme.fontFamily}" font-weight="700" text-anchor="middle" letter-spacing="0.04em">${glabel}</text>
        </g>
      `;
    })
    .join('\n');

  // 2. Render SVG Edges
  const edgeElements = edges
    .map((e) => {
      const srcNode = nodeMap.get(e.source);
      const tgtNode = nodeMap.get(e.target);
      if (!srcNode || !tgtNode) return '';

      const srcDims = getNodeDimensions(srcNode.data as any);
      const tgtDims = getNodeDimensions(tgtNode.data as any);

      const isHorizontal = diagram.layout_direction !== 'TB' && diagram.layout_direction !== 'BT';

      const sx = isHorizontal ? srcNode.position.x + srcDims.width : srcNode.position.x + srcDims.width / 2;
      const sy = isHorizontal ? srcNode.position.y + srcDims.height / 2 : srcNode.position.y + srcDims.height;
      const tx = isHorizontal ? tgtNode.position.x : tgtNode.position.x + tgtDims.width / 2;
      const ty = isHorizontal ? tgtNode.position.y + tgtDims.height / 2 : tgtNode.position.y;

      const midX = (sx + tx) / 2;
      const midY = (sy + ty) / 2;

      let d = '';
      if (isHorizontal) {
        d = `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`;
      } else {
        d = `M ${sx} ${sy} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`;
      }

      const labelStr = escapeXml(String(e.label || ''));
      const labelW = Math.max(70, labelStr.length * 6.5 + 18);
      const labelElem = e.label
        ? `<rect x="${midX - labelW / 2}" y="${midY - 11}" width="${labelW}" height="22" rx="5" fill="${theme.edgeLabelBg}" fill-opacity="0.96" stroke="${theme.edgeLabelBorder}" stroke-width="1"/>
           <text x="${midX}" y="${midY + 4}" fill="${theme.edgeLabelText}" font-size="10.5" font-family="${theme.fontFamily}" font-weight="600" text-anchor="middle">${labelStr}</text>`
        : '';

      const isBidirectional = (e as any).markerStart !== undefined;

      return `
        <g class="diagram-edge">
          <path d="${d}" fill="none" stroke="${theme.edgeColor}" stroke-width="${style === 'line-art' ? 1.5 : 2}" marker-end="url(#arrow-end-${style})" ${isBidirectional ? `marker-start="url(#arrow-start-${style})"` : ''} stroke-dasharray="${e.style?.strokeDasharray || 'none'}"/>
          ${labelElem}
        </g>
      `;
    })
    .join('\n');

  // 3. Render SVG Component Nodes
  const nodeElements = componentNodes
    .map((n) => {
      const x = n.position.x;
      const y = n.position.y;
      const dims = getNodeDimensions(n.data as any);
      const label = escapeXml(String(n.data?.label || n.id));
      const desc = escapeXml(String(n.data?.description || ''));
      const type = escapeXml(String(n.data?.type || 'generic')).toUpperCase();
      const group = n.data?.group ? escapeXml(String(n.data?.group)) : '';
      const accent = (n.data?.color as string) || theme.accent;
      const rx = style === 'line-art' ? 0 : style === 'blueprint' ? 4 : parseInt(theme.borderRadius) || 12;

      return `
        <g class="diagram-node" transform="translate(${x}, ${y})">
          <rect width="${dims.width}" height="${dims.height}" rx="${rx}" fill="${theme.nodeBg.includes('gradient') ? '#111827' : theme.nodeBg}" stroke="${theme.edgeColor}" stroke-width="1.5" filter="url(#node-shadow)"/>
          <!-- Top Accent Line -->
          <path d="M 0 ${rx} Q 0 0 ${rx} 0 L ${dims.width - rx} 0 Q ${dims.width} 0 ${dims.width} ${rx}" fill="none" stroke="${accent}" stroke-width="3" opacity="0.8"/>
          <!-- Badge -->
          <rect x="14" y="12" width="${type.length * 6.5 + 16}" height="18" rx="3" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" stroke-width="1"/>
          <text x="${14 + (type.length * 6.5 + 16) / 2}" y="24" fill="${accent}" font-size="9" font-family="${theme.fontFamily}" font-weight="700" text-anchor="middle" letter-spacing="0.04em">${type}</text>
          <!-- Title -->
          <text x="14" y="52" fill="${theme.nodeText}" font-size="13.5" font-family="${theme.fontFamily}" font-weight="700">${label}</text>
          <!-- Description -->
          ${desc ? `<text x="14" y="71" fill="${theme.nodeDesc}" font-size="11" font-family="${theme.fontFamily}">${desc}</text>` : ''}
          <!-- Group tag -->
          ${group ? `<rect x="14" y="${dims.height - 24}" width="${group.length * 6 + 14}" height="15" rx="3" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" stroke-width="0.8"/><text x="${14 + (group.length * 6 + 14) / 2}" y="${dims.height - 13}" fill="${theme.edgeColor}" font-size="8.5" font-family="${theme.fontFamily}" font-weight="600" text-anchor="middle">${group}</text>` : ''}
        </g>
      `;
    })
    .join('\n');

  // Title Header
  const titleStr = escapeXml(diagram.title || 'Technical Architecture Diagram');
  const typeStr = escapeXml((diagram.diagram_type || 'architecture').replace(/_/g, ' ').toUpperCase());

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${width} ${height}">
      <defs>
        <marker id="arrow-end-${style}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="${theme.edgeColor}"/>
        </marker>
        <marker id="arrow-start-${style}" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 10 1.5 L 1 5 L 10 8.5 z" fill="${theme.edgeColor}"/>
        </marker>
        <filter id="node-shadow" x="-10%" y="-10%" width="125%" height="135%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.55"/>
        </filter>
      </defs>

      <!-- Background Canvas -->
      <rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="${theme.canvasBg}"/>

      <!-- Header Banner Watermark -->
      <g class="diagram-header" transform="translate(${minX + 35}, ${minY + 30})">
        <text x="0" y="0" fill="${theme.nodeText}" font-size="18" font-family="${theme.fontFamily}" font-weight="800">${titleStr}</text>
        <rect x="0" y="8" width="${typeStr.length * 6.5 + 14}" height="18" rx="3" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" stroke-width="1"/>
        <text x="${(typeStr.length * 6.5 + 14) / 2}" y="20.5" fill="${theme.edgeColor}" font-size="9" font-family="${theme.fontFamily}" font-weight="700" text-anchor="middle" letter-spacing="0.05em">${typeStr}</text>
        <text x="${typeStr.length * 6.5 + 25}" y="20.5" fill="${theme.nodeDesc}" font-size="10" font-family="${theme.fontFamily}">• DevIllustrate AI Technical Architecture</text>
      </g>

      <!-- Groups (Enclosures) -->
      ${groupElements}

      <!-- Connections / Edges -->
      ${edgeElements}

      <!-- Component Nodes -->
      ${nodeElements}
    </svg>
  `;
}
