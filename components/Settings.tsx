import React, { useState } from 'react';
import { SparkleIcon, XIcon, CheckIcon } from './icons';

const Settings: React.FC<{
  apiKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}> = ({ apiKey, onSave, onClose }) => {
  const [value, setValue] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(value.trim());
    setSaved(true);
    setTimeout(onClose, 700);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full sm:w-[90%] glass rounded-t-3xl sm:rounded-3xl border border-white/10 p-5 pb-8 animate-tab-in">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <SparkleIcon width={17} height={17} className="text-amber-300" /> AI Stylist
          </h2>
          <button onClick={onClose} className="p-1.5 text-white/50 active:scale-90 transition-transform" aria-label="Close">
            <XIcon width={20} height={20} />
          </button>
        </div>
        <p className="text-white/55 text-sm leading-relaxed mb-4">
          The AI stylist is ready to go with the built-in key. To use your own free
          NVIDIA key instead, get one at{' '}
          <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" className="text-fuchsia-300 underline">
            build.nvidia.com
          </a>{' '}
          and paste it here — it's stored only in this browser. Clearing reverts to
          the built-in key.
        </p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="nvapi-…"
          autoComplete="off"
          className="w-full glass-bright rounded-2xl px-4 py-3 text-sm font-mono placeholder-white/30 outline-none focus:border-fuchsia-400/50 mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-semibold text-sm rounded-2xl py-3 active:scale-95 transition-transform"
          >
            {saved ? <CheckIcon width={17} height={17} /> : null} {saved ? 'Saved' : 'Save'}
          </button>
          {value && (
            <button
              onClick={() => setValue('')}
              className="glass-bright rounded-2xl px-5 py-3 text-sm font-semibold text-rose-300 active:scale-95 transition-transform"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
