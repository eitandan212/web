# 02 · Application Shell

## 1. Purpose

The shell is the persistent frame every screen lives inside: a three-column
adaptive layout that reflows based on context, never on a fixed per-screen basis.
The same shell serves the Dashboard, a chat/execution session, the Project
Workspace (IDE), Marketplace, and Settings — only the contents of the center
column and the presence/content of the right panel change.

## 2. Layout — desktop reference (1440×900)

```
┌──┬──────────────────────────────────────────────────────────┬──────────────────┐
│  │  Title bar: workspace name · breadcrumb · window controls │                  │
│  ├──────────────────────────────────────────────────────────┤                  │
│L │                                                            │                  │
│e │                                                            │   RIGHT          │
│f │                  CENTER WORKSPACE                         │   CONTEXT        │
│t │                                                            │   PANEL          │
│  │                                                            │                  │
│S │                                                            │  (collapsible,   │
│i │                                                            │   resizable,     │
│d │                                                            │   content        │
│e │                                                            │   varies)        │
│b │                                                            │                  │
│a │                                                            │                  │
│r │                                                            │                  │
│  ├──────────────────────────────────────────────────────────┤                  │
│  │  Prompt composer (persistent when in a session)           │                  │
└──┴──────────────────────────────────────────────────────────┴──────────────────┘
 64/240        flexible, min 640                                  0/320/480
```

Column widths:

| Column | Collapsed | Default | Expanded / user-resized |
|---|---|---|---|
| Left sidebar | 64px (icon rail) | 240px | up to 320px |
| Center workspace | — | fills remaining space | min 640px before right panel auto-collapses |
| Right context panel | 0 (hidden) | 320px | up to 480px, drag handle |

Below 1180px total width, the right panel auto-collapses to an icon rail
(48px) that flies out as an overlay on click rather than permanently taking
column space — the center workspace is never squeezed below 640px.

## 3. Left Sidebar

### 3.1 Structure, top to bottom

```
┌────────────────────┐
│ ◆ Beta Code         │  logo mark + wordmark (hidden in rail mode, mark only)
│─────────────────────│
│ ▾ Personal Workspace│  workspace switcher (click → dropdown of workspaces)
│─────────────────────│
│  Search…      ⌘K    │  opens Command Palette, not an inline search
│─────────────────────│
│  ◻ Dashboard         │
│  ◻ Projects          │
│  ◻ Agents            │
│  ◻ Skills            │
│  ◻ Tasks             │
│  ◻ History           │
│  ◻ Marketplace       │
│─────────────────────│
│  (flex spacer)       │
│─────────────────────│
│  ◻ Settings          │
│  ⦿ Tomer  ▾           │  user profile, opens account menu
└────────────────────┘
```

### 3.2 Nav item anatomy

20px icon + 14px label (`body.sm` weight 500), 12px vertical / 16px horizontal
padding, `radius.md`. States:

- Default: `text.secondary` icon+label, transparent background.
- Hover: `text.primary`, `surface.raised` background, 80ms.
- Active/selected: `text.primary`, `accent.primary.muted` background, 2px
  `accent.primary` left-edge indicator bar (2px wide, 20px tall, centered).
- Item with running background activity (e.g. "Agents" while agents are
  executing) shows a small `accent.primary` dot, top-right of the icon, no
  animation — presence-only signal, consistent with the "no idle motion" rule.

### 3.3 Workspace switcher

Click opens a popover (elevation 2) listing workspaces with a small colored
initial-avatar, name, and a subtitle showing active-agent count if nonzero.
"Create workspace" pinned at the bottom, separated by a hairline.

### 3.4 Collapse behavior

A chevron control at the sidebar's bottom edge (next to the profile row)
toggles rail mode. Collapsing: labels fade out over `motion.fast`, then width
animates 240→64 over `motion.base`, `cubic-bezier(.2,.8,.2,1)` — fade-then-shrink,
not simultaneous, so text doesn't visibly compress/wrap mid-animation. In rail
mode, hovering an icon shows a tooltip with the label after the standard
120ms delay; active-item indicator moves to a top accent bar on the icon itself.

Keyboard: `⌘\` toggles sidebar collapse from anywhere in the app.

## 4. Center Workspace

The center workspace is a **region controller**, not a single screen — it swaps
its content based on what the left nav selected and what the current session
state is, but the outer chrome (title bar area, composer dock) stays fixed so
switching contexts doesn't feel like a page navigation.

### 4.1 Content modes

| Mode | When shown | Spec |
|---|---|---|
| Dashboard | "Dashboard" selected, no active session | `08-dashboard.md` |
| Execution workspace | A prompt has been submitted / session active | `03-ai-execution-experience.md` |
| Project workspace (IDE) | "Projects" → a project opened | `06-project-workspace.md` |
| Marketplace | "Marketplace" selected | `09-marketplace.md` |
| Settings | "Settings" selected | `10-settings-and-providers.md` |

### 4.2 Title bar

56px tall, `surface.base`, `border.subtle` bottom rule. Left: breadcrumb trail
(Workspace ▸ Project ▸ current view), truncating from the left with an ellipsis
when narrow. Right: mode-specific quick actions (e.g. "Share," "New Task,"
view-toggle icons for Project Workspace), then window controls on platforms
that need them.

### 4.3 Prompt composer dock

Persistent bottom bar of the center workspace whenever a project/workspace
context exists (hidden only on Settings/Marketplace full-bleed screens).
Full anatomy in `03-ai-execution-experience.md` §2 — noted here because it is
part of the shell's structural contract: the composer never scrolls away with
content; the scrollable region is everything above it.

## 5. Right Context Panel

### 5.1 Purpose

A single panel whose *content* changes with focus, not a set of competing
panels. This keeps the "context-aware" promise from the brief honest: there is
one place to look, and it always shows what's relevant to whatever the user
just clicked or whatever the active agent just touched.

### 5.2 Tab strip

The panel has a persistent top tab strip (not a dropdown) so the user can
flip between the context types that are currently populated, rather than
losing one when another becomes relevant:

```
┌───────────────────────────────┐
│ Files  Terminal  Git  Agents ⋯│  ← tabs appear only when they have content
├───────────────────────────────┤
│                                │
│         [ active tab content ] │
│                                │
└───────────────────────────────┘
```

Available tabs (shown only when populated): **Files** (project tree / current
file / selected code), **Terminal**, **Git** (status, diff summary),
**Agents** (running agents mini-roster — see `04-multi-agent-system.md` §5),
**Memory** (context documents, pinned facts), **Environment** (model in use,
env vars, performance meter). An overflow `⋯` menu holds any tab that doesn't
fit at the panel's current width.

The panel auto-switches its active tab when the system has something urgent
to surface (e.g., a running agent just needs a terminal command approved), but
never auto-switches away from a tab the user explicitly clicked in the last
10 seconds — explicit user intent always wins over ambient suggestion.

### 5.3 Resize & collapse

Drag handle on the panel's left edge, 4px hit target, cursor `col-resize`.
Snap points at 320 / 400 / 480px with a soft magnetic pull (8px capture
radius) so users land on clean widths without fighting the drag. Collapse
control (chevron) in the tab strip's right corner collapses to the 48px icon
rail described in §2; each rail icon reopens the panel to its last width on
click.

### 5.4 Empty state

When nothing is selected and no agents are running: a single centered
`body.sm` `text.tertiary` line — "Nothing to show yet. Open a file or start a
task." No icon needed here; this is the one empty state in the product allowed
to be that minimal, because it's a resting/default state rather than a result
of an action.

## 6. Responsive behavior summary

| Width | Sidebar | Right panel | Composer |
|---|---|---|---|
| ≥ 1440px | 240px default | 320–480px | full width under center col |
| 1180–1439px | 240px or user rail choice | auto-collapses to rail | full width under center col |
| 900–1179px | rail (64px) forced | rail, flyout overlay | full width under center col |
| < 900px | rail, flyout overlay | rail, flyout overlay | full width, composer input shrinks to single-line with expand affordance |

Beta Code's primary target is desktop (1280px+); the < 900px row exists for
resizing a window on a smaller display, not for a mobile layout.
