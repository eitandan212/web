---
name: using-agent-skills
description: Routes incoming work to the right lifecycle skill for the Pulse music player, and defines the operating rules every other skill inherits. Read this when starting a session, when picking up a new request, or when unsure which skill applies.
---

# Using Agent Skills

This repo carries a small lifecycle pack: **spec → plan → build → verify → review → ship**.
It is sized for what Pulse actually is — a ~1,000-line single-page React app with no
backend, no test runner and no auth. Do not import ceremony that a bigger codebase would
need.

## Route the work

| The request looks like | Start with | Skip ahead if |
|---|---|---|
| "Add a queue screen", "let users make playlists" — new user-visible capability | `spec` | The request already names the exact screens, states and edge cases |
| "Split App.tsx", "extract a usePlayer hook" — restructuring without behaviour change | `plan` | It touches one file and under ~40 lines |
| "The mini player progress bar is stuck", "prev button skips two tracks" — defect | `build` (bug path) | Never skip reproducing it first |
| "Make the Now Playing screen feel smoother" — styling / polish | `build` | — |
| "Bump React", "add a linter" — dependency or tooling change | `plan` | — |
| Any change at all, before it is called done | `verify` then `review` | Never skip these two |
| The work is verified and reviewed | `ship` | — |

One-line rule: **anything that changes what a user sees or hears goes through `verify`
before you claim it works.**

## Operating rules all skills inherit

1. **The phone frame is the product.** Pulse is a mobile-first app that renders in a
   400×860 device shell on desktop and full-screen on mobile. Every visual change must be
   checked at both. A layout that only works in the desktop frame is not done.
2. **`App.tsx` owns all player state.** Components under `components/` are presentational:
   they take props and call callbacks. Do not add `useState` for player concerns
   (track, playback, likes, volume, shuffle, repeat, tab, expanded) inside a component.
   Local UI state that no one else needs — a search query, an open/closed disclosure —
   is fine in the component.
3. **One audio element, owned by `App.tsx`.** `audioRef` is the single `HTMLAudioElement`.
   Never construct a second `Audio()` anywhere else.
4. **No new media assets.** Album art is generated from `colors` + `glyph` in
   `data/tracks.ts`. Audio streams from SoundHelix. Adding an image or audio file to the
   repo needs an explicit ask — it breaks the project's "no media assets" property.
5. **State the assumption, then keep building.** If a request is ambiguous in a way that
   does not change most of the work, pick the reading a careful contributor would, write
   it down in your summary, and finish. Stop and ask only when the readings produce
   materially different code.

## Anti-rationalization

The failure mode this pack exists to prevent is an agent talking itself out of the gate.
If you catch yourself forming one of these thoughts, the rule it dodges is the one that
applies.

| The thought | Why it is wrong here | Do this instead |
|---|---|---|
| "It's a small change, the gate is overkill." | `tsc --noEmit` takes ~3s. The cost of a broken build reaching the user is minutes of their time. | Run `npm run verify`. |
| "There are no tests, so there's nothing to verify." | Typecheck and build are the tests this repo has, and a browser check is the rest. | Follow `verify` — it says exactly what to run. |
| "The typecheck passed, so it works." | `tsc` cannot see a mini player rendered behind the nav bar or audio that never starts. | Do the browser check for anything user-visible. |
| "I'll add the Tailwind classes now and fix the config later." | Classes in files outside `tailwind.config.js`'s `content` globs are silently stripped from the build. Nothing errors. | Add the new path to `content` in the same change. |
| "This eslint-disable comment means a linter checked it." | No linter is installed. Those comments are inert leftovers. | Reason about the dependency array yourself. |
| "I'll note the caveat in my summary instead of fixing it." | A caveat in chat is lost the moment the session ends. | Fix it, or write it into the code as a comment where the next reader will hit it. |
