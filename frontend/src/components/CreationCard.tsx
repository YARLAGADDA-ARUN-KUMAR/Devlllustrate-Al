import React from 'react';
import {
  Download,
  Trash2,
  Calendar,
  Layers,
} from 'lucide-react';
import type { IllustrationCreation } from '../types';
import { downloadPngFromSvg, downloadSvgFile } from '../services/generationService';

interface CreationCardProps {
  creation: IllustrationCreation;
  onDelete: (id: string) => void;
  onPreview: (creation: IllustrationCreation) => void;
}

export const CreationCard: React.FC<CreationCardProps> = ({
  creation,
  onDelete,
  onPreview,
}) => {
  const formattedDate = new Date(creation.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="creation-card glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all var(--transition-fast)',
      }}
    >
      {/* Thumbnail Area */}
      <div
        onClick={() => onPreview(creation)}
        style={{
          height: '210px',
          backgroundColor: '#070b14',
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          dangerouslySetInnerHTML={{ __html: creation.svgData }}
        />

        {/* Hover overlay hint */}
        <div
          className="card-hover-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(9, 13, 22, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
        >
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'var(--accent-cyan)',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Click to View
          </div>
        </div>

        {/* Category tag */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(11, 17, 28, 0.85)',
            backdropFilter: 'blur(6px)',
            borderRadius: 'var(--radius-full)',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {creation.category.replace(/-/g, ' ')}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
        <div>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: '1.3',
              marginBottom: '4px',
            }}
          >
            {creation.title}
          </h4>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.4',
            }}
          >
            {creation.prompt}
          </p>
        </div>

        {/* Metadata info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-dim)',
            marginTop: 'auto',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={12} color="var(--accent-cyan)" />
              {creation.style}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>

          <span style={{ fontFamily: 'var(--font-mono)' }}>{creation.dimensions}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => downloadSvgFile(creation.svgData, `${creation.title}.svg`)}
            title="Download SVG"
            style={{ flex: 1, fontSize: '12px', padding: '6px 10px' }}
          >
            <Download size={13} />
            SVG
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => downloadPngFromSvg(creation.svgData, `${creation.title}.png`)}
            title="Download PNG"
            style={{ flex: 1, fontSize: '12px', padding: '6px 10px' }}
          >
            PNG
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={() => onDelete(creation.id)}
            title="Delete from creations"
            style={{ padding: '6px 8px', color: 'var(--accent-rose)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
