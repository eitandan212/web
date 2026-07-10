import React, { useRef } from 'react';
import { LookEntry, gradeColor } from '../data/scoring';
import { CameraIcon, GalleryIcon, FlameIcon, SparkleIcon, ChevronLeftIcon, GearIcon } from './icons';
import ScoreRing from './ScoreRing';

const Capture: React.FC<{
  lastLook: LookEntry | null;
  streak: number;
  totalLooks: number;
  aiEnabled: boolean;
  onSelectFile: (file: File) => void;
  onOpenLast: () => void;
  onOpenSettings: () => void;
}> = ({ lastLook, streak, totalLooks, aiEnabled, onSelectFile, onOpenLast, onOpenSettings }) => {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelectFile(file);
    e.target.value = '';
  };

  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'Late night fit?' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="h-full overflow-y-auto px-5 pt-6 pb-32 scrollbar-none">
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-white/50 text-xs font-medium tracking-wide uppercase">{greeting}</p>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            Rate my look <SparkleIcon width={18} height={18} className="text-amber-300" />
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 glass-bright rounded-full px-3 py-1.5">
              <FlameIcon width={16} height={16} className="text-orange-400" />
              <span className="text-sm font-bold">{streak}</span>
            </div>
          )}
          <button
            onClick={onOpenSettings}
            className="relative p-2 glass-bright rounded-full active:scale-90 transition-transform"
            aria-label="AI Stylist settings"
          >
            <GearIcon width={18} height={18} className="text-white/70" />
            <span
              className={`absolute top-0.5 right-0.5 h-2 w-2 rounded-full ${
                aiEnabled ? 'bg-emerald-400' : 'bg-white/25'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl p-6 mb-6 bg-gradient-to-br from-fuchsia-600/30 via-rose-500/20 to-amber-400/20 border border-white/10">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="relative">
          <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
            <CameraIcon width={26} height={26} />
          </div>
          <h2 className="text-xl font-bold mb-1">Snap today's outfit</h2>
          <p className="text-white/60 text-sm mb-5">
            {aiEnabled
              ? 'A real AI stylist will review your fit, colors and styling.'
              : 'Instant on-device style scan — connect the AI stylist in settings for a real review.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => cameraRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-semibold text-sm rounded-2xl py-3 active:scale-95 transition-transform"
            >
              <CameraIcon width={18} height={18} /> Take Photo
            </button>
            <button
              onClick={() => galleryRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 glass-bright font-semibold text-sm rounded-2xl py-3 active:scale-95 transition-transform"
            >
              <GalleryIcon width={18} height={18} /> Gallery
            </button>
          </div>
        </div>
      </div>

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

      {lastLook ? (
        <button
          onClick={onOpenLast}
          className="w-full flex items-center gap-4 glass-bright rounded-2xl p-3 active:scale-[0.98] transition-transform text-left"
        >
          <div className="relative shrink-0">
            <img src={lastLook.image} alt="Last look" className="h-16 w-16 rounded-xl object-cover" />
            <div
              className={`absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-gradient-to-br ${gradeColor(lastLook.grade)} flex items-center justify-center text-[11px] font-black text-black shadow`}
            >
              {lastLook.grade}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/50 mb-0.5">Last look</p>
            <p className="font-semibold truncate">Look Score {lastLook.overall}</p>
            <p className="text-xs text-white/40">{new Date(lastLook.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          </div>
          <ScoreRing score={lastLook.overall} size={44} stroke={4}>
            <span className="text-xs font-bold">{lastLook.overall}</span>
          </ScoreRing>
          <ChevronLeftIcon width={16} height={16} className="rotate-180 text-white/30 shrink-0" />
        </button>
      ) : (
        <div className="text-center text-white/40 text-sm py-10">
          <p className="text-4xl mb-3">📸</p>
          {totalLooks === 0 ? 'Rate your first look to get started.' : 'No looks yet today.'}
        </div>
      )}
    </div>
  );
};

export default Capture;
