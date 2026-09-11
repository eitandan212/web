---
name: verify
description: The verification gate for Pulse — the exact commands and browser checks that decide whether a change actually works. Run before claiming any change is done. Never skip.
---

# Verify

Pulse has no test runner. That does not mean there is nothing to verify — it means the
gate is typecheck, build, and a short scripted browser pass. Run all three parts that apply.

## Part 1 — Machine checks (always)

```bash
npm run verify      # typecheck + production build
```

That is `tsc --noEmit` followed by `vite build`. Both pass on a clean tree, so **any failure
is yours.** Do not proceed past a red gate, and do not explain it away as pre-existing
without first checking out the base branch and confirming it fails there too.

Expected clean output ends with a build summary of roughly:

```
dist/index.html      ~0.9 kB
dist/assets/*.css     ~19 kB
dist/assets/*.js     ~216 kB
```

A JS bundle that jumps by more than ~20 kB means you added a dependency. That is a
reviewable decision, not an implementation detail — say so in your summary.

## Part 2 — Browser check (any user-visible change)

```bash
npm run dev         # http://localhost:3000
```

Typecheck cannot see a mini player rendered behind the nav bar, audio that never starts, or
a gradient that renders grey. Walk the path your change touches:

| Change touches | Walk this |
|---|---|
| Track list / search / Browse | Load app → type in search → clear it → tap a row → confirm Now Playing opens on the right track |
| Playback / transport | Tap play → pause → next → prev twice (first press restarts if >3s in) → scrub → volume |
| Mini player | Play a track → close Now Playing → confirm the bar appears above the nav with a moving hairline → tap it → confirm it expands |
| Likes | Tap a heart in Browse → switch to Library → confirm it is there → unlike from Library → confirm the empty state at zero |
| Now Playing | Open it → confirm ambient background matches the track gradient → shuffle and repeat toggle visibly → close returns to the tab you came from |
| Any layout change | Resize below `sm` (640px) and confirm the full-screen shell, then above it for the 400×860 phone frame |

**Always also check:** the launch state with no track selected (`index === null`) — no mini
player, no Now Playing, nav still works.

## Part 3 — Audio reality check (playback changes only)

Sound is the product. Confirm with the tab unmuted:

- [ ] Audio is audible when play is pressed.
- [ ] The scrubber advances and the time readout matches.
- [ ] Seeking jumps the audio, not just the UI.
- [ ] Volume changes take effect.

Note: **auto-advance at the end of a track does not work on `main`** — the `ended` listener
captures a stale `handleNext` (see `plan`). Do not record that as a regression you caused,
and do not record it as passing either.

## If you cannot run the browser check

Say so explicitly in your summary, naming what went unverified. A change verified only by
typecheck is reported as "typechecks and builds; not exercised in a browser" — never as
"works".

## Verification gate

- [ ] `npm run verify` exits 0.
- [ ] The relevant row of the Part 2 table was walked, or its absence stated.
- [ ] Part 3 run if playback changed.
- [ ] Bundle size delta noted if over ~20 kB.

## Anti-rationalization

| The thought | Why it is wrong here | Do this instead |
|---|---|---|
| "It's a one-line CSS change, the gate is overkill." | A one-line Tailwind change is precisely the kind that gets stripped by a missing `content` glob and fails silently. | Run it. It takes seconds. |
| "This failure looks pre-existing." | Both gates pass clean on `main`. "Looks pre-existing" is a hypothesis, not a finding. | `git stash`, re-run, and find out. |
| "I can't run a browser here, so browser checks don't apply." | They still apply — you just did not do them. | Report the change as unverified in a browser, by name. |
| "The typecheck passed, so it works." | `tsc` has no opinion about z-index, audio, or touch targets. | Walk the table row. |
| "The scrubber moves, so seeking works." | The scrubber is UI state. Seeking is `a.currentTime`. They can disagree. | Listen to the audio jump. |
| "Auto-advance is broken, so my playback change is broken." | It is broken on `main` too, and for an unrelated reason. | Check it against the base branch before attributing it. |
