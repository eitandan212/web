# 08 · Dashboard

## 1. Purpose

The home screen, shown when the app opens with no active session. It answers
three questions fast: what was I doing, what's happening right now, and what
should I do next — then gets out of the way. It is not a metrics-heavy
"analytics dashboard"; statistics are present but subordinate to re-entry
points into real work.

## 2. Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Good afternoon, Tomer                          Claude Sonnet 5 ▾ │
│  What are we building today?                                       │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  Ask Beta Code to build, fix, or explain anything…    ⏎ Run │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Running now                                                       │
│  [ Agent Card: Testing — 62% ]     [ Agent Card: Git — queued ]    │
│                                                                     │
│  Pinned workspaces                                    [ See all ]  │
│  [ Project Card ]  [ Project Card ]  [ Project Card ]  [ + New ]    │
│                                                                     │
│  Recent conversations                                  [ See all ] │
│  ▸ Rate limiting for /login              beta-code-web · 2h ago    │
│  ▸ Refactor AlbumCover into hooks         pulse · yesterday         │
│  ▸ Investigate flaky CI test             infra-tools · 2d ago      │
│                                                                     │
│  Suggested actions                                                  │
│  [ Fix 2 failing tests in pulse ]   [ Review open PR #142 ]         │
│                                                                     │
│  Quick launch                                                       │
│  [ New Project ]  [ Open Folder ]  [ Clone Repo ]  [ Launch Agent ] │
└─────────────────────────────────────────────────────────────────┘
```

Single scrollable column, max content width 960px (centered, generous side
margins on wider windows — deliberately not stretching to fill ultra-wide
displays, per the brief's "generous spacing" principle). Section gaps use
`space.3xl` (48px), the largest spacing token in the system, reserved for
exactly this kind of top-level rhythm.

## 3. Greeting + composer

`display` weight greeting, time-of-day aware, `text.primary`; a second line
in `text.secondary` as a soft prompt. Directly below, the same `Prompt
composer` component used in every other context (`03-ai-execution-experience.md`
§2) — submitting from the Dashboard creates a new session and transitions
straight into the Execution Workspace. Top-right, the current default model
as a `Badge`/dropdown — same control as the composer's own model indicator,
duplicated here because it's frequently the first thing a user checks before
starting work.

## 4. Running now

Only rendered when at least one agent is active anywhere in the workspace.
Horizontal row of compact `Agent Card`s (`04-multi-agent-system.md` §3) —
the Dashboard's variant omits the resource-usage row to stay compact, showing
just header + task line + progress. Clicking a card jumps to that agent's
full session.

## 5. Pinned workspaces

User-pinned projects as `Project Card`s: project name (`title.sm`), a small
language/framework badge row, last-activity timestamp, and a 3-dot build/git
health indicator (green/amber/red dot + label, e.g. "Build passing"). A
trailing `+ New` card (dashed `border.default`, `text.tertiary` icon+label)
opens the New Project modal. "See all" routes to the Projects list (left nav
→ Projects), which is this same card grid unfiltered and sortable.

## 6. Recent conversations

Flat list, not cards — this section is about density and quick re-entry, so
it uses the same row pattern as Command Palette results: leading chevron
icon, conversation title (`body.sm`, `text.primary`), trailing project name +
relative timestamp (`caption`, `text.tertiary`). Hover reveals a `Pin` icon
action. Clicking resumes that session in the Execution Workspace exactly
where it left off, including full turn history.

## 7. Suggested actions

Contextually generated chips/cards (not a fixed list) surfaced from project
signals already available to the system: failing tests, stale dependencies,
open PRs awaiting review, TODOs tagged for AI follow-up. Each is a compact
card: one-line description + a small source badge (project name). Clicking
one drops the user straight into an Execution Workspace turn pre-seeded with
that task as the prompt — this section exists to lower the activation energy
of starting work, not to nag; it's capped at 4 items and never shows a
"dismiss all" badge-of-shame styling.

## 8. Quick launch

A row of `secondary` buttons, icon-leading: **New Project** (opens creation
modal — name, location, template), **Open Folder** (native file picker),
**Clone Repo** (URL input modal), **Launch Agent** (same modal as
`04-multi-agent-system.md` §4.2). These are the only "oversized-adjacent"
targets on the Dashboard, and even then they stay at the standard 40px
button height — width, not height, is what gives them presence.

## 9. Empty state (first run)

Before any project exists: the greeting and composer remain (first action is
always available), but Pinned/Recent/Suggested collapse into a single
`Empty state` block (per `01-design-system.md` §6.19): "No projects yet" +
one line of copy + a single primary `New Project` action. Quick Launch stays
visible underneath since it's the way out of this state.
