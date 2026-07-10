import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LookEntry, analyzeLook, computeStreak, fileToDataUrl, loadImage } from './data/scoring';
import { DEFAULT_NVIDIA_KEY, NVIDIA_KEY_STORAGE, analyzeWithAI } from './data/aiStylist';
import Capture from './components/Capture';
import Analyzing from './components/Analyzing';
import Result from './components/Result';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import Settings from './components/Settings';
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    try { return localStorage.getItem(NVIDIA_KEY_STORAGE) ?? DEFAULT_NVIDIA_KEY; } catch { return DEFAULT_NVIDIA_KEY; }
  });

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

  const handleSaveKey = useCallback((key: string) => {
    // empty input reverts to the built-in key
    setApiKey(key || DEFAULT_NVIDIA_KEY);
    try {
      if (key) localStorage.setItem(NVIDIA_KEY_STORAGE, key);
      else localStorage.removeItem(NVIDIA_KEY_STORAGE);
    } catch {
      // storage unavailable — key still works for this session
    }
  }, []);

  // run the analysis while the Analyzing screen is up:
  // AI stylist when a key is set, on-device Quick Scan otherwise (or on any AI failure)
  useEffect(() => {
    if (!pendingImage) return;
    let cancelled = false;
    (async () => {
      const minDelay = new Promise((r) => setTimeout(r, 1800));
      let analysis: Omit<LookEntry, 'id' | 'createdAt' | 'image'>;
      if (apiKey) {
        try {
          analysis = await analyzeWithAI(pendingImage, apiKey);
        } catch {
          analysis = { ...analyzeLook(await loadImage(pendingImage)), engine: 'scan' };
        }
      } else {
        analysis = { ...analyzeLook(await loadImage(pendingImage)), engine: 'scan' };
      }
      await minDelay;
      if (cancelled) return;
      setFreshLook({
        id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
        createdAt: Date.now(),
        image: pendingImage,
        ...analysis,
      });
      setPendingImage(null);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingImage]);

  const handleSaveLook = useCallback(() => {
    if (!freshLook) return;
    setLooks((prev) => [freshLook, ...prev]);
    setFreshLook(null);
    setTab('home');
  }, [freshLook]);

  const handleDeleteLook = useCallback((id: string) => {
    setLooks((prev) => prev.filter((l) => l.id !== id));
    setViewingLook(null);
  }, []);

  const overlay = pendingImage ? 'analyzing' : freshLook ? 'result-fresh' : viewingLook ? 'result-view' : null;

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center sm:py-6 text-white">
      {/* Phone frame */}
      <div className="relative w-full h-screen sm:h-[860px] sm:max-w-[400px] sm:rounded-[44px] overflow-hidden bg-[#080810] sm:border sm:border-white/10 shadow-2xl shadow-black">
        {/* notch + status bar */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-40" />
        <StatusClock />

        {/* ambient app background */}
        <div className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1024] via-[#0a0a12] to-black" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[120%] h-72 blur-[90px] opacity-25 bg-gradient-to-r from-fuchsia-600 to-amber-400" />
        </div>

        {/* Main scrollable view */}
        <div className="relative z-10 h-full pt-6 sm:pt-8">
          {overlay === 'analyzing' && pendingImage && (
            <Analyzing image={pendingImage} ai={!!apiKey} />
          )}
          {overlay === 'result-fresh' && freshLook && (
            <Result
              look={freshLook}
              prevScore={lastLook?.overall ?? null}
              onClose={() => setFreshLook(null)}
              onSave={handleSaveLook}
            />
          )}
          {overlay === 'result-view' && viewingLook && (
            <Result
              look={viewingLook}
              readOnly
              onClose={() => setViewingLook(null)}
              onDelete={() => handleDeleteLook(viewingLook.id)}
            />
          )}
          {!overlay && (
            <div key={tab} className="h-full animate-tab-in">
              {tab === 'home' && (
                <Capture
                  lastLook={lastLook}
                  streak={streak}
                  totalLooks={looks.length}
                  aiEnabled={!!apiKey}
                  onSelectFile={handleSelectFile}
                  onOpenLast={() => lastLook && setViewingLook(lastLook)}
                  onOpenSettings={() => setSettingsOpen(true)}
                />
              )}
              {tab === 'history' && (
                <HistoryView looks={looks} onOpen={(look) => setViewingLook(look)} />
              )}
              {tab === 'profile' && <ProfileView looks={looks} streak={streak} />}
            </div>
          )}
        </div>

        {/* Settings sheet */}
        {settingsOpen && (
          <Settings apiKey={apiKey} onSave={handleSaveKey} onClose={() => setSettingsOpen(false)} />
        )}

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

const StatusClock: React.FC = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hidden sm:block absolute top-2 left-8 z-40 text-[13px] font-semibold tabular-nums text-white/90">
      {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  );
};

const NavButton: React.FC<{
  active: boolean; label: string; onClick: () => void; children: React.ReactNode;
}> = ({ active, label, onClick, children }) => (
  <button
    onClick={onClick}
    className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
      active ? 'text-white' : 'text-white/[0.45]'
    }`}
  >
    <span
      className={`absolute top-0 h-[3px] w-8 rounded-b-full bg-gradient-to-r from-fuchsia-400 to-amber-300 transition-opacity ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    />
    {children}
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

export default App;
