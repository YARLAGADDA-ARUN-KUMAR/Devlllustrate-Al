import React, { useState } from 'react';
import {
  Cloud,
  Cpu,
  ChevronDown,
  ChevronUp,
  Dices,
  Sliders,
  Sparkles,
} from 'lucide-react';
import type { GenerationSettings as ISettings, ImageDimension } from '../types';

interface GenerationSettingsProps {
  settings: ISettings;
  onChange: (newSettings: Partial<ISettings>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
}

export const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  settings,
  onChange,
  onGenerate,
  isGenerating,
  canGenerate,
}) => {
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);

  const handleRandomizeSeed = () => {
    const randomSeed = Math.floor(Math.random() * 900000) + 100000;
    onChange({ seed: randomSeed });
  };

  const dimensions: { id: ImageDimension; label: string; desc: string }[] = [
    { id: '512x512', label: '512 × 512', desc: 'Standard Square' },
    { id: '768x768', label: '768 × 768', desc: 'Medium Detail' },
    { id: '1024x1024', label: '1024 × 1024', desc: 'High Resolution' },
  ];

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Generation Method */}
      <div>
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Generation Method
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Select Cloudflare Workers AI for real diffusion graphics or the offline Vector Engine for instant SVG blueprints.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* Option A: Cloudflare Workers AI FLUX.1 */}
          <button
            type="button"
            onClick={() => onChange({ method: 'api' })}
            disabled={isGenerating}
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: settings.method === 'api' ? 'var(--bg-active)' : 'var(--bg-input)',
              border: settings.method === 'api' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all var(--transition-fast)',
              boxShadow: settings.method === 'api' ? '0 0 16px rgba(56, 189, 248, 0.2)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: settings.method === 'api' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cloud size={16} color="var(--accent-cyan)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Cloudflare AI
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '10px', padding: '1px 5px' }}>
                  FLUX.1
                </span>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Real generative AI model hosted on Cloudflare Workers AI.
            </p>
          </button>

          {/* Option B: Vector SVG Blueprint Engine */}
          <button
            type="button"
            onClick={() => onChange({ method: 'vector-engine' })}
            disabled={isGenerating}
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: (settings.method === 'vector-engine' || settings.method === 'stable-diffusion-v14') ? 'var(--bg-active)' : 'var(--bg-input)',
              border: (settings.method === 'vector-engine' || settings.method === 'stable-diffusion-v14') ? '1px solid var(--accent-violet)' : '1px solid var(--border-subtle)',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              transition: 'all var(--transition-fast)',
              boxShadow: (settings.method === 'vector-engine' || settings.method === 'stable-diffusion-v14') ? '0 0 16px rgba(129, 140, 248, 0.2)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: (settings.method === 'vector-engine' || settings.method === 'stable-diffusion-v14') ? 'rgba(129, 140, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cpu size={16} color="var(--accent-violet)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Vector Engine
                </span>
                <span className="badge badge-violet" style={{ fontSize: '10px', padding: '1px 5px' }}>
                  SVG
                </span>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Instant programmatic vector blueprint generator (offline).
            </p>
          </button>
        </div>
      </div>

      {/* 2. Image Dimensions */}
      <div>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          <span>Canvas Aspect / Dimensions</span>
          <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            {settings.dimensions}
          </span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {dimensions.map((dim) => {
            const isSelected = settings.dimensions === dim.id;
            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => onChange({ dimensions: dim.id })}
                disabled={isGenerating}
                style={{
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected ? 'var(--bg-active)' : 'var(--bg-input)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  textAlign: 'center',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{dim.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>{dim.desc}</div>
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>
          * FLUX.1 Schnell outputs standard 1024×1024 base resolution; dimensions guide the prompt layout and SVG scaling.
        </p>
      </div>

      {/* 3. Inference Sliders (Steps & Guidance Scale) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Steps */}
        <div className="form-group">
          <div className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sliders size={13} color="var(--accent-cyan)" />
              Inference Steps
            </span>
            <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {settings.inferenceSteps}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={settings.inferenceSteps > 8 ? 4 : settings.inferenceSteps}
            onChange={(e) => onChange({ inferenceSteps: Number(e.target.value) })}
            disabled={isGenerating}
            style={{ accentColor: 'var(--accent-cyan)', width: '100%', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)' }}>
            <span>Fast (1)</span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Optimal (4)</span>
            <span>Max (8)</span>
          </div>
        </div>

        {/* Guidance Scale */}
        <div className="form-group">
          <div className="form-label">
            <span>Guidance Scale</span>
            <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              N/A (FLUX.1)
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            step={0.5}
            value={settings.guidanceScale}
            onChange={(e) => onChange({ guidanceScale: Number(e.target.value) })}
            disabled={true}
            style={{ accentColor: 'var(--accent-violet)', width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
          />
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
            Distilled flow does not apply CFG guidance scale.
          </div>
        </div>
      </div>

      {/* 4. Seed Input */}
      <div className="form-group">
        <div className="form-label">
          <span>Seed / Generation Tag</span>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
            Client reference tag
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            className="form-input"
            value={settings.seed}
            onChange={(e) => onChange({ seed: Number(e.target.value) })}
            disabled={isGenerating}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={handleRandomizeSeed}
            disabled={isGenerating}
            title="Generate random seed"
            style={{ padding: '0 14px' }}
          >
            <Dices size={16} />
            Random
          </button>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
          Note: FLUX.1 Schnell runs cloud-side without fixed user seed inputs.
        </p>
      </div>

      {/* 5. Negative Prompt (Expandable) */}
      <div>
        <button
          type="button"
          onClick={() => setShowNegativePrompt(!showNegativePrompt)}
          className="btn-ghost"
          style={{ width: '100%', justifyContent: 'space-between', padding: '8px 4px', color: 'var(--text-secondary)' }}
        >
          <span style={{ fontSize: '13px', fontWeight: 500 }}>
            {showNegativePrompt ? 'Hide Negative Prompt' : 'Add Negative Prompt (Optional)'}
          </span>
          {showNegativePrompt ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showNegativePrompt && (
          <div style={{ marginTop: '8px' }}>
            <textarea
              className="form-textarea"
              rows={2}
              value={settings.negativePrompt}
              onChange={(e) => onChange({ negativePrompt: e.target.value })}
              placeholder="Unwanted visual elements (note: distilled FLUX.1 models use positive technical directives rather than negative prompts)..."
              disabled={isGenerating}
              style={{ fontSize: '13px' }}
            />
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
              * Cloudflare FLUX.1 Schnell does not accept negative prompts directly; prompt enrichment automatically injects clean styling directives.
            </p>
          </div>
        )}
      </div>

      {/* 6. Main Generate Button */}
      <div style={{ paddingTop: '8px' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '15px',
            borderRadius: 'var(--radius-md)',
            background: isGenerating
              ? 'var(--bg-active)'
              : 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
            color: '#ffffff',
            boxShadow: canGenerate && !isGenerating ? '0 4px 20px rgba(56, 189, 248, 0.35)' : 'none',
          }}
        >
          {isGenerating ? (
            <>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              Generating Technical Graphic...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Illustration
            </>
          )}
        </button>

        {!canGenerate && (
          <p style={{ fontSize: '11px', color: 'var(--text-dim)', textAlign: 'center', marginTop: '6px' }}>
            Enter a prompt above to activate generation.
          </p>
        )}
      </div>
    </div>
  );
};
