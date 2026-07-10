import React, { useEffect, useState } from 'react';
import { LookEntry, gradeColor } from '../data/scoring';
import { shareLook } from '../data/shareCard';
import { ChevronLeftIcon, SparkleIcon, CheckIcon, ShareIcon, TrashIcon } from './icons';
import ScoreRing from './ScoreRing';

// count from 0 to target in sync with the ring fill
const useCountUp = (target: number, duration = 1100) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
};

const Result: React.FC<{
  look: LookEntry;
  readOnly?: boolean;
  prevScore?: number | null;
  onClose: () => void;
  onSave?: () => void;
  onDelete?: () => void;
}> = ({ look, readOnly, prevScore, onClose, onSave, onDelete }) => {
  const counted = useCountUp(look.overall);
  const [barsIn, setBarsIn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setBarsIn(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const delta = prevScore == null ? null : look.overall - prevScore;

  const handleShare = async () => {
    setSharing(true);
    try {
      await shareLook(look);
    } finally {
      setSharing(false);
    }
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
      return;
    }
    onDelete?.();
  };

  return (
    <div className="h-full overflow-y-auto pb-32 scrollbar-none">
      <div className="sticky top-0 z-10 flex items-center gap-3 px-5 pt-6 pb-3 bg-gradient-to-b from-[#0a0a12] to-transparent">
        <button onClick={onClose} className="p-1.5 -ml-1.5 active:scale-90 transition-transform" aria-label="Back">
          <ChevronLeftIcon width={22} height={22} />
        </button>
        <h1 className="font-bold text-lg flex-1">{readOnly ? 'Look Detail' : 'Your Look Score'}</h1>
        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex items-center gap-1.5 glass-bright rounded-full px-3.5 py-2 text-xs font-semibold active:scale-95 transition-transform disabled:opacity-50"
        >
          <ShareIcon width={15} height={15} /> {sharing ? 'Rendering…' : 'Share'}
        </button>
      </div>

      <div className="px-5">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 mb-6">
          <img src={look.image} alt="Look" className="w-full h-64 object-cover" />
          <div
            className={`absolute top-3 right-3 h-10 w-10 rounded-full bg-gradient-to-br ${gradeColor(look.grade)} flex items-center justify-center text-base font-black text-black shadow-lg`}
          >
            {look.grade}
          </div>
        </div>

        <div className="flex flex-col items-center mb-7">
          <ScoreRing score={look.overall} size={168} stroke={13}>
            <div className="text-center">
              <p className="text-4xl font-black tabular-nums">{counted}</p>
              <p className="text-[11px] text-white/50 tracking-[0.15em] uppercase">Look Score</p>
            </div>
          </ScoreRing>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${
                look.engine === 'ai'
                  ? 'bg-fuchsia-500/15 text-fuchsia-300'
                  : 'bg-white/10 text-white/50'
              }`}
            >
              <SparkleIcon width={11} height={11} /> {look.engine === 'ai' ? 'AI Stylist' : 'Quick Scan'}
            </span>
            {delta !== null && delta !== 0 && (
              <span
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${
                  delta > 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                }`}
              >
                {delta > 0 ? '▲' : '▼'} {Math.abs(delta)} vs last look
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-7">
          {look.categories.map((c, i) => (
            <div key={c.key}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/70 font-medium">{c.label}</span>
                <span className="font-bold tabular-nums">{c.score}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-amber-300"
                  style={{
                    width: barsIn ? `${c.score}%` : '0%',
                    transition: `width 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.12}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="glass-bright rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <SparkleIcon width={16} height={16} className="text-amber-300" />
            <h3 className="font-bold text-sm">Stylist Tips</h3>
          </div>
          <ul className="space-y-2.5">
            {look.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/70 leading-snug">
                <span className="text-fuchsia-400 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {!readOnly && (
          <button
            onClick={onSave}
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold text-sm rounded-2xl py-3.5 active:scale-95 transition-transform"
          >
            <CheckIcon width={18} height={18} /> Save to History
          </button>
        )}

        {readOnly && onDelete && (
          <button
            onClick={handleDelete}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold active:scale-95 transition-all ${
              confirmDelete
                ? 'bg-rose-500 text-white'
                : 'glass-bright text-rose-300'
            }`}
          >
            <TrashIcon width={17} height={17} />
            {confirmDelete ? 'Tap again to delete' : 'Remove from History'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Result;
