
import React, { useState, useRef } from 'react';
import { editImageWithNano } from '../services/geminiService';
import { AIModelType } from '../types';
import { validateImageFile } from '../services/security';

const IMAGE_MODELS = [
  { id: 'gemini-2.5-flash-image', label: 'Flash Nano', desc: 'Fast & efficient editing', color: 'text-cyan-400' },
  { id: 'gemini-3-flash-preview', label: 'Flash 3.0', desc: 'Enhanced reasoning', color: 'text-blue-400' },
  { id: 'gemini-3-pro-image-preview', label: 'Pro Image', desc: 'Highest detail synthesis', color: 'text-purple-400' },
];

const ImageRemix: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModelType>('gemini-2.5-flash-image');
  const [sourceFile, setSourceFile] = useState<string | null>(null);
  const [sourceMime, setSourceMime] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileRef = useRef<HTMLInputElement>(null);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const check = validateImageFile(file);
      if (!check.valid) {
        setError(check.error ?? 'Invalid file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSourceFile(reader.result as string);
        setSourceMime(file.type);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!prompt || !sourceFile) return;

    // Mandatory API key selection for gemini-3-pro-image-preview
    if (selectedModel === 'gemini-3-pro-image-preview') {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey?.();
      if (!hasKey) {
        await (window as any).aistudio?.openSelectKey?.();
        // Assuming success per guidelines to avoid race conditions
      }
    }

    setLoading(true);
    setError(null);
    try {
      const res = await editImageWithNano(sourceFile, sourceMime, prompt, selectedModel);
      setResultImage(res);
    } catch (err: any) {
      console.error(err);
      // Handle key selection errors per guidelines
      if (err.message?.includes("Requested entity was not found.")) {
        setError("API Key Error: Paid project not found. Please re-select your key.");
        await (window as any).aistudio?.openSelectKey?.();
      } else {
        setError(err.message || "Pixel reconstruction interrupted.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="image-remix" className="px-6 py-24 bg-[#050505] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
            Static Asset Modification Node
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 italic uppercase text-white">
            Nano <span className="text-cyan-400">Image Architect</span>.
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
            Manipulate source pixels with lightning speed using Gemini Nano series models.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="glass p-8 rounded-[40px] border-white/5 space-y-6 shadow-3xl">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Model Selection</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {IMAGE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id as AIModelType)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedModel === m.id ? 'bg-cyan-500/10 border-cyan-500/50 shadow-xl' : 'bg-zinc-950 border-white/5'
                    }`}
                  >
                    <div className={`text-[9px] font-black uppercase tracking-widest ${selectedModel === m.id ? m.color : 'text-zinc-500'}`}>{m.label}</div>
                    <p className="text-[7px] text-zinc-600 uppercase tracking-tighter leading-tight mt-1">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div 
              onClick={() => fileRef.current?.click()}
              className="aspect-video bg-zinc-950 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden relative group"
            >
              {sourceFile ? (
                <img src={sourceFile} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center opacity-40">
                  <span className="text-4xl block">🖼️</span>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-2">Upload Source Layer</p>
                </div>
              )}
              <input type="file" ref={fileRef} hidden accept="image/*" onChange={onUpload} />
            </div>

            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Inject modification directive... (e.g. 'Turn the person into a hologram')"
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-6 text-white text-sm outline-none focus:ring-1 focus:ring-cyan-500/50 min-h-[120px]"
            />

            <button 
              onClick={handleEdit}
              disabled={loading || !prompt || !sourceFile}
              className="w-full py-5 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all disabled:opacity-20 shadow-xl"
            >
              {loading ? 'Reconstructing Pixels...' : 'Execute Remix'}
            </button>
          </div>

          <div className="aspect-video glass rounded-[40px] border-white/5 bg-zinc-900 flex items-center justify-center relative overflow-hidden shadow-2xl">
            {resultImage ? (
              <div className="w-full h-full relative animate-in fade-in duration-700">
                <img src={resultImage} className="w-full h-full object-contain" />
                <a 
                  href={resultImage} 
                  download="Nano_Remix_Master.png"
                  className="absolute bottom-6 right-6 px-8 py-3 bg-cyan-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl"
                >
                  Export PNG
                </a>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] text-cyan-500 font-black uppercase tracking-widest">Nano Processing...</span>
              </div>
            ) : (
              <div className="text-center opacity-10">
                <span className="text-[100px] leading-none">🎨</span>
                <p className="text-[11px] font-black uppercase tracking-[0.5em] mt-4">Projection Idle</p>
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

export default ImageRemix;
