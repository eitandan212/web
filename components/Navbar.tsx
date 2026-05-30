
import React from 'react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLoginToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLoginToggle }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (!isLoggedIn) {
      onLoginToggle();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-[32px] px-8 py-3 border-white/5 shadow-2xl relative group/nav">
        {/* Animated accent border */}
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-purple-500/0 opacity-0 group-hover/nav:opacity-100 transition-opacity pointer-events-none" />
        
        <div 
          className="flex items-center gap-4 group cursor-pointer relative z-10"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center transform group-hover:-rotate-6 transition-transform duration-500">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
                <circle cx="12" cy="12" r="3" className="fill-blue-500 animate-pulse" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Visionary</span>
            <span className="text-[9px] font-black tracking-[0.4em] text-blue-500 uppercase ml-1">AI_STUDIO_V4</span>
          </div>
        </div>
        
        <div className="hidden xl:flex items-center gap-12 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
          <button onClick={() => scrollTo('video-creator')} className="hover:text-white transition-colors relative group/link uppercase">
            Neural_Engine
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover/link:w-full transition-all" />
          </button>
          <button onClick={() => scrollTo('ai-tools')} className="hover:text-white transition-colors relative group/link uppercase">
            Creative_Suite
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover/link:w-full transition-all" />
          </button>
          <button onClick={() => scrollTo('social-manager')} className="hover:text-white transition-colors relative group/link uppercase">
            Distribution
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover/link:w-full transition-all" />
          </button>
          <button onClick={() => scrollTo('tutorial')} className="hover:text-white transition-colors relative group/link uppercase">
            Academy
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover/link:w-full transition-all" />
          </button>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          {!isLoggedIn ? (
            <button 
              onClick={onLoginToggle}
              className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1"
            >
              Secure Access
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Node_Online</span>
            </div>
          )}
          
          <button 
            onClick={isLoggedIn ? () => scrollTo('video-creator') : onLoginToggle}
            className={`px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl ${
              isLoggedIn 
              ? 'bg-zinc-900 text-zinc-400 border border-white/5 hover:bg-zinc-800' 
              : 'bg-white text-black hover:scale-105 active:scale-95 shadow-white/5'
            }`}
          >
            {isLoggedIn ? 'Studio Console' : 'Initialize Studio'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
