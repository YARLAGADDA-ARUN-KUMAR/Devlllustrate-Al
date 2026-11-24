import React, { useState } from 'react';
import type {
  GenerationSettings as ISettings,
  IllustrationCategory,
  IllustrationCreation,
  IllustrationStyle,
} from '../types';
import { PromptEditor } from '../components/PromptEditor';
import { CategorySelector } from '../components/CategorySelector';
import { StyleSelector } from '../components/StyleSelector';
import { GenerationSettings } from '../components/GenerationSettings';
import { ImagePreview } from '../components/ImagePreview';
import { generateIllustration } from '../services/generationService';

interface GenerateProps {
  initialPrompt?: string;
  initialCategory?: IllustrationCategory;
  initialStyle?: IllustrationStyle;
  initialSettings?: Partial<ISettings>;
  initialCreation?: IllustrationCreation | null;
  onSaveCreation: (creation: IllustrationCreation) => void;
  savedCreationIds: Set<string>;
}

export const Generate: React.FC<GenerateProps> = ({
  initialPrompt = '',
  initialCategory = 'software-architecture',
  initialStyle = 'flat-vector',
  initialSettings,
  initialCreation = null,
  onSaveCreation,
  savedCreationIds,
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      initialCreation?.prompt ||
      'A modern software architecture diagram showing a React frontend communicating with a FastAPI backend and a MySQL database with Redis caching.'
  );
  const [category, setCategory] = useState<IllustrationCategory>(initialCreation?.category || initialCategory);
  const [style, setStyle] = useState<IllustrationStyle>(initialCreation?.style || initialStyle);

  const [settings, setSettings] = useState<ISettings>({
    method: initialCreation?.method || initialSettings?.method || 'diagram-ai',
    dimensions: initialCreation?.dimensions || initialSettings?.dimensions || '1024x1024',
    inferenceSteps: initialCreation?.inferenceSteps || initialSettings?.inferenceSteps || 4,
    guidanceScale: initialCreation?.guidanceScale || initialSettings?.guidanceScale || 7.5,
    seed: initialCreation?.seed || initialSettings?.seed || 48291,
    negativePrompt: initialCreation?.negativePrompt || initialSettings?.negativePrompt || '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentCreation, setCurrentCreation] = useState<IllustrationCreation | null>(initialCreation || null);

  const samplePrompts = [
    'A high-availability Kubernetes cluster architecture with ingress nginx, microservice pods, stateful database sets, and Prometheus observability.',
    'A Zero-Trust cybersecurity perimeter showing public internet gateway, WAF firewall layer, mTLS mutual authentication, and encrypted KMS HSM enclave.',
    'A distributed database cluster showing Raft consensus protocol heartbeat between Leader and Follower nodes, Write-Ahead Logs (WAL), and hash ring sharding.',
    'Multi-region Google Cloud Platform topology with Cloud Armor, Global External HTTPS Load Balancer, VPC peering, and Cloud Spanner synchronous database.',
    'Deep learning Stable Diffusion neural pipeline showing text prompt CLIP tokenization, latent Gaussian noise space, UNet cross-attention denoising, and VAE decoder.',
  ];

  const handleSamplePrompt = () => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setPrompt(randomPrompt);
  };

  const handleUpdateSettings = (updated: Partial<ISettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setProgress(0);
    setErrorMessage(null);
    setStatusMessage('Initializing diffusion pipeline...');

    try {
      const creation = await generateIllustration(
        {
          prompt,
          category,
          style,
          settings,
        },
        (pct, msg) => {
          setProgress(pct);
          setStatusMessage(msg);
        }
      );

      setCurrentCreation(creation);
      // Auto-save to gallery
      onSaveCreation(creation);
    } catch (err: any) {
      setErrorMessage(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    const newSeed = Math.floor(Math.random() * 900000) + 100000;
    setSettings((prev) => ({ ...prev, seed: newSeed }));
    setTimeout(() => {
      handleGenerate();
    }, 50);
  };

  const isSaved = currentCreation ? savedCreationIds.has(currentCreation.id) : false;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(420px, 1.1fr) minmax(460px, 1fr)',
        gap: '24px',
        alignItems: 'start',
      }}
      className="generation-workspace-grid"
    >
      {/* Left Panel: Generation Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {errorMessage && (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              fontSize: '13px',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <strong style={{ color: '#ef4444', display: 'block', marginBottom: '2px' }}>
                Generation Failed
              </strong>
              {errorMessage}
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '0 4px',
              }}
              title="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <PromptEditor
          prompt={prompt}
          onChange={setPrompt}
          onClear={() => setPrompt('')}
          onSample={handleSamplePrompt}
          disabled={isGenerating}
        />

        <CategorySelector
          selected={category}
          onSelect={setCategory}
          disabled={isGenerating}
        />

        <StyleSelector
          selected={style}
          onSelect={setStyle}
          disabled={isGenerating}
        />

        <GenerationSettings
          settings={settings}
          onChange={handleUpdateSettings}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          canGenerate={prompt.trim().length > 0}
        />
      </div>

      {/* Right Panel: Image / Diagram Preview Canvas */}
      <div>
        <ImagePreview
          creation={currentCreation}
          isGenerating={isGenerating}
          progress={progress}
          statusMessage={statusMessage}
          onRegenerate={handleRegenerate}
          onSaveToCreations={onSaveCreation}
          onDiagramChange={(updatedDiagram) => {
            setCurrentCreation((prev) => (prev ? { ...prev, diagramData: updatedDiagram } : null));
          }}
          isSaved={isSaved}
        />
      </div>
    </div>
  );
};
