
import React, { useState } from 'react';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const NeuralIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blue-500" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
    <circle cx="12" cy="12" r="3" className="fill-blue-400 animate-pulse" />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

/**
 * SECURITY WARNING: This component provides NO real authentication.
 * All login buttons simply call onLoginSuccess() after a cosmetic delay.
 * The email input is not validated or sent anywhere.
 *
 * For production, replace with a real auth provider (Firebase Auth,
 * Auth0, Supabase Auth, etc.) and validate sessions server-side.
 */
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authStep, setAuthStep] = useState<'form' | 'scanning' | 'success'>('form');

  if (!isOpen) return null;

  const handleAuth = (e?: React.FormEvent) => {
    e?.preventDefault();
    setAuthStep('scanning');

    // WARNING: No real authentication — cosmetic animation only.
    // Replace with actual OAuth / credential verification for production.
    setTimeout(() => {
      setAuthStep('success');
      setTimeout(() => {
        onLoginSuccess();
        onClose();
        setAuthStep('form');
      }, 1500);
    }, 2000);
  };

  const QuickLoginButton = ({ icon: Icon, label, color }: { icon: React.FC, label: string, color: string }) => (
    <button 
      onClick={() => handleAuth()}
      className={`group relative flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-800 transition-all duration-300 overflow-hidden`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r ${color}`} />
      <div className="relative z-10 group-hover:scale-110 transition-transform">
        <Icon />
      </div>
      <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 group-hover:text-white transition-colors">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative w-full max-w-md glass rounded-[40px] border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.1)] overflow-hidden animate-float">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
        
        <div className="p-10 relative z-10">
          {authStep === 'form' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20 rotate-3">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase italic">Initialize Session</h3>
                <p className="text-zinc-500 text-xs font-medium tracking-wide">Select your neural gateway for instant access.</p>
              </div>

              <div className="space-y-3">
                <QuickLoginButton icon={GoogleIcon} label="Connect via Google" color="from-red-500 to-orange-500" />
                <QuickLoginButton icon={GitHubIcon} label="Auth via GitHub" color="from-zinc-500 to-zinc-400" />
                <QuickLoginButton icon={NeuralIcon} label="Neural Direct Link" color="from-blue-500 to-purple-500" />
              </div>

              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">or</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <input 
                  type="email" 
                  required
                  placeholder="ARCHITECT_ID"
                  className="w-full bg-zinc-900/80 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700 font-mono text-xs"
                />
                <button 
                  type="submit"
                  className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl"
                >
                  Request Credential Sync
                </button>
              </form>
            </div>
          )}

          {authStep === 'scanning' && (
            <div className="py-16 text-center space-y-10">
              <div className="relative w-48 h-48 mx-auto">
                <div className="absolute inset-0 border-[1px] border-blue-500/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin duration-[2000ms]" />
                <div className="absolute inset-4 bg-blue-500/5 rounded-full flex items-center justify-center">
                   <div className="w-12 h-1 bg-blue-400 shadow-[0_0_20px_blue] animate-[scan_1.5s_ease-in-out_infinite]" />
                   <span className="text-5xl opacity-20">🛰️</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-black text-white uppercase tracking-[0.3em] italic">Verification In Progress</h4>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {authStep === 'success' && (
            <div className="py-16 text-center space-y-8 animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                  <span className="text-5xl">⚡</span>
               </div>
               <div className="space-y-2">
                <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase">Link Established</h4>
                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.4em]">Neural Node: Active</p>
               </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-40px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(40px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
