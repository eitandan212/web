import React from 'react';
import { Track } from '../data/tracks';
import AlbumCover from './AlbumCover';
import { PlayIcon, PauseIcon, NextIcon } from './icons';

interface Props {
  track: Track;
  isPlaying: boolean;
  progress: number; // 0..1
  onPlayPause: () => void;
  onNext: () => void;
  onExpand: () => void;
}

const MiniPlayer: React.FC<Props> = ({ track, isPlaying, progress, onPlayPause, onNext, onExpand }) => (
  <div className="absolute left-2 right-2 bottom-[68px] z-20">
    <div
      onClick={onExpand}
      className="glass-bright rounded-2xl px-2.5 py-2.5 flex items-center gap-3 shadow-lg shadow-black/40 cursor-pointer active:scale-[0.99] transition-transform overflow-hidden"
    >
      <AlbumCover track={track} size={44} rounded="rounded-xl" glyphSize="text-xl" spinning={isPlaying} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate text-white">{track.title}</p>
        <p className="text-xs text-white/[0.55] truncate">{track.artist}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
        className="h-9 w-9 rounded-full bg-white text-black flex items-center justify-center active:scale-90 transition-transform"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <PauseIcon width={18} height={18} /> : <PlayIcon width={18} height={18} className="ml-0.5" />}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="h-9 w-9 rounded-full text-white flex items-center justify-center active:scale-90 transition-transform"
        aria-label="Next"
      >
        <NextIcon width={20} height={20} />
      </button>
      {/* progress hairline */}
      <div className="absolute left-0 bottom-0 h-0.5 bg-white/70" style={{ width: `${progress * 100}%` }} />
    </div>
  </div>
);

export default MiniPlayer;
