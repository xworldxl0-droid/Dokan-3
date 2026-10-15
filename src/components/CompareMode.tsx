import React, { useState, useRef, useEffect } from 'react';
import {
  Columns,
  SplitSquareVertical,
  Smartphone,
  Shield,
  Grid,
  ArrowRight,
  ArrowLeftRight,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sliders,
  Type,
  Layout,
  Layers,
} from 'lucide-react';
import { GeneratedThumbnailItem, TextOverlayConfig } from '../types/thumbnail';
import { SafeZonesGuide } from './SafeZonesGuide';
import { downloadThumbnail } from '../utils/canvasExport';

interface CompareModeProps {
  history: GeneratedThumbnailItem[];
  onSelectThumbnailForStudio: (item: GeneratedThumbnailItem) => void;
  initialA?: GeneratedThumbnailItem | null;
  initialB?: GeneratedThumbnailItem | null;
}

export const CompareMode: React.FC<CompareModeProps> = ({
  history,
  onSelectThumbnailForStudio,
  initialA,
  initialB,
}) => {
  const [itemA, setItemA] = useState<GeneratedThumbnailItem | null>(
    initialA || (history.length > 0 ? history[0] : null)
  );
  const [itemB, setItemB] = useState<GeneratedThumbnailItem | null>(
    initialB || (history.length > 1 ? history[1] : history.length > 0 ? history[0] : null)
  );

  const [viewMode, setViewMode] = useState<'side-by-side' | 'split-slider' | 'mobile-scale'>('side-by-side');
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [showRuleOfThirds, setShowRuleOfThirds] = useState<boolean>(false);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100 for split wipe
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Sync if initial props change
  useEffect(() => {
    if (initialA) setItemA(initialA);
    if (initialB) setItemB(initialB);
  }, [initialA, initialB]);

  // Handle slider mouse / touch dragging
  const handlePointerMove = (clientX: number) => {
    if (!splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDraggingSlider && e.touches[0]) {
      handlePointerMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSlider) {
      handlePointerMove(e.clientX);
    }
  };

  const handleSwap = () => {
    const temp = itemA;
    setItemA(itemB);
    setItemB(temp);
  };

  // Helper to render text overlay inside a thumbnail preview box
  const renderOverlay = (textConfig: TextOverlayConfig) => {
    if (!textConfig.enabled || (!textConfig.title && !textConfig.subtitle && !textConfig.badgeEnabled)) {
      return null;
    }

    return (
      <div
        className={`absolute p-4 z-10 flex flex-col pointer-events-none select-none ${
          textConfig.position === 'top-left'
            ? 'top-2 left-2 items-start text-left'
            : textConfig.position === 'bottom-left'
            ? 'bottom-4 left-2 items-start text-left'
            : textConfig.position === 'top-right'
            ? 'top-2 right-2 items-end text-right'
            : textConfig.position === 'center-top'
            ? 'top-2 left-1/2 -translate-x-1/2 items-center text-center'
            : 'top-1/4 left-1/4 items-start text-left'
        }`}
        style={{
          transform: textConfig.rotation ? `rotate(${textConfig.rotation}deg)` : undefined,
        }}
      >
        {textConfig.badgeEnabled && textConfig.badgeText && (
          <div
            className="px-2 py-0.5 rounded text-[10px] font-extrabold text-white mb-1 shadow-md uppercase tracking-wider"
            style={{
              backgroundColor: textConfig.badgeColor || '#e11d48',
              fontFamily: `'${textConfig.font}', sans-serif`,
            }}
          >
            {textConfig.badgeText}
          </div>
        )}

        {textConfig.title && (
          <div
            className="font-black leading-tight tracking-tight uppercase whitespace-pre-line"
            style={{
              fontFamily: `'${textConfig.font}', Impact, sans-serif`,
              fontSize: `clamp(14px, 3.2vw, ${textConfig.titleSize * 0.7}px)`,
              color: textConfig.badgeStyle === 'highlight' ? '#000000' : textConfig.textColor,
              backgroundColor:
                textConfig.badgeStyle === 'highlight'
                  ? '#eab308'
                  : textConfig.badgeStyle === 'box'
                  ? 'rgba(0,0,0,0.85)'
                  : 'transparent',
              padding: textConfig.badgeStyle !== 'none' ? '2px 8px' : undefined,
              borderRadius: textConfig.badgeStyle !== 'none' ? '6px' : undefined,
              textShadow:
                textConfig.strokeWidth > 0
                  ? `-2px -2px 0 ${textConfig.strokeColor}, 2px -2px 0 ${textConfig.strokeColor}, -2px 2px 0 ${textConfig.strokeColor}, 2px 2px 0 ${textConfig.strokeColor}, 0 2px 8px ${textConfig.glowColor}`
                  : `0 2px 8px ${textConfig.glowColor}`,
            }}
          >
            {textConfig.title}
          </div>
        )}

        {textConfig.subtitle && (
          <div
            className="font-bold text-slate-100 mt-0.5 uppercase tracking-wide whitespace-pre-line text-[11px]"
            style={{
              fontFamily: `'${textConfig.font}', sans-serif`,
              textShadow:
                textConfig.strokeWidth > 0
                  ? `-1px -1px 0 ${textConfig.strokeColor}, 1px -1px 0 ${textConfig.strokeColor}, -1px 1px 0 ${textConfig.strokeColor}, 1px 1px 0 ${textConfig.strokeColor}`
                  : '0 2px 4px rgba(0,0,0,0.9)',
            }}
          >
            {textConfig.subtitle}
          </div>
        )}
      </div>
    );
  };

  if (!itemA || !itemB || history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <Columns className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Need at least 2 thumbnails</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
          Generate or customize thumbnails in the Studio first to use Compare Mode for A/B testing and design evaluation.
        </p>
      </div>
    );
  }

  // Calculate text placement safety rating
  const checkSafety = (pos: string) => {
    if (pos === 'bottom-right') {
      return { status: 'danger', message: 'Blocks YouTube duration timestamp' };
    }
    if (pos === 'bottom-left' || pos === 'top-left') {
      return { status: 'safe', message: 'Clear of YouTube UI obstacles' };
    }
    if (pos === 'top-right') {
      return { status: 'caution', message: 'May overlap Watch Later / Share icons' };
    }
    return { status: 'safe', message: 'Within safe margins' };
  };

  const safetyA = checkSafety(itemA.textConfig.position);
  const safetyB = checkSafety(itemB.textConfig.position);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 font-display">
      {/* Compare Header & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Columns className="w-5 h-5 text-amber-400" />
              <span>A/B Thumbnail Compare Mode</span>
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              1280 × 720
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate differences in typography hierarchy, focal balance, and YouTube UI safe zones.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'side-by-side'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>

            <button
              onClick={() => setViewMode('split-slider')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'split-slider'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Slider Wipe</span>
            </button>

            <button
              onClick={() => setViewMode('mobile-scale')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'mobile-scale'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Feed Size</span>
            </button>
          </div>

          {/* Synchronized Overlays */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setShowSafeZones(!showSafeZones)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                showSafeZones
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle safe zones on both versions"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Safe Margins</span>
            </button>

            <button
              onClick={() => setShowRuleOfThirds(!showRuleOfThirds)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                showRuleOfThirds
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle 3x3 rule of thirds grid on both versions"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3rds Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail Selection Bar (Picker Carousel) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Thumbnails to Compare from History:</span>
          </span>
          <button
            onClick={handleSwap}
            className="flex items-center gap-1.5 text-[11px] font-medium text-amber-400 hover:text-amber-300 px-2 py-1 rounded bg-slate-950 border border-slate-800 transition-colors cursor-pointer"
            title="Swap Version A and Version B"
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>Swap Slots (A ⇄ B)</span>
          </button>
        </div>

        {/* Scrollable strip of creations */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
          {history.map((item, idx) => {
            const isA = itemA.id === item.id;
            const isB = itemB.id === item.id;
            return (
              <div
                key={item.id}
                className={`group relative shrink-0 w-36 sm:w-44 bg-slate-950 rounded-xl overflow-hidden border transition-all ${
                  isA
                    ? 'border-amber-400 ring-2 ring-amber-400/30'
                    : isB
                    ? 'border-cyan-400 ring-2 ring-cyan-400/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="relative aspect-video w-full bg-slate-900">
                  <img src={item.imageUrl} alt="Thumbnail thumbnail" className="w-full h-full object-cover" />

                  {/* Active slot indicator pill */}
                  {isA && (
                    <div className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow">
                      SLOT A
                    </div>
                  )}
                  {isB && (
                    <div className="absolute top-1.5 left-1.5 bg-cyan-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow">
                      SLOT B
                    </div>
                  )}
                </div>

                <div className="p-2 flex flex-col gap-1.5 bg-slate-950">
                  <span className="text-[10px] text-slate-300 font-medium truncate block">
                    {item.textConfig.title || item.prompt || `Thumbnail #${idx + 1}`}
                  </span>
                  <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-800/80">
                    <button
                      onClick={() => setItemA(item)}
                      disabled={isA}
                      className={`text-[10px] font-bold py-1 rounded transition-colors cursor-pointer ${
                        isA
                          ? 'bg-amber-500/20 text-amber-400 cursor-default'
                          : 'bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-400'
                      }`}
                    >
                      Set A
                    </button>
                    <button
                      onClick={() => setItemB(item)}
                      disabled={isB}
                      className={`text-[10px] font-bold py-1 rounded transition-colors cursor-pointer ${
                        isB
                          ? 'bg-cyan-500/20 text-cyan-400 cursor-default'
                          : 'bg-slate-900 hover:bg-cyan-400 hover:text-slate-950 text-slate-400'
                      }`}
                    >
                      Set B
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN VIEWPORT: SIDE-BY-SIDE */}
      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Version A Card */}
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-3 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  A
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Version A
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(itemA.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => downloadThumbnail(itemA.imageUrl, itemA.textConfig, 'png', 'thumbnail-A')}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Download Version A"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onSelectThumbnailForStudio(itemA)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer"
                >
                  <span>Open in Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 16:9 Canvas */}
            <div className="relative aspect-video w-full bg-black overflow-hidden">
              <img src={itemA.imageUrl} alt="Thumbnail Version A" className="w-full h-full object-cover" />
              {renderOverlay(itemA.textConfig)}
              <SafeZonesGuide showSafeZones={showSafeZones} showRuleOfThirds={showRuleOfThirds} />
            </div>

            {/* Version A Specs Badge Bar */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>
                  Font: <strong className="text-white">{itemA.textConfig.font}</strong>
                </span>
                <span>·</span>
                <span>
                  Position: <strong className="text-white">{itemA.textConfig.position}</strong>
                </span>
                <span>·</span>
                <span>
                  Style: <strong className="text-white capitalize">{itemA.style}</strong>
                </span>
              </div>
              <div
                className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                  safetyA.status === 'safe'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {safetyA.status === 'safe' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                <span>{safetyA.message}</span>
              </div>
            </div>
          </div>

          {/* Version B Card */}
          <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-3 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center">
                  B
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Version B
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(itemB.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => downloadThumbnail(itemB.imageUrl, itemB.textConfig, 'png', 'thumbnail-B')}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Download Version B"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onSelectThumbnailForStudio(itemB)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors cursor-pointer"
                >
                  <span>Open in Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 16:9 Canvas */}
            <div className="relative aspect-video w-full bg-black overflow-hidden">
              <img src={itemB.imageUrl} alt="Thumbnail Version B" className="w-full h-full object-cover" />
              {renderOverlay(itemB.textConfig)}
              <SafeZonesGuide showSafeZones={showSafeZones} showRuleOfThirds={showRuleOfThirds} />
            </div>

            {/* Version B Specs Badge Bar */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>
                  Font: <strong className="text-white">{itemB.textConfig.font}</strong>
                </span>
                <span>·</span>
                <span>
                  Position: <strong className="text-white">{itemB.textConfig.position}</strong>
                </span>
                <span>·</span>
                <span>
                  Style: <strong className="text-white capitalize">{itemB.style}</strong>
                </span>
              </div>
              <div
                className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                  safetyB.status === 'safe'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {safetyB.status === 'safe' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                <span>{safetyB.message}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT: INTERACTIVE SPLIT SLIDER (WIPE COMPARE) */}
      {viewMode === 'split-slider' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200">
              Drag the center slider to wipe between Version A (Left) and Version B (Right):
            </span>
            <span className="font-mono text-amber-400">{Math.round(sliderPosition)}% split</span>
          </div>

          <div
            ref={splitContainerRef}
            onMouseDown={() => setIsDraggingSlider(true)}
            onMouseUp={() => setIsDraggingSlider(false)}
            onMouseLeave={() => setIsDraggingSlider(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDraggingSlider(true)}
            onTouchEnd={() => setIsDraggingSlider(false)}
            onTouchMove={handleTouchMove}
            className="relative aspect-video w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black border border-slate-800 select-none cursor-ew-resize"
          >
            {/* Background Layer: Version B (Full width underneath) */}
            <div className="absolute inset-0">
              <img src={itemB.imageUrl} alt="Version B" className="w-full h-full object-cover pointer-events-none" />
              {renderOverlay(itemB.textConfig)}
              <div className="absolute top-3 right-3 bg-cyan-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded shadow">
                VERSION B
              </div>
            </div>

            {/* Foreground Layer: Version A clipped by sliderPosition percentage */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              {/* Inner wrapper kept at 100% width of splitContainer so images align perfectly */}
              <div className="absolute inset-0 w-full" style={{ width: splitContainerRef.current?.offsetWidth || '100%' }}>
                <img src={itemA.imageUrl} alt="Version A" className="w-full h-full object-cover pointer-events-none" />
                {renderOverlay(itemA.textConfig)}
                <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded shadow">
                  VERSION A
                </div>
              </div>
            </div>

            {/* Vertical Divider Line with Grab Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 flex items-center justify-center -translate-x-1/2 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white text-slate-950 shadow-2xl flex items-center justify-center border-2 border-slate-900 pointer-events-auto cursor-ew-resize">
                <Sliders className="w-4 h-4" />
              </div>
            </div>

            <SafeZonesGuide showSafeZones={showSafeZones} showRuleOfThirds={showRuleOfThirds} />
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT: MOBILE FEED SCALE TEST */}
      {viewMode === 'mobile-scale' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-center max-w-xl mx-auto">
            <h3 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Smartphone Search & Feed Simulation (340px)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Over 70% of viewers scroll YouTube on mobile screens. Look away and look back quickly: which thumbnail commands your eye first?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            {/* Version A Mobile Card */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg p-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-amber-400">Version A</span>
                <span className="text-[10px] text-slate-500">Scaled to Mobile Feed</span>
              </div>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
                <img src={itemA.imageUrl} alt="Thumbnail A" className="w-full h-full object-cover" />
                {renderOverlay(itemA.textConfig)}
                <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono font-medium px-1.5 py-0.5 rounded">
                  14:28
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-white line-clamp-1">
                  {itemA.textConfig.title.replace('\n', ' ') || itemA.prompt}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>Creator Studio</span>
                  <span>·</span>
                  <span>248K views</span>
                  <span>·</span>
                  <span>1 day ago</span>
                </div>
              </div>
            </div>

            {/* Version B Mobile Card */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg p-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-cyan-400">Version B</span>
                <span className="text-[10px] text-slate-500">Scaled to Mobile Feed</span>
              </div>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
                <img src={itemB.imageUrl} alt="Thumbnail B" className="w-full h-full object-cover" />
                {renderOverlay(itemB.textConfig)}
                <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono font-medium px-1.5 py-0.5 rounded">
                  14:28
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-white line-clamp-1">
                  {itemB.textConfig.title.replace('\n', ' ') || itemB.prompt}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>Creator Studio</span>
                  <span>·</span>
                  <span>248K views</span>
                  <span>·</span>
                  <span>1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED DIFFERENCE BREAKDOWN TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layout className="w-4 h-4 text-amber-400" />
            <span>Design & Typography Differences Breakdown</span>
          </h3>
          <span className="text-[11px] text-slate-400">Side-by-side design comparison</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold w-1/4">Evaluation Attribute</th>
                <th className="py-2.5 px-4 font-semibold text-amber-400 w-3/8">
                  Version A ({itemA.textConfig.font})
                </th>
                <th className="py-2.5 px-4 font-semibold text-cyan-400 w-3/8">
                  Version B ({itemB.textConfig.font})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {/* Title Copy */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-slate-400">Title Copy</td>
                <td className="py-3 px-4 font-bold text-white whitespace-pre-line">
                  {itemA.textConfig.title || '(No title overlay)'}
                </td>
                <td className="py-3 px-4 font-bold text-white whitespace-pre-line">
                  {itemB.textConfig.title || '(No title overlay)'}
                </td>
              </tr>

              {/* Text Placement */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-slate-400">Text Placement</td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-white capitalize">{itemA.textConfig.position}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-white capitalize">{itemB.textConfig.position}</span>
                </td>
              </tr>

              {/* Typography Font & Size */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-slate-400">Headline Font & Size</td>
                <td className="py-3 px-4">
                  <span className="text-white font-semibold">{itemA.textConfig.font}</span>{' '}
                  <span className="text-slate-500 font-mono">({itemA.textConfig.titleSize}pt)</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-white font-semibold">{itemB.textConfig.font}</span>{' '}
                  <span className="text-slate-500 font-mono">({itemB.textConfig.titleSize}pt)</span>
                </td>
              </tr>

              {/* Outline & Glow */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-slate-400">Outline & Glow Effect</td>
                <td className="py-3 px-4">
                  <span className="text-slate-300">
                    {itemA.textConfig.strokeWidth}px stroke · {itemA.textConfig.glowRadius}px glow
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-slate-300">
                    {itemB.textConfig.strokeWidth}px stroke · {itemB.textConfig.glowRadius}px glow
                  </span>
                </td>
              </tr>

              {/* Badge Sticker */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-slate-400">Badge Sticker</td>
                <td className="py-3 px-4">
                  {itemA.textConfig.badgeEnabled && itemA.textConfig.badgeText ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-rose-600">
                      {itemA.textConfig.badgeText}
                    </span>
                  ) : (
                    <span className="text-slate-500">None</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {itemB.textConfig.badgeEnabled && itemB.textConfig.badgeText ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-rose-600">
                      {itemB.textConfig.badgeText}
                    </span>
                  ) : (
                    <span className="text-slate-500">None</span>
                  )}
                </td>
              </tr>

              {/* Visual Genre & Style */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-slate-400">Visual Genre Style</td>
                <td className="py-3 px-4 capitalize font-medium text-white">{itemA.style}</td>
                <td className="py-3 px-4 capitalize font-medium text-white">{itemB.style}</td>
              </tr>

              {/* Safe Margins Compliance */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-medium text-slate-400">YouTube UI Safe Zone</td>
                <td className="py-3 px-4">
                  <span
                    className={`font-semibold ${
                      safetyA.status === 'safe' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {safetyA.message}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`font-semibold ${
                      safetyB.status === 'safe' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {safetyB.message}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
