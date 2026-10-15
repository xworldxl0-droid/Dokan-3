import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ThumbnailPreview } from './components/ThumbnailPreview';
import { ControlPanel } from './components/ControlPanel';
import { TemplatesGallery } from './components/TemplatesGallery';
import { HistoryGallery } from './components/HistoryGallery';
import { CompareMode } from './components/CompareMode';
import { SpecsGuide } from './components/SpecsGuide';
import {
  ThumbnailGenerationParams,
  TextOverlayConfig,
  GeneratedThumbnailItem,
} from './types/thumbnail';
import { checkServerStatus, generateThumbnailAPI } from './services/api';
import { SHOWCASE_TEMPLATES, ShowcaseTemplate } from './data/showcaseTemplates';
import { Sparkles, ArrowRight, Video, Upload, Wand2, Shield, Eye, Columns } from 'lucide-react';

const INITIAL_IMAGE = '/src/assets/images/thumb_tech_ai_1792084439138.jpg';

const DEFAULT_PARAMS: ThumbnailGenerationParams = {
  mode: 'prompt',
  prompt: 'Professional tech reviewer testing next-generation holographic AI headset with glowing amber & cyan holographic interfaces, dramatic dark studio lighting, high contrast',
  style: 'technology',
  colorPalette: 'Vibrant Neon (Cyan & Pink)',
  backgroundStyle: 'High-Tech Laboratory with Holograms',
  subjectPlacement: 'right',
  includeTextInImage: false,
  titleText: 'ULTIMATE AI\nREVOLUTION?',
  referenceImage: null,
  preserveSubject: true,
  language: 'English',
};

const DEFAULT_TEXT_CONFIG: TextOverlayConfig = {
  enabled: true,
  title: 'ULTIMATE AI\nREVOLUTION?',
  subtitle: 'GEN-4 MODEL TESTED',
  font: 'Bebas Neue',
  titleSize: 56,
  subtitleSize: 22,
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
};

const STORAGE_KEY = 'thumbgenius_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'templates' | 'compare' | 'specs' | 'history'>('studio');
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(INITIAL_IMAGE);
  const [generationParams, setGenerationParams] = useState<ThumbnailGenerationParams>(DEFAULT_PARAMS);
  const [textConfig, setTextConfig] = useState<TextOverlayConfig>(DEFAULT_TEXT_CONFIG);
  const [history, setHistory] = useState<GeneratedThumbnailItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [compareA, setCompareA] = useState<GeneratedThumbnailItem | null>(null);
  const [compareB, setCompareB] = useState<GeneratedThumbnailItem | null>(null);

  // Check server status and API key
  useEffect(() => {
    checkServerStatus().then((status) => {
      setHasApiKey(status.hasApiKey);
    });

    // Load history from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        // Pre-populate with showcase creations
        const initialCreations: GeneratedThumbnailItem[] = SHOWCASE_TEMPLATES.map((tmpl) => ({
          id: tmpl.id,
          imageUrl: tmpl.imageUrl,
          timestamp: Date.now() - 3600000,
          prompt: tmpl.prompt,
          style: tmpl.style,
          textConfig: {
            ...tmpl.textConfig,
            textColor: tmpl.textConfig.textColor || '#ffffff',
            strokeColor: tmpl.textConfig.strokeColor || '#000000',
            glowColor: tmpl.textConfig.glowColor || 'rgba(0,0,0,0.5)',
            badgeColor: tmpl.textConfig.badgeColor || '#e11d48',
          },
          titleText: tmpl.textConfig.title,
        }));
        setHistory(initialCreations);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCreations));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  const saveHistoryItem = (newItem: GeneratedThumbnailItem) => {
    setHistory((prev) => {
      const updated = [newItem, ...prev.filter((i) => i.id !== newItem.id)].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save to localStorage:', err);
      }
      return updated;
    });
  };

  const handleUpdateParams = (updates: Partial<ThumbnailGenerationParams>) => {
    setGenerationParams((prev) => ({ ...prev, ...updates }));
    if (updates.titleText !== undefined) {
      setTextConfig((prev) => ({ ...prev, title: updates.titleText || '' }));
    }
  };

  const handleUpdateTextConfig = (updates: Partial<TextOverlayConfig>) => {
    setTextConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleNewGeneration = () => {
    setGenerationParams(DEFAULT_PARAMS);
    setTextConfig(DEFAULT_TEXT_CONFIG);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTemplate = (template: ShowcaseTemplate) => {
    setCurrentImageUrl(template.imageUrl);
    setGenerationParams({
      ...generationParams,
      prompt: template.prompt,
      style: template.style,
      colorPalette: template.colorPalette,
      backgroundStyle: template.backgroundStyle,
      subjectPlacement: template.subjectPlacement,
      mode: 'prompt',
    });
    setTextConfig({
      ...textConfig,
      ...template.textConfig,
      textColor: template.textConfig.textColor || '#ffffff',
      strokeColor: template.textConfig.strokeColor || '#000000',
      glowColor: template.textConfig.glowColor || 'rgba(0,0,0,0.5)',
      badgeColor: template.textConfig.badgeColor || '#e11d48',
    });
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryItem = (item: GeneratedThumbnailItem) => {
    setCurrentImageUrl(item.imageUrl);
    setGenerationParams((prev) => ({
      ...prev,
      prompt: item.prompt,
      style: item.style,
    }));
    setTextConfig(item.textConfig);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage delete error:', err);
      }
      return updated;
    });
  };

  const handleClearAllHistory = () => {
    if (confirm('Are you sure you want to clear your creations history?')) {
      setHistory([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.warn('LocalStorage clear error:', err);
      }
    }
  };

  const handleOpenCompare = (itemA?: GeneratedThumbnailItem, itemB?: GeneratedThumbnailItem) => {
    if (itemA) setCompareA(itemA);
    if (itemB) setCompareB(itemB);
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Execute Thumbnail Generation via Backend
  const handleGenerate = async () => {
    setErrorMessage(null);
    setIsGenerating(true);
    setGenerationStep('Preparing 1280×720 composition & lighting parameters...');

    try {
      // Step feedback animation
      const stepTimer1 = setTimeout(() => {
        setGenerationStep('Synthesizing high-contrast focal subject & background...');
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setGenerationStep('Applying mobile-optimized rim lighting & visual hierarchy...');
      }, 3500);

      const result = await generateThumbnailAPI({
        ...generationParams,
        titleText: textConfig.title,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (result.imageUrl) {
        setCurrentImageUrl(result.imageUrl);

        // Add to history
        const newItem: GeneratedThumbnailItem = {
          id: `thumb-${Date.now()}`,
          imageUrl: result.imageUrl,
          timestamp: Date.now(),
          prompt: generationParams.prompt,
          style: generationParams.style,
          textConfig,
          referenceImageUsed: Boolean(generationParams.referenceImage),
          titleText: textConfig.title,
        };
        saveHistoryItem(newItem);
      }
    } catch (err: any) {
      console.error('Generation failure:', err);
      setErrorMessage(
        err.message || 'Generation failed. Please ensure GEMINI_API_KEY is configured in Settings > Secrets.'
      );
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-display selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewGeneration={handleNewGeneration}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'studio' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto pt-2 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exclusively for YouTube Creators</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 text-balance">
                Create Stunning YouTube Thumbnails with AI
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed text-balance">
                Upload an image or describe your idea. Let AI do the design. Engineered specifically for 1280 × 720 specs, safe margins, and high mobile click-through rates.
              </p>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs max-w-xl text-left flex items-start gap-3 shadow-lg">
                  <span className="font-bold text-rose-400 text-sm">⚠️</span>
                  <div className="space-y-1">
                    <span className="font-bold block">Generation Error:</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Studio Workspace Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: 16:9 Thumbnail Canvas & Controls (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <ThumbnailPreview
                  imageUrl={currentImageUrl}
                  isGenerating={isGenerating}
                  generationStep={generationStep}
                  textConfig={textConfig}
                  onUpdateTextConfig={handleUpdateTextConfig}
                  promptDescription={generationParams.prompt}
                />
              </div>

              {/* Right Column: Generation Controls & Overlay Editor (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <ControlPanel
                  generationParams={generationParams}
                  onUpdateParams={handleUpdateParams}
                  textConfig={textConfig}
                  onUpdateTextConfig={handleUpdateTextConfig}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  hasApiKey={hasApiKey}
                />
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <TemplatesGallery onSelectTemplate={handleSelectTemplate} />
        )}

        {/* Compare Mode Tab */}
        {activeTab === 'compare' && (
          <CompareMode
            history={history}
            onSelectThumbnailForStudio={handleSelectHistoryItem}
            initialA={compareA}
            initialB={compareB}
          />
        )}

        {/* Specs & Safe Zones Guide Tab */}
        {activeTab === 'specs' && <SpecsGuide />}

        {/* History / Gallery Tab */}
        {activeTab === 'history' && (
          <HistoryGallery
            history={history}
            onSelectThumbnail={handleSelectHistoryItem}
            onDeleteThumbnail={handleDeleteHistory}
            onClearAll={handleClearAllHistory}
            onOpenCompare={handleOpenCompare}
          />
        )}
      </main>

      {/* Footer adhering to anti-slop guidelines */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">ThumbGenius AI</span>
            <span>·</span>
            <span>1280 × 720 HD YouTube Standard</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setActiveTab('specs')} className="hover:text-amber-400 transition-colors">
              Platform Safe Zones
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('templates')} className="hover:text-amber-400 transition-colors">
              Pro Templates
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('compare')} className="hover:text-amber-400 transition-colors">
              A/B Compare
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('history')} className="hover:text-amber-400 transition-colors">
              Saved Creations ({history.length})
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
