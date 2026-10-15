import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Eye,
  Grid,
  Shield,
  Smartphone,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
} from 'lucide-react';
import { TextOverlayConfig } from '../types/thumbnail';
import { SafeZonesGuide } from './SafeZonesGuide';
import { MobileFeedMockup } from './MobileFeedMockup';
import { downloadThumbnail, copyThumbnailToClipboard } from '../utils/canvasExport';

interface ThumbnailPreviewProps {
  imageUrl: string;
  isGenerating: boolean;
  generationStep: string;
  textConfig: TextOverlayConfig;
  onUpdateTextConfig: (config: Partial<TextOverlayConfig>) => void;
  promptDescription?: string;
}

export const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  imageUrl,
  isGenerating,
  generationStep,
  textConfig,
  onUpdateTextConfig,
  promptDescription,
}) => {
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [showRuleOfThirds, setShowRuleOfThirds] = useState(false);
  const [showMobileMockup, setShowMobileMockup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg'>('png');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handleDownload = async () => {
    try {
      await downloadThumbnail(imageUrl, textConfig, downloadFormat, 'youtube-thumbnail-1280x720');
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleCopy = async () => {
    const success = await copyThumbnailToClipboard(imageUrl, textConfig);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Viewport Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="font-mono font-semibold text-amber-400">1280 × 720</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">16:9 Standard</span>
        </div>

        {/* Inspection Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              showSafeZones
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Toggle YouTube duration pill and mobile safe zone"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Safe Margins</span>
          </button>

          <button
            onClick={() => setShowRuleOfThirds(!showRuleOfThirds)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              showRuleOfThirds
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Toggle 3x3 composition grid"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rule of Thirds</span>
          </button>

          <button
            onClick={() => setShowMobileMockup(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Test appearance in YouTube mobile feed"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Mobile CTR Test</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-950 rounded-md p-0.5 border border-slate-800">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(75, prev - 25))}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 px-1">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(150, prev + 25))}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 16:9 Canvas Frame */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex items-center justify-center p-2 sm:p-4">
        <div
          className="relative aspect-video w-full max-w-4xl rounded-xl overflow-hidden shadow-inner bg-slate-900 border border-slate-800/80 transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
        >
          {/* Base Image */}
          <img
            src={imageUrl}
            alt="YouTube thumbnail preview"
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Safe Zones & Guides Layer */}
          <SafeZonesGuide
            showSafeZones={showSafeZones}
            showRuleOfThirds={showRuleOfThirds}
          />

          {/* Live Text Overlay Layer */}
          {textConfig.enabled && (textConfig.title || textConfig.subtitle || textConfig.badgeEnabled) && (
            <div
              className={`absolute p-4 sm:p-6 z-10 flex flex-col pointer-events-none select-none ${
                textConfig.position === 'top-left'
                  ? 'top-4 left-4 items-start text-left'
                  : textConfig.position === 'bottom-left'
                  ? 'bottom-6 left-4 items-start text-left'
                  : textConfig.position === 'top-right'
                  ? 'top-4 right-4 items-end text-right'
                  : textConfig.position === 'center-top'
                  ? 'top-4 left-1/2 -translate-x-1/2 items-center text-center'
                  : 'top-1/4 left-1/4 items-start text-left'
              }`}
              style={{
                transform: textConfig.rotation ? `rotate(${textConfig.rotation}deg)` : undefined,
              }}
            >
              {/* Badge sticker */}
              {textConfig.badgeEnabled && textConfig.badgeText && (
                <div
                  className="px-3 py-1 rounded-md text-xs sm:text-sm font-extrabold text-white mb-2 shadow-lg uppercase tracking-wider"
                  style={{
                    backgroundColor: textConfig.badgeColor || '#e11d48',
                    fontFamily: `'${textConfig.font}', sans-serif`,
                  }}
                >
                  {textConfig.badgeText}
                </div>
              )}

              {/* Main Title */}
              {textConfig.title && (
                <div
                  className="font-black leading-[1.08] tracking-tight uppercase whitespace-pre-line"
                  style={{
                    fontFamily: `'${textConfig.font}', Impact, sans-serif`,
                    fontSize: `clamp(18px, 4.2vw, ${textConfig.titleSize * 0.9}px)`,
                    color: textConfig.badgeStyle === 'highlight' ? '#000000' : textConfig.textColor,
                    backgroundColor:
                      textConfig.badgeStyle === 'highlight'
                        ? '#eab308'
                        : textConfig.badgeStyle === 'box'
                        ? 'rgba(0,0,0,0.85)'
                        : 'transparent',
                    padding: textConfig.badgeStyle !== 'none' ? '4px 12px' : undefined,
                    borderRadius: textConfig.badgeStyle !== 'none' ? '8px' : undefined,
                    textShadow:
                      textConfig.strokeWidth > 0
                        ? `-2px -2px 0 ${textConfig.strokeColor}, 2px -2px 0 ${textConfig.strokeColor}, -2px 2px 0 ${textConfig.strokeColor}, 2px 2px 0 ${textConfig.strokeColor}, 0 4px 12px ${textConfig.glowColor}`
                        : `0 4px 12px ${textConfig.glowColor}`,
                  }}
                >
                  {textConfig.title}
                </div>
              )}

              {/* Subtitle */}
              {textConfig.subtitle && (
                <div
                  className="font-bold text-slate-100 mt-1 uppercase tracking-wide whitespace-pre-line"
                  style={{
                    fontFamily: `'${textConfig.font}', sans-serif`,
                    fontSize: `clamp(12px, 2vw, ${textConfig.subtitleSize * 0.8}px)`,
                    textShadow:
                      textConfig.strokeWidth > 0
                        ? `-1px -1px 0 ${textConfig.strokeColor}, 1px -1px 0 ${textConfig.strokeColor}, -1px 1px 0 ${textConfig.strokeColor}, 1px 1px 0 ${textConfig.strokeColor}, 0 2px 8px rgba(0,0,0,0.9)`
                        : '0 2px 8px rgba(0,0,0,0.9)',
                  }}
                >
                  {textConfig.subtitle}
                </div>
              )}
            </div>
          )}

          {/* Generating Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 animate-spin flex items-center justify-center" />
                <div className="absolute inset-1 rounded-xl bg-slate-950 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Creating YouTube Thumbnail
              </h3>
              <p className="text-xs text-amber-300 font-mono">
                {generationStep || 'Synthesizing 1280×720 16:9 canvas...'}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Optimizing contrast & focal subject for mobile CTR</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setDownloadFormat('png')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                downloadFormat === 'png'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PNG (Lossless)
            </button>
            <button
              onClick={() => setDownloadFormat('jpeg')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                downloadFormat === 'jpeg'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              JPG (Compressed)
            </button>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Native 1280×720px resolution
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Copy high-res image to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download Thumbnail</span>
          </button>
        </div>
      </div>

      {/* Mobile Feed Mockup Modal */}
      <MobileFeedMockup
        isOpen={showMobileMockup}
        onClose={() => setShowMobileMockup(false)}
        imageUrl={imageUrl}
        textConfig={textConfig}
        videoTitle={promptDescription || textConfig.title || 'Incredible Breakthrough'}
      />
    </div>
  );
};
