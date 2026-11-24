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
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { IllustrationCreation } from '../types';
import {
  downloadAsPng,
  downloadAsJpeg,
  downloadSvgFile,
} from '../services/generationService';

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
  const [zoomScale, setZoomScale] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleDownloadPng = () => {
    if (!creation) return;
    const cleanTitle = creation.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadAsPng(creation, cleanTitle || 'technical-illustration');
  };

  const handleDownloadJpeg = () => {
    if (!creation) return;
    const cleanTitle = creation.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadAsJpeg(creation, cleanTitle || 'technical-illustration');
  };

  const handleDownloadSvg = () => {
    if (!creation || !creation.svgData) return;
    const cleanTitle = creation.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadSvgFile(creation.svgData, `${cleanTitle}.svg`);
  };

  const handleCopySvg = () => {
    if (!creation?.svgData) return;
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
              : 'Real-time generative model output'}
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
              Cloudflare Workers AI
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--accent-cyan)', marginBottom: '20px', minHeight: '38px', fontFamily: 'var(--font-mono)' }}>
              {statusMessage || 'Connecting to FLUX.1 Schnell model...'}
            </p>

            {/* Indeterminate or staged progress bar */}
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
                  width: `${Math.max(10, progress)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.3s ease-out',
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
              <span>FLUX.1 Schnell Inference</span>
              <span>{progress}%</span>
            </div>
          </div>
        ) : creation ? (
          /* Rendered Result: Either Raster AI Image or Vector SVG */
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
            {creation.imageDataUrl ? (
              <img
                src={creation.imageDataUrl}
                alt={creation.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '480px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                }}
              />
            ) : creation.svgData ? (
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
            ) : null}

            {/* AI Model Badge */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(11, 17, 28, 0.88)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                color: creation.isAIGenerated !== false ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {creation.isAIGenerated !== false ? (
                <>
                  <Sparkles size={12} color="var(--accent-cyan)" />
                  FLUX.1 Schnell AI Output
                </>
              ) : (
                <>
                  <CheckCircle2 size={12} color="var(--accent-emerald)" />
                  Vector Diagram Preview
                </>
              )}
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
              Enter a description and configure settings on the left to generate real AI technical graphics using Cloudflare Workers AI.
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
              {creation.isAIGenerated !== false ? 'Cloudflare Workers AI (FLUX.1)' : 'Vector Engine'}
            </span>
            <span>•</span>
            <span>{creation.dimensions}</span>
            <span>•</span>
            <span>Steps: {creation.inferenceSteps}</span>
            <span>•</span>
            <span>Seed: #{creation.seed}</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleDownloadPng}
              title="Download high-resolution image as PNG"
              style={{ flex: 1, minWidth: '110px', fontSize: '12.5px', padding: '9px 12px' }}
            >
              <Download size={14} />
              PNG
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleDownloadJpeg}
              title="Download high-resolution image as JPEG"
              style={{ flex: 1, minWidth: '110px', fontSize: '12.5px', padding: '9px 12px' }}
            >
              <Download size={14} />
              JPEG
            </button>

            {creation.svgData && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleDownloadSvg}
                title="Download raw SVG vector graphic"
                style={{ fontSize: '12.5px', padding: '9px 12px' }}
              >
                SVG
              </button>
            )}

            <button
              type="button"
              className="btn-secondary"
              onClick={onRegenerate}
              title="Regenerate with new random seed"
              style={{ padding: '9px 12px' }}
            >
              <RotateCcw size={14} />
              Redo
            </button>

            {creation.svgData && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCopySvg}
                title="Copy SVG code to clipboard"
                style={{ padding: '9px 12px' }}
              >
                {copied ? <CheckCircle2 size={14} color="var(--accent-emerald)" /> : <FileCode size={14} />}
              </button>
            )}
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
            backgroundColor: 'rgba(5, 8, 15, 0.94)',
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
              flexWrap: 'wrap',
              gap: '12px',
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Zoom Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2px 6px',
                  marginRight: '8px',
                }}
              >
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.25))}
                  title="Zoom Out"
                  style={{ padding: '4px 6px' }}
                >
                  <ZoomOut size={15} />
                </button>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', minWidth: '42px', textAlign: 'center' }}>
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setZoomScale((z) => Math.min(3, z + 0.25))}
                  title="Zoom In"
                  style={{ padding: '4px 6px' }}
                >
                  <ZoomIn size={15} />
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setZoomScale(1)}
                  style={{ fontSize: '11px', padding: '4px 6px' }}
                >
                  Reset
                </button>
              </div>

              <button type="button" className="btn-primary" onClick={handleDownloadPng} style={{ fontSize: '12px', padding: '6px 12px' }}>
                <Download size={13} /> PNG
              </button>
              <button type="button" className="btn-secondary" onClick={handleDownloadJpeg} style={{ fontSize: '12px', padding: '6px 12px' }}>
                <Download size={13} /> JPEG
              </button>
              {creation.svgData && (
                <button type="button" className="btn-secondary" onClick={handleDownloadSvg} style={{ fontSize: '12px', padding: '6px 12px' }}>
                  SVG
                </button>
              )}
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setIsZoomed(false);
                  setZoomScale(1);
                }}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  padding: 0,
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
              overflow: 'auto',
              padding: '20px',
            }}
          >
            {creation.imageDataUrl ? (
              <img
                src={creation.imageDataUrl}
                alt={creation.title}
                style={{
                  maxWidth: zoomScale === 1 ? '90vw' : 'none',
                  maxHeight: zoomScale === 1 ? '82vh' : 'none',
                  transform: `scale(${zoomScale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                }}
              />
            ) : creation.svgData ? (
              <div
                style={{
                  maxWidth: '1100px',
                  width: '100%',
                  maxHeight: '85vh',
                  transform: `scale(${zoomScale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                }}
                dangerouslySetInnerHTML={{ __html: creation.svgData }}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
