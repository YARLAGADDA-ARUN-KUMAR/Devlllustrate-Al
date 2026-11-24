import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import type { PromptTemplate } from '../types';

interface TemplatesProps {
  templates: PromptTemplate[];
  onUseTemplate: (template: PromptTemplate) => void;
}

export const Templates: React.FC<TemplatesProps> = ({
  templates,
  onUseTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'software-architecture', label: 'Software Architecture' },
    { id: 'cloud-computing', label: 'Cloud Infrastructure' },
    { id: 'database-systems', label: 'Database Design' },
    { id: 'cybersecurity', label: 'Cybersecurity' },
    { id: 'artificial-intelligence', label: 'Machine Learning' },
    { id: 'networking', label: 'Networking' },
  ];

  const filtered = templates.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Intro Header */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Technical Documentation Graphic Templates
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '720px' }}>
            Pre-engineered prompts and configuration presets tuned for software architecture diagrams,
            distributed cloud networks, database topologies, and security protocols.
          </p>
        </div>

        {/* Filter Pills */}
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

      {/* Template Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {filtered.map((template) => (
          <div
            key={template.id}
            className="glass-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'all var(--transition-fast)',
            }}
          >
            {/* Visual Preview */}
            <div
              style={{
                height: '190px',
                backgroundColor: '#070b14',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                borderBottom: '1px solid var(--border-subtle)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                dangerouslySetInnerHTML={{ __html: template.svgPreview }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(11, 17, 28, 0.85)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--accent-cyan)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {template.category.replace(/-/g, ' ')}
              </div>
            </div>

            {/* Content Details */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {template.name}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {template.description}
                </p>
              </div>

              {/* Recommended Parameters */}
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Style: {template.style}</span>
                <span>Dim: {template.recommendedDimensions}</span>
                <span>Steps: {template.recommendedSteps}</span>
              </div>

              {/* Prompt Preview Snippet */}
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-dim)',
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  lineHeight: '1.4',
                  fontStyle: 'italic',
                }}
              >
                "{template.prompt.slice(0, 110)}..."
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="btn-primary"
                onClick={() => onUseTemplate(template)}
                style={{ marginTop: 'auto', width: '100%', fontSize: '13.5px' }}
              >
                <Wand2 size={15} />
                Use Template in Workspace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
