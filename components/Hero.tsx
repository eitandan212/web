
import React from 'react';

interface HeroProps {
  isLoggedIn: boolean;
  onOpenAuth: () => void;
}

const Hero: React.FC<HeroProps> = ({ isLoggedIn, onOpenAuth }) => {
  const scrollToTools = () => {
    if (isLoggedIn) {
      document.getElementById('video-creator')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      onOpenAuth();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden bg-[#050505]">
      {/* Background Lighting Layers */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none opacity-50" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border-white/10 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          {isLoggedIn ? 'Neural Interface Active' : 'Intelligence. In Motion.'}
        </div>
        
        <h1 className="text-6xl md:text-[120px] font-[900] tracking-[-0.05em] leading-[0.9] mb-8 text-white">
          <span className="inline-block opacity-40 italic">GENERATE</span> <br />
          <span className="glow-text text-white">REALITY</span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-zinc-500 text-lg md:text-xl mb-14 leading-relaxed font-light">
          Visionary AI is the elite neural engine for content architects. 
          Bridge the gap between imagination and production with 
          <span className="text-white font-medium"> zero-latency cinematic synthesis.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={scrollToTools}
            className="group relative px-12 py-6 bg-white rounded-2xl font-black text-black overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.15)]"
          >
            <span className="relative z-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em]">
              {isLoggedIn ? 'Launch Studio Console' : 'Initialize Gateway'}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"/>
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button 
            onClick={() => document.getElementById('tutorial')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-12 py-6 glass rounded-2xl font-black text-white text-[11px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all border-white/10"
          >
            Academy Briefing
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20">
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
          <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Scroll to Explore</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
