
import React, { useState, useRef } from 'react';
import { generateVisual, editImageWithNano } from '../services/geminiService';
import { ToolType, AIModelType } from '../types';
import { validateImageFile } from '../services/security';

const REMIX_TEMPLATES = [
  { id: 'style-morph', label: 'Neural Morph', icon: '🎨', desc: 'Transform aesthetic style' },
  { id: 'env-swap', label: 'Universe Swap', icon: '🌍', desc: 'Change environmental context' },
  { id: 'detail-up', label: 'Detail Synthesis', icon: '💎', desc: 'Enhance and refine textures' },
];

const ANALYTICAL_MODELS = [
  { id: 'gemini-3-flash-preview', label: 'Flash 3.0', desc: 'Logic & Reasoning', color: 'text-orange-400' },
  { id: 'gemini-2.5-flash-image', label: 'Flash Nano', desc: 'High-Speed Visuals', color: 'text-cyan-400' },
];

const CreativeSuite: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('video-gen');
  const [selectedModel, setSelectedModel] = useState<AIModelType>('gemini-2.5-flash-image');
  const [selectedTemplate, setSelectedTemplate] = useState(REMIX_TEMPLATES[0].id);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const check = validateImageFile(file);
      if (!check.valid) {
        setError(check.error ?? 'Invalid file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setSourcePreview(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleRemix = async () => {
    if (!prompt) return;
    
    setLoading(true);
    setError(null);
    try {
      if (sourcePreview) {
        // High-speed Flash Remix
        const res = await editImageWithNano(sourcePreview, 'image/jpeg', prompt, selectedModel);
        setResult(res);
      } else {
        // High-speed Text-to-Visual
        const res = await generateVisual({ prompt, aspectRatio: '16:9', model: selectedModel });
        setResult(res);
      }
    } catch (err: any) {
      setError(err.message || "Neural synthesis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-tools" className="px-6 py-24 bg-zinc-950 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">
            Flash Synthesis Hub
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white italic uppercase">
            Viral <span className="text-orange-500">Remix Studio</span>.
          </h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Latency-Zero Neural Operations.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-8 rounded-[40px] border-white/5 space-y-8 shadow-3xl">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Core Processor</h4>
                <div className="grid grid-cols-1 gap-2">
                  {ANALYTICAL_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id as AIModelType)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedModel === m.id ? 'bg-orange-500/10 border-orange-500/50' : 'bg-zinc-950 border-white/5'
                      }`}
                    >
                      <span className={`text-[10px] font-black uppercase ${selectedModel === m.id ? 'text-white' : 'text-zinc-500'}`}>{m.label}</span>
                      <p className="text-[7px] text-zinc-600 uppercase tracking-tighter mt-1">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Neural Template</h4>
                <div className="grid grid-cols-1 gap-2">
                  {REMIX_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedTemplate === t.id ? 'bg-orange-500/10 border-orange-500/50' : 'bg-zinc-950 border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{t.icon}</span>
                        <span className={`text-[10px] font-black uppercase ${selectedTemplate === t.id ? 'text-white' : 'text-zinc-500'}`}>{t.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Remix Directive</h4>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the neural reconstruction..."
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 text-white text-sm outline-none focus:ring-1 focus:ring-orange-500/50 min-h-[100px]"
                />
              </div>

              <button
                onClick={handleRemix}
                disabled={loading || !prompt}
                className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] shadow-2xl text-xs transition-all disabled:opacity-20"
              >
                {loading ? 'Synthesizing...' : 'Execute Remix'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square glass rounded-[40px] border border-white/5 bg-zinc-900 flex items-center justify-center relative cursor-pointer group overflow-hidden shadow-2xl"
              >
                {sourcePreview ? (
                  <img src={sourcePreview} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center opacity-30 group-hover:opacity-50 transition-opacity">
                    <span className="text-6xl block">🖼️</span>
                    <p className="text-[10px] font-black uppercase mt-2">Source Layer</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleUpload} />
              </div>

              <div className="aspect-square glass rounded-[40px] border border-white/5 bg-black flex items-center justify-center relative shadow-inner overflow-hidden">
                {result ? (
                   <img src={result} className="w-full h-full object-contain animate-in zoom-in duration-500" />
                ) : loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(249,115,22,0.3)]" />
                    <span className="text-[10px] text-orange-500 font-black uppercase animate-pulse">Flash Processing...</span>
                  </div>
                ) : (
                  <div className="text-center opacity-10">
                    <span className="text-[120px] block leading-none">⚡</span>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] mt-4">Buffer Idle</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mt-12 p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-center">
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CreativeSuite;
