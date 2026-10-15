import React from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { SHOWCASE_TEMPLATES, ShowcaseTemplate } from '../data/showcaseTemplates';

interface TemplatesGalleryProps {
  onSelectTemplate: (template: ShowcaseTemplate) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ onSelectTemplate }) => {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-6 px-4">
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <span>High-Converting Thumbnail Templates</span>
          <span className="text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            1280 × 720
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Engineered for maximum Click-Through Rate (CTR). Click any template to load its prompt, style, and text layout into the studio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SHOWCASE_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col"
          >
            {/* 16:9 Thumbnail Visual */}
            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
              <img
                src={tmpl.imageUrl}
                alt={tmpl.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-amber-300">
                {tmpl.badge}
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[11px] font-mono text-white">
                1280×720
              </div>
            </div>

            {/* Template Specs & Info */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {tmpl.title}
                  </h3>
                  <span className="text-xs text-slate-500 capitalize">
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tmpl.prompt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-500">Color Grade:</span>{' '}
                  <span className="text-slate-300 font-medium">{tmpl.colorPalette}</span>
                </div>
                <button
                  onClick={() => onSelectTemplate(tmpl)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
