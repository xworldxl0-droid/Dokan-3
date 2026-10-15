import { ImageAnalysisResult, ThumbnailGenerationParams } from '../types/thumbnail';

export interface ServerStatusResponse {
  status: string;
  hasApiKey: boolean;
  recommendedSpecs: {
    width: number;
    height: number;
    aspectRatio: string;
    maxFileSize: string;
    supportedFormats: string[];
  };
}

export async function checkServerStatus(): Promise<ServerStatusResponse> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn('Status check failed:', err);
    return {
      status: 'offline',
      hasApiKey: false,
      recommendedSpecs: {
        width: 1280,
        height: 720,
        aspectRatio: '16:9',
        maxFileSize: '20MB',
        supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
      },
    };
  }
}

export async function analyzeReferenceImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<ImageAnalysisResult> {
  const res = await fetch('/api/analyze-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || data.error || 'Failed to analyze reference image');
  }

  return data.analysis;
}

export async function enhancePromptWithAI(
  rawPrompt: string,
  style: string,
  topic?: string
): Promise<{
  enhancedPrompt: string;
  suggestedTitle: string;
  recommendedColorPalette: string;
  styleNotes: string;
}> {
  const res = await fetch('/api/enhance-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawPrompt, style, topic }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to enhance prompt');
  }

  return data.data;
}

export async function generateThumbnailAPI(params: ThumbnailGenerationParams): Promise<{
  imageUrl: string;
  metadata: any;
}> {
  const res = await fetch('/api/generate-thumbnail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || data.error || 'Failed to generate thumbnail image');
  }

  return data;
}
