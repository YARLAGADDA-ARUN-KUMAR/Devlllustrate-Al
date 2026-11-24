export type IllustrationCategory =
  | 'software-architecture'
  | 'cloud-computing'
  | 'database-systems'
  | 'cybersecurity'
  | 'artificial-intelligence'
  | 'networking'
  | 'operating-systems'
  | 'general';

export type IllustrationStyle =
  | 'flat-vector'
  | 'isometric'
  | 'blueprint'
  | 'minimalist'
  | '3d-technical'
  | 'line-art';

export type GenerationMethod = 'api' | 'stable-diffusion-v14';

export type ImageDimension = '512x512' | '768x768' | '1024x1024';

export interface GenerationSettings {
  method: GenerationMethod;
  dimensions: ImageDimension;
  inferenceSteps: number;
  guidanceScale: number;
  seed: number;
  negativePrompt: string;
}

export interface IllustrationCreation {
  id: string;
  title: string;
  prompt: string;
  category: IllustrationCategory;
  style: IllustrationStyle;
  method: GenerationMethod;
  dimensions: ImageDimension;
  inferenceSteps: number;
  guidanceScale: number;
  seed: number;
  negativePrompt?: string;
  createdAt: string;
  // Hybrid support: both raster AI-generated images and legacy/vector SVGs
  imageDataUrl?: string;
  imageMimeType?: string;
  svgData?: string;
  isAIGenerated?: boolean;
  enhancedPrompt?: string;
  model?: string;
  isFavorite?: boolean;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: IllustrationCategory;
  style: IllustrationStyle;
  description: string;
  prompt: string;
  recommendedDimensions: ImageDimension;
  recommendedSteps: number;
  recommendedGuidance: number;
  svgPreview: string;
}

export interface AppSettings {
  defaultMethod: GenerationMethod;
  defaultStyle: IllustrationStyle;
  defaultDimensions: ImageDimension;
  defaultSteps: number;
  defaultGuidance: number;
  themePreference: 'studio-dark' | 'midnight-cyber' | 'contrast-dark';
  enableSoundEffects: boolean;
  autoSaveToCreations: boolean;
}

export type NavigationPage =
  | 'dashboard'
  | 'generate'
  | 'creations'
  | 'templates'
  | 'settings'
  | 'help';
