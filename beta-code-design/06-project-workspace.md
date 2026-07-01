# 06 · Project Workspace (IDE Surface)

## 1. Purpose

When a user opens a project, the center workspace switches from the
conversational execution view to a full IDE surface — but one where AI
involvement (the composer, tool cards, agent activity) is a first-class
citizen of the layout, not a bolted-on chat window. The user should be able
to read code, edit it by hand, and hand work to the AI without ever feeling
like they've left one product and entered another.

## 2. Layout

```
┌──┬───────────────┬──────────────────────────────────┬────────────────────┐
│  │ EXPLORER       │  login.ts ×  rate.ts   +          │  (right context     │
│  │────────────────│  src ▸ auth ▸ login.ts             │   panel — same      │
│  │ ▾ src           │──────────────────────────────────│   panel as shell,   │
│  │   ▾ auth        │ 1  import { Router } from ···     │   defaults to       │
│  │     login.ts •  │ 2  import { rateLimiter } ···     │   Outline/Problems  │
│  │     rate.ts      │ 3                                  │   here)             │
│  │   ▸ components   │ ⋮  (editor body)                   │                    │
│  │ ▸ tests          │                                     │                    │
│  │────────────────│                                     │                    │
│  │ OUTLINE          │                                     │                    │
│  │ PROBLEMS (2)      │                                     │                    │
│  ├───────────────┤──────────────────────────────────┤                    │
│  │                │  ▤ Terminal   ▤ Problems  ▤ Preview │                    │
│  │                │  $ npm test                          │                    │
│  │                │  ⋮ (terminal output)                  │                    │
│  ├───────────────┴──────────────────────────────────┤                    │
│  │  Prompt composer (context-aware: @login.ts attached) │                    │
└──┴───────────────────────────────────────────────────┴────────────────────┘
```

The Project Workspace reuses the app shell's three columns (`02-application-shell.md`)
but subdivides the center column into three stacked regions: **Editor** (top,
majority of height), **Bottom panel** (Terminal/Problems/Preview, tabbed,
resizable, collapsible to a thin strip), and the **Composer dock** (fixed,
shared with every other mode).

## 3. Explorer (left sidebar, project-scoped)

Appears in the sidebar's content region when a project is open, replacing the
global nav list with a "◂ Back to Workspace" affordance pinned above it plus
three stacked sections: **Explorer** (file tree, `01-design-system.md` §6.16),
**Outline** (symbol tree for the active file — functions/classes collapsible,
click to jump), **Problems** (flat list of diagnostics across the project,
grouped by file, with severity icon + message, click jumps to the line).

Each section header is a `Tabs`-style collapsible rule (`▾`/`▸`) rather than
a separate panel, so the user controls how much of the sidebar's vertical
space goes to file browsing versus problems at any moment. Section heights
are user-draggable with the same snap behavior as the right panel.

File tree rows show AI-attribution dots (per `01-design-system.md` §6.16) —
this is how "project awareness" becomes visible at rest: a user can see at a
glance which files the AI touched recently without opening a diff.

## 4. Tabs & breadcrumbs

Editor tabs sit in a single row above the editor: `radius.md` top corners
only, active tab `surface.canvas` (matches editor background, "flush" against
its content), inactive tabs `surface.base`. Each tab: file-type icon, name
(`body.sm`), unsaved-modified dot (`accent.secondary`, replaces the icon on
hover to show a close ✕ instead), close button on hover/focus. Overflow tabs
scroll horizontally with a fade mask at the edges rather than shrinking
indefinitely.

A breadcrumb rule sits directly under the tab row: `Workspace ▸ src ▸ auth ▸
login.ts ▸ handleLogin()` — each segment clickable, folder segments open a
quick-jump dropdown of sibling files, the final symbol segment syncs live
with cursor position (updates as the user scrolls/clicks in the editor).

## 5. Editor

`surface.canvas` background (the one place the deepest background token is
used for content, not chrome — reinforces that code is the "ground truth"
layer). `mono.md`, 1.6 line-height for comfortable scanning. Gutter: line
numbers `text.disabled`, git-change markers (`|` bar, `status.success` for
added/`accent.secondary` for modified/`status.error` triangle for deleted-below)
flush against the number column, breakpoint/diagnostic dots inline with them.

**Minimap**: docked right edge of the editor (inside the editor region, not
part of the app shell's right panel), 80px wide, low-opacity rendered glyphs
of the actual code (not an abstract heatmap), a `surface.raised` viewport
window overlay showing current scroll position, draggable. Diagnostics appear
as thin colored ticks in the minimap's own gutter.

**Inline AI markers**: when the AI is the source of a change not yet
accepted/committed (e.g. proposed inline during a live edit), the affected
lines get a soft `accent.secondary.muted` left-edge wash — same visual
grammar as the Diff Viewer's added-line treatment, so "AI proposed this" and
"this is new code" read as the same kind of fact.

**Selection → AI actions**: selecting any code range shows a small floating
`ghost`-button toolbar above the selection after a short hover delay: `Ask`,
`Explain`, `Fix`, `Refactor` — each pre-fills the composer with the selection
attached as context (visually, the selection becomes an `@` reference chip in
the composer, matching the `@file` mention pattern from
`03-ai-execution-experience.md` §2).

## 6. Bottom panel — Terminal / Problems / Preview

Tabbed strip (underline style per `01-design-system.md` §6.5) directly above
the panel body. Default height ~220px, draggable top edge, collapses to a
28px tab-only strip on click of a chevron (matches the collapse affordance
used elsewhere in the shell for consistency).

- **Terminal**: full `Terminal` component. Multiple terminal instances get
  their own sub-tabs (small, `+`-to-add, `×`-to-close) inside this tab.
- **Problems**: a denser, filterable version of the sidebar Problems list —
  same rows, plus filter chips (Errors/Warnings/Info) and a "Fix with AI"
  ghost button per row that routes straight into a scoped execution turn.
- **Preview**: a live embedded preview of the running app (for web projects)
  — device-frame toggle (desktop/tablet/mobile width presets), refresh
  button, and an address/route field. This is the same rendering surface the
  Browser Agent's "Open Browser" tool card can pop into full view.

## 7. Git integration

Git status lives in three coordinated places that always agree with each
other: the Explorer's per-file dots (§3), the right context panel's Git tab
(list of changed files + stat summary + a `Commit` composer at the bottom —
message field, `Commit` primary button), and inline in the editor gutter (§5).
There is no separate standalone "Git screen" in the Project Workspace — git
state is treated as an attribute of files and diffs, not its own destination,
which keeps the mental model to "one project, one truth" rather than yet
another panel to check.

Committing from the right panel produces a Git Commit Tool Card
(`05-tool-cards.md` §4) in the current session's turn history, so commit
activity is auditable the same way AI actions are — human and AI commits look
identical in the log except for the actor attribution in the card header.

## 8. Quick actions

A small `⋯` affordance in the tab row's right corner opens: Split editor,
Open in new window, Reveal in Explorer, Copy path, Run file, Toggle minimap.
Right-click in the Explorer opens the standard file `Context menu`
(`01-design-system.md` §6.6): New File/Folder, Rename, Delete, Reveal, Ask AI
about this file.

## 9. Context references

Anything a user has explicitly pinned as relevant context for the AI (a file,
a doc, a past decision) appears as a small persistent strip directly above
the composer when in Project Workspace:

```
Context: @login.ts  @rate-limits.md  ⊕ Add
```

Chips are removable (×), reorderable is not needed (order has no semantic
effect), and clicking a chip opens that file/doc in the editor. This strip is
the visible surface of the right panel's "Memory" tab — pinning something here
is equivalent to pinning it there.
