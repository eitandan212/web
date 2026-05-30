
import React, { useState, useEffect, useRef } from 'react';
import { SocialPlatform, ConnectedAccount } from '../types';
import { generateCatchyTitle } from '../services/geminiService';
import { validateMediaFile } from '../services/security';

const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform === 'youtube') return <svg viewBox="0 0 24 24" className="w-full h-full fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
  if (platform === 'tiktok') return <svg viewBox="0 0 24 24" className="w-full h-full fill-current"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.59-1.01-.01 2.62.02 5.24-.02 7.86-.01 2.32-.5 4.79-2.05 6.44-1.63 1.84-4.25 2.51-6.57 2.13-2.5-.4-4.74-2.14-5.63-4.59-.97-2.5-.45-5.65 1.51-7.56 1.4-1.42 3.48-2.1 5.46-1.83.01 1.48-.01 2.97.01 4.46-.92-.22-1.99-.07-2.71.56-.88.75-1.11 2.11-.64 3.12.39.95 1.39 1.62 2.42 1.67 1.25.12 2.58-.51 3.07-1.66.27-.61.35-1.28.34-1.95.01-6.12.01-12.24.01-18.36z"/></svg>;
  return <svg viewBox="0 0 24 24" className="w-full h-full fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>;
};

const SocialPublishing: React.FC = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    { platform: 'youtube', username: '', isConnected: false },
    { platform: 'tiktok', username: '', isConnected: false },
    { platform: 'instagram', username: '', isConnected: false },
  ]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [payloadVideo, setPayloadVideo] = useState<string | null>(null);
  const [payloadPrompt, setPayloadPrompt] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleNewPayload = (e: any) => {
      setPayloadVideo(e.detail.url);
      setPayloadPrompt(e.detail.prompt);
      setGeneratedTitle('');
      setStatus('idle');
    };
    window.addEventListener('new-social-payload', handleNewPayload);
    return () => window.removeEventListener('new-social-payload', handleNewPayload);
  }, []);

  const handleLink = (platform: SocialPlatform) => {
    setTimeout(() => {
      setAccounts(prev => prev.map(acc => 
        acc.platform === platform ? { ...acc, isConnected: true, username: `@Neural_Director_${Math.floor(Math.random() * 99)}` } : acc
      ));
    }, 1000);
  };

  const togglePlatformSelection = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const autoGenerateTitle = async () => {
    if (!payloadVideo && !payloadPrompt) return;
    setIsGeneratingTitle(true);
    try {
      const context = payloadPrompt || "uploaded video";
      const result = await generateCatchyTitle(context, selectedPlatforms[0] || 'youtube');
      setGeneratedTitle(result.title);
    } catch (e) {
      console.error(e);
      setGeneratedTitle("Visionary Future: AI Evolution ⚡");
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handlePublish = () => {
    if (!generatedTitle || selectedPlatforms.length === 0) return;
    setIsUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setStatus('success');
      }
    }, 150);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const check = validateMediaFile(file);
      if (!check.valid) {
        alert(check.error ?? 'Invalid file.');
        return;
      }
      const url = URL.createObjectURL(file);
      setPayloadVideo(url);
      setPayloadPrompt(file.name);
      setGeneratedTitle('');
      setStatus('idle');
    }
  };

  return (
    <section id="social-manager" className="px-6 py-24 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Unified Distribution Node
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white italic">
            Social <span className="text-orange-500">Feed Manager</span>.
          </h2>
          <p className="text-zinc-500 mt-4 text-xs uppercase tracking-widest font-bold">Upload directly or generate viral titles for your content.</p>
        </div>

        {/* Account Selection */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {accounts.map((acc) => (
            <div key={acc.platform} className={`glass p-8 rounded-[40px] border-white/5 relative overflow-hidden transition-all ${acc.isConnected ? 'border-orange-500/30' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 p-4 rounded-2xl mb-4 border transition-all ${acc.isConnected ? 'bg-orange-500/20 border-orange-500/50 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]' : 'bg-zinc-900 border-white/10 text-zinc-600'}`}>
                  <PlatformIcon platform={acc.platform} />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1 italic">{acc.platform}</h3>
                {acc.isConnected ? (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-[10px] font-mono text-zinc-500">{acc.username}</p>
                    <button 
                      onClick={() => togglePlatformSelection(acc.platform)}
                      className={`px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${selectedPlatforms.includes(acc.platform) ? 'bg-orange-500 text-white shadow-lg' : 'bg-zinc-800 text-zinc-400'}`}
                    >
                      {selectedPlatforms.includes(acc.platform) ? 'Active Target' : 'Select Target'}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleLink(acc.platform)} className="mt-2 px-6 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Authorize Link</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto glass rounded-[40px] border-white/5 p-10 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Metadata Synthesis</label>
                  <button 
                    onClick={autoGenerateTitle} 
                    disabled={isGeneratingTitle || (!payloadVideo && !payloadPrompt)} 
                    className={`text-[9px] font-black uppercase flex items-center gap-2 transition-all ${isGeneratingTitle ? 'text-zinc-500 animate-pulse' : 'text-orange-500 hover:text-orange-400'}`}
                  >
                    <span className="text-xs">⚡</span> {isGeneratingTitle ? 'Synthesizing...' : 'Auto Title'}
                  </button>
                </div>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={generatedTitle}
                    onChange={(e) => setGeneratedTitle(e.target.value)}
                    placeholder="Describe content or click Auto Title..."
                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:ring-1 focus:ring-orange-500/50 placeholder:text-zinc-700"
                  />
                  {isGeneratingTitle && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />}
                </div>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video bg-zinc-950 rounded-3xl overflow-hidden border border-white/5 relative group cursor-pointer hover:border-orange-500/30 transition-all shadow-inner"
              >
                {payloadVideo ? (
                  <div className="w-full h-full relative">
                    <video src={payloadVideo} className="w-full h-full object-cover" controls onClick={(e) => e.stopPropagation()} />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-800 space-y-4">
                    <div className="w-20 h-20 bg-zinc-900 rounded-[28px] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                      <span className="text-4xl">🎞️</span>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Load Video to Manager</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="video/*" 
                  onChange={handleFileUpload} 
                />
              </div>
            </div>

            <div className="flex flex-col justify-end space-y-6">
              <div className="glass-bright p-6 rounded-3xl border-white/5 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-2 h-2 rounded-full bg-orange-500" />
                   <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Publishing Controls</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-zinc-500 uppercase font-black">Target Nodes</span>
                    <span className="text-[9px] text-white font-black">{selectedPlatforms.length || 'NONE'}</span>
                  </div>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2 px-2">
                  <div className="flex justify-between text-[9px] font-black text-orange-500 uppercase tracking-[0.1em]">
                    <span>Uploading Content...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
              
              {status === 'success' && (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                  <p className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.2em]">Published Successfully</p>
                </div>
              )}

              <button 
                onClick={handlePublish}
                disabled={isUploading || !payloadVideo || selectedPlatforms.length === 0 || !generatedTitle}
                className="w-full py-6 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-zinc-200 transition-all disabled:opacity-20 shadow-2xl relative overflow-hidden group"
              >
                {isUploading ? 'Executing Push...' : 'Publish to Feed'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialPublishing;
