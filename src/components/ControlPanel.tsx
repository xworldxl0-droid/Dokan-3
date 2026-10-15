import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Type,
  Palette,
  Layout,
  ScanEye,
  AlertCircle,
  HelpCircle,
  Check,
  RefreshCw,
  Wand2,
  Trash2,
  Lock,
  ChevronRight,
} from 'lucide-react';
import {
  ThumbnailGenerationParams,
  ThumbnailStyle,
  SubjectPlacement,
  TextPosition,
  TextOverlayConfig,
  ImageAnalysisResult,
  TextFont,
} from '../types/thumbnail';
import { analyzeReferenceImage, enhancePromptWithAI } from '../services/api';

interface ControlPanelProps {
  generationParams: ThumbnailGenerationParams;
  onUpdateParams: (params: Partial<ThumbnailGenerationParams>) => void;
  textConfig: TextOverlayConfig;
  onUpdateTextConfig: (config: Partial<TextOverlayConfig>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasApiKey: boolean;
}

const STYLES: { id: ThumbnailStyle; label: string; icon: string; desc: string }[] = [
  { id: 'cinematic', label: 'Cinematic', icon: '🎬', desc: 'Dramatic lighting, anamorphic flare & depth' },
  { id: 'gaming', label: 'Gaming', icon: '🎮', desc: 'Vibrant neon, sparks, explosive action' },
  { id: 'technology', label: 'Technology', icon: '⚡', desc: 'Holograms, blue/amber rim light, sleek tech' },
  { id: 'business', label: 'Business', icon: '📈', desc: 'Executive studio, charts, emerald & gold' },
  { id: 'reaction', label: 'Reaction', icon: '😲', desc: 'High-emotion face, spotlight contrast' },
  { id: 'educational', label: 'Educational', icon: '💡', desc: 'Documentary clarity, 3D visual aids' },
  { id: 'travel', label: 'Travel', icon: '🏔️', desc: 'Golden hour landscapes, epic vistas' },
  { id: 'islamic', label: 'Islamic', icon: '🕌', desc: 'Warm lantern glow, arches & serenity' },
  { id: 'minimal', label: 'Minimal', icon: '✨', desc: 'Clean single subject, crisp negative space' },
];

const QUICK_PROMPTS = [
  { label: '🚀 10x YouTube Growth', prompt: 'Confident creator standing next to an explosive glowing 10x subscriber growth chart with golden confetti particles', style: 'business' as ThumbnailStyle, title: '10X GROWTH\nIN 30 DAYS' },
  { label: '🤖 Gen-4 AI Tested', prompt: 'Tech reviewer wearing holographic AR headset with glowing circuit boards and AI benchmark data hovering in front', style: 'technology' as ThumbnailStyle, title: 'AI MODEL 4.0\nTESTED!' },
  { label: '😱 Impossible Challenge', prompt: 'Shocked creator expression on the right with giant fiery maze behind them and intense red emergency rim light', style: 'reaction' as ThumbnailStyle, title: 'I SURVIVED\nTHE TRAP' },
  { label: '🎮 Unreal Esports Clutch', prompt: 'Gamer screaming in triumph with neon cyan and magenta rim light, explosive gaming victory screen behind', style: 'gaming' as ThumbnailStyle, title: '1 VS 5 CLUTCH\nNEW RECORD' },
  { label: '🏔️ Solo Alpine Summit', prompt: 'Hiker with backpack standing on towering misty peak during golden sunrise, breathtaking clouds below', style: 'travel' as ThumbnailStyle, title: '48 HOURS\nALONE HERE' },
];

const PALETTES = [
  'Vibrant Neon (Cyan & Pink)',
  'Cinematic Gold & Deep Teal',
  'High-Contrast Crimson & Charcoal',
  'Esports Acid Lime & Purple',
  'Clean Luxury Emerald & Gold',
  'High-Key Bright White & Amber',
];

const BACKGROUNDS = [
  'Dramatic Studio Rim Light & Bokeh',
  'Explosive Action Battlefield & Embers',
  'High-Tech Laboratory with Holograms',
  'Majestic Mountain Sunset & Clouds',
  'Dark Executive Luxury Office',
  'Clean Minimalist Gradient Backdrop',
];

const FONTS: { id: TextFont; label: string }[] = [
  { id: 'Bebas Neue', label: 'Bebas Neue (Classic YouTube Bold)' },
  { id: 'Oswald', label: 'Oswald (Punchy Athletic)' },
  { id: 'Montserrat', label: 'Montserrat (Modern Ultra-Heavy)' },
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Clean Display)' },
];

const BADGE_PRESETS = ['NEW', 'TOP 10', 'SECRET', 'MUST WATCH', '4K', '100%', 'WARNING', 'UNBELIEVABLE'];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  generationParams,
  onUpdateParams,
  textConfig,
  onUpdateTextConfig,
  onGenerate,
  isGenerating,
  hasApiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'text' | 'composition'>('create');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onUpdateParams({
        referenceImage: base64,
        referenceMimeType: file.type,
      });
      // Automatically switch to Image mode if currently in prompt-only
      if (generationParams.mode === 'prompt') {
        onUpdateParams({ mode: 'image' });
      }
    };
    reader.readAsDataURL(file);
  };

  // Image analysis trigger
  const handleAnalyze = async () => {
    if (!generationParams.referenceImage) return;
    try {
      setIsAnalyzing(true);
      const analysis = await analyzeReferenceImage(
        generationParams.referenceImage,
        generationParams.referenceMimeType || 'image/jpeg'
      );
      setAnalysisResult(analysis);
      if (analysis.suggestedStyle) {
        onUpdateParams({ style: analysis.suggestedStyle });
      }
      if (analysis.suggestedTitles && analysis.suggestedTitles.length > 0) {
        onUpdateTextConfig({ title: analysis.suggestedTitles[0] });
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      alert(err.message || 'Image analysis failed. Please check your API key.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // AI Prompt Enhancer trigger
  const handleEnhancePrompt = async () => {
    if (!generationParams.prompt.trim()) return;
    try {
      setIsEnhancing(true);
      const res = await enhancePromptWithAI(generationParams.prompt, generationParams.style);
      if (res.enhancedPrompt) {
        onUpdateParams({ prompt: res.enhancedPrompt });
      }
      if (res.suggestedTitle && !textConfig.title) {
        onUpdateTextConfig({ title: res.suggestedTitle });
      }
    } catch (err: any) {
      console.error('Enhance prompt error:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Tab Navigation */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/70 p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'create'
              ? 'bg-slate-800 text-amber-400 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Prompt & Image</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'text'
              ? 'bg-slate-800 text-amber-400 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Text & Badges</span>
        </button>

        <button
          onClick={() => setActiveTab('composition')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'composition'
              ? 'bg-slate-800 text-amber-400 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Style & Layout</span>
        </button>
      </div>

      {/* API Key Missing Notice */}
      {!hasApiKey && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-300">Gemini API Key Required:</span>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              To generate AI thumbnails with live models, please configure <code className="bg-amber-950/80 px-1 py-0.5 rounded text-amber-300 font-mono">GEMINI_API_KEY</code> in the AI Studio Settings &gt; Secrets panel. You can still test text overlays, canvas layouts, and showcase templates immediately!
            </p>
          </div>
        </div>
      )}

      {/* Tab 1: Create (Prompt & Image) */}
      {activeTab === 'create' && (
        <div className="p-5 flex flex-col gap-5">
          {/* Two Core Options */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block uppercase tracking-wider">
              Creation Workflow
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => onUpdateParams({ mode: 'prompt' })}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  generationParams.mode === 'prompt'
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Write a Prompt</span>
                <span className="text-[10px] text-slate-500 font-normal">Text to Image</span>
              </button>

              <button
                onClick={() => onUpdateParams({ mode: 'image' })}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  generationParams.mode === 'image'
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Upload Image</span>
                <span className="text-[10px] text-slate-500 font-normal">Image to Thumbnail</span>
              </button>

              <button
                onClick={() => onUpdateParams({ mode: 'both' })}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  generationParams.mode === 'both'
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Hybrid Both</span>
                <span className="text-[10px] text-slate-500 font-normal">Subject + Prompt</span>
              </button>
            </div>
          </div>

          {/* Reference Image Upload Area (Shown for 'image' or 'both') */}
          {(generationParams.mode === 'image' || generationParams.mode === 'both') && (
            <div className="flex flex-col gap-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reference Subject Image</span>
                </span>
                <span className="text-[11px] text-slate-500">JPG, PNG, WEBP up to 20MB</span>
              </div>

              {generationParams.referenceImage ? (
                <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <img
                    src={generationParams.referenceImage}
                    alt="Subject reference"
                    className="w-16 h-16 object-cover rounded-md border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-200 truncate">
                      Subject Loaded
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <ScanEye className="w-3 h-3" />
                        <span>{isAnalyzing ? 'Analyzing...' : 'AI Vision Analysis'}</span>
                      </button>
                      <span className="text-slate-600">·</span>
                      <button
                        onClick={() =>
                          onUpdateParams({ referenceImage: null, referenceMimeType: undefined })
                        }
                        className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/40 hover:bg-slate-900/60 transition-all text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-amber-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-300 block">
                      Click to upload or drag & drop reference image
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Upload person, face, gadget, gaming screenshot, or product
                    </span>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Subject Preservation Switch */}
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={generationParams.preserveSubject}
                  onChange={(e) => onUpdateParams({ preserveSubject: e.target.checked })}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/30 w-3.5 h-3.5 bg-slate-950"
                />
                <span className="font-medium">
                  Preserve subject identity, facial expression & recognizable traits
                </span>
              </label>

              {/* Vision Analysis Breakdown Card */}
              {analysisResult && (
                <div className="bg-slate-900/90 border border-amber-500/30 rounded-lg p-3 text-xs space-y-2">
                  <div className="font-semibold text-amber-400 text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Vision Analysis Results</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{analysisResult.subjectDescription}</p>
                  <div className="text-[10px] text-slate-400">
                    <strong className="text-slate-200">Preserving traits:</strong>{' '}
                    {analysisResult.keyFeaturesToPreserve.join(', ')}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    <strong className="text-slate-200">Composition:</strong>{' '}
                    {analysisResult.compositionAdvice}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prompt Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Thumbnail Topic & Concept
              </label>
              <button
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !generationParams.prompt.trim()}
                className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer disabled:opacity-40"
                title="Transform idea into high-converting YouTube thumbnail prompt"
              >
                <Wand2 className="w-3 h-3" />
                <span>{isEnhancing ? 'Enhancing...' : 'AI Enhance Prompt'}</span>
              </button>
            </div>

            <textarea
              value={generationParams.prompt}
              onChange={(e) => onUpdateParams({ prompt: e.target.value })}
              placeholder="e.g. Confident creator pointing at glowing futuristic AI device, dramatic blue & orange rim lighting, dark studio backdrop, 8k commercial quality..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 transition-colors resize-none"
            />

            {/* Quick Inspiration Prompts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-medium text-slate-500">Quick ideas:</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onUpdateParams({
                        prompt: qp.prompt,
                        style: qp.style,
                      });
                      onUpdateTextConfig({
                        title: qp.title,
                      });
                    }}
                    className="text-[11px] px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md border border-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block uppercase tracking-wider">
              Visual Genre & Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => onUpdateParams({ style: st.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    generationParams.style === st.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm'
                      : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{st.icon}</span>
                    <span className="text-xs font-bold leading-tight">{st.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 line-clamp-1 leading-tight">
                    {st.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Text & Badges Overlay */}
      {activeTab === 'text' && (
        <div className="p-5 flex flex-col gap-5">
          {/* Text Overlay Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                Crisp Canvas Text Overlay
              </span>
              <span className="text-[11px] text-slate-400 block">
                Guarantees 100% sharp typography with zero AI spelling errors
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={textConfig.enabled}
                onChange={(e) => onUpdateTextConfig({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {textConfig.enabled && (
            <>
              {/* Title Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Main Title (Punchy, 2-4 words)
                </label>
                <textarea
                  value={textConfig.title}
                  onChange={(e) => onUpdateTextConfig({ title: e.target.value })}
                  placeholder="e.g. ULTIMATE AI&#10;REVOLUTION?"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 uppercase"
                />
                <span className="text-[10px] text-slate-500">
                  Use line breaks to stack lines vertically for high CTR impact.
                </span>
              </div>

              {/* Subtitle Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Subtitle (Optional Kicker)
                </label>
                <input
                  type="text"
                  value={textConfig.subtitle}
                  onChange={(e) => onUpdateTextConfig({ subtitle: e.target.value })}
                  placeholder="e.g. TESTED & RATED"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 uppercase"
                />
              </div>

              {/* Font Family Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Headline Font
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onUpdateTextConfig({ font: f.id })}
                      className={`px-3 py-2 text-xs rounded-lg border text-left transition-colors cursor-pointer ${
                        textConfig.font === f.id
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                      style={{ fontFamily: `'${f.id}', sans-serif` }}
                    >
                      {f.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Styling Controls Grid */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                {/* Title Size */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Title Scale</span>
                    <span className="font-mono text-amber-400">{textConfig.titleSize}pt</span>
                  </div>
                  <input
                    type="range"
                    min="36"
                    max="78"
                    value={textConfig.titleSize}
                    onChange={(e) => onUpdateTextConfig({ titleSize: Number(e.target.value) })}
                    className="accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Stroke Outline */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Outline Stroke</span>
                    <span className="font-mono text-amber-400">{textConfig.strokeWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={textConfig.strokeWidth}
                    onChange={(e) => onUpdateTextConfig({ strokeWidth: Number(e.target.value) })}
                    className="accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Text Color */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Text Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textConfig.textColor}
                      onChange={(e) => onUpdateTextConfig({ textColor: e.target.value })}
                      className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {textConfig.textColor}
                    </span>
                  </div>
                </div>

                {/* Highlight / Box Style */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Backing Style</span>
                  <select
                    value={textConfig.badgeStyle}
                    onChange={(e) =>
                      onUpdateTextConfig({
                        badgeStyle: e.target.value as 'none' | 'box' | 'highlight',
                      })
                    }
                    className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 px-2 py-1 focus:outline-none"
                  >
                    <option value="none">No Box</option>
                    <option value="highlight">Yellow Highlight</option>
                    <option value="box">Dark Box</option>
                  </select>
                </div>
              </div>

              {/* Badge Sticker */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Badge Sticker</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={textConfig.badgeEnabled}
                      onChange={(e) => onUpdateTextConfig({ badgeEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-rose-500"></div>
                  </label>
                </div>

                {textConfig.badgeEnabled && (
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {BADGE_PRESETS.map((bp) => (
                        <button
                          key={bp}
                          onClick={() => onUpdateTextConfig({ badgeText: bp })}
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            textConfig.badgeText === bp
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {bp}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={textConfig.badgeText || ''}
                      onChange={(e) => onUpdateTextConfig({ badgeText: e.target.value })}
                      placeholder="Custom badge text..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 uppercase"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab 3: Style & Layout */}
      {activeTab === 'composition' && (
        <div className="p-5 flex flex-col gap-5">
          {/* Subject Placement */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block uppercase tracking-wider">
              Subject Placement
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {(
                [
                  { id: 'right', label: 'Right Side', sub: 'Best for text' },
                  { id: 'left', label: 'Left Side', sub: 'Text on right' },
                  { id: 'center', label: 'Centered', sub: 'Dramatic solo' },
                  { id: 'rule_of_thirds', label: '3rds Grid', sub: 'Cinematic' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onUpdateParams({ subjectPlacement: p.id })}
                  className={`py-2 px-1 text-center rounded-lg transition-colors cursor-pointer ${
                    generationParams.subjectPlacement === p.id
                      ? 'bg-slate-800 text-amber-400 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-medium">{p.label}</div>
                  <div className="text-[9px] text-slate-500">{p.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Overlay Position */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block uppercase tracking-wider">
              Text Overlay Placement
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {(
                [
                  { id: 'top-left', label: 'Top Left' },
                  { id: 'bottom-left', label: 'Bottom Left' },
                  { id: 'top-right', label: 'Top Right' },
                  { id: 'center-top', label: 'Center Top' },
                ] as const
              ).map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => onUpdateTextConfig({ position: pos.id })}
                  className={`py-2 px-1 text-center rounded-lg transition-colors cursor-pointer ${
                    textConfig.position === pos.id
                      ? 'bg-slate-800 text-amber-400 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-medium">{pos.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Presets */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Color Palette
            </label>
            <select
              value={generationParams.colorPalette}
              onChange={(e) => onUpdateParams({ colorPalette: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
            >
              {PALETTES.map((pal) => (
                <option key={pal} value={pal}>
                  {pal}
                </option>
              ))}
            </select>
          </div>

          {/* Background Style */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Background Style
            </label>
            <select
              value={generationParams.backgroundStyle}
              onChange={(e) => onUpdateParams({ backgroundStyle: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60"
            >
              {BACKGROUNDS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Target Language
            </label>
            <select
              value={generationParams.language}
              onChange={(e) => onUpdateParams({ language: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="Arabic">Arabic (العربية)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Japanese">Japanese (日本語)</option>
              <option value="Portuguese">Portuguese (Português)</option>
            </select>
          </div>
        </div>
      )}

      {/* Prominent Generate CTA Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-950/50 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950 stroke-[2.5]" />
              <span>Generating YouTube Thumbnail...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Generate Thumbnail (1280×720)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
