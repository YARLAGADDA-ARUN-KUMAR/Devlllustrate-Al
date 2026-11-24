import type { GenerationSettings, IllustrationCategory, IllustrationCreation, IllustrationStyle } from '../types';
import { generateTechnicalSvg } from './svgIllustrations';

export interface GenerationRequest {
  prompt: string;
  category: IllustrationCategory;
  style: IllustrationStyle;
  settings: GenerationSettings;
}

export interface ProgressCallback {
  (percentage: number, statusText: string): void;
}

// Future FastAPI Backend configuration endpoint
// When FastAPI is running, set this to true or configure via Vite environment variable
export const BACKEND_CONFIG = {
  useRealBackend: false,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  t4ColabUrl: import.meta.env.VITE_COLAB_BACKEND_URL || '',
};

/**
 * Generates technical illustration.
 * Currently runs a realistic client-side simulation with progressive denoising steps,
 * isolated and ready for seamless FastAPI backend swap.
 */
export async function generateIllustration(
  request: GenerationRequest,
  onProgress?: ProgressCallback
): Promise<IllustrationCreation> {
  const { prompt, category, style, settings } = request;

  if (!prompt.trim()) {
    throw new Error('Please enter a description for the illustration.');
  }

  // If connected to future backend:
  if (BACKEND_CONFIG.useRealBackend) {
    return await callFastApiBackend(request, onProgress);
  }

  // Realistic simulated diffusion pipeline
  const totalSteps = settings.inferenceSteps || 25;
  const stepDelayMs = 65; // realistic pacing ~1.8-2.5 seconds total

  const progressMilestones = [
    { pct: 5, msg: 'Initializing diffusion pipeline & CLIP text encoder...' },
    { pct: 15, msg: `Tokenizing prompt: "${prompt.slice(0, 32)}..."` },
    { pct: 25, msg: `Sampling Gaussian latent space (Seed: ${settings.seed})...` },
    { pct: 40, msg: `Euler Ancestral Denoising step 6/${totalSteps}...` },
    { pct: 55, msg: `Applying classifier-free guidance (scale: ${settings.guidanceScale})...` },
    { pct: 70, msg: `Euler Ancestral Denoising step 18/${totalSteps}...` },
    { pct: 85, msg: 'Decoding latents through Variational Autoencoder (VAE)...' },
    { pct: 95, msg: `Rendering ${style} graphic for ${category}...` },
    { pct: 100, msg: 'Technical graphic generation complete!' },
  ];

  for (const milestone of progressMilestones) {
    if (onProgress) {
      onProgress(milestone.pct, milestone.msg);
    }
    await new Promise((resolve) => setTimeout(resolve, stepDelayMs * 3));
  }

  // Parse width & height from dimension string (e.g. '1024x1024')
  const [w, h] = settings.dimensions.split('x').map(Number);

  // Generate vector graphic tailored to category and style
  const svgMarkup = generateTechnicalSvg({
    category,
    style,
    title: prompt.slice(0, 45),
    width: w,
    height: h,
    seed: settings.seed,
  });

  const creation: IllustrationCreation = {
    id: `ill_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: prompt.length > 50 ? `${prompt.slice(0, 47)}...` : prompt,
    prompt: prompt.trim(),
    category,
    style,
    method: settings.method,
    dimensions: settings.dimensions,
    inferenceSteps: settings.inferenceSteps,
    guidanceScale: settings.guidanceScale,
    seed: settings.seed,
    negativePrompt: settings.negativePrompt,
    createdAt: new Date().toISOString(),
    svgData: svgMarkup,
  };

  return creation;
}

/**
 * Placeholder for future FastAPI integration.
 * Will route to either hosted diffusion API or self-hosted Stable Diffusion v1.4 on Colab/Local GPU.
 */
async function callFastApiBackend(
  request: GenerationRequest,
  onProgress?: ProgressCallback
): Promise<IllustrationCreation> {
  onProgress?.(10, 'Connecting to FastAPI backend endpoint...');
  
  const response = await fetch(`${BACKEND_CONFIG.apiBaseUrl}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Helper to download an SVG string as a file in the browser.
 */
export function downloadSvgFile(svgContent: string, filename: string = 'technical-illustration.svg') {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper to download SVG rasterized as high-resolution PNG.
 */
export function downloadPngFromSvg(svgContent: string, filename: string = 'technical-illustration.png') {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width || 1024;
    canvas.height = img.height || 768;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  };

  img.src = url;
}
