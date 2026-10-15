import React from 'react';
import { Sparkles, Video, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'templates' | 'compare' | 'specs' | 'history';
  setActiveTab: (tab: 'studio' | 'templates' | 'compare' | 'specs' | 'history') => void;
  onNewGeneration: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewGeneration,
  historyCount,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-rose-950/40">
          <Video className="w-5 h-5 text-white stroke-[2.2]" />
        </div>
        <a
          href="#studio"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('studio');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-display"
        >
          <span>ThumbGenius</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-medium">
            AI
          </span>
        </a>
      </div>

      {/* Zone 2: 5 single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('studio')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'studio' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
          }`}
        >
          Thumbnail Studio
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'templates' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
          }`}
        >
          Pro Templates
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'compare' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
          }`}
        >
          Compare
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 ${
            activeTab === 'specs' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
          }`}
        >
          YouTube Specs
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
            activeTab === 'history' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
          }`}
        >
          <span>Creations</span>
          {historyCount > 0 && (
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
              {historyCount}
            </span>
          )}
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNewGeneration}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Thumbnail</span>
        </button>
      </div>
    </header>
  );
};
