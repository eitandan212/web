
import React, { useState } from 'react';
import { autoDirectTemplate, generateVisual } from '../services/geminiService';
import { ScriptResponse } from '../types';

const VIRAL_TEMPLATES = [
  { id: 'emotional-story', label: 'Emotional Narrative', icon: '🥺', style: 'Close-ups, warm lighting, slow pacing, heart-felt.' },
  { id: '3-step-guide', label: '3-Step Viral Guide', icon: '💡', style: 'Fast cuts, text overlays, bright lighting, energetic.' },
  { id: 'pov-narrative', label: 'POV Perspective', icon: '🤳', style: 'First-person view, shaky cam, authentic feel, high energy.' },
  { id: 'product-reveal', label: 'Luxury Reveal', icon: '💎', style: 'Shadowy, slow reveal, neon accents, high-end.' },
];

interface RenderedScene extends ScriptResponse {
  imageUrl?: string;
  isRendering?: boolean;
}

const ScriptGenSection: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(VIRAL_TEMPLATES[0].id);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [scenes, setScenes] = useState<RenderedScene[]>([]);
  const [status, setStatus] = useState('');

  const handleCreate = async () => {
    if (!prompt) return;
    setLoading(true);
    setScenes([]);
    setStatus('Analyzing Trend Structure...');

    try {
      const storyboard = await autoDirectTemplate(selectedTemplate, prompt);
      const initialScenes = storyboard.map(s => ({ ...s, isRendering: false }));
      setScenes(initialScenes);

      for (let i = 0; i < initialScenes.length; i++) {
        setStatus(`Rendering Neural Frame ${i + 1}...`);
        setScenes(prev => prev.map((s, idx) => idx === i ? { ...s, isRendering: true } : s));
        
        try {
          // Fixed error: Module '"../services/geminiService"' has no exported member 'renderSceneFrame'.
          // Using generateVisual which provides the required functionality.
          const imageUrl = await generateVisual({
            prompt: initialScenes[i].visualPrompt,
            aspectRatio: '16:9',
            model: 'gemini-2.5-flash-image'
          });
          setScenes(prev => prev.map((s, idx) => idx === i ? { ...s, imageUrl, isRendering: false } : s));
        } catch (err) {
          console.error(err);
          setScenes(prev => prev.map((s, idx) => idx === i ? { ...s, isRendering: false } : s));
        }
      }
      setStatus('Remix Storyboard Ready.');
    } catch (err) {
      console.error(err);
      setStatus('Strategy Error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="script-gen" className="px-6 py-32 bg-black overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.4em]">
            Trend-Aware Script Architect
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white italic uppercase">
            Viral <span className="text-purple-500">Script Gen</span>.
          </h2>
          <p className="max-w-xl mx-auto text-zinc-500 text-sm font-bold uppercase tracking-widest">
            Select a high-retention viral structure and adapt your topic instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2 mb-4">Select Viral Trend</h3>
            <div className="grid grid-cols-1 gap-3">
              {VIRAL_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`group p-6 rounded-3xl border text-left transition-all ${
                    selectedTemplate === t.id ? 'bg-zinc-900 border-purple-500 shadow-2xl' : 'bg-zinc-950 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl">{t.icon}</span>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${selectedTemplate === t.id ? 'text-white' : 'text-zinc-500'}`}>{t.label}</span>
                  </div>
                  <p className="text-[8px] text-zinc-600 uppercase tracking-tighter line-clamp-1">{t.style}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="glass rounded-[40px] border-white/5 p-8 shadow-3xl">
              <div className="flex flex-col gap-6">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter subject for trend adaptation (e.g. 'Coffee Shop', 'New Tech Startup')..."
                    className="w-full bg-zinc-950 border border-white/5 rounded-3xl p-6 text-white text-sm focus:ring-1 focus:ring-purple-500/50 outline-none min-h-[120px]"
                  />
                  <button
                    onClick={handleCreate}
                    disabled={loading || !prompt}
                    className="absolute bottom-4 right-4 px-10 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-2xl disabled:opacity-30"
                  >
                    {loading ? 'Synthesizing...' : 'Architect Script'}
                  </button>
                </div>

                {status && (
                  <div className="flex items-center gap-3 px-4">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em]">{status}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {scenes.length > 0 ? scenes.map((s, i) => (
                    <div key={i} className="flex flex-col gap-4 group">
                      <div className="relative aspect-video glass rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 group-hover:border-purple-500/30 transition-all">
                        {s.imageUrl ? (
                          <img src={s.imageUrl} className="w-full h-full object-cover" />
                        ) : s.isRendering ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                             <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2" />
                             <span className="text-[8px] font-black text-purple-500 uppercase">Rendering...</span>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <span className="text-3xl">🎬</span>
                          </div>
                        )}
                      </div>
                      <div className="px-2">
                        <div className="text-[9px] font-black text-zinc-500 uppercase mb-1">Hook Sequence 0{s.scene}</div>
                        <p className="text-[11px] text-zinc-400 font-medium leading-relaxed line-clamp-2 italic">"{s.description}"</p>
                      </div>
                    </div>
                  )) : (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="aspect-video glass rounded-3xl border border-white/5 opacity-10" />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScriptGenSection;
