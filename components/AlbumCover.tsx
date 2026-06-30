import React from 'react';
import { Track, gradientOf } from '../data/tracks';

interface Props {
  track: Track;
  size?: number | string;
  rounded?: string;
  className?: string;
  glyphSize?: string;
  spinning?: boolean;
}

const AlbumCover: React.FC<Props> = ({
  track,
  size = '100%',
  rounded = 'rounded-2xl',
  className = '',
  glyphSize = 'text-5xl',
  spinning = false,
}) => (
  <div
    className={`relative overflow-hidden ${rounded} ${className} ${
      spinning ? 'animate-[spin_18s_linear_infinite]' : ''
    }`}
    style={{ width: size, height: size, background: gradientOf(track) }}
  >
    {/* soft light blooms */}
    <div
      className="absolute -top-1/3 -left-1/4 w-2/3 h-2/3 rounded-full blur-2xl opacity-50"
      style={{ background: track.colors[1] }}
    />
    <div
      className="absolute -bottom-1/3 -right-1/4 w-2/3 h-2/3 rounded-full blur-2xl opacity-40"
      style={{ background: track.colors[0] }}
    />
    {/* grain/contrast veil */}
    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
    <div className="absolute inset-0 flex items-center justify-center">
      <span className={`${glyphSize} drop-shadow-lg select-none`}>{track.glyph}</span>
    </div>
  </div>
);

export default AlbumCover;
