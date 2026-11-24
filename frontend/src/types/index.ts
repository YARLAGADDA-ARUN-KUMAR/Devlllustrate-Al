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

export type GenerationMethod = 'diagram-ai' | 'api' | 'vector-engine' | 'stable-diffusion-v14';

export type ImageDimension = '512x512' | '768x768' | '1024x1024';

export type DiagramNodeType =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'cache'
  | 'queue'
  | 'gateway'
  | 'service'
  | 'auth'
  | 'storage'
  | 'network'
  | 'firewall'
  | 'security'
  | 'ai_model'
  | 'process'
  | 'kernel'
  | 'user'
  | 'external'
  | 'generic';

export type DiagramNodeShape =
  | 'rectangle'
  | 'cylinder'
  | 'cloud'
  | 'diamond'
  | 'hexagon'
  | 'circle'
  | 'rounded';

export interface DiagramNodeData {
  id: string;
  label: string;
  type: DiagramNodeType;
  description?: string;
  group?: string;
  shape?: DiagramNodeShape;
  color?: string;
  icon?: string;
  isEditing?: boolean;
}

export interface DiagramEdgeData {
  id?: string;
  source: string;
  target: string;
  label?: string;
  direction?: 'unidirectional' | 'bidirectional' | 'none';
  style?: 'solid' | 'dashed' | 'dotted';
  animated?: boolean;
}

export interface DiagramDefinition {
  title: string;
  diagram_type: string;
  description?: string;
  nodes: DiagramNodeData[];
  edges: DiagramEdgeData[];
  layout_direction?: 'TB' | 'LR' | 'RL' | 'BT';
}

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
  // Multi-format support:
  // 1. Structured Diagram Data (Interactive, editable graph)
  diagramData?: DiagramDefinition;
  // 2. Raster AI-generated image (FLUX.1 Schnell)
  imageDataUrl?: string;
  imageMimeType?: string;
  // 3. Vector SVG representation
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
