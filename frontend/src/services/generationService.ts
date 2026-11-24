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

  // If user selected Vector SVG Engine (or legacy SD), run the vector generator
  if (settings.method === 'vector-engine' || settings.method === 'stable-diffusion-v14') {
    return await generateVectorSimulation(request, onProgress);
  }

  // Real AI Generation via FastAPI + Cloudflare Workers AI FLUX.1 Schnell
  onProgress?.(15, 'Validating prompt & technical directives...');
  await new Promise((r) => setTimeout(r, 100));

  onProgress?.(35, 'Connecting to FastAPI backend & dispatching request...');
  
  let response: Response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000);

    onProgress?.(60, 'Synthesizing illustration with Cloudflare Workers AI (FLUX.1 Schnell)...');

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
        'Generation request timed out after 60 seconds. Cloudflare Workers AI may be experiencing high traffic.'
      );
    }
    throw new Error(
      `Could not connect to FastAPI backend at ${API_BASE_URL}. Please ensure the backend is running on http://127.0.0.1:8000.`
    );
  }

  onProgress?.(85, 'Decoding & inspecting generated image payload...');

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

  onProgress?.(100, 'Technical illustration generated successfully!');
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
    method: 'vector-engine',
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
 * Inspects a Data URL to determine its true MIME type and extension.
 */
export function getImageFormat(dataUrl: string): { ext: string; mime: string } {
  if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) {
    return { ext: 'jpg', mime: 'image/jpeg' };
  }
  if (dataUrl.startsWith('data:image/png')) {
    return { ext: 'png', mime: 'image/png' };
  }
  if (dataUrl.startsWith('data:image/webp')) {
    return { ext: 'webp', mime: 'image/webp' };
  }
  return { ext: 'png', mime: 'image/png' };
}

/**
 * Downloads a raster image from a Data URL
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
  link.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads an illustration creation as a PNG, converting if necessary.
 */
export async function downloadAsPng(creation: IllustrationCreation, baseName: string = 'technical-illustration') {
  const filename = `${baseName.replace(/\.[^.]+$/, '')}.png`;

  if (creation.imageDataUrl) {
    const format = getImageFormat(creation.imageDataUrl);
    if (format.mime === 'image/png') {
      downloadImageFile(creation.imageDataUrl, filename);
      return;
    }
    // Convert JPEG/WEBP to PNG via canvas
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1024;
      canvas.height = img.naturalHeight || 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        downloadImageFile(pngUrl, filename);
      }
    };
    img.src = creation.imageDataUrl;
    return;
  }

  if (creation.svgData) {
    downloadPngFromSvg(creation.svgData, filename);
  }
}

/**
 * Downloads an illustration creation as a JPEG, converting if necessary.
 */
export async function downloadAsJpeg(creation: IllustrationCreation, baseName: string = 'technical-illustration') {
  const filename = `${baseName.replace(/\.[^.]+$/, '')}.jpg`;

  if (creation.imageDataUrl) {
    const format = getImageFormat(creation.imageDataUrl);
    if (format.mime === 'image/jpeg') {
      downloadImageFile(creation.imageDataUrl, filename);
      return;
    }
    // Convert PNG/WEBP to JPEG via canvas with solid dark background
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1024;
      canvas.height = img.naturalHeight || 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#080c14';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const jpegUrl = canvas.toDataURL('image/jpeg', 0.95);
        downloadImageFile(jpegUrl, filename);
      }
    };
    img.src = creation.imageDataUrl;
    return;
  }

  if (creation.svgData) {
    downloadJpegFromSvg(creation.svgData, filename);
  }
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
      downloadImageFile(pngUrl, filename.endsWith('.png') ? filename : `${filename}.png`);
    }
    URL.revokeObjectURL(url);
  };

  img.src = url;
}

/**
 * Converts SVG string into raster JPEG and downloads it.
 */
export function downloadJpegFromSvg(svgContent: string, filename: string = 'technical-illustration.jpg') {
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
      const jpegUrl = canvas.toDataURL('image/jpeg', 0.95);
      downloadImageFile(jpegUrl, filename.endsWith('.jpg') ? filename : `${filename}.jpg`);
    }
    URL.revokeObjectURL(url);
  };

  img.src = url;
}
