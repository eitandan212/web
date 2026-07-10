import React, { useEffect, useState } from 'react';
import { SparkleIcon } from './icons';

const STEPS = [
  'Scanning color palette…',
  'Measuring contrast…',
  'Checking lighting…',
  'Calculating Look Score…',
];

const Analyzing: React.FC<{ image: string; onDone: () => void }> = ({ image, onDone }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 420);
    const doneTimer = setTimeout(onDone, 1800);
    return () => {
      clearInterval(stepTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 text-center">
      <div className="relative w-56 h-72 rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-8">
        <img src={image} alt="Analyzing" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-fuchsia-400/40 to-transparent animate-scan" />
      </div>
      <div className="flex items-center gap-2 text-amber-300 mb-2">
        <SparkleIcon width={18} height={18} className="animate-pulse" />
        <span className="text-sm font-semibold">Analyzing your look</span>
      </div>
      <p className="text-white/60 text-sm h-5 transition-all">{STEPS[step]}</p>
    </div>
  );
};

export default Analyzing;
