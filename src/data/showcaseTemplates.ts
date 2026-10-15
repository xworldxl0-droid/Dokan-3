import { GeneratedThumbnailItem, ThumbnailStyle } from '../types/thumbnail';

export interface ShowcaseTemplate {
  id: string;
  title: string;
  category: ThumbnailStyle;
  badge: string;
  imageUrl: string;
  prompt: string;
  style: ThumbnailStyle;
  colorPalette: string;
  backgroundStyle: string;
  subjectPlacement: 'right' | 'left' | 'center' | 'rule_of_thirds';
  textConfig: {
    enabled: boolean;
    title: string;
    subtitle: string;
    font: 'Bebas Neue' | 'Oswald' | 'Montserrat' | 'Plus Jakarta Sans';
    titleSize: number;
    subtitleSize: number;
    textColor: string;
    strokeColor: string;
    strokeWidth: number;
    glowColor: string;
    glowRadius: number;
    badgeStyle: 'none' | 'box' | 'highlight' | 'gradient';
    badgeColor: string;
    position: 'top-left' | 'bottom-left' | 'top-right' | 'center-top' | 'custom';
    rotation?: number;
    badgeText?: string;
    badgeEnabled?: boolean;
  };
}

export const SHOWCASE_TEMPLATES: ShowcaseTemplate[] = [
  {
    id: 'template-tech-ai',
    title: 'Gen-4 AI Breakdown',
    category: 'technology',
    badge: 'TECH / HARDWARE',
    imageUrl: '/src/assets/images/thumb_tech_ai_1792084439138.jpg',
    prompt: 'Professional YouTube thumbnail for a high-tech AI review video, dramatic blue and amber studio rim lighting, futuristic holographic devices, high contrast, sharp mobile readability, 8k commercial quality, 16:9 aspect ratio',
    style: 'technology',
    colorPalette: 'Cyan & Amber Rim Light',
    backgroundStyle: 'Futuristic Dark Lab with Holographic Data',
    subjectPlacement: 'right',
    textConfig: {
      enabled: true,
      title: 'ULTIMATE AI\nREVOLUTION?',
      subtitle: 'GEN-4 MODEL TESTED',
      font: 'Bebas Neue',
      titleSize: 58,
      subtitleSize: 24,
      textColor: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 4,
      glowColor: 'rgba(56, 189, 248, 0.6)',
      glowRadius: 10,
      badgeStyle: 'highlight',
      badgeColor: '#0284c7',
      position: 'top-left',
      badgeText: '9.8 / 10',
      badgeEnabled: true,
      rotation: -1,
    },
  },
  {
    id: 'template-gaming',
    title: 'Insane Clutch Battle',
    category: 'gaming',
    badge: 'GAMING / ESPORTS',
    imageUrl: '/src/assets/images/thumb_gaming_battle_1792084440304.jpg',
    prompt: 'Vibrant gaming YouTube thumbnail with an excited gamer streamer silhouette, neon purple and green backlighting, intense battle scene backdrop, explosive particle effects, 16:9 aspect ratio, high visual punch',
    style: 'gaming',
    colorPalette: 'Neon Purple & Toxic Lime',
    backgroundStyle: 'Explosive Battlefield & Particle Sparks',
    subjectPlacement: 'center',
    textConfig: {
      enabled: true,
      title: 'INSANE\nCLUTCH!!',
      subtitle: 'WORLD RECORD WIN',
      font: 'Montserrat',
      titleSize: 52,
      subtitleSize: 22,
      textColor: '#bef264',
      strokeColor: '#000000',
      strokeWidth: 5,
      glowColor: 'rgba(168, 85, 247, 0.8)',
      glowRadius: 14,
      badgeStyle: 'box',
      badgeColor: '#9333ea',
      position: 'top-left',
      badgeText: 'NEW RECORD',
      badgeEnabled: true,
      rotation: -2,
    },
  },
  {
    id: 'template-travel',
    title: 'Solo Alpine Expedition',
    category: 'travel',
    badge: 'TRAVEL / CINEMATIC',
    imageUrl: '/src/assets/images/thumb_travel_cinematic_1792084439944.jpg',
    prompt: 'Cinematic travel documentary YouTube thumbnail, dramatic mountain peaks in golden hour sunlight, backpacker standing on cliff edge gazing into the misty valley, high dynamic range, rich warm colors, 16:9 aspect ratio',
    style: 'travel',
    colorPalette: 'Golden Hour & Deep Sapphire',
    backgroundStyle: 'Majestic Alpine Peaks with Sea of Clouds',
    subjectPlacement: 'right',
    textConfig: {
      enabled: true,
      title: 'I SURVIVED 48H\nALONE HERE',
      subtitle: 'SWISS ALPS EXPEDITION',
      font: 'Oswald',
      titleSize: 50,
      subtitleSize: 20,
      textColor: '#fef08a',
      strokeColor: '#0f172a',
      strokeWidth: 4,
      glowColor: 'rgba(234, 88, 12, 0.5)',
      glowRadius: 8,
      badgeStyle: 'box',
      badgeColor: '#ea580c',
      position: 'top-left',
      badgeText: 'DOCUMENTARY',
      badgeEnabled: true,
      rotation: 0,
    },
  },
  {
    id: 'template-business',
    title: 'Market Wealth Code',
    category: 'business',
    badge: 'BUSINESS / FINANCE',
    imageUrl: '/src/assets/images/thumb_business_finance_1792084440661.jpg',
    prompt: 'High-contrast business finance YouTube thumbnail, clean modern studio aesthetic, confident professional pointing toward rising holographic market chart, emerald and gold lighting accents, 16:9 aspect ratio',
    style: 'business',
    colorPalette: 'Emerald Glow & Matte Slate',
    backgroundStyle: 'Modern Executive Studio with Growth Chart',
    subjectPlacement: 'left',
    textConfig: {
      enabled: true,
      title: 'THE $1M\nBLUEPRINT',
      subtitle: 'HOW THE 1% INVEST IN 2026',
      font: 'Bebas Neue',
      titleSize: 56,
      subtitleSize: 22,
      textColor: '#ffffff',
      strokeColor: '#022c22',
      strokeWidth: 4,
      glowColor: 'rgba(16, 185, 129, 0.6)',
      glowRadius: 10,
      badgeStyle: 'highlight',
      badgeColor: '#059669',
      position: 'top-right',
      badgeText: 'MUST WATCH',
      badgeEnabled: true,
      rotation: 1,
    },
  },
];
