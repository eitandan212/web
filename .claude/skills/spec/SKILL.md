---
name: spec
description: Write a short spec before building a new user-visible feature in Pulse — screens, states, edge cases and what is explicitly out of scope. Use when the request names a capability ("add playlists", "add a queue") rather than a concrete change.
---

# Spec

For a feature in a 1,000-line app, a spec is a page, not a document. Its job is to surface
the three or four decisions that would otherwise get made silently mid-implementation.

## Steps

1. **Name the user-facing outcome in one sentence.** "A user can reorder the songs waiting
   to play." If you cannot write this sentence, the request is not yet a feature.
2. **List the screens touched.** Pulse has exactly four surfaces — Browse (`components/Browse.tsx`),
   Liked (`LikedView` inside `App.tsx`), Now Playing (`components/NowPlaying.tsx`), and the
   Mini Player (`components/MiniPlayer.tsx`) — plus the bottom nav. Say which change and
   whether a fifth surface is being added.
3. **List the state it adds.** Every entry lands in `App.tsx` (see rule 2 of
   `using-agent-skills`). Name the variable, its type, and its initial value. If it needs
   to survive a reload, say so explicitly — nothing in Pulse persists today, so persistence
   is always net-new work.
4. **Write the edge cases as a table.** Use the checklist below; it is drawn from how this
   player actually behaves.
5. **Write "Not in scope".** Two or three bullets. This is the highest-value section —
   it is what stops a queue feature from growing into a playlist CRUD.

## Edge-case checklist

Walk these for any playback-adjacent feature. Each one is a real state Pulse can be in.

- **No track selected** (`index === null`, the app's launch state) — what renders?
- **Track selected, paused** — does the feature still work?
- **Last track + repeat off** — `handleNext` wraps to index 0; is that right for your feature?
- **Single-track list** — `pickNext` has a special case for `TRACKS.length === 1`; does yours?
- **Shuffle on** — order is random per-advance, not a shuffled queue. Features that assume
  a stable "next track" are wrong under shuffle.
- **Liked list empty** — `LikedView` renders an empty state; does yours?
- **Search filtering active** — `Browse` filters `TRACKS` but `playTrack` indexes into the
  full `TRACKS` array. Anything index-based must not use the filtered list.
- **Audio fails to load** — `a.play()` rejections are swallowed today. If your feature
  depends on playback actually starting, say what should happen when it does not.

## Verification gate

Do not move to `plan` until all four are true:

- [ ] The outcome sentence exists and names a user, not a component.
- [ ] Every new piece of state is listed with a type and an initial value.
- [ ] Every checklist row above is either answered or explicitly marked not-applicable.
- [ ] "Not in scope" has at least two bullets.

## Anti-rationalization

| The thought | Why it is wrong here | Do this instead |
|---|---|---|
| "The request was detailed, so the spec is redundant." | A detailed request describes the happy path. The checklist above is entirely unhappy paths. | Walk the checklist anyway; it takes two minutes. |
| "I'll handle edge cases as I hit them in the code." | Hitting them in code means discovering a state-shape problem after the state is wired into four components. | Answer them first — the answers decide the state shape. |
| "Out-of-scope is obvious." | It is obvious to you now and invisible to the reviewer and to the next session. | Write the bullets. |
| "I'll spec it after I prototype." | Fine — but then the spec is written from the prototype's accidents rather than the user's need. | Prototype if you must, then spec from the outcome sentence, not the code. |
