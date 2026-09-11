# Pulse · Music Player

A mobile-first music player: React 19 + Vite 6 + Tailwind 3 + TypeScript, no backend,
no runtime dependencies beyond React. ~1,000 lines of source.

## Commands

```bash
npm install
npm run dev         # http://localhost:3000
npm run typecheck   # tsc --noEmit
npm run verify      # typecheck + production build — the gate before any change is "done"
npm run build
npm run preview
```

There is no test runner and no linter. `npm run verify` plus a browser pass is the whole
gate — see `.claude/skills/verify/SKILL.md` for what to walk.

## Working agreements

This repo carries a lifecycle skill pack in `.claude/skills/`:

| Skill | Use it for |
|---|---|
| `using-agent-skills` | Routing a request to the right skill; the rules the others inherit |
| `spec` | New user-visible features, before any code |
| `plan` | Multi-file changes and refactors |
| `build` | Every code change — conventions, audio contract, mobile rules |
| `verify` | The gate: commands and browser walks. Never skipped |
| `review` | Adversarial self-review of the diff |
| `ship` | Commit, push, and an honest summary |

Start at `using-agent-skills` if unsure.

## Architecture in one paragraph

`App.tsx` owns **all** player state (current track index, playback, time, volume, shuffle,
repeat, likes, tab, expanded) and the single `HTMLAudioElement` behind `audioRef`.
Everything under `components/` is presentational — props in, callbacks out. Track data and
the `gradientOf` / `formatTime` helpers live in `data/tracks.ts`. Album art is generated
from a two-stop gradient plus an emoji glyph, so the repo ships no image or audio assets;
audio streams from SoundHelix.

## Gotchas

- **Tailwind `content` globs.** `tailwind.config.js` lists source paths explicitly. Classes
  in a file outside those globs are silently stripped from the build — no error, just
  unstyled output. Any new source directory must be added there in the same change.
- **Inert `eslint-disable` comments.** `App.tsx` carries `react-hooks/exhaustive-deps`
  disables, but no ESLint is installed. Nothing checks those dependency arrays but you.
- **Auto-advance is broken on `main`.** The mount effect registers
  `onEnd = () => handleNext(true)` with an empty dependency array, capturing the
  first-render `handleNext` whose closure has `index === null`. Its first line returns
  early, so a track that plays to the end does not advance. Fix by routing `onEnd` through
  a ref or re-registering the listener — not yet done.
- **Stale Gemini config.** `vite.config.ts` defines `process.env.API_KEY` and
  `process.env.GEMINI_API_KEY` from the environment. Leftovers from the AI Studio template
  this repo started as; nothing reads them.
- **Indices are into `TRACKS`.** `Browse` renders a filtered list, but `playTrack` and
  `pickNext` index the full `TRACKS` array. Never derive an index from a filtered view.
