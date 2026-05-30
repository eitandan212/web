
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="px-6 py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white italic">V</div>
          <span className="text-xl font-bold tracking-tight text-white">Visionary <span className="text-blue-400">AI</span></span>
        </div>

        <div className="flex gap-8 text-sm text-zinc-500">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="flex gap-4">
           {['twitter', 'github', 'discord'].map(social => (
             <div key={social} className="w-10 h-10 rounded-full glass flex items-center justify-center cursor-pointer hover:border-white/20 transition-all">
                <div className="w-4 h-4 bg-zinc-600 rounded-sm" />
             </div>
           ))}
        </div>
      </div>
      <div className="text-center mt-12 text-zinc-600 text-[10px] tracking-widest uppercase">
        © 2024 Visionary AI Platforms Inc. Built for the era of intelligence.
      </div>
    </footer>
  );
};

export default Footer;
