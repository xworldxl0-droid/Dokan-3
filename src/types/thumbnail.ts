export type ThumbnailStyle =
  | 'cinematic'
  | 'gaming'
  | 'technology'
  | 'business'
  | 'reaction'
  | 'educational'
  | 'travel'
  | 'islamic'
  | 'minimal';

export type SubjectPlacement = 'right' | 'left' | 'center' | 'rule_of_thirds';

export type TextPosition = 'top-left' | 'bottom-left' | 'top-right' | 'center-top' | 'custom';

export type TextFont = 'Bebas Neue' | 'Oswald' | 'Montserrat' | 'Plus Jakarta Sans';

export interface TextOverlayConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  font: TextFont;
  titleSize: number; // in pt / relative
  subtitleSize: number;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
  glowColor: string;
  glowRadius: number;
  badgeStyle: 'none' | 'box' | 'highlight' | 'gradient';
  badgeColor: string;
  position: TextPosition;
  customX?: number; // 0 - 100 percentage
  customY?: number;
  rotation?: number; // -15 to +15 deg
  badgeText?: string; // e.g. "NEW", "TOP 10", "SECRET"
  badgeEnabled?: boolean;
}

export interface ThumbnailGenerationParams {
  mode: 'prompt' | 'image' | 'both';
  prompt: string;
  topic?: string;
  style: ThumbnailStyle;
  colorPalette: string;
  backgroundStyle: string;
  subjectPlacement: SubjectPlacement;
  includeTextInImage: boolean;
  titleText: string;
  referenceImage: string | null; // base64
  referenceMimeType?: string;
  preserveSubject: boolean;
  language: string;
}

export interface ImageAnalysisResult {
  subjectDescription: string;
  keyFeaturesToPreserve: string[];
  compositionAdvice: string;
  suggestedBackground: string;
  suggestedTitles: string[];
  suggestedStyle: ThumbnailStyle;
  colorPaletteAdvice: string;
}

export interface GeneratedThumbnailItem {
  id: string;
  imageUrl: string;
  timestamp: number;
  prompt: string;
  style: ThumbnailStyle;
  textConfig: TextOverlayConfig;
  referenceImageUsed?: boolean;
  titleText?: string;
}
