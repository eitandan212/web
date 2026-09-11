---
name: build
description: Implement a change in Pulse following the repo's actual conventions — state ownership, Tailwind idioms, touch targets and the audio contract. Use for every code change, including bug fixes and styling work.
---

# Build

## Conventions this repo actually uses

Match these. They are read off the existing code, not imported from a style guide.

**Components**
- `const X: React.FC<Props> = ({ ... }) => (` with a destructured props object.
- Props declared as a local `interface Props` above the component. Not exported, not generic.
- Default export at the bottom: `export default X;`.
- Callback props are named `onThing` (`onPlay`, `onToggleLike`, `onExpand`). Data props are
  bare nouns (`track`, `isPlaying`, `progress`).
- Small helper components (`NavButton`, `LikedView`) live at the bottom of the file that
  uses them, below the main export. Only promote one to `components/` when a second file
  needs it.

**Styling**
- Tailwind utility classes inline. No CSS modules, no styled-components.
- Opacity uses the bracket form when it is not a Tailwind step: `text-white/[0.45]`,
  `bg-white/[0.08]`. Plain steps (`text-white/50`, `bg-white/10`) are used where they land
  on one. Both appear in the codebase; match the neighbouring lines.
- Glass surfaces use the `.glass` / `.glass-bright` classes from `index.css`, never a
  hand-rolled `backdrop-blur` stack.
- Press feedback is `active:scale-90` on icon buttons and `active:scale-[0.99]` on rows and
  cards. Every interactive element gets one.
- Scrollable views carry `scrollbar-none` and bottom padding of `pb-44` to clear the mini
  player and nav.
- Track gradients come from `gradientOf(track)` in `data/tracks.ts`. Never inline a
  `linear-gradient` built from `track.colors` by hand — that helper exists.

**State**
- All player state lives in `App.tsx`. See rule 2 in `using-agent-skills`.
- Callbacks that cross into a component are wrapped in `useCallback`. Derived lists use
  `useMemo` (`likedTracks`, Browse's `filtered`).
- `likes` is a `Set<number>` of track ids, replaced immutably on toggle — never mutated.

**Icons**
- Add new icons to `components/icons.tsx`, matching the existing shape exactly:
  `export const FooIcon = (p: P) => (<svg {...base(p)}>…</svg>);` where
  `type P = React.SVGProps<SVGSVGElement>` and `base()` supplies the shared
  `viewBox`/`stroke: currentColor`/`strokeWidth: 2`/24×24 defaults, overridable by props.
- Filled variants take an extra flag alongside the spread, as `HeartIcon` does:
  `({ filled, ...p }: P & { filled?: boolean })`.
- Solid glyphs override the stroke defaults inline (`fill="currentColor" stroke="none"`),
  the way `PlayIcon` and `PauseIcon` do.
- Do not add an icon library. The set is inline SVG precisely so there is no dependency.

## The audio contract

Get this wrong and the app fails in ways typecheck cannot see.

- `audioRef.current` is the one and only `HTMLAudioElement`. Never construct another.
- `a.play()` returns a promise that **rejects** on autoplay block or load failure. Every
  call site must `.catch()`. The existing calls do; yours must too.
- Changing `index` triggers the load-and-play effect. To change tracks, `setIndex` — do not
  touch `a.src` directly from anywhere else.
- Seeking sets both `a.currentTime` and `setCurrentTime`, because `timeupdate` may not fire
  before the next paint.
- Media Session handlers re-register whenever `current` or the transport callbacks change.
  If you add a transport action, add its handler there too or OS controls silently drift
  out of sync with the in-app buttons.

## Mobile rules

The product is a phone app. These are not suggestions.

- **Touch targets ≥ 36px.** The existing icon buttons are `h-9 w-9` (36px). Smaller is a
  defect on a real device even though it looks fine in the desktop frame.
- **Test both shells.** The frame is `w-full h-screen` on mobile and
  `sm:h-[860px] sm:max-w-[400px]` above the `sm` breakpoint. A change checked only in the
  desktop frame is unverified.
- **Nothing may sit under the nav.** The bottom nav is 64px and the mini player floats at
  `bottom-[68px]`. New fixed or absolute elements must clear both.
- **Row content must truncate, not wrap.** Titles and artists use `truncate` inside a
  `min-w-0 flex-1` parent. Dropping the `min-w-0` breaks truncation and blows out the row.

## The bug path

When the request is a defect, not a feature:

1. **Reproduce it first.** Name the exact steps and the state the app must be in. If you
   cannot reproduce it, say so before changing anything — a fix for an unreproduced bug is
   a guess.
2. **Find the cause, not the symptom.** Ask which of the eight edge cases in `spec`'s
   checklist the code fails to handle. Most Pulse bugs are one of them.
3. **Check whether it is a stale-closure bug.** `App.tsx` has several `useCallback`s with
   hand-maintained dependency arrays and `eslint-disable` comments. No linter checks them.
   If behaviour is correct on first interaction and wrong afterwards, suspect a stale
   closure before anything else.
4. **Fix the narrowest thing.** Then run `verify`.

## Verification gate

- [ ] `npm run typecheck` passes.
- [ ] New Tailwind classes live in a path listed in `tailwind.config.js`'s `content`.
- [ ] Every `a.play()` you added has a `.catch()`.
- [ ] Every interactive element you added has an `active:` press state and an `aria-label`
      if it is icon-only.
- [ ] No new `useState` for player concerns outside `App.tsx`.
- [ ] No new file under `components/` that is only used by one other file.

Then run the `verify` skill. This checklist is not a substitute for it.

## Anti-rationalization

| The thought | Why it is wrong here | Do this instead |
|---|---|---|
| "I'll keep this bit of state local to the component, it's simpler." | Player state read by two surfaces and mutated by a third is exactly how the mini player and Now Playing screen fall out of sync. | Lift it to `App.tsx`. |
| "`h-8` looks better than `h-9`." | 32px fails a thumb on a real phone. The design is not the product; the phone is. | Keep ≥36px, or add padding to reach it. |
| "It renders fine in my desktop frame." | The desktop frame is 400px wide with a fixed 860px height. A real phone is neither. | Check the `w-full h-screen` path too. |
| "I'll add a tiny helper library for this." | The project ships zero runtime dependencies beyond React, deliberately — generated covers, inline SVG, no media files. | Write the ten lines. |
| "The dependency array warning is disabled, so it was reviewed." | There is no linter. The comments are inert. | Reason through the closure yourself. |
| "I'll skip the `.catch()`, playback won't fail here." | It fails on autoplay policy, on offline, and on a dead SoundHelix URL. An unhandled rejection kills the interaction. | Add the `.catch()`. |
| "The user asked for a fix, not a repro." | A fix you cannot demonstrate fixing anything is not a fix. | Reproduce, then fix, then show the difference. |
