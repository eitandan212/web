import React, { useEffect, useRef } from 'react';
import { Track } from '../data/tracks';
import { AnalyserHandle, BIN_COUNT } from '../hooks/useAudioAnalyser';

interface Props {
  track: Track;
  isPlaying: boolean;
  analyser: React.MutableRefObject<AnalyserHandle | null>;
  children: React.ReactNode;
}

/** Angular samples around the bloom. Mirrored, so the shape stays symmetric. */
const POINTS = 64;
/** Only the lower bins carry musical energy; the top of the range sits near zero. */
const USED_BINS = 40;
/**
 * The artwork's width as a fraction of the visualizer box. The box is what the
 * layout constrains, so sizing the artwork from it (rather than the reverse)
 * keeps the aura inside the viewport on narrow phones. The value is bounded
 * below: the bar ring sits at 0.425 of the box, and it has to clear the
 * artwork's rounded corners (~0.707 of the artwork's own half-width) for the
 * ring to be unbroken. That is why the artwork is smaller here than the 300px
 * it occupies without a visualizer.
 */
const ART_FRACTION = 0.625;
const TAU = Math.PI * 2;

/**
 * `lift` mixes the colour toward white. The soft body keeps the track's own
 * saturation (a whitened wash just reads grey); the bars are lifted so their
 * hard edges stay legible over the artwork's own glow.
 */
const toRgb = (hex: string, lift = 0): [number, number, number] => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const mix = (c: number) => Math.round(c + (255 - c) * lift);
  return [mix((n >> 16) & 255), mix((n >> 8) & 255), mix(n & 255)];
};

/**
 * A living aura behind the album art, deformed by the audio spectrum and
 * breathing with the bass. Drawn on a canvas in a requestAnimationFrame loop
 * that reads everything through refs, so a 60fps visual costs zero React
 * renders. The artwork is passed as children and backlit by the bloom.
 */
const Visualizer: React.FC<Props> = ({ track, isPlaying, analyser, children }) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const artRef = useRef<HTMLDivElement | null>(null);

  // Everything the animation loop needs, held in refs so the loop mounts once.
  const playingRef = useRef(isPlaying);
  const colorsRef = useRef<[number[], number[], number[], number[]]>([
    toRgb(track.colors[0]), toRgb(track.colors[1]),
    toRgb(track.colors[0], 0.45), toRgb(track.colors[1], 0.45),
  ]);
  const dataRef = useRef(new Uint8Array(BIN_COUNT));
  const smoothRef = useRef(new Float32Array(POINTS));
  // Preallocated: the draw loop runs at 60fps, so per-frame allocation here
  // turns into steady GC pressure on a phone.
  const radiiRef = useRef(new Float32Array(POINTS));
  const scratchRef = useRef(new Float32Array(POINTS));
  const bassRef = useRef(0);

  useEffect(() => { playingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => {
    colorsRef.current = [
      toRgb(track.colors[0]), toRgb(track.colors[1]),
      toRgb(track.colors[0], 0.45), toRgb(track.colors[1], 0.45),
    ];
  }, [track]);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let side = 0;
    let raf = 0;

    const resize = () => {
      side = box.getBoundingClientRect().width;
      if (!side) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(side * dpr);
      canvas.height = Math.round(side * dpr);
      canvas.style.width = `${side}px`;
      canvas.style.height = `${side}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(box);
    resize();

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!side) return;

      const playing = playingRef.current;
      const data = dataRef.current;
      analyser.current?.read(data, playing, t);

      const smooth = smoothRef.current;
      const [c0, c1, b0, b1] = colorsRef.current;
      const half = POINTS / 2;
      const cx = side / 2;
      const cy = side / 2;
      const base = side * 0.33;
      const bulge = side * 0.1;

      // Bass drives the overall breathing of both the aura and the artwork.
      let bass = 0;
      for (let i = 0; i < 4; i++) bass += data[i];
      bass /= 4 * 255;
      bassRef.current += (bass - bassRef.current) * 0.18;
      const breathe = bassRef.current;

      // Deform the circle: mirrored spectrum, eased over time.
      const radii = radiiRef.current;
      for (let i = 0; i < POINTS; i++) {
        const p = i < half ? i / half : (POINTS - i) / half;
        const v = data[Math.min(USED_BINS - 1, Math.floor(p * USED_BINS))] / 255;
        smooth[i] += (v - smooth[i]) * 0.3;
        const drift = Math.sin(t * 0.0011 + i * 0.17) * 0.05;
        radii[i] = base * (1 + breathe * 0.1) + bulge * (smooth[i] + drift);
      }
      // Blur the radii into their neighbours so the silhouette stays organic
      // instead of faceting into a polygon.
      const prev = scratchRef.current;
      for (let pass = 0; pass < 2; pass++) {
        prev.set(radii);
        for (let i = 0; i < POINTS; i++) {
          const a = prev[(i - 1 + POINTS) % POINTS];
          const b = prev[(i + 1) % POINTS];
          radii[i] = prev[i] * 0.5 + (a + b) * 0.25;
        }
      }

      ctx.clearRect(0, 0, side, side);
      ctx.globalCompositeOperation = 'lighter';

      const glow = 0.5 + breathe * 0.5;

      // 1. Ambient halo — a wide, shapeless wash that lifts the aura off the
      //    Now Playing gradient without any hard edge of its own.
      const halo = ctx.createRadialGradient(cx, cy, base * 0.55, cx, cy, cx);
      halo.addColorStop(0, `rgba(${c0[0]},${c0[1]},${c0[2]},0)`);
      halo.addColorStop(0.55, `rgba(${c0[0]},${c0[1]},${c0[2]},${0.3 * glow})`);
      halo.addColorStop(1, `rgba(${c1[0]},${c1[1]},${c1[2]},0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, side, side);

      // 2. The spectrum body.
      ctx.beginPath();
      for (let i = 0; i <= POINTS; i++) {
        const a0 = ((i % POINTS) / POINTS) * TAU - Math.PI / 2;
        const a1 = (((i + 1) % POINTS) / POINTS) * TAU - Math.PI / 2;
        const r0 = radii[i % POINTS];
        const r1 = radii[(i + 1) % POINTS];
        const x0 = cx + Math.cos(a0) * r0;
        const y0 = cy + Math.sin(a0) * r0;
        const mx = (x0 + cx + Math.cos(a1) * r1) / 2;
        const my = (y0 + cy + Math.sin(a1) * r1) / 2;
        if (i === 0) ctx.moveTo(mx, my);
        else ctx.quadraticCurveTo(x0, y0, mx, my);
      }
      ctx.closePath();

      const fill = ctx.createRadialGradient(cx, cy, base * 0.45, cx, cy, base + bulge);
      fill.addColorStop(0, `rgba(${c0[0]},${c0[1]},${c0[2]},0)`);
      fill.addColorStop(0.5, `rgba(${c0[0]},${c0[1]},${c0[2]},${0.55 * glow})`);
      fill.addColorStop(1, `rgba(${c1[0]},${c1[1]},${c1[2]},${0.12 * glow})`);
      ctx.fillStyle = fill;
      ctx.fill();

      // 3. A thin luminous rim, whitened at peaks so loud moments flare.
      const rim = 0.3 + breathe * 0.45;
      ctx.strokeStyle = `rgba(255,255,255,${rim * 0.32})`;
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // 4. Discrete spectrum bars. Soft gradients wash out against the Now
      //    Playing backdrop; hard-edged ticks are what actually reads as
      //    "this is the music". Their radius clears the artwork's corners so
      //    the ring is unbroken the whole way round.
      const barIn = side * 0.425;
      const barMax = side * 0.07;
      ctx.lineCap = 'round';
      for (let i = 0; i < POINTS; i++) {
        const v = smooth[i];
        if (v < 0.012) continue;
        const a = (i / POINTS) * TAU - Math.PI / 2;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const out = barIn + barMax * v;
        const p = i < half ? i / half : (POINTS - i) / half;
        const c = [
          Math.round(b0[0] + (b1[0] - b0[0]) * p),
          Math.round(b0[1] + (b1[1] - b0[1]) * p),
          Math.round(b0[2] + (b1[2] - b0[2]) * p),
        ];
        ctx.beginPath();
        ctx.moveTo(cx + cos * barIn, cy + sin * barIn);
        ctx.lineTo(cx + cos * out, cy + sin * out);
        ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.35 + v * 0.6})`;
        ctx.lineWidth = 2.25;
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';

      // The artwork breathes with the bass — transform only, so no re-layout.
      // The translate half has to be written here too: assigning `transform`
      // replaces Tailwind's centring utilities wholesale.
      if (artRef.current) {
        const s = (playing ? 1 : 0.9) + breathe * 0.035;
        artRef.current.style.transform = `translate(-50%, -50%) scale(${s.toFixed(4)})`;
      }
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [analyser]);

  return (
    <div ref={boxRef} className="relative w-full max-w-[384px] aspect-square">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      />
      <div
        ref={artRef}
        className="absolute left-1/2 top-1/2 aspect-square shadow-2xl shadow-black/50 will-change-transform"
        style={{
          width: `${ART_FRACTION * 100}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 120ms linear',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Visualizer;
