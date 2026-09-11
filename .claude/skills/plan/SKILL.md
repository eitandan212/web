---
name: plan
description: Break a spec or a refactor into an ordered, file-level plan for Pulse, identifying which of the five source files change and in what order. Use before any change touching more than one file or more than ~40 lines.
---

# Plan

## The map

Pulse is small enough to hold in your head. Know where things live before you plan where
they go.

```
App.tsx            308 lines  ALL player state, audio wiring, nav, LikedView, NavButton
index.tsx           17 lines  mount only — rarely changes
index.css           44 lines  Tailwind layers, .glass / .glass-bright, .scrollbar-none, keyframes
data/tracks.ts     114 lines  Track interface, TRACKS array, gradientOf(), formatTime()
components/
  Browse.tsx       158 lines  greeting, search, featured carousel, full track list
  NowPlaying.tsx   167 lines  full-screen player: art, scrubber, transport, volume
  MiniPlayer.tsx    46 lines  collapsed bar: art, title, play/pause, next, progress hairline
  AlbumCover.tsx    44 lines  generated gradient cover — used by all three surfaces
  icons.tsx        121 lines  inline SVG set
tailwind.config.js            content globs — MUST list any new source directory
vite.config.ts                dev server :3000, @ alias, stale GEMINI_API_KEY defines
```

## Steps

1. **Order by data flow, not by file size.** The dependency direction is
   `data/tracks.ts → App.tsx → components/*`. Change the type first, then the state that
   holds it, then the components that render it. Planning in the other direction produces
   a broken intermediate state at every step.
2. **Name each file and what changes in it.** One line each. If a file appears in your plan
   without a reason, cut it.
3. **Put the shared-component change first when there is one.** `AlbumCover` and `icons`
   are used by all three surfaces; changing them mid-plan invalidates work already done.
4. **Flag the config files.** If the plan creates a new directory (`hooks/`, `lib/`,
   `components/player/`), the plan must contain a step that adds it to `content` in
   `tailwind.config.js`. This is the single most common silent failure in this repo.
5. **Size the steps so each one typechecks.** `npm run typecheck` should pass between steps,
   not only at the end. If a step cannot typecheck on its own, it is really two halves of
   one step — merge them.

## When the plan is a refactor

`App.tsx` at 308 lines is the natural place refactor requests land. Two specific traps:

- **The mount effect captures a stale `handleNext`, and it is currently broken.** The
  `useEffect` with `[]` deps registers `onEnd = () => handleNext(true)` on mount, capturing
  the *first* `handleNext` — the one whose closure has `index === null`. Its first line is
  `if (index === null) return;`, so **auto-advance at the end of a track does nothing today.**
  The fix is to route `onEnd` through a ref that always points at the current `handleNext`,
  or to re-register the listener when `handleNext` changes. If your plan touches this effect,
  say which of the two you are doing; if it does not, leave the bug alone rather than
  half-fixing it.
- **`playTrack` and `pickNext` index into `TRACKS` directly.** Extracting a `usePlayer` hook
  means deciding whether the hook owns `TRACKS` or receives it. Decide in the plan, not
  halfway through the extraction.

## Verification gate

- [ ] Every step names its file(s).
- [ ] Steps are ordered `data → state → components`.
- [ ] Each step leaves `npm run typecheck` passing.
- [ ] If a new directory appears, a `tailwind.config.js` step exists.
- [ ] The plan says what is *not* being changed, where a reader might assume otherwise.

Then work the steps with `build`, one at a time, running `npm run typecheck` between them.

## Anti-rationalization

| The thought | Why it is wrong here | Do this instead |
|---|---|---|
| "It's only 1,000 lines, I can just start." | Size is not the risk — ordering is. Component-first edits break on the type change that follows. | Write five lines of plan. It costs less than one backtrack. |
| "I'll add the Tailwind path once I see classes not applying." | You will not see it. Missing classes look like a styling mistake, not a config one, and you will debug the component for ten minutes first. | Add the glob in the same step that creates the directory. |
| "Intermediate breakage is fine, I'll fix it at the end." | A plan whose middle does not compile cannot be paused, reviewed, or resumed after a context reset. | Re-cut the steps so each one stands alone. |
| "The refactor is mechanical." | The mount-effect closure and the `TRACKS` coupling above are not mechanical, and they are exactly what a mechanical refactor silently breaks. | Read the two traps above and decide each one explicitly. |
