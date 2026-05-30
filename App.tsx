
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import VideoCreator from './components/VideoCreator';
import AutoDirector from './components/AutoDirector';
import WatermarkEraser from './components/WatermarkEraser';
import ImageRemix from './components/ImageRemix';
import ScriptGenSection from './components/ScriptGenSection';
import CreativeSuite from './components/CreativeSuite';
import TutorialSection from './components/TutorialSection';
import SocialPublishing from './components/SocialPublishing';
import LiveAssistant from './components/LiveAssistant';
import SupportChat from './components/SupportChat';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setTimeout(() => {
      document.getElementById('video-creator')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  return (
    <div className="min-h-screen selection:bg-blue-500/30 bg-[#050505]">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLoginToggle={() => isLoggedIn ? setIsLoggedIn(false) : setIsAuthOpen(true)} 
      />
      
      <main className="relative">
        <Hero isLoggedIn={isLoggedIn} onOpenAuth={() => setIsAuthOpen(true)} />
        
        {isLoggedIn ? (
          <div className="animate-in fade-in slide-in-from-bottom-20 duration-1000">
            <VideoCreator />
            <div id="social-manager"><SocialPublishing /></div>
            <div id="auto-direct"><AutoDirector /></div>
            <div id="eraser"><WatermarkEraser /></div>
            <div id="image-edit"><ImageRemix /></div>
            <div id="ai-tools"><CreativeSuite /></div>
            <div id="tutorial"><TutorialSection /></div>
            <div id="script-gen"><ScriptGenSection /></div>
            <LiveAssistant />
            <SupportChat />
          </div>
        ) : (
          <div className="animate-in fade-in duration-1000">
            <Features />
            <div className="py-40 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none translate-y-20" />
              <div className="max-w-2xl mx-auto glass p-20 rounded-[80px] border-blue-500/10 shadow-[0_0_100px_rgba(59,130,246,0.05)] relative z-10">
                <div className="w-24 h-24 bg-zinc-900/50 rounded-[40px] flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-inner">
                   <span className="text-5xl">🗝️</span>
                </div>
                <h3 className="text-4xl font-black italic mb-6 uppercase tracking-tighter">Gateway Locked</h3>
                <p className="text-zinc-500 mb-14 text-sm tracking-wide leading-relaxed font-light">
                  Establish a secure neural link to activate the studio's generative temporal kernels and master creative tools.
                </p>
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="group px-16 py-6 bg-white text-black rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 mx-auto"
                >
                  Authorize Uplink
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default App;
