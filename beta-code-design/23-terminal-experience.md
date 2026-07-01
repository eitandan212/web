# 23 · Terminal Experience

## 1. Purpose

The terminal is where Beta Code and the user share the most literal,
unmediated view of "what's actually happening on this machine." It has to
feel like a real, fast terminal first, and an AI-augmented one second — never
the reverse.

Base component visuals are defined in `01-design-system.md` §6.17; this
document covers the fuller experience: multiple instances, split view, AI
explanations, history, and auto-fix.

## 2. Multiple terminals

The bottom panel's Terminal tab (`06-project-workspace.md` §6) supports any
number of concurrent terminal instances, presented as a compact sub-tab strip
directly above the terminal body:

```
┌─────────────────────────────────────┐
│  ▤ Terminal   ▤ Problems   ▤ Preview  │
├─────────────────────────────────────┤
│  bash  ✕   npm run dev  ✕   + │          │
├─────────────────────────────────────┤
│  $ npm run dev                          │
│  ⋮                                        │
└─────────────────────────────────────┘
```

Each sub-tab: a short label (defaults to the shell name, renames to the
running command once one starts — e.g. "bash" becomes "npm run dev" the
moment that command is invoked, reverting to "bash" when it exits), a close
✕ on hover, and a `+` to spawn another. Sub-tabs reorder by drag. A
process-still-running indicator (small `accent.primary` dot, static per the
"no idle loop" motion rule) sits on a background tab so switching away from a
long-running dev server doesn't make the user forget it's there.

Terminals spawned by an agent (as part of a Run Terminal tool call,
`05-tool-cards.md` §4) appear as their own sub-tab labeled with the agent's
identity chip instead of a shell name, so a user can distinguish "my manual
shell" from "the terminal the Developer agent is currently running commands
in" — both are real, live terminal instances, not a simulated log.

## 3. Split view

The terminal body supports horizontal or vertical split (toolbar icon-button
pair, or `⌘⇧\``), producing two independently-scrollable terminal panes
within the same tab — distinct from spawning a second sub-tab: a split is
for watching two things side by side (e.g. a dev server's output next to an
interactive shell), while sub-tabs are for switching between many unrelated
sessions. Splits can be nested once (max 2×2 grid) before the panel suggests
using separate sub-tabs instead, to avoid the terminal area turning into an
unreadable tiling-window-manager grid.

## 4. AI inline explanations

Hovering (or focusing, for keyboard users per `16-accessibility.md` §2) any
line of terminal output reveals a small `Explain` ghost affordance at the
line's right edge — clicking it doesn't leave the terminal; it opens a
compact inline popover directly below that line with a one-paragraph
plain-language explanation of what the line means (a stack trace frame, a
cryptic flag, a warning), reusing the same popover elevation/style as a
`Tooltip` but persistent until dismissed rather than hover-only, since the
content here is substantial enough to want to stay open while read.

For a **failed command** specifically (non-zero exit code), this same
explanation surfaces automatically and inline, unprompted, directly beneath
the failing output — no hover needed — framed as a single collapsed line:

```
$ npm test
  ⋮ (failure output)
  ▸ Why this failed — Explain
```

Expanding it shows the plain-language root cause. This is deliberately
lightweight (a collapsed rail, not a full Tool Card) because it's a passive
aid sitting inside a raw terminal, not a tracked, replayable action the way
an agent's own Run Terminal tool call is.

## 5. Command history & auto-fix

**History**: `↑`/`↓` cycles through previously run commands in the focused
terminal instance, scoped per-instance (not shared across sub-tabs, matching
how a real shell's history is scoped per session) but persisted across app
restarts per-project. A `⌘⇧K` clear-scrollback action wipes the visible
buffer without touching command history.

**Auto Fix** (`⌘⇧F` while terminal-focused, or a `Fix with AI` ghost button
appearing next to a failed command's exit status): routes the failing
command and its output into a scoped execution turn, exactly the same
"Fix with AI" affordance and flow used everywhere else in the product
(`13-user-flows.md` §5a, `19-error-handling.md` §4.5) — the terminal doesn't
invent its own separate repair mechanism. The resulting fix, once approved,
re-runs the original command automatically in the same terminal instance so
the user sees the corrected output land exactly where the failure was,
rather than in a new tool card disconnected from the terminal they were
watching.

## 6. Visual & interaction consistency

- Prompt glyph, stdout/stderr coloring, and cursor blink all follow
  `01-design-system.md` §6.17 exactly, regardless of whether the terminal is
  in the bottom panel, in a split, or embedded inside a Run Terminal Tool
  Card's expanded state (`05-tool-cards.md` §4) — a terminal looks like a
  terminal everywhere in the product.
- Copy behavior: selecting text auto-copies (standard terminal convention,
  opt-out in Settings → Terminal), plus an explicit copy-button on hover for
  users who prefer deliberate copying, matching the hover-then-focus-visible
  pattern used for Tool Card copy actions (`16-accessibility.md` §2).
- Font and scrollback length are user-configurable in Settings → Terminal
  (`10-settings-and-providers.md` §3); shell selection (bash/zsh/PowerShell/
  etc.) is detected from the OS by default with a manual override in the
  same section.
