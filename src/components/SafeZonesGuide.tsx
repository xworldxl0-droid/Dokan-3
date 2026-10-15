import React from 'react';

interface SafeZonesGuideProps {
  showSafeZones: boolean;
  showRuleOfThirds: boolean;
}

export const SafeZonesGuide: React.FC<SafeZonesGuideProps> = ({
  showSafeZones,
  showRuleOfThirds,
}) => {
  if (!showSafeZones && !showRuleOfThirds) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Rule of Thirds grid */}
      {showRuleOfThirds && (
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border border-amber-500/20">
          <div className="border-r border-b border-amber-500/20" />
          <div className="border-r border-b border-amber-500/20" />
          <div className="border-b border-amber-500/20" />
          <div className="border-r border-b border-amber-500/20" />
          <div className="border-r border-b border-amber-500/20" />
          <div className="border-b border-amber-500/20" />
          <div className="border-r border-amber-500/20" />
          <div className="border-r border-amber-500/20" />
          <div />
        </div>
      )}

      {/* Safe Margins */}
      {showSafeZones && (
        <>
          {/* Outer unsafe margin boundary (80px equivalent relative margin) */}
          <div className="absolute inset-[6%] border-2 border-dashed border-rose-500/60 rounded-md">
            <span className="absolute -top-3 left-4 bg-rose-950/90 text-rose-300 text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/40">
              SAFE CONTENT ZONE (1280×720)
            </span>
          </div>

          {/* YouTube Bottom-Right Duration Badge Danger Area */}
          <div className="absolute bottom-[6%] right-[6%] w-[18%] h-[12%] min-w-[70px] min-h-[26px] bg-black/90 border border-rose-500/80 rounded flex flex-col items-center justify-center p-1 shadow-lg">
            <span className="text-[11px] font-mono font-bold text-white tracking-wider">
              14:28
            </span>
            <span className="text-[8px] font-medium text-rose-400 text-center leading-none mt-0.5">
              YouTube Time Badge
            </span>
          </div>

          {/* YouTube Top-Right Watch Later & Share Danger Zone */}
          <div className="absolute top-[6%] right-[6%] w-[9%] h-[14%] border border-rose-500/40 bg-black/40 rounded flex flex-col items-center justify-center p-1">
            <span className="text-[8px] font-mono text-rose-300 text-center">
              Watch Later
            </span>
          </div>
        </>
      )}
    </div>
  );
};
