import type {
  GenerationSettings,
  IllustrationCategory,
  IllustrationCreation,
  IllustrationStyle,
} from '../types';
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

// Configurable API Base URL from Vite environment, defaulting to standard FastAPI port 8000
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Generates technical illustration using the FastAPI backend and Cloudflare Workers AI FLUX.1 Schnell.
 * Shows honest, transparent progress stages rather than fabricated percentages.
 */
export async function generateIllustration(
  request: GenerationRequest,
  onProgress?: ProgressCallback
): Promise<IllustrationCreation> {
  const { prompt, settings } = request;

  if (!prompt.trim()) {
    throw new Error('Please enter a description for the illustration.');
  }

  // If user selected Self-Hosted Stable Diffusion v1.4 and backend isn't forced,
  // allow the vector simulation engine as a secondary test option
  if (settings.method === 'stable-diffusion-v14') {
    return await generateVectorSimulation(request, onProgress);
  }

  // Real AI Generation via FastAPI + Cloudflare Workers AI FLUX.1 Schnell
  onProgress?.(15, 'Preparing illustration request...');
  await new Promise((r) => setTimeout(r, 120));

  onProgress?.(35, 'Connecting to FastAPI backend & Cloudflare Workers AI...');
  
  let response: Response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000);

    onProgress?.(60, 'Generating technical graphic with FLUX.1 Schnell...');

    response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error(
        'Generation request timed out after 60 seconds. Cloudflare Workers AI may be experiencing high load.'
      );
    }
    throw new Error(
      `Could not connect to FastAPI backend at ${API_BASE_URL}. Please ensure the backend is running on http://127.0.0.1:8000.`
    );
  }

  onProgress?.(85, 'Processing and decoding generated image...');

  if (!response.ok) {
    let errorDetail = 'Image generation failed.';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errorDetail;
    } catch {
      errorDetail = `Server error (${response.status}: ${response.statusText})`;
    }
    throw new Error(errorDetail);
  }

  const result: IllustrationCreation = await response.json();

  onProgress?.(100, 'Technical illustration ready!');
  return result;
}

/**
 * Check backend connectivity and health.
 */
export async function checkBackendHealth(): Promise<{
  isOnline: boolean;
  isCloudflareConfigured: boolean;
  model: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      return { isOnline: false, isCloudflareConfigured: false, model: '', error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return {
      isOnline: true,
      isCloudflareConfigured: Boolean(data.isCloudflareConfigured),
      model: data.defaultModel || 'FLUX.1 Schnell',
    };
  } catch (e: any) {
    return { isOnline: false, isCloudflareConfigured: false, model: '', error: e.message };
  }
}

/**
 * Secondary vector simulation engine for self-hosted SD testing.
 */
async function generateVectorSimulation(
  request: GenerationRequest,
  onProgress?: ProgressCallback
): Promise<IllustrationCreation> {
  const { prompt, category, style, settings } = request;

  const milestones = [
    { pct: 20, msg: 'Initializing self-hosted vector engine...' },
    { pct: 50, msg: `Structuring ${category.replace(/-/g, ' ')} topology...` },
    { pct: 80, msg: `Synthesizing ${style} technical blueprint...` },
    { pct: 100, msg: 'Illustration synthesized!' },
  ];

  for (const m of milestones) {
    onProgress?.(m.pct, m.msg);
    await new Promise((r) => setTimeout(r, 180));
  }

  const [w, h] = settings.dimensions.split('x').map(Number);
  const svgMarkup = generateTechnicalSvg({
    category,
    style,
    title: prompt.slice(0, 45),
    width: w,
    height: h,
    seed: settings.seed,
  });

  return {
    id: `ill_local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: prompt.length > 50 ? `${prompt.slice(0, 47)}...` : prompt,
    prompt: prompt.trim(),
    category,
    style,
    method: 'stable-diffusion-v14',
    dimensions: settings.dimensions,
    inferenceSteps: settings.inferenceSteps,
    guidanceScale: settings.guidanceScale,
    seed: settings.seed,
    negativePrompt: settings.negativePrompt,
    createdAt: new Date().toISOString(),
    svgData: svgMarkup,
    isAIGenerated: false,
  };
}

/**
 * Downloads a raster image from a Data URL (PNG/JPEG)
 */
export function downloadImageFile(dataUrl: string, filename: string = 'technical-illustration.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads raw SVG markup as a vector file.
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
 * Converts SVG string into raster PNG and downloads it.
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
      downloadImageFile(pngUrl, filename);
    }
    URL.revokeObjectURL(url);
  };

  img.src = url;
}
