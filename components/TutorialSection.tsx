
import React from 'react';

const TutorialSection: React.FC = () => {
  return (
    <section id="tutorial" className="px-6 py-12 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Neural Academy v4.0
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white italic">
            Command the <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">Future</span> of Cinema.
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          {/* Video Player Side */}
          <div className="lg:col-span-8 relative aspect-video bg-black rounded-[40px] overflow-hidden border border-white/5 shadow-2xl group">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  alt="Neural Engine Tutorial"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-40 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.6)] border border-white/20">
                      <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-white border-b-[14px] border-b-transparent ml-2" />
                    </div>
                  </div>
                </div>

                {/* HUD Elements */}
                <div className="absolute bottom-8 left-8 flex flex-col gap-2">
                   <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Training_Module_01: SYNCING_MOTION</div>
                   <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-blue-500 animate-[progress_2s_ease-in-out_infinite]" />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:col-span-4 space-y-4">
             {[
               { 
                 step: "01", 
                 title: "Define Objective", 
                 desc: "Enter a high-fidelity temporal prompt describing movement, lighting, and cinematic style.",
                 icon: "🖋️" 
               },
               { 
                 step: "02", 
                 title: "Inject Context", 
                 desc: "Upload a starting frame or a reference video to ground the AI in your specific visual universe.",
                 icon: "🧬" 
               },
               { 
                 step: "03", 
                 title: "Iterative Synthesis", 
                 desc: "Use the Magic Edit tools to refine specific portions of your generation without re-rendering everything.",
                 icon: "✨" 
               }
             ].map((item, i) => (
               <div key={i} className="glass p-6 rounded-3xl border-white/5 hover:border-blue-500/20 transition-all group">
                 <div className="flex gap-4 items-start">
                    <div className="text-xs font-mono text-zinc-700 font-bold group-hover:text-blue-500/50 transition-colors mt-1">{item.step}</div>
                    <div>
                       <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                         <span>{item.icon}</span> {item.title}
                       </h4>
                       <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
               </div>
             ))}
             
             <button className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all mt-4">
               Access Neural Documentation
             </button>
          </div>
        </div>

        {/* Guidance Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 glass rounded-[32px] border-emerald-500/10">
            <h5 className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Tips for Success
            </h5>
            <p className="text-xs text-zinc-400 leading-relaxed italic">
              "For realistic motion, include camera movement keywords like 'Slow tracking shot' or 'Cinematic orbit' in your prompt."
            </p>
          </div>
          <div className="p-8 glass rounded-[32px] border-purple-500/10">
            <h5 className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" /> Lighting Engine
            </h5>
            <p className="text-xs text-zinc-400 leading-relaxed italic">
              "Describe the time of day and light source. 'Golden hour rim lighting' yields 40% higher detail in neural renders."
            </p>
          </div>
          <div className="p-8 glass rounded-[32px] border-orange-500/10">
            <h5 className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> File Standards
            </h5>
            <p className="text-xs text-zinc-400 leading-relaxed italic">
              "Ensure source images are high contrast. The engine performs best with 1080p source reference materials."
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
};

export default TutorialSection;
