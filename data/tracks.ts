export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  /** Duration in seconds (fallback; real duration is read from the audio element). */
  duration: number;
  /** Streamable audio source. */
  src: string;
  /** Two-stop gradient used to generate the album cover + ambient background. */
  colors: [string, string];
  /** Emoji used as a glyph on the generated cover. */
  glyph: string;
}

/**
 * Royalty-free demo tracks (SoundHelix) so the player actually plays audio
 * without bundling any media. Album covers are generated from `colors`/`glyph`
 * so there are no external image dependencies.
 */
export const TRACKS: Track[] = [
  {
    id: 1,
    title: 'Neon Skyline',
    artist: 'Aurora Pulse',
    album: 'Midnight Drive',
    duration: 372,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    colors: ['#7c3aed', '#ec4899'],
    glyph: '🌃',
  },
  {
    id: 2,
    title: 'Velvet Currents',
    artist: 'Lo-Fi Tide',
    album: 'Slow Hours',
    duration: 426,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    colors: ['#0ea5e9', '#22d3ee'],
    glyph: '🌊',
  },
  {
    id: 3,
    title: 'Golden Static',
    artist: 'Sundown Co.',
    album: 'Warm Noise',
    duration: 343,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    colors: ['#f59e0b', '#ef4444'],
    glyph: '🌅',
  },
  {
    id: 4,
    title: 'Deep Forest',
    artist: 'Mossbank',
    album: 'Field Recordings',
    duration: 289,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    colors: ['#10b981', '#14b8a6'],
    glyph: '🌲',
  },
  {
    id: 5,
    title: 'Cosmic Drift',
    artist: 'Vector Bloom',
    album: 'Outer Bands',
    duration: 398,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    colors: ['#6366f1', '#a855f7'],
    glyph: '🪐',
  },
  {
    id: 6,
    title: 'Crimson Hour',
    artist: 'Ember Lane',
    album: 'Afterglow',
    duration: 311,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    colors: ['#e11d48', '#fb7185'],
    glyph: '🔥',
  },
  {
    id: 7,
    title: 'Glass Mornings',
    artist: 'Pale Window',
    album: 'Soft Light',
    duration: 357,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    colors: ['#0891b2', '#84cc16'],
    glyph: '🌤️',
  },
  {
    id: 8,
    title: 'Midnight Arcade',
    artist: 'Pixel Ghost',
    album: 'Continue?',
    duration: 334,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    colors: ['#8b5cf6', '#3b82f6'],
    glyph: '👾',
  },
];

/** Helper: CSS gradient string for a track's cover/background. */
export const gradientOf = (t: Track, angle = 135) =>
  `linear-gradient(${angle}deg, ${t.colors[0]}, ${t.colors[1]})`;

/** Format seconds as m:ss. */
export const formatTime = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};
