import React from 'react';
import { LookEntry, gradeColor } from '../data/scoring';
import { ClockIcon } from './icons';

const Sparkline: React.FC<{ scores: number[] }> = ({ scores }) => {
  if (scores.length < 2) return null;
  const w = 100, h = 32, pad = 4;
  const max = 100, min = 0;
  const step = (w - pad * 2) / (scores.length - 1);
  const points = scores
    .map((s, i) => {
      const x = pad + i * step;
      const y = pad + (1 - (s - min) / (max - min)) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="url(#spark)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="spark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const HistoryView: React.FC<{
  looks: LookEntry[];
  onOpen: (look: LookEntry) => void;
}> = ({ looks, onOpen }) => {
  const chronological = [...looks].reverse();

  return (
    <div className="h-full overflow-y-auto px-5 pt-6 pb-32 scrollbar-none">
      <h1 className="text-2xl font-extrabold tracking-tight mb-1">History</h1>
      <p className="text-white/50 text-sm mb-6">{looks.length} {looks.length === 1 ? 'look' : 'looks'} rated</p>

      {looks.length === 0 ? (
        <div className="text-center text-white/40 text-sm py-24">
          <p className="text-4xl mb-3">🗂️</p>
          Your rated looks will show up here.
        </div>
      ) : (
        <>
          {chronological.length >= 2 && (
            <div className="glass-bright rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2 text-white/60 text-xs font-medium">
                <ClockIcon width={14} height={14} /> Score trend
              </div>
              <Sparkline scores={chronological.map((l) => l.overall)} />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5">
            {looks.map((look) => (
              <button
                key={look.id}
                onClick={() => onOpen(look)}
                className="relative aspect-square rounded-2xl overflow-hidden active:scale-95 transition-transform"
              >
                <img src={look.image} alt="Look" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div
                  className={`absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-gradient-to-br ${gradeColor(look.grade)} flex items-center justify-center text-[10px] font-black text-black`}
                >
                  {look.grade}
                </div>
                <p className="absolute bottom-1.5 left-1.5 text-xs font-bold">{look.overall}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryView;
