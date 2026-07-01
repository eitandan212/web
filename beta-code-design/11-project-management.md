# 11 · Project Management

## 1. Purpose

Beyond the Project Workspace's code-editing surface (`06-project-workspace.md`),
each project has a management view — the place to understand a project's
health, history, and structure at a level above individual files. Reached via
a project's own top-level tabs, separate from the Editor/Terminal/Preview
tabs which live one level down inside the Workspace itself.

## 2. Project top-level navigation

```
┌───────────────────────────────────────────────────────────────┐
│  pulse-music-player                                              │
│  Overview  Files  Tasks  Timeline  History  Docs  Architecture     │
├───────────────────────────────────────────────────────────────┤
│                         (section content)                          │
└───────────────────────────────────────────────────────────────┘
```

`Tabs` (underline style, matching every other tabbed surface in the app).
"Files" here opens directly into the Project Workspace IDE view
(`06-project-workspace.md`); the rest are management-only screens described
below.

## 3. Overview

The default landing tab. A compact status dashboard — but composed of a small,
fixed set of cards rather than an open-ended grid of widgets, keeping it from
sprawling into "busy dashboard" territory.

```
┌───────────────────────────┐  ┌───────────────────────────┐
│ Build                       │  │ Git                          │
│ ● Passing · 2m ago            │  │ main · 3 ahead · clean         │
└───────────────────────────┘  └───────────────────────────┘
┌───────────────────────────┐  ┌───────────────────────────┐
│ Dependencies                 │  │ Environment                    │
│ 42 packages · 2 outdated       │  │ Node 20 · 3 env vars set        │
└───────────────────────────┘  └───────────────────────────┘

Recent activity
▸ Developer agent committed "Add rate limiting"        10:41 AM
▸ You opened login.ts                                    10:38 AM
▸ Testing agent ran 24 tests, 24 passed                  10:35 AM
```

Each status card: `title.sm` label, one headline stat/state line with a
status dot (green/amber/red), and is clickable through to its full section
(Build → Timeline filtered to builds, Dependencies → its own tab, Git →
right panel's Git tab). Recent activity is a flat chronological feed —
same row pattern as the Dashboard's "Recent conversations" — mixing human and
agent actions in one timeline, each row's leading icon distinguishing actor
type (user avatar vs. agent identity chip).

## 4. Dependencies

Table (`01-design-system.md` §6.15): package name, current version, latest
version, license, a status badge (`Up to date` / `Outdated` / `Vulnerable` —
`status.error` for vulnerable, sorted to the top by default). Row hover
reveals an inline "Update" ghost action; selecting multiple rows (checkbox
column) enables a bulk "Update selected" bar that pins above the table.
Vulnerable packages expand inline to show the advisory summary and a
"Fix with AI" action routing into an execution turn.

## 5. Build status

Shown as part of Overview (§3) plus a filterable log in Timeline (§7): each
build run is a row with duration, trigger (manual/on-save/CI), pass/fail
badge, and expandable full output (reuses the `Terminal` component). Failing
builds get a "Fix with AI" action identical in spirit to the vulnerable
dependency case — one consistent affordance across the product for "AI, deal
with this failure," rather than a bespoke button per context.

## 6. Environment

A simple key-masked-value table for environment variables (masked by default
like API keys in Settings, per `10-settings-and-providers.md` §4.3, with a
reveal toggle), plus read-only runtime info (Node/Python/etc. version,
detected package manager, OS). Editing env vars opens the same inline-expand
pattern as provider configuration for consistency.

## 7. Tasks & Timeline

**Tasks**: a lightweight kanban-free list (not a full project-management
tool — Beta Code tracks AI/dev tasks, not a Jira replacement) of open items:
checkbox, title, source (manually added / auto-generated from a TODO / spawned
by an agent), assignee (a user avatar or agent identity chip — tasks can be
assigned to a specific agent type, which pre-fills the Launch Agent flow from
`04-multi-agent-system.md` §4.2 when started).

**Timeline**: a single chronological rail combining commits, builds, agent
runs, and task completions — visually, an extension of the Overview's Recent
Activity feed but with date-grouping headers (`Today`, `Yesterday`, `This
week`) and a filter row (All / Commits / Builds / Agents / Tasks) as `Tabs`.
Each entry is a compact one-line row; commits and agent runs expand inline to
their respective card types (Git Commit tool card, Agent Card summary) on
click, reusing components rather than inventing new "timeline entry" visuals.

## 8. History

A project-scoped version of the global History nav item (left sidebar) — all
past AI sessions/turns for this project specifically, same row pattern as the
Dashboard's Recent Conversations list, searchable, groupable by date. This is
where "what did we ask the AI to do three weeks ago" gets answered.

## 9. Documentation

Rendered markdown docs living in the repo (README, `/docs`), shown in a
simple two-pane reader: a left mini-outline (matches the Explorer's Outline
section styling) and rendered content on the right using the same Markdown
rendering rules as AI prose in the Execution Workspace (headings, code
blocks, tables all reuse those exact components) — documentation and AI
output should look like the same "kind of text," reinforcing that Beta Code
treats docs as living, AI-editable material, not static files. A "Regenerate
with AI" ghost action sits at the top of any doc.

## 10. Architecture

Auto-generated (and user-editable) architecture diagrams: a canvas showing
modules/services as nodes (`radius.lg` boxes, `surface.raised`) connected by
directional edges, styled consistently with the Multi-Agent orchestration
view's swimlane visual language (`04-multi-agent-system.md` §4.1) so
"relationships between things" reads the same whether it's agents or code
modules. Nodes are clickable through to the relevant files/folders in the
Explorer. A "Regenerate" action re-derives the diagram from current code
structure via an execution turn (Architect agent).

## 11. Git activity

Not a separate tab (git status/diff live in the Project Workspace's Git tab
and gutter per `06-project-workspace.md` §7) but surfaced here as the
Overview's Git card and as commit entries in Timeline — consistent with the
"one truth per concept" rule used throughout this brief.
