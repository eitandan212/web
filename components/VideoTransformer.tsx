
import React, { useState, useRef } from 'react';
import { editImageWithNano } from '../services/geminiService';

const VideoTransformer: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResultUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransform = async () => {
    if (!imagePreview || !prompt) return;
    setLoading(true);
    setError(null);
    try {
      // Fixed error: Module '"../services/geminiService"' has no exported member 'editImage'.
      // Using editImageWithNano which handles visual transformations for both images and frames.
      const url = await editImageWithNano(imagePreview, 'image/png', prompt);
      setResultUrl(url);
    } catch (err: any) {
      setError(err.message || "Remix failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="visual-transformer" className="px-6 py-24 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
            Global Language Support
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 italic uppercase">
            Neural <span className="text-yellow-500">Remix</span>.
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-500 text-sm font-bold uppercase tracking-widest">
            Transform source assets with zero language barriers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="glass p-8 rounded-[40px] border-white/5 space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-zinc-900 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-yellow-500/30 transition-colors"
            >
              {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="text-center"><span className="text-4xl block mb-2">🖼️</span><span className="text-zinc-600 font-bold uppercase tracking-widest text-[9px]">Upload Image (Any Language)</span></div>}
              <input type="file" ref={fileInputRef} hidden onChange={handleUpload} />
            </div>
            <textarea 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your remix (He, En, Ru, Arb...)" 
              className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 text-white text-sm outline-none focus:ring-1 focus:ring-yellow-500/50"
            />
            <button 
              onClick={handleTransform}
              disabled={loading || !imagePreview}
              className="w-full py-5 bg-yellow-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 shadow-xl shadow-yellow-500/10"
            >
              {loading ? 'Processing Neural Threads...' : 'Transform Reality'}
            </button>
          </div>

          <div className="aspect-square glass rounded-[40px] border-white/5 flex items-center justify-center overflow-hidden relative shadow-inner">
            {resultUrl ? (
              <img src={resultUrl} className="w-full h-full object-contain" />
            ) : loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] text-yellow-500 font-black uppercase">Reconstructing...</span>
              </div>
            ) : (
              <div className="text-center opacity-10 grayscale">
                 <span className="text-8xl">✨</span>
                 <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Remix</p>
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoTransformer;
