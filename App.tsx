import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Track, TRACKS, formatTime } from './data/tracks';
import Browse from './components/Browse';
import MiniPlayer from './components/MiniPlayer';
import NowPlaying from './components/NowPlaying';
import AlbumCover from './components/AlbumCover';
import { HomeIcon, HeartIcon, WaveIcon } from './components/icons';
import { useAudioAnalyser } from './hooks/useAudioAnalyser';

type Tab = 'home' | 'liked';

const App: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [index, setIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<Tab>('home');
  const [likes, setLikes] = useState<Set<number>>(new Set([1, 5]));

  const current = index === null ? null : TRACKS[index];

  // Spectrum data for the Now Playing visualizer. Bound on first track
  // selection, which is always a user gesture — the AudioContext needs one.
  const analyser = useAudioAnalyser(audioRef, index !== null);

  // --- audio wiring -------------------------------------------------------
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    a.volume = volume;

    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => handleNext(true);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnd);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnd);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load + play whenever the selected track changes
  useEffect(() => {
    const a = audioRef.current;
    if (!a || current === null) return;
    a.src = current.src;
    a.load();
    setCurrentTime(0);
    a.play().catch(() => setIsPlaying(false));
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // --- controls -----------------------------------------------------------
  const playTrack = useCallback((track: Track) => {
    const i = TRACKS.findIndex((t) => t.id === track.id);
    if (i === -1) return;
    if (i === index) {
      togglePlay();
    } else {
      setIndex(i);
      setExpanded(true);
    }
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || current === null) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  }, [current]);

  const pickNext = useCallback((dir: 1 | -1) => {
    if (index === null) return 0;
    if (shuffle) {
      if (TRACKS.length === 1) return index;
      let n = index;
      while (n === index) n = Math.floor(Math.random() * TRACKS.length);
      return n;
    }
    return (index + dir + TRACKS.length) % TRACKS.length;
  }, [index, shuffle]);

  const handleNext = useCallback((fromEnd = false) => {
    if (index === null) return;
    if (fromEnd && repeat) {
      const a = audioRef.current;
      if (a) { a.currentTime = 0; a.play().catch(() => {}); }
      return;
    }
    setIndex(pickNext(1));
  }, [index, repeat, pickNext]);

  const handlePrev = useCallback(() => {
    const a = audioRef.current;
    if (a && a.currentTime > 3) { a.currentTime = 0; return; }
    setIndex(pickNext(-1));
  }, [pickNext]);

  const seek = useCallback((t: number) => {
    const a = audioRef.current;
    if (a) { a.currentTime = t; setCurrentTime(t); }
  }, []);

  const toggleLike = useCallback((id: number) => {
    setLikes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Media Session (lock-screen / OS controls) for that real-phone feel
  useEffect(() => {
    if (current === null || !('mediaSession' in navigator)) return;
    // @ts-ignore
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title, artist: current.artist, album: current.album,
    });
    navigator.mediaSession.setActionHandler('play', togglePlay);
    navigator.mediaSession.setActionHandler('pause', togglePlay);
    navigator.mediaSession.setActionHandler('nexttrack', () => handleNext());
    navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
  }, [current, togglePlay, handleNext, handlePrev]);

  const likedTracks = useMemo(() => TRACKS.filter((t) => likes.has(t.id)), [likes]);
  const progress = duration ? currentTime / duration : 0;

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center sm:py-6 text-white">
      {/* Phone frame */}
      <div className="relative w-full h-screen sm:h-[860px] sm:max-w-[400px] sm:rounded-[44px] overflow-hidden bg-[#080810] sm:border sm:border-white/10 shadow-2xl shadow-black">
        {/* notch */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-40" />

        {/* ambient app background */}
        <div className="absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#15101f] via-[#0a0a12] to-black" />
          {current && (
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[120%] h-72 blur-[90px] opacity-30 transition-all duration-700"
              style={{ background: `linear-gradient(135deg, ${current.colors[0]}, ${current.colors[1]})` }}
            />
          )}
        </div>

        {/* Main scrollable view */}
        <div className="relative z-10 h-full pt-6 sm:pt-8">
          {tab === 'home' ? (
            <Browse
              currentTrack={current}
              isPlaying={isPlaying}
              likes={likes}
              onPlay={playTrack}
              onToggleLike={toggleLike}
            />
          ) : (
            <LikedView
              tracks={likedTracks}
              currentTrack={current}
              isPlaying={isPlaying}
              onPlay={playTrack}
              onToggleLike={toggleLike}
            />
          )}
        </div>

        {/* Mini player */}
        {current && !expanded && (
          <MiniPlayer
            track={current}
            isPlaying={isPlaying}
            progress={progress}
            onPlayPause={togglePlay}
            onNext={() => handleNext()}
            onExpand={() => setExpanded(true)}
          />
        )}

        {/* Bottom nav */}
        <nav className="absolute bottom-0 inset-x-0 z-20 h-[64px] glass border-t border-white/10 flex items-stretch">
          <NavButton active={tab === 'home'} label="Home" onClick={() => setTab('home')}>
            <HomeIcon width={22} height={22} />
          </NavButton>
          <NavButton active={tab === 'liked'} label="Library" onClick={() => setTab('liked')}>
            <HeartIcon filled={tab === 'liked'} width={22} height={22} />
          </NavButton>
        </nav>

        {/* Full-screen player */}
        {current && expanded && (
          <NowPlaying
            track={current}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration || current.duration}
            volume={volume}
            shuffle={shuffle}
            repeat={repeat}
            liked={likes.has(current.id)}
            onSeek={seek}
            onVolume={setVolume}
            onPlayPause={togglePlay}
            onNext={() => handleNext()}
            onPrev={handlePrev}
            onToggleShuffle={() => setShuffle((s) => !s)}
            onToggleRepeat={() => setRepeat((r) => !r)}
            onToggleLike={() => toggleLike(current.id)}
            onClose={() => setExpanded(false)}
            analyser={analyser}
          />
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

const LikedView: React.FC<{
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: (t: Track) => void;
  onToggleLike: (id: number) => void;
}> = ({ tracks, currentTrack, isPlaying, onPlay, onToggleLike }) => (
  <div className="h-full overflow-y-auto px-5 pt-6 pb-44 scrollbar-none">
    <div className="flex items-center gap-4 mb-7">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-900/40">
        <HeartIcon filled width={30} height={30} className="text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Liked Songs</h1>
        <p className="text-white/50 text-sm">{tracks.length} {tracks.length === 1 ? 'song' : 'songs'}</p>
      </div>
    </div>

    {tracks.length === 0 ? (
      <div className="text-center text-white/40 text-sm py-24">
        <p className="text-4xl mb-3">🤍</p>
        Tap the heart on any song to save it here.
      </div>
    ) : (
      <div className="flex flex-col">
        {tracks.map((t) => {
          const active = currentTrack?.id === t.id;
          return (
            <div
              key={t.id}
              onClick={() => onPlay(t)}
              className={`group flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl cursor-pointer active:scale-[0.99] transition-all ${
                active ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="relative shrink-0">
                <AlbumCover track={t} size={52} rounded="rounded-xl" glyphSize="text-2xl" />
                {active && (
                  <div className="absolute inset-0 rounded-xl bg-black/[0.45] flex items-center justify-center">
                    <WaveIcon width={22} height={22} className={`text-white ${isPlaying ? 'animate-pulse' : ''}`} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate ${active ? 'text-green-400' : 'text-white'}`}>{t.title}</p>
                <p className="text-xs text-white/50 truncate">{t.artist} · {t.album}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleLike(t.id); }}
                className="p-1.5 text-pink-400 active:scale-90 transition-transform"
                aria-label="Unlike"
              >
                <HeartIcon filled width={18} height={18} />
              </button>
              <span className="text-[11px] text-white/40 tabular-nums w-9 text-right">{formatTime(t.duration)}</span>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default App;
