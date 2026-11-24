import React, { useState } from 'react';
import {
  Download,
  RotateCcw,
  Maximize2,
  BookmarkCheck,
  Bookmark,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  Cpu,
  Cloud,
  X,
} from 'lucide-react';
import type { IllustrationCreation } from '../types';
import { downloadPngFromSvg, downloadSvgFile } from '../services/generationService';

interface ImagePreviewProps {
  creation: IllustrationCreation | null;
  isGenerating: boolean;
  progress: number;
  statusMessage: string;
  onRegenerate: () => void;
  onSaveToCreations?: (creation: IllustrationCreation) => void;
  isSaved?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  creation,
  isGenerating,
  progress,
  statusMessage,
  onRegenerate,
  onSaveToCreations,
  isSaved = false,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadSvg = () => {
    if (!creation) return;
    const filename = `${creation.category}-${creation.style}-${creation.seed}.svg`;
    downloadSvgFile(creation.svgData, filename);
  };

  const handleDownloadPng = () => {
    if (!creation) return;
    const filename = `${creation.category}-${creation.style}-${creation.seed}.png`;
    downloadPngFromSvg(creation.svgData, filename);
  };

  const handleCopySvg = () => {
    if (!creation) return;
    navigator.clipboard.writeText(creation.svgData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="image-preview-panel glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '620px',
        position: 'sticky',
        top: '24px',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Illustration Preview
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {creation
              ? `${creation.category.replace(/-/g, ' ')} · ${creation.style}`
              : 'Real-time vector rendering output'}
          </p>
        </div>

        {creation && !isGenerating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onSaveToCreations && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onSaveToCreations(creation)}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck size={14} color="var(--accent-emerald)" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={14} />
                    Save to Gallery
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              className="btn-ghost"
              onClick={() => setIsZoomed(true)}
              title="Fullscreen Zoom"
              style={{ padding: '6px 8px' }}
            >
              <Maximize2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#070b12',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '440px',
        }}
      >
        {isGenerating ? (
          /* Realistic Generation Progress Animation */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '85%',
              maxWidth: '420px',
              textAlign: 'center',
              padding: '24px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                border: '1px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 0 24px rgba(56, 189, 248, 0.25)',
                animation: 'pulse 1.8s infinite ease-in-out',
              }}
            >
              <Layers size={32} color="var(--accent-cyan)" />
            </div>

            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Simulating Latent Diffusion
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--accent-cyan)', marginBottom: '20px', minHeight: '38px', fontFamily: 'var(--font-mono)' }}>
              {statusMessage || 'Sampling Gaussian noise...'}
            </p>

            {/* Progress bar */}
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.2s ease-out',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '10px',
                fontSize: '12px',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span>Latent Denoising</span>
              <span>{progress}%</span>
            </div>
          </div>
        ) : creation ? (
          /* Rendered SVG Illustration */
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              style={{
                width: '100%',
                maxHeight: '480px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              dangerouslySetInnerHTML={{ __html: creation.svgData }}
            />

            {/* Clearly marked demonstration tag */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(11, 17, 28, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={12} color="var(--accent-emerald)" />
              Demo Illustration Output
            </div>
          </div>
        ) : (
          /* Empty State */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '32px 24px',
              maxWidth: '360px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <ImageIcon size={28} color="var(--text-dim)" />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Your illustration will appear here.
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Enter a description and configure settings on the left to generate your first technical illustration.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Metadata & Action Controls */}
      {creation && !isGenerating && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Metadata badges */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {creation.method === 'stable-diffusion-v14' ? (
                <Cpu size={12} color="var(--accent-violet)" />
              ) : (
                <Cloud size={12} color="var(--accent-cyan)" />
              )}
              {creation.method === 'stable-diffusion-v14' ? 'SD v1.4 (T4 GPU)' : 'API Cloud'}
            </span>
            <span>•</span>
            <span>{creation.dimensions}</span>
            <span>•</span>
            <span>Steps: {creation.inferenceSteps}</span>
            <span>•</span>
            <span>CFG: {creation.guidanceScale}</span>
            <span>•</span>
            <span>Seed: #{creation.seed}</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '8px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleDownloadSvg}
              title="Download vector graphic"
              style={{ fontSize: '13px', padding: '10px 14px' }}
            >
              <Download size={15} />
              Download SVG
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleDownloadPng}
              title="Download rasterized PNG"
              style={{ fontSize: '13px', padding: '10px 14px' }}
            >
              <ImageIcon size={15} />
              Download PNG
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={onRegenerate}
              title="Regenerate with new random seed"
              style={{ padding: '10px 14px' }}
            >
              <RotateCcw size={15} />
              Regenerate
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleCopySvg}
              title="Copy SVG code to clipboard"
              style={{ padding: '10px 12px' }}
            >
              {copied ? <CheckCircle2 size={15} color="var(--accent-emerald)" /> : <FileCode size={15} />}
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Lightbox Modal */}
      {isZoomed && creation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(5, 8, 15, 0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
                {creation.title}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {creation.dimensions} · {creation.style} · Seed: #{creation.seed}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-secondary" onClick={handleDownloadSvg}>
                <Download size={14} /> Download SVG
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setIsZoomed(false)}
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
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
              overflow: 'auto',
              padding: '20px',
            }}
          >
            <div
              style={{ maxWidth: '1100px', width: '100%', maxHeight: '85vh' }}
              dangerouslySetInnerHTML={{ __html: creation.svgData }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
