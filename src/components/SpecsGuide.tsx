import React from 'react';
import { CheckCircle2, AlertTriangle, Smartphone, ShieldCheck, Eye, Layers } from 'lucide-react';

export const SpecsGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Official YouTube Thumbnail Specifications
        </h2>
        <p className="text-xs text-slate-400">
          ThumbGenius AI automatically enforces all YouTube platform standards and mobile safe-zone geometry.
        </p>
      </div>

      {/* Core Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Resolution
          </span>
          <span className="text-xl font-bold text-amber-400 font-mono">1280 × 720</span>
          <span className="text-[11px] text-slate-400">Standard HD (minimum 640px)</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Aspect Ratio
          </span>
          <span className="text-xl font-bold text-amber-400 font-mono">16:9</span>
          <span className="text-[11px] text-slate-400">Standard YouTube player format</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Max File Size
          </span>
          <span className="text-xl font-bold text-amber-400 font-mono">2 MB</span>
          <span className="text-[11px] text-slate-400">Standard uploads (PNG or JPG)</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Image Formats
          </span>
          <span className="text-xl font-bold text-amber-400 font-mono">PNG / JPG</span>
          <span className="text-[11px] text-slate-400">Also WEBP & GIF compatible</span>
        </div>
      </div>

      {/* Safe Zones & YouTube Obstacles */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            Safe Margins & UI Obstacles on YouTube
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Bottom-Right Timestamp Obstacle</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              YouTube overlays a black duration badge (e.g. <span className="font-mono text-white bg-slate-900 px-1 py-0.5 rounded">12:45</span>) on the bottom-right corner of all thumbnails. Never put important faces, titles, or logos there.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Smartphone className="w-4 h-4" />
              <span>Mobile Feed Readability</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Over 70% of YouTube views occur on smartphones where your 1280x720 thumbnail renders at roughly 320x180px or even smaller (120x68px in search). Bold text and high contrast are mandatory.
            </p>
          </div>
        </div>
      </div>

      {/* Pro Creator CTR Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            Algorithm-Proven CTR Guidelines
          </h3>
        </div>

        <ul className="space-y-3 text-xs text-slate-300">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>The 3-to-4 Word Rule:</strong> Keep thumbnail text under 4 words. The thumbnail text should hook curiosity rather than duplicate the video title.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Intense Rim Lighting:</strong> Light the subject from behind or the sides with complementary rim lighting (blue & amber or green & magenta) to separate them from the background.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>High Saturation & Contrast:</strong> Standard camera photos look muddy in feeds. ThumbGenius AI applies punchy grading so colors pop even in dark mode YouTube feeds.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Heavy Outlines & Glow:</strong> Adding a 3-5px outline or backing box around title words guarantees legibility across white, dark, or busy image backgrounds.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
