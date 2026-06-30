import React, { useMemo, useState } from 'react';
import { Track, TRACKS, gradientOf, formatTime } from '../data/tracks';
import AlbumCover from './AlbumCover';
import { SearchIcon, WaveIcon, HeartIcon } from './icons';

interface Props {
  currentTrack: Track | null;
  isPlaying: boolean;
  likes: Set<number>;
  onPlay: (track: Track) => void;
  onToggleLike: (id: number) => void;
}

const Greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const Browse: React.FC<Props> = ({ currentTrack, isPlaying, likes, onPlay, onToggleLike }) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TRACKS;
    return TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q),
    );
  }, [query]);

  const featured = TRACKS.slice(0, 4);

  return (
    <div className="h-full overflow-y-auto px-5 pt-6 pb-44 scrollbar-none">
      {/* Header */}
      <div className="mb-5">
        <p className="text-white/50 text-sm">{Greeting()} 👋</p>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Pulse
        </h1>
      </div>

      {/* Search */}
      <div className="relative mb-7">
        <SearchIcon width={18} height={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Songs, artists, albums"
          className="w-full bg-white/[0.08] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-white/25 focus:bg-white/[0.12] transition-colors"
        />
      </div>

      {/* Featured row (hidden while searching) */}
      {!query && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-white mb-3">Made for you</h2>
          <div className="flex gap-4 overflow-x-auto -mx-5 px-5 pb-2 scrollbar-none">
            {featured.map((t) => (
              <button
                key={t.id}
                onClick={() => onPlay(t)}
                className="shrink-0 w-36 text-left active:scale-95 transition-transform"
              >
                <div className="w-36 h-36 mb-2 shadow-lg shadow-black/40">
                  <AlbumCover track={t} rounded="rounded-2xl" glyphSize="text-5xl" />
                </div>
                <p className="text-sm font-semibold text-white truncate">{t.title}</p>
                <p className="text-xs text-white/50 truncate">{t.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Track list */}
      <section>
        <h2 className="text-base font-bold text-white mb-2">
          {query ? `Results (${filtered.length})` : 'All tracks'}
        </h2>
        <div className="flex flex-col">
          {filtered.map((t) => {
            const active = currentTrack?.id === t.id;
            const liked = likes.has(t.id);
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
                      <WaveIcon
                        width={22} height={22}
                        className={`text-white ${isPlaying ? 'animate-pulse' : ''}`}
                      />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold truncate ${active ? 'text-green-400' : 'text-white'}`}>
                    {t.title}
                  </p>
                  <p className="text-xs text-white/50 truncate">{t.artist} · {t.album}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleLike(t.id); }}
                  className={`p-1.5 transition-all active:scale-90 ${
                    liked ? 'text-pink-400 opacity-100' : 'text-white/40 opacity-0 group-hover:opacity-100'
                  } ${liked ? 'opacity-100' : ''}`}
                  aria-label="Like"
                >
                  <HeartIcon filled={liked} width={18} height={18} />
                </button>
                <span className="text-[11px] text-white/40 tabular-nums w-9 text-right">
                  {formatTime(t.duration)}
                </span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center text-white/40 text-sm py-16">
              No matches for “{query}”
            </div>
          )}
        </div>
      </section>

      {/* Liked summary card */}
      {likes.size > 0 && !query && (
        <section className="mt-8">
          <div
            className="rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-black/30"
            style={{ background: gradientOf(TRACKS[0], 120) }}
          >
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <HeartIcon filled width={24} height={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold">Liked Songs</p>
              <p className="text-white/70 text-xs">{likes.size} {likes.size === 1 ? 'song' : 'songs'}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Browse;
