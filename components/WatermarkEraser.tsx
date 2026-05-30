
import React, { useState, useRef } from 'react';
import { removeWatermark } from '../services/geminiService';

const WatermarkEraser: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [target, setTarget] = useState('watermark or logo');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSourceImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleErase = async () => {
    if (!sourceImage) return;
    setLoading(true);
    setError(null);
    setStatus('Scanning Visual Layers...');

    try {
      const cleansed = await removeWatermark(sourceImage, target);
      setResult(cleansed);
      setStatus('Neural Cleanse Complete.');
    } catch (err: any) {
      setError(err.message || "Cleansing interrupted.");
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = `Cleansed_Asset_${Date.now()}.jpg`;
    a.click();
  };

  return (
    <section id="watermark-eraser" className="px-6 py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[9px] font-black uppercase tracking-[0.2em]">
            Neural Layer Cleansing
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white italic uppercase">
            Neural <span className="text-cyan-400">Eraser</span>.
          </h2>
          <p className="max-w-xl mx-auto text-zinc-500 text-sm font-bold uppercase tracking-widest">
            Remove watermarks, logos, and unwanted objects with pixel-perfect inpainting.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="glass p-8 rounded-[40px] border-white/5 space-y-8 shadow-3xl">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Source Asset</h4>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video glass rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-cyan-500/30 transition-all overflow-hidden relative group"
              >
                {sourceImage ? (
                  <img src={sourceImage} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center opacity-30 group-hover:opacity-50 transition-opacity">
                    <span className="text-5xl block mb-2">📸</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">Select Image / Frame</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleUpload} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">Target to Erase</h4>
              <input 
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g., 'the watermark in the bottom right corner'"
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 text-white text-sm outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            <button
              onClick={handleErase}
              disabled={loading || !sourceImage}
              className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] shadow-2xl shadow-cyan-500/20 text-xs transition-all disabled:opacity-30"
            >
              {loading ? 'Cleansing...' : 'Execute Neural Eraser'}
            </button>
          </div>

          <div className="aspect-video glass rounded-[40px] border-white/5 bg-black flex items-center justify-center relative shadow-2xl overflow-hidden group">
            {result ? (
              <div className="w-full h-full relative">
                <img src={result} className="w-full h-full object-contain animate-in fade-in duration-1000" />
                <button 
                  onClick={downloadResult}
                  className="absolute bottom-6 right-6 p-4 bg-cyan-500 text-black rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:scale-110 active:scale-95 flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">Export Clean Asset</span>
                </button>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] text-cyan-500 font-black uppercase animate-pulse">{status}</span>
                  <div className="w-32 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-cyan-500 origin-left animate-[shimmer_1.5s_infinite]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-10">
                <span className="text-[120px] block leading-none">🧼</span>
                <p className="text-[11px] font-black uppercase tracking-[0.6em] mt-8">Clean Output Preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WatermarkEraser;
