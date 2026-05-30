
import React from 'react';

const EditorShowcase: React.FC = () => {
  return (
    <section className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="relative glass rounded-3xl p-4 border-white/10 shadow-2xl animate-float">
          {/* Header of the mock editor */}
          <div className="flex items-center justify-between mb-4 px-4 py-2 border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">VisionaryWorkspace_v3.4.exe</div>
            <div className="w-12" />
          </div>

          <div className="grid grid-cols-12 gap-4 h-[450px]">
            {/* Left Sidebar */}
            <div className="col-span-2 flex flex-col gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 bg-zinc-800/50 rounded-lg border border-white/5 flex items-center justify-center text-zinc-600">
                  <div className="w-6 h-1 bg-zinc-700 rounded-full" />
                </div>
              ))}
              <div className="mt-auto p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] text-blue-400 font-bold uppercase text-center">
                AI Tracking ON
              </div>
            </div>

            {/* Main Preview */}
            <div className="col-span-8 relative group cursor-crosshair">
              <div className="w-full h-full bg-black rounded-xl overflow-hidden relative">
                <img 
                  src="https://picsum.photos/seed/cyberpunk/1200/800" 
                  alt="Video Preview" 
                  className="w-full h-full object-cover opacity-80"
                />
                {/* AI Overlays */}
                <div className="absolute top-1/4 left-1/3 w-32 h-32 border-2 border-blue-500 rounded-lg animate-pulse">
                  <div className="absolute -top-6 left-0 bg-blue-500 text-white text-[8px] px-1 font-bold">HUMAN_01: TRACKING</div>
                </div>
                <div className="absolute bottom-10 right-10 flex gap-2">
                   <div className="w-16 h-8 bg-purple-600/50 backdrop-blur-md rounded border border-purple-400/50 flex items-center justify-center text-[8px] font-bold">AUTO_ROTOSCOPE</div>
                   <div className="w-16 h-8 bg-blue-600/50 backdrop-blur-md rounded border border-blue-400/50 flex items-center justify-center text-[8px] font-bold">MOTION_VECTOR</div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="col-span-2 flex flex-col gap-4">
              <div className="p-3 bg-zinc-800/30 rounded-xl border border-white/5">
                <div className="text-[10px] text-zinc-500 mb-2">PROPERTIES</div>
                <div className="space-y-2">
                   <div className="h-2 w-full bg-zinc-700 rounded" />
                   <div className="h-2 w-3/4 bg-zinc-700 rounded" />
                   <div className="h-2 w-1/2 bg-blue-500/50 rounded" />
                </div>
              </div>
              <div className="flex-1 p-3 bg-zinc-800/30 rounded-xl border border-white/5">
                 <div className="text-[10px] text-zinc-500 mb-2">LAYER_STACK</div>
                 <div className="space-y-2">
                   <div className="h-4 bg-purple-500/20 border border-purple-500/30 rounded" />
                   <div className="h-4 bg-blue-500/20 border border-blue-500/30 rounded" />
                   <div className="h-4 bg-zinc-700/50 rounded" />
                 </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-4 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 h-24 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 bottom-0 w-[2px] bg-red-500 z-10 shadow-[0_0_10px_red]">
               <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full" />
            </div>
            <div className="flex items-end gap-1 h-full opacity-30">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="flex-1 bg-zinc-700" style={{ height: `${Math.random() * 80 + 20}%` }} />
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-4 px-10 flex gap-4">
               <div className="h-4 w-32 bg-blue-600/30 rounded-full border border-blue-500/50" />
               <div className="h-4 w-48 bg-purple-600/30 rounded-full border border-purple-500/50" />
               <div className="h-4 w-20 bg-emerald-600/30 rounded-full border border-emerald-500/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorShowcase;
