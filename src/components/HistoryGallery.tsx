import React, { useState } from 'react';
import { Download, Trash2, ArrowRight, Eye, Columns } from 'lucide-react';
import { GeneratedThumbnailItem } from '../types/thumbnail';
import { downloadThumbnail } from '../utils/canvasExport';

interface HistoryGalleryProps {
  history: GeneratedThumbnailItem[];
  onSelectThumbnail: (item: GeneratedThumbnailItem) => void;
  onDeleteThumbnail: (id: string) => void;
  onClearAll: () => void;
  onOpenCompare: (itemA?: GeneratedThumbnailItem, itemB?: GeneratedThumbnailItem) => void;
}

export const HistoryGallery: React.FC<HistoryGalleryProps> = ({
  history,
  onSelectThumbnail,
  onDeleteThumbnail,
  onClearAll,
  onOpenCompare,
}) => {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const handleToggleSelect = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleLaunchCompare = () => {
    if (selectedForCompare.length === 2) {
      const a = history.find((h) => h.id === selectedForCompare[0]);
      const b = history.find((h) => h.id === selectedForCompare[1]);
      onOpenCompare(a, b);
    } else if (history.length >= 2) {
      onOpenCompare(history[0], history[1]);
    } else {
      onOpenCompare();
    }
  };

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <Eye className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">No saved creations yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
          Every thumbnail you generate or customize in the Studio will automatically be saved here so you can compare, revise, and download later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 flex flex-col gap-6 font-display">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Your Thumbnail Creations</h2>
          <p className="text-xs text-slate-400">
            {history.length} thumbnail{history.length === 1 ? '' : 's'} stored in your browser workspace
            {selectedForCompare.length > 0 && ` · ${selectedForCompare.length} selected for comparison`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length >= 2 && (
            <button
              onClick={handleLaunchCompare}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>
                {selectedForCompare.length === 2
                  ? 'Compare 2 Selected'
                  : 'Launch Compare Mode'}
              </span>
            </button>
          )}

          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Gallery</span>
          </button>
        </div>
      </div>

      {/* Grid of Creations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {history.map((item) => {
          const isSelected = selectedForCompare.includes(item.id);
          const selectionIndex = selectedForCompare.indexOf(item.id);
          const slotLabel = selectionIndex === 0 ? 'Slot A' : selectionIndex === 1 ? 'Slot B' : null;

          return (
            <div
              key={item.id}
              className={`group bg-slate-900 border rounded-xl overflow-hidden shadow-md flex flex-col transition-all ${
                isSelected ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                <img src={item.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                  {item.style}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-300">
                  1280×720
                </div>

                {/* Compare Selection Checkbox Badge */}
                <button
                  onClick={() => handleToggleSelect(item.id)}
                  className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer shadow-md ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                      : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
                  }`}
                  title="Toggle select for A/B comparison"
                >
                  {isSelected ? `✓ ${slotLabel}` : '+ Compare'}
                </button>
              </div>

              <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {item.prompt || item.textConfig.title || 'Custom thumbnail creation'}
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => onDeleteThumbnail(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete creation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const other = history.find((h) => h.id !== item.id) || item;
                        onOpenCompare(item, other);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                      title="Compare this thumbnail"
                    >
                      <Columns className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => downloadThumbnail(item.imageUrl, item.textConfig, 'png')}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Download PNG"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectThumbnail(item)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer"
                    >
                      <span>Edit in Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
