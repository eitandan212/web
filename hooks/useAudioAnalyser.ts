import { useEffect, useRef, type MutableRefObject } from 'react';

const FFT_SIZE = 128;
/** Frequency bins produced by FFT_SIZE. */
export const BIN_COUNT = FFT_SIZE / 2;

/** ~0.75s at 60fps of all-zero reads before we give up on real audio data. */
const SILENCE_FRAMES = 45;

export interface AnalyserHandle {
  /**
   * Fill `out` (length >= BIN_COUNT) with 0..255 magnitudes for this frame.
   * Returns true when the values came from real audio, false when they were
   * synthesized because the analyser is unavailable or reading silence.
   */
  read(out: Uint8Array, playing: boolean, tMs: number): boolean;
}

/** Real spectra are bass-heavy and decay toward the top end; mimic that shape. */
const synthesize = (out: Uint8Array, playing: boolean, tMs: number) => {
  const t = tMs / 1000;
  const gain = playing ? 1 : 0.14;
  for (let i = 0; i < BIN_COUNT; i++) {
    const f = i / BIN_COUNT;
    const envelope = Math.pow(1 - f, 1.7);
    const wobble =
      Math.sin(t * 2.1 + i * 0.37) * 0.5 +
      Math.sin(t * 3.7 - i * 0.22) * 0.3 +
      Math.sin(t * 5.9 + i * 0.13) * 0.2;
    const v = envelope * (0.55 + 0.45 * wobble) * gain;
    out[i] = Math.max(0, Math.min(255, v * 255));
  }
};

/**
 * Wires the app's single <audio> element into a Web Audio analyser.
 *
 * The demo tracks are cross-origin, and Web Audio only yields real frequency
 * data when the media server sends CORS headers. We deliberately do NOT set
 * `crossOrigin` on the element: doing so would make playback itself fail when
 * the header is missing, and a synthesized visualizer is a far cheaper failure
 * than silent audio. When the analyser reads all-zero for SILENCE_FRAMES
 * consecutive frames, `read()` transparently switches to a synthesized
 * spectrum and reports false. It switches back the moment real data appears.
 */
export function useAudioAnalyser(
  audioRef: MutableRefObject<HTMLAudioElement | null>,
  active: boolean,
): MutableRefObject<AnalyserHandle | null> {
  const handleRef = useRef<AnalyserHandle | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<AnalyserNode | null>(null);
  const boundRef = useRef(false);
  const silentRef = useRef(0);
  const rawRef = useRef(new Uint8Array(BIN_COUNT));

  // Build the handle once. It reads through refs, so it never goes stale.
  if (handleRef.current === null) {
    handleRef.current = {
      read(out, playing, tMs) {
        const ctx = ctxRef.current;
        const node = nodeRef.current;

        // Autoplay policy starts the context suspended; every play is a gesture.
        if (ctx && playing && ctx.state === 'suspended') ctx.resume().catch(() => {});

        if (node) {
          const raw = rawRef.current;
          node.getByteFrequencyData(raw);
          let sum = 0;
          for (let i = 0; i < BIN_COUNT; i++) sum += raw[i];
          if (sum > 0) {
            silentRef.current = 0;
            out.set(raw.subarray(0, BIN_COUNT));
            return true;
          }
          // Genuine silence between tracks looks identical to a CORS-tainted
          // stream, so only fall back once it persists.
          if (silentRef.current < SILENCE_FRAMES) {
            silentRef.current++;
            out.fill(0);
            return true;
          }
        }

        synthesize(out, playing, tMs);
        return false;
      },
    };
  }

  useEffect(() => {
    if (!active || boundRef.current) return;
    const el = audioRef.current;
    if (!el) return;

    try {
      const Ctor: typeof AudioContext | undefined =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;

      const ctx = new Ctor();
      const node = ctx.createAnalyser();
      node.fftSize = FFT_SIZE;
      node.smoothingTimeConstant = 0.75;

      // Both hops matter: without the destination connection the element's
      // audio is captured into the graph and never reaches the speakers.
      const source = ctx.createMediaElementSource(el);
      source.connect(node);
      node.connect(ctx.destination);

      ctxRef.current = ctx;
      nodeRef.current = node;
      boundRef.current = true;
    } catch {
      // No Web Audio, or the element is already bound to another graph.
      // Playback is untouched; the visualizer runs on synthesized data.
    }
  }, [active, audioRef]);

  return handleRef;
}
