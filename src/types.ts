export type ToolType =
  | 'move'
  | 'select'
  | 'direct_select'
  | 'wand'
  | 'lasso'
  | 'pen'
  | 'node'
  | 'brush'
  | 'pencil'
  | 'calligraphy'
  | 'shape_builder'
  | 'rectangle'
  | 'circle'
  | 'polygon'
  | 'bezier'
  | 'gradient'
  | 'mesh'
  | 'text'
  | 'perspective'
  | 'crop'
  | 'knife'
  | 'measure'
  | 'eyedropper'
  | 'color_picker'
  | 'clone'
  | 'healing'
  | 'blur'
  | 'sharpen'
  | 'smudge'
  | 'erase'
  | 'hand'
  | 'zoom'
  | 'orbit3d'
  | 'material_paint'
  | 'ai_designer';

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light';

export interface CanvasLayer {
  id: string;
  name: string;
  type: 'image' | 'vector' | 'text' | 'group' | 'pattern';
  visible: boolean;
  locked: boolean;
  opacity: number; // 0 to 100
  blendMode: BlendMode;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color?: string;
  content?: string; // Image URL or text string or SVG data
  fontFamily?: string;
  fontSize?: number;
  fill?: string;
  stroke?: string;
  thumbnail?: string;
}

export type ProductType =
  | 'tshirt'
  | 'mug'
  | 'tumbler'
  | 'pillow'
  | 'phonecase'
  | 'bottle'
  | 'puzzle'
  | 'mousepad'
  | 'keychain';

export interface ProductConfig {
  id: ProductType;
  name: string;
  category: string;
  dimensions: string;
  printArea: string;
  sublimationTemp: string;
  sublimationTime: string;
  icon: string;
  thumbnail: string;
}

export interface PatternItem {
  id: string;
  name: string;
  category: 'Tropical' | 'Floral' | 'Abstrato' | 'Geométrico' | 'Animal' | 'Textura';
  url: string;
  tags: string[];
}

export interface HistoryAction {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  type: 'create' | 'edit' | 'ai' | 'transform' | 'import' | 'effect';
}

export interface AIState {
  prompt: string;
  model: string;
  style: string;
  selectedColors: string[];
  isGenerating: boolean;
  enhancedPrompt?: string;
  variations: { id: string; url: string; title: string }[];
}

export interface ProjectMeta {
  name: string;
  width: number;
  height: number;
  unit: 'px' | 'mm' | 'cm' | 'in';
  dpi: number;
  colorMode: 'CMYK' | 'RGB';
  bleed: number; // mm
  safeMargin: number; // mm
  iccProfile: string;
}

export interface PrintSettings {
  mirrorMode: boolean;
  bleedMarks: boolean;
  cropMarks: boolean;
  paperSize: 'A4' | 'A3' | 'Roll 24"' | 'Roll 44"';
  dpi: number;
  iccProfile: string;
  printerName: string;
  copies: number;
}
