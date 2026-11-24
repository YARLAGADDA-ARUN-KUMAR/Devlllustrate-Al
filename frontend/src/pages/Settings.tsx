import React from 'react';
import {
  Cpu,
  Trash2,
  Terminal,
  Palette,
} from 'lucide-react';
import type { AppSettings, IllustrationStyle, ImageDimension } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearHistory: () => void;
  onResetDefaults: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onClearHistory,
  onResetDefaults,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '860px' }}>
      {/* 1. Inference Engine Defaults */}
      <section className="glass-card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cpu size={18} color="var(--accent-cyan)" />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Inference Engine Defaults
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Configure default generative models and hardware target preferences.
            </p>
          </div>
        </div>

        {/* Default Method */}
        <div className="form-group">
          <label className="form-label">Default Generation Method</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={() => onUpdateSettings({ defaultMethod: 'stable-diffusion-v14' })}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: settings.defaultMethod === 'stable-diffusion-v14' ? 'var(--bg-active)' : 'var(--bg-input)',
                border: settings.defaultMethod === 'stable-diffusion-v14' ? '1px solid var(--accent-violet)' : '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Stable Diffusion v1.4</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                Self-hosted PyTorch inference (Google Colab T4 / Local RTX 2050)
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ defaultMethod: 'api' })}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: settings.defaultMethod === 'api' ? 'var(--bg-active)' : 'var(--bg-input)',
                border: settings.defaultMethod === 'api' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '13.5px' }}>API Cloud Generation</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                External hosted diffusion model provider endpoint
              </div>
            </button>
          </div>
        </div>

        {/* Default Dimensions & Style */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Default Canvas Dimensions</label>
            <select
              className="form-input"
              value={settings.defaultDimensions}
              onChange={(e) => onUpdateSettings({ defaultDimensions: e.target.value as ImageDimension })}
              style={{ cursor: 'pointer' }}
            >
              <option value="512x512">512 × 512 (Standard Square)</option>
              <option value="768x768">768 × 768 (Medium Detail)</option>
              <option value="1024x1024">1024 × 1024 (High-Resolution Diagram)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Default Graphic Style</label>
            <select
              className="form-input"
              value={settings.defaultStyle}
              onChange={(e) => onUpdateSettings({ defaultStyle: e.target.value as IllustrationStyle })}
              style={{ cursor: 'pointer' }}
            >
              <option value="flat-vector">Flat Vector</option>
              <option value="isometric">Isometric</option>
              <option value="blueprint">Blueprint</option>
              <option value="minimalist">Minimalist</option>
              <option value="3d-technical">3D Technical</option>
              <option value="line-art">Line Art</option>
            </select>
          </div>
        </div>
      </section>

      {/* 2. Interface & Theme Preference */}
      <section className="glass-card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Palette size={18} color="var(--accent-violet)" />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Theme & Workspace Aesthetics
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Customize visual density, contrast, and color balance.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { id: 'studio-dark', title: 'Studio Dark', desc: 'Deep navy background with cyan & violet highlights' },
            { id: 'midnight-cyber', title: 'Midnight Cyber', desc: 'True charcoal with neon accents & high glow' },
            { id: 'contrast-dark', title: 'Contrast Tech', desc: 'Maximum contrast borders for diagram inspection' },
          ].map((theme) => {
            const isSelected = settings.themePreference === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onUpdateSettings({ themePreference: theme.id as any })}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--bg-active)' : 'var(--bg-input)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '13px' }}>{theme.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{theme.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Future FastAPI & GPU Integration Status */}
      <section className="glass-card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Terminal size={18} color="var(--accent-emerald)" />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Backend Integration Ready (FastAPI Architecture)
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Frontend is architected with modular service endpoints for FastAPI + Stable Diffusion v1.4.
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
          }}
        >
          <div>// Target FastAPI Endpoint Configuration</div>
          <div>VITE_API_BASE_URL=http://localhost:8000/api</div>
          <div>VITE_COLAB_BACKEND_URL=https://xxxx-t4.ngrok-free.app</div>
          <div style={{ color: 'var(--accent-emerald)', marginTop: '4px' }}>
            ✓ Stable Diffusion v1.4 tested on Google Colab T4 GPU
          </div>
          <div style={{ color: 'var(--accent-cyan)' }}>
            ✓ Local NVIDIA RTX 2050 CUDA verification ready
          </div>
        </div>
      </section>

      {/* 4. Danger Zone / History Clearing */}
      <section
        className="glass-card"
        style={{
          padding: '24px 28px',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--accent-rose)' }}>
            Storage & History Management
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Clear client-side localStorage creations cache or reset application defaults.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              if (confirm('Clear all stored illustrations from your browser?')) {
                onClearHistory();
              }
            }}
            style={{ color: 'var(--accent-rose)' }}
          >
            <Trash2 size={14} />
            Clear Illustration History
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={onResetDefaults}
          >
            Reset Settings to Defaults
          </button>
        </div>
      </section>
    </div>
  );
};
