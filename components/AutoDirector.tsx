
import React, { useState, useRef, useEffect } from 'react';
import { analyzeVideoForEdit, editImageWithNano } from '../services/geminiService';
import { AIModelType } from '../types';

const EDIT_MODES = [
  { id: 'auto-cut', label: 'Flash Smart Cut', icon: '✂️', desc: 'Neural pacing and moment detection' },
  { id: 'auto-text', label: 'Dynamic Captions', icon: '💬', desc: 'Context-aware script generation' },
  { id: 'vfx-style', label: 'Instant VFX', icon: '✨', desc: 'Apply neural filters and effects' },
];

const AutoDirector: React.FC = () => {
  const [sourceVideo, setSourceVideo] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [editMode, setEditMode] = useState('auto-cut');
  const [loading, setLoading] = useState(false);
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);
  const [resultFrame, setResultFrame] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceVideo(URL.createObjectURL(file));
      setAnalysis(null);
      setResultFrame(null);
      setError(null);
    }
  };

  const captureFrame = (): string => {
    if (!videoRef.current) return '';
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    return '';
  };

  const handleExecuteEdit = async () => {
    if (!sourceVideo || !prompt) return;
    setLoading(true);
    setError(null);
    setStatus('Syncing Flash Engine...');

    try {
      const frame = captureFrame();
      setStatus('Analyzing Neural Stream...');
      const result = await analyzeVideoForEdit(frame, `Edit directive: ${prompt}. Mode: ${editMode}`);
      setAnalysis(result);

      setStatus('Synthesizing Master Frame...');
      const res = await editImageWithNano(frame, 'image/jpeg', `Mode: ${editMode}. Prompt: ${prompt}. Visual Logic: ${result.visualEffectAdvice}`);
      setResultFrame(res);
      
      setStatus('Neural Master Ready.');
    } catch (err: any) {
      setError(err.message || "Synthesis interrupted.");
    } finally {
      setLoading(false);
    }
  };

  const recordMasterMP4 = async () => {
    if (!resultFrame) return;
    setIsRenderingVideo(true);
    setRenderProgress(0);
    setStatus('Mastering MP4 Stream...');

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = resultFrame;
    await new Promise((res) => (img.onload = res));

    // Recording Setup
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Visionary_Neural_Master_${Date.now()}.mp4`;
      a.click();
      setIsRenderingVideo(false);
      setStatus('Master Exported.');
    };

    recorder.start();

    // Cinematic Animation Loop (5 seconds)
    const duration = 5000;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setRenderProgress(Math.floor(progress * 100));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle cinematic zoom
      const scale = 1 + (progress * 0.05);
      const x = (canvas.width * (1 - scale)) / 2;
      const y = (canvas.height * (1 - scale)) / 2;
      
      ctx.drawImage(img, x, y, canvas.width * scale, canvas.height * scale);

      // Add "Neural" overlay effects
      ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 * Math.sin(elapsed / 200)})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        recorder.stop();
      }
    };

    animate();
  };

  return (
    <section id="auto-director" className="px-6 py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em]">
            Neural Core: Free Mastering Engine
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white italic uppercase">
            Neural <span className="text-emerald-500">Master MP4</span>.
          </h2>
          <p className="max-w-xl mx-auto text-zinc-500 text-sm font-bold uppercase tracking-widest">
            Analyze, remix, and export high-quality MP4 clips with zero costs.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-8 rounded-[40px] border-white/5 space-y-8 shadow-3xl">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Editor Directive</h4>
                <div className="grid grid-cols-1 gap-2">
                  {EDIT_MODES.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setEditMode(m.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        editMode === m.id ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg' : 'bg-zinc-950 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{m.icon}</span>
                        <div>
                          <div className={`text-[10px] font-black uppercase tracking-widest ${editMode === m.id ? 'text-white' : 'text-zinc-500'}`}>{m.label}</div>
                          <p className="text-[7px] text-zinc-600 uppercase tracking-tighter">{m.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Creative Instruction</h4>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Make it look like a high-budget cyberpunk film'"
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500/50 min-h-[100px]"
                />
              </div>

              <button
                onClick={handleExecuteEdit}
                disabled={loading || isRenderingVideo || !sourceVideo || !prompt}
                className="w-full py-6 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] shadow-2xl shadow-emerald-500/20 text-xs transition-all disabled:opacity-30"
              >
                {loading ? 'Processing...' : 'Generate Neural Remix'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Source Stream</h4>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video glass rounded-[40px] border border-white/5 bg-zinc-900 flex items-center justify-center relative cursor-pointer group overflow-hidden"
                >
                  {sourceVideo ? (
                    <video ref={videoRef} src={sourceVideo} className="w-full h-full object-cover" controls />
                  ) : (
                    <div className="text-center opacity-30 group-hover:opacity-50 transition-opacity">
                      <span className="text-5xl block mb-2">📼</span>
                      <p className="text-[10px] font-black uppercase tracking-widest">Load Source</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} hidden accept="video/*" onChange={handleUpload} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Master Preview</h4>
                <div className="aspect-video glass rounded-[40px] border border-white/5 bg-black flex items-center justify-center relative shadow-2xl overflow-hidden group">
                  <canvas 
                    ref={canvasRef} 
                    width={1280} 
                    height={720} 
                    className={`w-full h-full object-contain ${!resultFrame && 'hidden'}`} 
                  />
                  
                  {!resultFrame && !loading && !isRenderingVideo && (
                    <div className="text-center opacity-10">
                      <span className="text-8xl">🎬</span>
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] mt-4">Projection Idle</p>
                    </div>
                  )}

                  {(loading || isRenderingVideo) && (
                    <div className="flex flex-col items-center gap-4 text-center px-6">
                      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] text-emerald-500 font-black uppercase animate-pulse">
                        {isRenderingVideo ? `Rendering MP4: ${renderProgress}%` : status}
                      </span>
                    </div>
                  )}

                  {resultFrame && !isRenderingVideo && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                        onClick={recordMasterMP4}
                        className="px-10 py-4 bg-emerald-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
                       >
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                         Export Master MP4
                       </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {analysis && (
              <div className="glass p-8 rounded-[40px] border-emerald-500/20 space-y-6 animate-in slide-in-from-bottom-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">📊</div>
                    <h5 className="text-[11px] font-black text-white uppercase tracking-widest">Neural Mastering Insights</h5>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Suggested Script</span>
                    <div className="space-y-2">
                      {analysis.suggestedCaptions.map((c: string, i: number) => (
                        <div key={i} className="text-[11px] text-zinc-400 font-medium italic">"{c}"</div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Neural Cuts</span>
                    <div className="flex flex-wrap gap-2">
                      {analysis.smartCutPoints.map((t: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-white/5 rounded text-[9px] font-mono text-emerald-400 border border-emerald-500/10">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Color Logic</span>
                    <p className="text-[10px] text-zinc-500 leading-relaxed uppercase bg-white/5 p-3 rounded-xl">{analysis.visualEffectAdvice}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AutoDirector;
