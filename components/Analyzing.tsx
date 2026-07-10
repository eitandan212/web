import React, { useEffect, useState } from 'react';
import { SparkleIcon } from './icons';

const SCAN_STEPS = [
  'Scanning color palette…',
  'Measuring contrast…',
  'Checking lighting…',
  'Calculating Look Score…',
];

const AI_STEPS = [
  'Uploading to AI stylist…',
  'Studying the silhouette…',
  'Judging color coordination…',
  'Writing your style notes…',
];

// Purely presentational — App decides when the analysis is done and unmounts us.
const Analyzing: React.FC<{ image: string; ai?: boolean }> = ({ image, ai }) => {
  const steps = ai ? AI_STEPS : SCAN_STEPS;
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), ai ? 1400 : 450);
    return () => clearInterval(id);
  }, [ai, steps.length]);

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 text-center">
      <div className="relative w-56 h-72 rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-8">
        <img src={image} alt="Analyzing" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-fuchsia-400/40 to-transparent animate-scan" />
      </div>
      <div className="flex items-center gap-2 text-amber-300 mb-2">
        <SparkleIcon width={18} height={18} className="animate-pulse" />
        <span className="text-sm font-semibold">{ai ? 'AI stylist is looking' : 'Analyzing your look'}</span>
      </div>
      <p className="text-white/60 text-sm h-5 transition-all">{steps[step]}</p>
    </div>
  );
};

export default Analyzing;
