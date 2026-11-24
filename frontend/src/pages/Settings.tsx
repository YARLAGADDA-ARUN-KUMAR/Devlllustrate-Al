import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Trash2,
  Terminal,
  Palette,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import type { AppSettings, IllustrationStyle, ImageDimension } from '../types';
import { checkBackendHealth } from '../services/generationService';

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
  const [backendHealth, setBackendHealth] = useState<{
    isOnline: boolean;
    isCloudflareConfigured: boolean;
    model: string;
    checked: boolean;
  }>({
    isOnline: false,
    isCloudflareConfigured: false,
    model: '',
    checked: false,
  });
  const [checking, setChecking] = useState(false);

  const performHealthCheck = async () => {
    setChecking(true);
    const result = await checkBackendHealth();
    setBackendHealth({
      isOnline: result.isOnline,
      isCloudflareConfigured: result.isCloudflareConfigured,
      model: result.model,
      checked: true,
    });
    setChecking(false);
  };

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((result) => {
      if (isMounted) {
        setBackendHealth({
          isOnline: result.isOnline,
          isCloudflareConfigured: result.isCloudflareConfigured,
          model: result.model,
          checked: true,
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '860px' }}>
      {/* 1. Live Backend & Cloudflare Workers AI Status */}
      <section className="glass-card" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: backendHealth.isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Terminal size={18} color={backendHealth.isOnline ? 'var(--accent-emerald)' : 'var(--accent-rose)'} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                FastAPI Backend & Cloudflare AI Status
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Real-time connection check with your local FastAPI server.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={performHealthCheck}
            disabled={checking}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <RefreshCw size={13} className={checking ? 'spin' : ''} />
            Check Connection
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginTop: '4px',
          }}
        >
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {backendHealth.isOnline ? (
              <CheckCircle2 size={18} color="var(--accent-emerald)" />
            ) : (
              <AlertCircle size={18} color="var(--accent-rose)" />
            )}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>FastAPI Server</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                {backendHealth.isOnline ? 'Online (http://127.0.0.1:8000)' : 'Not Connected'}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {backendHealth.isCloudflareConfigured ? (
              <CheckCircle2 size={18} color="var(--accent-emerald)" />
            ) : (
              <AlertCircle size={18} color="var(--accent-amber)" />
            )}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Workers AI Credentials</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                {backendHealth.isCloudflareConfigured
                  ? 'Configured in backend/.env'
                  : 'Missing credentials in backend/.env'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Inference Engine Defaults */}
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
              <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Cloudflare Workers AI (Recommended)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                FLUX.1 Schnell 4-step distilled diffusion transformer
              </div>
            </button>

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
              <div style={{ fontWeight: 600, fontSize: '13.5px' }}>Self-Hosted / Vector Engine</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                Local synthetic vector diagram generator
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

      {/* 3. Interface & Theme Preference */}
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
            Clear client-side IndexedDB creations cache or reset application defaults.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              if (confirm('Clear all stored illustrations from your browser database?')) {
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
