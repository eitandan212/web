import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LookEntry, analyzeLook, computeStreak, fileToDataUrl, loadImage } from './data/scoring';
import Capture from './components/Capture';
import Analyzing from './components/Analyzing';
import Result from './components/Result';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import { HomeIcon, ClockIcon, UserIcon } from './components/icons';

type Tab = 'home' | 'history' | 'profile';
const STORAGE_KEY = 'lookrate.looks';

const loadStoredLooks = (): LookEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LookEntry[]) : [];
  } catch {
    return [];
  }
};

const App: React.FC = () => {
  const [tab, setTab] = useState<Tab>('home');
  const [looks, setLooks] = useState<LookEntry[]>(() => loadStoredLooks());
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [freshLook, setFreshLook] = useState<LookEntry | null>(null);
  const [viewingLook, setViewingLook] = useState<LookEntry | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(looks));
    } catch {
      // storage full or unavailable — the app still works for the session
    }
  }, [looks]);

  const streak = useMemo(() => computeStreak(looks), [looks]);
  const lastLook = looks[0] ?? null;

  const handleSelectFile = useCallback(async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    setPendingImage(dataUrl);
  }, []);

  const handleAnalyzed = useCallback(async () => {
    if (!pendingImage) return;
    const img = await loadImage(pendingImage);
    const analysis = analyzeLook(img);
    setFreshLook({
      id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      createdAt: Date.now(),
      image: pendingImage,
      ...analysis,
    });
    setPendingImage(null);
  }, [pendingImage]);

  const handleSaveLook = useCallback(() => {
    if (!freshLook) return;
    setLooks((prev) => [freshLook, ...prev]);
    setFreshLook(null);
    setTab('home');
  }, [freshLook]);

  const overlay = pendingImage ? 'analyzing' : freshLook ? 'result-fresh' : viewingLook ? 'result-view' : null;

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center sm:py-6 text-white">
      {/* Phone frame */}
      <div className="relative w-full h-screen sm:h-[860px] sm:max-w-[400px] sm:rounded-[44px] overflow-hidden bg-[#080810] sm:border sm:border-white/10 shadow-2xl shadow-black">
        {/* notch */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-40" />

        {/* ambient app background */}
        <div className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1024] via-[#0a0a12] to-black" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[120%] h-72 blur-[90px] opacity-25 bg-gradient-to-r from-fuchsia-600 to-amber-400" />
        </div>

        {/* Main scrollable view */}
        <div className="relative z-10 h-full pt-6 sm:pt-8">
          {overlay === 'analyzing' && pendingImage && (
            <Analyzing image={pendingImage} onDone={handleAnalyzed} />
          )}
          {overlay === 'result-fresh' && freshLook && (
            <Result look={freshLook} onClose={() => setFreshLook(null)} onSave={handleSaveLook} />
          )}
          {overlay === 'result-view' && viewingLook && (
            <Result look={viewingLook} readOnly onClose={() => setViewingLook(null)} />
          )}
          {!overlay && tab === 'home' && (
            <Capture
              lastLook={lastLook}
              streak={streak}
              totalLooks={looks.length}
              onSelectFile={handleSelectFile}
              onOpenLast={() => lastLook && setViewingLook(lastLook)}
            />
          )}
          {!overlay && tab === 'history' && (
            <HistoryView looks={looks} onOpen={(look) => setViewingLook(look)} />
          )}
          {!overlay && tab === 'profile' && <ProfileView looks={looks} streak={streak} />}
        </div>

        {/* Bottom nav */}
        {!overlay && (
          <nav className="absolute bottom-0 inset-x-0 z-20 h-[64px] glass border-t border-white/10 flex items-stretch">
            <NavButton active={tab === 'home'} label="Home" onClick={() => setTab('home')}>
              <HomeIcon width={22} height={22} />
            </NavButton>
            <NavButton active={tab === 'history'} label="History" onClick={() => setTab('history')}>
              <ClockIcon width={22} height={22} />
            </NavButton>
            <NavButton active={tab === 'profile'} label="Profile" onClick={() => setTab('profile')}>
              <UserIcon width={22} height={22} />
            </NavButton>
          </nav>
        )}
      </div>
    </div>
  );
};

const NavButton: React.FC<{
  active: boolean; label: string; onClick: () => void; children: React.ReactNode;
}> = ({ active, label, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
      active ? 'text-white' : 'text-white/[0.45]'
    }`}
  >
    {children}
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

export default App;
