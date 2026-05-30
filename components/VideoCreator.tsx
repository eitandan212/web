
import React, { useState } from 'react';
import { generateVisual } from '../services/geminiService';
import { AIModelType, GeneratedImage } from '../types';

const STYLE_PRESETS = [
  { id: 'none', label: 'Raw', icon: '📷' },
  { id: 'cinematic', label: 'Cinematic', icon: '🎬', prompt: 'Cinematic lighting, photorealistic, highly detailed.' },
  { id: 'cyberpunk', label: 'Neon Soul', icon: '🌃', prompt: 'Cyberpunk aesthetic, neon glow, wet streets, futuristic.' },
  { id: 'studio', label: 'Studio Pro', icon: '💡', prompt: 'Studio portrait lighting, clean background, sharp focus, professional.' },
];

const AI_MODELS = [
  { id: 'gemini-3-flash-preview', label: 'Gemini 3 Flash', desc: 'Optimal Speed', color: 'text-blue-400' },
  // Fix: updated gemini-2.5-flash-lite-latest to gemini-flash-lite-latest per guidelines
  { id: 'gemini-flash-lite-latest', label: 'Gemini 2.5 Flash Lite', desc: 'Ultra Fast', color: 'text-emerald-400' },
];

const VideoCreator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModelType>('gemini-3-flash-preview');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('16:9');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setError(null);
    setLoading(true);
    setResultUrl(null);

    try {
      const style = STYLE_PRESETS.find(s => s.id === 'cinematic')?.prompt || '';
      const finalPrompt = `${prompt}. ${style}`;

      const url = await generateVisual({
        prompt: finalPrompt,
        aspectRatio,
        model: selectedModel
      });
      
      setResultUrl(url);
    } catch (err: any) {
      setError(err.message || "Synthesis failed. Ensure your API key is correct.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="video-creator" className="px-6 py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[9px] font-black uppercase tracking-[0.3em]">
                Fast Synthesis Mode
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white italic uppercase">
                Asset <span className="text-blue-500">Creator</span>.
              </h2>
            </div>

            <div className="glass rounded-[32px] p-8 border-white/5 shadow-3xl space-y-8">
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Intelligence Model</label>
                 <div className="grid grid-cols-1 gap-3">
                   {AI_MODELS.map((m) => (
                     <button
                        key={m.id}
                        onClick={() => setSelectedModel(m.id as AIModelType)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          selectedModel === m.id ? 'bg-zinc-800 border-blue-500/50 ring-1 ring-blue-500/20' : 'bg-zinc-900 border-white/5'
                        }`}
                     >
                       <div className={`text-[10px] font-black uppercase tracking-widest ${m.color}`}>{m.label}</div>
                       <div className="text-[8px] text-zinc-500 mt-1 uppercase tracking-tighter">{m.desc}</div>
                     </button>
                   ))}
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Canvas Format</label>
                 <select 
                  value={aspectRatio} 
                  onChange={(e:any) => setAspectRatio(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none"
                 >
                   <option value="1:1">1:1 Square</option>
                   <option value="16:9">16:9 Landscape</option>
                   <option value="9:16">9:16 Portrait</option>
                 </select>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Visual Directive</label>
                 <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your vision..."
                    className="w-full bg-zinc-950/80 border border-white/5 rounded-2xl p-6 text-white focus:ring-1 focus:ring-blue-500/50 min-h-[120px] text-sm outline-none"
                 />
               </div>

               <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt}
                  className="w-full py-6 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:scale-[1.02] transition-all disabled:opacity-30"
               >
                 {loading ? 'Synthesizing...' : 'Generate Asset'}
               </button>
               {error && (
                 <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-500 text-[10px] text-center font-bold uppercase">{error}</p>
                 </div>
               )}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-video glass rounded-[40px] overflow-hidden border border-white/5 bg-[#0a0a0c] flex items-center justify-center shadow-2xl group">
              {resultUrl ? (
                <div className="relative w-full h-full">
                  <img src={resultUrl} className="w-full h-full object-contain" alt="Generated Visual" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => downloadImage(resultUrl, `Export_${Date.now()}`)}
                      className="px-8 py-3 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-110 transition-transform shadow-2xl"
                    >
                      Export
                    </button>
                  </div>
                </div>
              ) : loading ? (
                <div className="text-center p-12 space-y-6">
                  <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <h4 className="text-xl font-black text-white italic uppercase tracking-[0.2em]">Synthesis Active...</h4>
                </div>
              ) : (
                <div className="text-center opacity-20 space-y-4">
                  <span className="text-6xl">💎</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-500">Engine Ready</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoCreator;
