import React from 'react';
import { Sparkles, Trash2, Wand2 } from 'lucide-react';

interface PromptEditorProps {
  prompt: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSample: () => void;
  disabled?: boolean;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  onChange,
  onClear,
  onSample,
  disabled = false,
}) => {
  const charCount = prompt.length;
  const maxChars = 600;

  return (
    <div className="prompt-editor-container glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wand2 size={16} color="var(--accent-cyan)" />
            Describe Your Illustration
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Specify systems, services, data flow directions, and protocols.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn-ghost"
            onClick={onSample}
            disabled={disabled}
            title="Load an example prompt"
            style={{ fontSize: '12px', padding: '4px 10px' }}
          >
            <Sparkles size={13} color="var(--accent-cyan)" />
            Sample Prompt
          </button>
          {prompt.length > 0 && (
            <button
              type="button"
              className="btn-ghost"
              onClick={onClear}
              disabled={disabled}
              title="Clear input"
              style={{ fontSize: '12px', padding: '4px 8px', color: 'var(--text-dim)' }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <textarea
          className="form-textarea"
          rows={4}
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe the technical illustration you want to generate. Example: A modern software architecture diagram showing a React frontend communicating with a FastAPI backend and a MySQL database..."
          disabled={disabled}
          maxLength={maxChars}
          style={{
            resize: 'vertical',
            minHeight: '110px',
            fontSize: '14px',
            lineHeight: '1.6',
            borderColor: prompt.trim() ? 'var(--border-accent)' : 'var(--border-subtle)',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
            fontSize: '12px',
            color: 'var(--text-dim)',
          }}
        >
          <span>Tip: Mention key components like Load Balancers, Gateways, or Caches.</span>
          <span style={{ color: charCount > 500 ? 'var(--accent-amber)' : 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {charCount} / {maxChars}
          </span>
        </div>
      </div>
    </div>
  );
};
