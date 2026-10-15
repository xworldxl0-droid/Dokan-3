import React from 'react';
import { X, Smartphone, ThumbsUp, MessageSquare, Share2, MoreVertical } from 'lucide-react';
import { TextOverlayConfig } from '../types/thumbnail';

interface MobileFeedMockupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  textConfig: TextOverlayConfig;
  videoTitle?: string;
  channelName?: string;
}

export const MobileFeedMockup: React.FC<MobileFeedMockupProps> = ({
  isOpen,
  onClose,
  imageUrl,
  textConfig,
  videoTitle = 'The Most Incredible Breakthrough in AI Tech [Explained]',
  channelName = 'TechCraft Studio',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">
              YouTube Mobile Feed Test
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Smartphone bezel simulation */}
        <div className="p-4 bg-slate-950 flex flex-col gap-3">
          <div className="text-[11px] text-slate-400 text-center pb-1">
            Previewing at simulated 360px mobile width to test thumbnail readability and focal punch:
          </div>

          {/* YouTube Video Card */}
          <div className="bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800/80 shadow-md">
            {/* 16:9 Thumbnail preview with live overlay */}
            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
              <img
                src={imageUrl}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
              />

              {/* Live text overlay scaled for mockup */}
              {textConfig.enabled && textConfig.title && (
                <div
                  className={`absolute p-2.5 z-10 flex flex-col ${
                    textConfig.position === 'top-left'
                      ? 'top-1 left-1 items-start text-left'
                      : textConfig.position === 'bottom-left'
                      ? 'bottom-2 left-1 items-start text-left'
                      : textConfig.position === 'top-right'
                      ? 'top-1 right-1 items-end text-right'
                      : 'top-1 left-1/2 -translate-x-1/2 items-center text-center'
                  }`}
                  style={{
                    transform: textConfig.rotation ? `rotate(${textConfig.rotation}deg)` : undefined,
                  }}
                >
                  {textConfig.badgeEnabled && textConfig.badgeText && (
                    <div
                      className="px-1.5 py-0.5 rounded text-[9px] font-extrabold text-white mb-1 shadow-sm uppercase tracking-wide"
                      style={{ backgroundColor: textConfig.badgeColor || '#e11d48' }}
                    >
                      {textConfig.badgeText}
                    </div>
                  )}

                  <div
                    className="font-black leading-tight tracking-tight uppercase"
                    style={{
                      fontFamily: `'${textConfig.font}', sans-serif`,
                      fontSize: `${Math.max(12, textConfig.titleSize * 0.28)}px`,
                      color: textConfig.badgeStyle === 'highlight' ? '#000000' : textConfig.textColor,
                      backgroundColor:
                        textConfig.badgeStyle === 'highlight'
                          ? '#eab308'
                          : textConfig.badgeStyle === 'box'
                          ? 'rgba(0,0,0,0.85)'
                          : 'transparent',
                      padding: textConfig.badgeStyle !== 'none' ? '2px 4px' : undefined,
                      borderRadius: textConfig.badgeStyle !== 'none' ? '4px' : undefined,
                      textShadow:
                        textConfig.strokeWidth > 0
                          ? `-1px -1px 0 ${textConfig.strokeColor}, 1px -1px 0 ${textConfig.strokeColor}, -1px 1px 0 ${textConfig.strokeColor}, 1px 1px 0 ${textConfig.strokeColor}`
                          : '0 2px 4px rgba(0,0,0,0.8)',
                    }}
                  >
                    {textConfig.title}
                  </div>

                  {textConfig.subtitle && (
                    <div
                      className="font-bold text-slate-100 text-[10px] mt-0.5"
                      style={{
                        fontFamily: `'${textConfig.font}', sans-serif`,
                        textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                      }}
                    >
                      {textConfig.subtitle}
                    </div>
                  )}
                </div>
              )}

              {/* YouTube duration badge */}
              <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono font-medium px-1.5 py-0.5 rounded">
                14:28
              </div>
            </div>

            {/* YouTube video metadata below thumbnail */}
            <div className="p-3 flex gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                TC
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                  {videoTitle}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                  <span>{channelName}</span>
                  <span>·</span>
                  <span>412K views</span>
                  <span>·</span>
                  <span>18 hours ago</span>
                </div>
              </div>
              <button className="text-slate-400 shrink-0 self-start p-0.5">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Readability Assessment */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 space-y-1.5">
            <div className="font-semibold text-amber-400 text-[11px] uppercase tracking-wider">
              Mobile Readability Checklist
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>16:9 Aspect Ratio (1280×720 native target)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Safe margins respected for mobile app view</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-amber-400 font-bold">💡</span>
              <span>Rule of thumb: text should have $\le 4$ words for maximum mobile CTR</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
