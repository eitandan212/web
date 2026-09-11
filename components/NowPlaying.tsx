import React from 'react';
import { Track, gradientOf, formatTime } from '../data/tracks';
import AlbumCover from './AlbumCover';
import Visualizer from './Visualizer';
import { AnalyserHandle } from '../hooks/useAudioAnalyser';
import {
  PlayIcon, PauseIcon, NextIcon, PrevIcon, ShuffleIcon, RepeatIcon,
  HeartIcon, ChevronDownIcon, VolumeIcon, MoreIcon,
} from './icons';

interface Props {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  liked: boolean;
  onSeek: (t: number) => void;
  onVolume: (v: number) => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: () => void;
  onClose: () => void;
  analyser: React.MutableRefObject<AnalyserHandle | null>;
}

const NowPlaying: React.FC<Props> = ({
  track, isPlaying, currentTime, duration, volume, shuffle, repeat, liked,
  onSeek, onVolume, onPlayPause, onNext, onPrev,
  onToggleShuffle, onToggleRepeat, onToggleLike, onClose, analyser,
}) => {
  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute inset-0 z-30 flex flex-col text-white overflow-hidden animate-[slideUp_0.35s_cubic-bezier(0.22,1,0.36,1)]">
      {/* Ambient background driven by the track colors */}
      <div className="absolute inset-0 -z-10" style={{ background: gradientOf(track, 165) }} />
      <div className="absolute inset-0 -z-10 bg-black/[0.62] backdrop-blur-2xl" />
      <div
        className="absolute -top-20 -left-16 w-72 h-72 rounded-full blur-3xl opacity-40 -z-10 animate-pulse"
        style={{ background: track.colors[0] }}
      />
      <div
        className="absolute bottom-10 -right-16 w-72 h-72 rounded-full blur-3xl opacity-40 -z-10"
        style={{ background: track.colors[1] }}
      />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 pt-6">
        <button onClick={onClose} className="p-2 -ml-2 active:scale-90 transition-transform" aria-label="Collapse">
          <ChevronDownIcon width={26} height={26} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Now Playing</p>
          <p className="text-xs font-semibold text-white/90 truncate max-w-[160px]">{track.album}</p>
        </div>
        <button className="p-2 -mr-2 active:scale-90 transition-transform" aria-label="More">
          <MoreIcon width={24} height={24} />
        </button>
      </header>

      {/* Artwork */}
      <div className="flex-1 flex items-center justify-center px-8 min-h-0">
        <Visualizer track={track} isPlaying={isPlaying} analyser={analyser}>
          <AlbumCover track={track} rounded="rounded-[32px]" glyphSize="text-8xl" />
        </Visualizer>
      </div>

      {/* Meta + controls */}
      <div className="px-7 pb-8">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold tracking-tight truncate">{track.title}</h2>
            <p className="text-white/[0.65] text-sm truncate">{track.artist}</p>
          </div>
          <button
            onClick={onToggleLike}
            className={`p-2 active:scale-90 transition-all ${liked ? 'text-pink-400' : 'text-white/70'}`}
            aria-label="Like"
          >
            <HeartIcon filled={liked} width={26} height={26} />
          </button>
        </div>

        {/* Seek bar */}
        <div className="mb-1">
          <div className="relative h-1.5 group">
            <div className="absolute inset-0 rounded-full bg-white/20" />
            <div className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${pct}%` }} />
            <div
              className="absolute -top-1 h-3.5 w-3.5 rounded-full bg-white shadow -ml-1.5 transition-transform group-active:scale-125"
              style={{ left: `${pct}%` }}
            />
            <input
              type="range" min={0} max={duration || 0} step={0.1} value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              aria-label="Seek"
            />
          </div>
          <div className="flex justify-between text-[11px] text-white/[0.55] mt-2 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
          </div>
        </div>

        {/* Transport */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={onToggleShuffle}
            className={`p-2 active:scale-90 transition-all ${shuffle ? 'text-green-400' : 'text-white/60'}`}
            aria-label="Shuffle"
          >
            <ShuffleIcon width={20} height={20} />
          </button>

          <button onClick={onPrev} className="p-2 active:scale-90 transition-transform text-white" aria-label="Previous">
            <PrevIcon width={34} height={34} />
          </button>

          <button
            onClick={onPlayPause}
            className="h-[72px] w-[72px] rounded-full bg-white text-black flex items-center justify-center shadow-xl active:scale-95 transition-transform"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon width={30} height={30} /> : <PlayIcon width={30} height={30} className="ml-0.5" />}
          </button>

          <button onClick={onNext} className="p-2 active:scale-90 transition-transform text-white" aria-label="Next">
            <NextIcon width={34} height={34} />
          </button>

          <button
            onClick={onToggleRepeat}
            className={`p-2 active:scale-90 transition-all ${repeat ? 'text-green-400' : 'text-white/60'}`}
            aria-label="Repeat"
          >
            <RepeatIcon width={20} height={20} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 mt-6 text-white/60">
          <VolumeIcon width={18} height={18} />
          <div className="relative flex-1 h-1 group">
            <div className="absolute inset-0 rounded-full bg-white/20" />
            <div className="absolute inset-y-0 left-0 rounded-full bg-white/80" style={{ width: `${volume * 100}%` }} />
            <input
              type="range" min={0} max={1} step={0.01} value={volume}
              onChange={(e) => onVolume(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
