import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Helper to get GoogleGenAI client with required header
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Health and Configuration check
app.get('/api/status', (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    recommendedSpecs: {
      width: 1280,
      height: 720,
      aspectRatio: '16:9',
      maxFileSize: '20MB',
      supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    },
  });
});

// 2. Vision analysis for uploaded reference image
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    const ai = getGenAI();
    if (!ai) {
      res.status(503).json({
        error: 'API_KEY_MISSING',
        message: 'GEMINI_API_KEY is not configured on the server. Please configure it in Settings > Secrets.',
      });
      return;
    }

    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: 'MISSING_IMAGE', message: 'No image provided for analysis.' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `You are a world-class YouTube thumbnail director and visual strategist (analyzing MrBeast, Veritaseum, Ali Abdaal, MKBHD thumbnails).
Analyze this uploaded reference image for a YouTube thumbnail production.
Return JSON with the following exact keys:
- "subjectDescription": (Concise 1-2 sentence description of the person/object, their expression, and unique features)
- "keyFeaturesToPreserve": (Array of 3-5 specific traits to preserve, e.g. "curly brown hair", "yellow hoodie", "shocked eye contact", "black camera body")
- "compositionAdvice": (Where to position this subject on a 16:9 canvas to leave room for high-contrast titles and avoid the bottom-right timestamp badge)
- "suggestedBackground": (Ideal background concept to maximize contrast against the subject)
- "suggestedTitles": (Array of 3 short, punchy 2-4 word high-CTR text overlay phrases)
- "suggestedStyle": (Best matching style out of: cinematic, gaming, business, technology, reaction, educational, travel, minimal, islamic)
- "colorPaletteAdvice": (Complementary high-contrast color scheme)

Respond ONLY with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(textOutput);
    } catch {
      parsed = {
        subjectDescription: 'Reference subject detected in image',
        keyFeaturesToPreserve: ['Main subject silhouette', 'Facial expression', 'Core branding'],
        compositionAdvice: 'Position subject on the right 2/3 of 16:9 canvas, leaving the left for title text.',
        suggestedBackground: 'Vibrant studio background with dramatic rim lighting',
        suggestedTitles: ['UNBELIEVABLE!', 'THE TRUTH', 'WATCH THIS FIRST'],
        suggestedStyle: 'technology',
        colorPaletteAdvice: 'High contrast cyan and warm amber',
      };
    }

    res.json({ success: true, analysis: parsed });
  } catch (err: any) {
    console.error('Image analysis error:', err);
    res.status(500).json({
      error: 'ANALYSIS_FAILED',
      message: err.message || 'Failed to analyze reference image',
    });
  }
});

// 3. AI Prompt Enhancer for YouTube Thumbnails
app.post('/api/enhance-prompt', async (req: Request, res: Response) => {
  try {
    const ai = getGenAI();
    if (!ai) {
      res.status(503).json({
        error: 'API_KEY_MISSING',
        message: 'GEMINI_API_KEY is not configured on the server.',
      });
      return;
    }

    const { rawPrompt, style = 'cinematic', topic = '' } = req.body;
    if (!rawPrompt && !topic) {
      res.status(400).json({ error: 'MISSING_PROMPT', message: 'Please provide a topic or prompt.' });
      return;
    }

    const systemInstruction = `You are an elite YouTube thumbnail designer. Transform user ideas into hyper-detailed prompts optimized for generating stunning 1280x720 YouTube thumbnails.
Incorporate rules:
- Bold focal subject with dramatic rim lighting and high dynamic range
- Mobile readability: uncluttered composition, sharp silhouettes, 3D pop
- Strict visual hierarchy, cinematic color grading, vibrant contrasts
- 16:9 landscape aspect ratio
- Safe margins: leave space on top-left or top-center for text overlays, avoid bottom-right corner where YouTube duration timer lives.
- Specify: "No watermarks, no distorted faces, clean ultra-sharp details"

Return JSON with:
{
  "enhancedPrompt": "detailed prompt text",
  "suggestedTitle": "Short 2-4 word punchy title",
  "recommendedColorPalette": "name of color palette",
  "styleNotes": "1-line composition recommendation"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `User idea: "${rawPrompt || topic}". Style: ${style}. Generate the optimized prompt.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Enhance prompt error:', err);
    res.status(500).json({
      error: 'ENHANCE_FAILED',
      message: err.message || 'Failed to enhance prompt',
    });
  }
});

// 4. Generate Thumbnail Image (Text-to-Thumbnail or Image-to-Thumbnail)
app.post('/api/generate-thumbnail', async (req: Request, res: Response) => {
  try {
    const ai = getGenAI();
    if (!ai) {
      res.status(503).json({
        error: 'API_KEY_MISSING',
        message: 'GEMINI_API_KEY is not configured. Please configure your Gemini API key in the Secrets panel to generate real thumbnails.',
      });
      return;
    }

    const {
      prompt = '',
      style = 'cinematic',
      colorPalette = 'Vibrant & Punchy',
      backgroundStyle = 'Dramatic Studio Rim Light',
      subjectPlacement = 'right',
      includeTextInImage = false,
      titleText = '',
      referenceImage = null,
      preserveSubject = true,
      aspectRatio = '16:9',
    } = req.body;

    if (!prompt.trim() && !referenceImage) {
      res.status(400).json({
        error: 'INVALID_INPUT',
        message: 'Please provide either a prompt or upload a reference image.',
      });
      return;
    }

    // Build specialized style and composition guidance
    let styleDescriptor = '';
    switch (style) {
      case 'gaming':
        styleDescriptor = 'Vibrant neon esports gaming aesthetic, dynamic motion blur, glowing particle embers, explosive action atmosphere, saturated purples and greens, high energy.';
        break;
      case 'technology':
        styleDescriptor = 'Cutting-edge tech studio aesthetic, sleek holographic displays, blue and amber rim lighting, pristine hardware details, futuristic depth of field.';
        break;
      case 'business':
        styleDescriptor = 'Premium financial & business studio look, deep charcoal and emerald or gold accents, clean modern architectural lines, confident authoritative mood.';
        break;
      case 'educational':
        styleDescriptor = 'Vivid science & knowledge documentary aesthetic, hyper-clear visual demonstration, rich 3D diagrammatic atmosphere, high illumination, engaging curiosity.';
        break;
      case 'reaction':
        styleDescriptor = 'Exaggerated emotional reaction aesthetic, intense facial expression, dramatic split or isolated spotlight, high saturation, immediate scroll-stopping curiosity.';
        break;
      case 'travel':
        styleDescriptor = 'Breathtaking cinematic National Geographic landscape, golden hour sunlight, majestic mountain or coastal vistas, rich warm saturation, sense of grand adventure.';
      case 'islamic':
        styleDescriptor = 'Elegant Islamic architectural aesthetic, intricate geometric arches, warm lantern glow, golden calligraphy lighting, serene cinematic twilight atmosphere.';
        break;
      case 'minimal':
        styleDescriptor = 'Sleek Apple-style minimalist aesthetic, clean single focal subject, bold contrast, soft diffuse shadows, negative space for text overlays.';
        break;
      case 'cinematic':
      default:
        styleDescriptor = 'Hollywood blockbuster cinematic aesthetic, anamorphic lens flare, dramatic three-point lighting, deep shadows, 8k commercial color grading.';
        break;
    }

    // Placement instruction
    let placementInstruction = '';
    if (subjectPlacement === 'right') {
      placementInstruction = 'Place primary focal subject on the right half of the 16:9 frame, leaving the left half open with clean contrast for text overlays. Keep bottom-right corner clear for YouTube video timestamp.';
    } else if (subjectPlacement === 'left') {
      placementInstruction = 'Place primary focal subject on the left half of the 16:9 frame, leaving the right half open for graphical elements. Keep bottom-right corner clear.';
    } else if (subjectPlacement === 'center') {
      placementInstruction = 'Place primary focal subject in dramatic center composition, flanked by atmospheric lighting and depth.';
    } else {
      placementInstruction = 'Balanced rule-of-thirds composition, keeping important details inside safe margin zones.';
    }

    const textRule = includeTextInImage && titleText.trim()
      ? `Render bold, stylized 3D typography stating "${titleText.trim()}" integrated naturally into the scene with high contrast.`
      : `Strictly DO NOT generate any text, letters, symbols, words, or watermarks. Keep the image pure graphic photography so that custom text overlays can be placed cleanly.`;

    // Assembling final generation prompt
    const finalPrompt = `Professional YouTube Thumbnail design (1280x720 16:9 resolution).
Topic & Concept: ${prompt || 'Stunning eye-catching YouTube thumbnail'}
Style: ${styleDescriptor}
Background: ${backgroundStyle}
Color Grading: ${colorPalette}
Composition: ${placementInstruction}
Text Instruction: ${textRule}
Quality: Ultra-sharp 8k resolution, photorealistic details, high dynamic range, punchy contrast optimized to maximize Click-Through Rate (CTR) on both mobile and desktop screens. Avoid cluttered noise.`;

    let generatedImageUrl = '';

    // If reference image provided, use multimodal editing / generation
    if (referenceImage) {
      const cleanData = referenceImage.replace(/^data:image\/[a-z]+;base64,/, '');
      const mime = referenceImage.match(/^data:(image\/[a-z]+);base64,/)?.[1] || 'image/jpeg';

      const multimodalInstruction = preserveSubject
        ? `Use this uploaded reference image as the primary subject. Strictly PRESERVE the subject's identity, facial facial features, expression, and distinct characteristics. Replace or enhance the background to match: ${finalPrompt}. Integrate the subject seamlessly into this new lighting and environment.`
        : `Use this reference image for compositional and thematic inspiration. ${finalPrompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanData,
                mimeType: mime,
              },
            },
            {
              text: multimodalInstruction,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
          },
        },
      });

      // Extract image part
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          const outMime = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
          break;
        }
      }
    } else {
      // Text-to-image generation
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              text: finalPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          const outMime = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImageUrl) {
      res.status(502).json({
        error: 'NO_IMAGE_RETURNED',
        message: 'The AI model completed the request but did not return image data. Try refining the prompt or theme.',
      });
      return;
    }

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      metadata: {
        style,
        subjectPlacement,
        aspectRatio: '16:9',
        resolution: '1280x720',
        timestamp: Date.now(),
      },
    });
  } catch (err: any) {
    console.error('Thumbnail generation error:', err);
    res.status(500).json({
      error: 'GENERATION_ERROR',
      message: err.message || 'An error occurred during thumbnail generation.',
    });
  }
});

// Vite Middleware integration for Fullstack app
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`ThumbGenius AI backend running at http://localhost:${port}`);
  });
}

startServer();
