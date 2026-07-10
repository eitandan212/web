import React from 'react';
import { LookEntry, gradeColor } from '../data/scoring';
import { ChevronLeftIcon, SparkleIcon, CheckIcon } from './icons';
import ScoreRing from './ScoreRing';

const Result: React.FC<{
  look: LookEntry;
  readOnly?: boolean;
  onClose: () => void;
  onSave?: () => void;
}> = ({ look, readOnly, onClose, onSave }) => (
  <div className="h-full overflow-y-auto pb-32 scrollbar-none">
    <div className="sticky top-0 z-10 flex items-center gap-3 px-5 pt-6 pb-3 bg-gradient-to-b from-[#0a0a12] to-transparent">
      <button onClick={onClose} className="p-1.5 -ml-1.5 active:scale-90 transition-transform">
        <ChevronLeftIcon width={22} height={22} />
      </button>
      <h1 className="font-bold text-lg">{readOnly ? 'Look Detail' : 'Your Look Score'}</h1>
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

      <div className="flex justify-center mb-7">
        <ScoreRing score={look.overall} size={168} stroke={13}>
          <div className="text-center">
            <p className="text-4xl font-black tabular-nums">{look.overall}</p>
            <p className="text-[11px] text-white/50 tracking-wide uppercase">Look Score</p>
          </div>
        </ScoreRing>
      </div>

      <div className="space-y-3 mb-7">
        {look.categories.map((c) => (
          <div key={c.key}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-white/70 font-medium">{c.label}</span>
              <span className="font-bold tabular-nums">{c.score}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-amber-300 transition-all duration-700"
                style={{ width: `${c.score}%` }}
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
    </div>
  </div>
);

export default Result;
