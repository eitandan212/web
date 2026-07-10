import React from 'react';
import { LookEntry } from '../data/scoring';
import { UserIcon, FlameIcon, StarIcon, SparkleIcon } from './icons';

const ProfileView: React.FC<{ looks: LookEntry[]; streak: number }> = ({ looks, streak }) => {
  const total = looks.length;
  const avg = total ? Math.round(looks.reduce((a, l) => a + l.overall, 0) / total) : 0;
  const best = total ? Math.max(...looks.map((l) => l.overall)) : 0;

  const badges = [
    { icon: SparkleIcon, label: 'First Look', unlocked: total >= 1 },
    { icon: StarIcon, label: 'Trendsetter', unlocked: best >= 80 },
    { icon: StarIcon, label: 'Perfectionist', unlocked: best >= 95 },
    { icon: FlameIcon, label: '3-Day Streak', unlocked: streak >= 3 },
    { icon: FlameIcon, label: '7-Day Streak', unlocked: streak >= 7 },
  ];

  return (
    <div className="h-full overflow-y-auto px-5 pt-6 pb-32 scrollbar-none">
      <div className="flex items-center gap-4 mb-7">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-amber-400 flex items-center justify-center shadow-lg shadow-fuchsia-900/40">
          <UserIcon width={30} height={30} className="text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Your Style Profile</h1>
          <p className="text-white/50 text-sm">{total} {total === 1 ? 'look' : 'looks'} rated so far</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-7">
        <Stat label="Average" value={avg} />
        <Stat label="Best" value={best} />
        <Stat label="Streak" value={streak} suffix={streak === 1 ? 'day' : 'days'} />
      </div>

      <h3 className="font-bold text-sm mb-3 text-white/70">Badges</h3>
      <div className="grid grid-cols-2 gap-2.5">
        {badges.map((b) => (
          <div
            key={b.label}
            className={`flex items-center gap-2.5 rounded-2xl p-3 border ${
              b.unlocked ? 'glass-bright border-white/10' : 'border-white/5 opacity-40'
            }`}
          >
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${b.unlocked ? 'bg-gradient-to-br from-fuchsia-500/40 to-amber-400/40' : 'bg-white/5'}`}>
              <b.icon width={17} height={17} />
            </div>
            <span className="text-xs font-semibold leading-tight">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: number; suffix?: string }> = ({ label, value, suffix }) => (
  <div className="glass-bright rounded-2xl p-3.5 text-center">
    <p className="text-2xl font-black tabular-nums">{value}</p>
    <p className="text-[11px] text-white/50 mt-0.5">{suffix ? `${label} (${suffix})` : label}</p>
  </div>
);

export default ProfileView;
