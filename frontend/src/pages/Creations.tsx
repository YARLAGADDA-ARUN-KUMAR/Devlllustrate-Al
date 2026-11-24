import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Sparkles,
  X,
  FileCode,
  CheckCircle2,
} from 'lucide-react';
import type { IllustrationCreation } from '../types';
import { CreationCard } from '../components/CreationCard';
import { downloadPngFromSvg, downloadSvgFile } from '../services/generationService';

interface CreationsProps {
  creations: IllustrationCreation[];
  onDeleteCreation: (id: string) => void;
  onClearAll: () => void;
  onNavigateToGenerate: () => void;
}

export const Creations: React.FC<CreationsProps> = ({
  creations,
  onDeleteCreation,
  onClearAll,
  onNavigateToGenerate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalCreation, setActiveModalCreation] = useState<IllustrationCreation | null>(null);
  const [copied, setCopied] = useState(false);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'software-architecture', label: 'Architecture' },
    { id: 'cloud-computing', label: 'Cloud' },
    { id: 'database-systems', label: 'Databases' },
    { id: 'cybersecurity', label: 'Cybersecurity' },
    { id: 'artificial-intelligence', label: 'AI & ML' },
    { id: 'networking', label: 'Networking' },
  ];

  const filteredCreations = creations.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopySvg = (svg: string) => {
    navigator.clipboard.writeText(svg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Controls: Search & Category Filters */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '480px' }}>
            <Search
              size={18}
              color="var(--text-dim)"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creations by prompt or title..."
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing {filteredCreations.length} of {creations.length} graphics
            </span>
            {creations.length > 0 && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your local creation history?')) {
                    onClearAll();
                  }
                }}
                style={{ fontSize: '12.5px', color: 'var(--accent-rose)' }}
              >
                <Trash2 size={13} />
                Clear Gallery
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  backgroundColor: isSelected ? 'var(--accent-cyan)' : 'var(--bg-input)',
                  color: isSelected ? '#080c14' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredCreations.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredCreations.map((item) => (
            <CreationCard
              key={item.id}
              creation={item}
              onDelete={onDeleteCreation}
              onPreview={(creation) => setActiveModalCreation(creation)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          className="glass-card"
          style={{
            padding: '60px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Filter size={24} color="var(--text-dim)" />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              No illustrations found
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '360px' }}>
              {searchQuery
                ? `No graphics matched "${searchQuery}". Try modifying your search keywords.`
                : 'You have not saved any illustrations in this category yet.'}
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={onNavigateToGenerate}
            style={{ marginTop: '8px' }}
          >
            <Sparkles size={16} />
            Generate a New Illustration
          </button>
        </div>
      )}

      {/* Detail & Fullscreen Lightbox Modal */}
      {activeModalCreation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(6, 9, 16, 0.94)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '28px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                {activeModalCreation.title}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {activeModalCreation.category.replace(/-/g, ' ')} · {activeModalCreation.style} · Seed: #{activeModalCreation.seed}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => downloadSvgFile(activeModalCreation.svgData, `${activeModalCreation.title}.svg`)}
                style={{ fontSize: '13px', padding: '8px 14px' }}
              >
                <Download size={14} /> Download SVG
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => downloadPngFromSvg(activeModalCreation.svgData, `${activeModalCreation.title}.png`)}
                style={{ fontSize: '13px', padding: '8px 14px' }}
              >
                Download PNG
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleCopySvg(activeModalCreation.svgData)}
                style={{ fontSize: '13px', padding: '8px 14px' }}
              >
                {copied ? <CheckCircle2 size={14} color="var(--accent-emerald)" /> : <FileCode size={14} />}
                {copied ? 'Copied' : 'Copy SVG'}
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={() => setActiveModalCreation(null)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  marginLeft: '8px',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              overflow: 'auto',
            }}
          >
            <div
              style={{ maxWidth: '1100px', width: '100%', maxHeight: '80vh' }}
              dangerouslySetInnerHTML={{ __html: activeModalCreation.svgData }}
            />
          </div>

          <div
            style={{
              marginTop: '12px',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: '1.5',
            }}
          >
            <strong>Prompt:</strong> {activeModalCreation.prompt}
          </div>
        </div>
      )}
    </div>
  );
};
