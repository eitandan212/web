# 03 · The AI Execution Experience

## 1. Purpose

This is the product's central idea, so it gets the most detail. Submitting a
prompt must never feel like sending a chat message into a void. It feels like
handing off a job: the interface immediately shows that the job has been
received, shows how it's being understood and planned, shows it happening, and
shows how it was checked before calling it done. The user can watch, redirect,
or step in at every phase.

## 2. The prompt composer

Persistent dock at the bottom of the center workspace (see
`02-application-shell.md` §4.3).

```
┌──────────────────────────────────────────────────────────────────┐
│  📎  ⌘  Ask Beta Code to build, fix, or explain anything…          │
│                                                                    │
│  [ @file  /command  ⌥model ]                    Claude Sonnet 5 ▾ │
│                                                        ⏎ Run       │
└──────────────────────────────────────────────────────────────────┘
```

- **Field**: auto-growing textarea, `body.md`, placeholder in `text.tertiary`,
  1–8 visible lines before internal scroll. `radius.lg`, `surface.raised`,
  `border.default`, focus state `border.strong` + inset accent ring.
- **Attach (📎)**: attach files/images/context docs — opens a small picker,
  attached items appear as chips above the field.
- **Inline triggers**: typing `@` opens a file/symbol reference popover,
  `/` opens a command/skill picker (shared visual language with the Command
  Palette, `07-command-palette.md`), `⌥` (or a model chip) switches the active
  model inline without leaving the composer.
- **Model indicator**: bottom-right, shows the active model as a `Badge`;
  click opens the same model switcher as Settings → Models.
  Multiple concurrent providers are supported — the badge shows the model
  actually routed for *this* request.
  is the composer's job here — see `03-ai-execution-experience.md` §2.
- **Run control**: primary `Button`, label "Run" with `⏎` hint, becomes
  "Stop" (danger-ghost) while a request is in flight in this thread.

Submitting: the field clears, the composer height animates back to 1 line
(`motion.base`), and a new turn is appended to the workspace above it — camera
auto-scrolls only if the user was already at the bottom of the scroll region
(never yanks their view away from something they scrolled up to read).

## 3. The five-phase model

Every submitted turn produces one **execution turn** in the center workspace,
built from up to five phases. Not all phases are visually distinct for trivial
requests (a one-line factual answer collapses straight to Completion), but the
structure is always the same underlying state machine, so the user builds a
consistent mental model over time.

```
Understanding → Planning → Execution → Verification → Completion
```

### 3.1 Shared turn anatomy

```
┌───────────────────────────────────────────────────────────┐
│ ◆ You                                            10:41 AM  │
│   Add rate limiting to the /login endpoint                 │
├───────────────────────────────────────────────────────────┤
│ ✳ Beta Code                          [Understanding ●○○○○] │
│                                                              │
│   ▸ Reasoning (12s)                              [collapse] │
│   ┌─────────────────────────────────────────────────────┐  │
│   │ Looking for the existing auth middleware and rate    │  │
│   │ limit patterns already used elsewhere in the repo…   │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                              │
│   ▸ Plan                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │ 1. Read auth/login.ts and existing middleware         │  │
│   │ 2. Add a token-bucket limiter in middleware/rate.ts   │  │
│   │ 3. Wire it into the login route                       │  │
│   │ 4. Add a test for the 429 path                         │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                              │
│   [ Tool Card: Read File ]                                  │
│   [ Tool Card: Write File ]                                  │
│   [ Tool Card: Run Terminal ]                                │
│                                                              │
│   ✓ Verified — tests passing, no lint errors                 │
│                                                              │
│   Rate limiting is now applied to /login (5 req / 60s per   │
│   IP). See the changes below.                                │
│                                                              │
│   [ Diff Viewer: middleware/rate.ts ]                        │
│                                                              │
│   ⟳ Retry     ⎘ Branch here     👍 👎                         │
└───────────────────────────────────────────────────────────┘
```

A turn is a single `Card`-family container (`surface.raised`, `radius.lg`) but
its *phase indicator* (top right, five dots as shown above) is what carries
the state — filled dots for completed phases, a pulsing outline (opacity-only,
no scale/loop motion beyond the standard indeterminate token) for the active
phase, hollow for phases not yet reached.

### 3.2 Understanding

**Visual language:** violet accent (`accent.secondary`). This is the only
phase primarily about the AI's internal state rather than an outward action,
so it borrows the "reasoning" color.

Shows, as they resolve, in order: a one-line restatement of the request in the
AI's own words (helps the user catch misunderstanding immediately — this is
the single highest-leverage moment for the user to redirect), then a
collapsible **Reasoning** block (`accent.secondary.muted` background, `italic`
`mono.sm` — visually distinct from both prose and code so it can never be
mistaken for the final answer), streaming in token-by-token with a 1px
blinking caret at the write head.

Reasoning is collapsed by default once it finishes and the next phase starts,
leaving just "▸ Reasoning (12s)" as a rail — expandable any time, including
long after the turn completes, since it's kept in turn history.

### 3.3 Planning

**Visual language:** neutral surface, blue accent for interactive elements.

A numbered plan (see anatomy above) renders as a lightweight checklist, each
step showing a small circular status glyph that will later be filled in
during Execution (hollow → half-filled spinner → check/✕) — so Planning and
Execution visually connect: the plan the user reviewed *is* the progress
tracker for what happens next, not a separate artifact.

For anything non-trivial (creates/deletes files, runs a destructive command,
touches more than N files, or the user's settings require confirmation — see
`10-settings-and-providers.md` → Privacy), the plan ends in an inline
**confirmation bar**:

```
┌─────────────────────────────────────────────────────┐
│  This will modify 2 files and run 1 terminal command. │
│                              [ Adjust ]   [ Approve ] │
└─────────────────────────────────────────────────────┘
```

`Adjust` opens the composer pre-filled with a refinement prompt scoped to the
plan; `Approve` (primary button) transitions to Execution. If the user's
settings have "auto-approve low-risk actions" on (default for reads/greps,
off for writes/terminal by default — see Settings → Agents), this bar is
skipped for qualifying plans.

### 3.4 Execution

**Visual language:** blue accent, this is the "system acting" phase.

Each plan step, as it becomes active, expands into one or more **Tool Cards**
(full spec in `05-tool-cards.md`) appended in the turn body, in the order
they execute — including in cases with multiple agents, where tool cards are
prefixed with a small colored agent-identity chip so the user always knows
which agent produced which card (full multi-agent visuals in
`04-multi-agent-system.md`).

Live state: the plan-step glyph next to the currently-running step shows a
12px spinner (`accent.primary`, indeterminate ring, no easing); completed
steps flip to a filled check (`status.success`) with a subtle 140ms scale-in;
a failed step shows `status.error` ✕ and the flow moves to a **recovery**
sub-branch (the AI proposes a fix, shown as a nested mini-turn with its own
Understanding→Execution) rather than silently aborting the whole turn.

The user can **Pause** (icon button, top-right of the turn, appears only
while Execution is active) at any point between tool calls — paused state
freezes the phase indicator and shows a `status.warning` "Paused" badge with
Resume/Stop actions. Mid-tool-call, Pause takes effect at the next safe
boundary rather than interrupting a running command.

### 3.5 Verification

**Visual language:** green accent, brief and compact — this phase is
intentionally low-ceremony so it doesn't feel like padding.

A single-line status row: `✓ Verified — tests passing, no lint errors` or,
if checks were skipped/unavailable, `— No verification available for this
change`. Click to expand into whatever was actually run (test output, lint
output, a screenshot diff for UI changes) as a nested Tool Card. If
verification fails, this phase does **not** silently continue to Completion —
it loops back into Execution with a new recovery step, and the turn's overall
phase indicator reflects the retry.

### 3.6 Completion

**Visual language:** back to neutral/primary text — the "handoff" moment.

The AI's final prose summary (`body.md`, capped ~72ch as noted in
`01-design-system.md` §2.2), followed by any Diff Viewers, generated
images/diagrams, or output tables relevant to the result. Ends the turn with a
persistent action row:

`⟳ Retry` (re-runs from Planning with the same input) · `⎘ Branch here`
(forks a new parallel turn from this point, useful for trying an alternative
approach without losing the original) · thumbs up/down (lightweight feedback,
`ghost` icon buttons) · `Copy` (copies the prose response).

## 4. Streaming

All AI-authored text (reasoning, plan, prose) streams in at a steady
per-token cadence rather than arriving in bursts, with a 1px `accent.primary`
(or `accent.secondary` inside reasoning) caret at the write head. Code blocks
stream fully-formed line-by-line rather than character-by-character once a
block boundary is detected, so syntax highlighting doesn't flicker
mid-token. If the user scrolls up during streaming, auto-scroll disengages
immediately and a small "↓ New content" pill appears pinned above the
composer to let them jump back down on their own terms.

## 5. Multi-turn thread structure

Turns stack vertically with `space.2xl` separation (per the design system's
spacing rhythm) and a hairline (`border.subtle`) between them — not full
cards-within-cards, to avoid the "boxes in boxes" clutter the brief warns
against. A slim, persistent left-edge rail spanning the whole thread shows
turn boundaries and lets the user click to jump between them, similar in
spirit to a scrollbar map.

## 6. Empty / cold-start state

Before any prompt is submitted in a session, the center workspace shows: the
Beta Code mark, a `title.lg` prompt like "What are we building?", 3–4
**suggested action** cards pulled from the current project's context (e.g.
"Fix the failing test in `auth.spec.ts`," "Explain this architecture") and,
below, the composer already focused. No onboarding illustration — the
suggestions themselves communicate capability.
