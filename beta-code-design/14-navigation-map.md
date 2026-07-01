# 14 · Navigation Map

## 1. Purpose

A single reference for how every screen connects to every other screen —
what's a persistent shell versus a swapped mode, what's a modal versus a full
navigation, and what the back/forward semantics are. Use this document to
check "can a user get lost here" before adding any new screen.

## 2. Shell vs. mode vs. overlay

Three different kinds of "screen change" exist in Beta Code, and they must
not be visually confused with each other:

| Kind | What persists | What changes | Example |
|---|---|---|---|
| **Shell** | Sidebar + right panel frame, title bar | Never swaps wholesale | The app window itself |
| **Mode** | Shell frame | Center workspace content, right panel's available tabs | Dashboard → Project Workspace |
| **Overlay** | Everything behind it, dimmed | A layer on top, dismissible without navigation | Command Palette, Modals, Marketplace detail slide-in |

Left-nav clicks always produce a **mode** change (no page-load feeling, no
scroll-position loss elsewhere). Only overlays get open/close animations that
imply "this is temporary"; modes cross-fade as content swaps in place
(`12-motion-system.md`).

## 3. Full sitemap

```
Beta Code
│
├─ Dashboard  (08)                                  [mode, default landing]
│
├─ Projects                                          [mode: project list]
│   └─ <Project>                                     [mode: Project Workspace, 06]
│        ├─ Files (Editor/Terminal/Preview)           [tab within mode]
│        ├─ Overview                                  [tab, 11 §3]
│        ├─ Tasks & Timeline                          [tab, 11 §7]
│        ├─ History (project-scoped)                  [tab, 11 §8]
│        ├─ Docs                                      [tab, 11 §9]
│        └─ Architecture                              [tab, 11 §10]
│
├─ Agents                                             [mode, 04 §4]
│   └─ <Agent detail / transcript>                    [in-place expand, not a new mode]
│
├─ Skills                                             [mode: installed skills list]
│
├─ Tasks                                              [mode: cross-project task list]
│
├─ History                                             [mode: cross-project session list]
│   └─ <Session>                                       [mode: Execution Workspace, resumed]
│
├─ Marketplace                                         [mode, 09]
│   ├─ Agents / Skills / Templates / Workflows /
│   │  Themes / Extensions                             [tab within mode]
│   └─ <Item Detail>                                    [overlay: right-edge slide-in, 09 §4]
│
├─ Settings                                            [mode, 10]
│   ├─ General / Appearance / Models & Providers /
│   │  Agents / Skills / Workspace / Editor / Terminal /
│   │  Notifications / Privacy / Updates / Advanced / About
│                                                        [left-rail sub-nav within mode]
│
└─ (overlays reachable from anywhere)
    ├─ Command Palette (⌘K)                            [07]
    ├─ New Project modal                                [13 §3]
    ├─ Launch Agent modal                               [04 §4.2]
    ├─ Share Workspace modal                             [13 §8]
    └─ Notification toast stack                          [20]
```

Any node under "Execution Workspace" (the conversational/agent-run surface,
`03-ai-execution-experience.md`) is not a separate mode from Project
Workspace — it's the *content* of the center column whenever a turn is
active, layered above whatever else is there (Dashboard's cold-start, or the
Project Workspace's Editor area collapses to make room per
`02-application-shell.md`). It never gets its own sitemap node because it is
not a destination you navigate *to*; it's a state the current destination can
be in.

## 4. Entry points into each mode

| Mode | Reachable from |
|---|---|
| Dashboard | App launch, sidebar "Dashboard," logo click (top of sidebar), `Esc` from any mode with no unsaved state |
| Projects / a specific project | Sidebar "Projects," Dashboard Pinned Workspaces, Command Palette `@`, History (resuming a session jumps into its project) |
| Agents | Sidebar "Agents," clicking any Agent Card anywhere (Dashboard, right panel, Timeline), Command Palette `/` |
| Skills | Sidebar "Skills," Settings → Skills (same list, different chrome — see §5) |
| Tasks | Sidebar "Tasks," Project's own Tasks tab (project-scoped filter applied) |
| History | Sidebar "History," Project's own History tab (scoped) |
| Marketplace | Sidebar "Marketplace," any "Requires X" prompt inline in Settings/Agents, Suggested Actions |
| Settings | Sidebar "Settings," any inline "Configure" link from other screens (deep-links to the specific section) |

## 5. Same list, different chrome

Skills has both a global mode (browsing/enabling any installed skill) and a
Settings sub-section (`10-settings-and-providers.md` §3). These render the
same underlying list component but the global mode adds Marketplace-style
discovery (browse more), while the Settings section is scoped to
configuration (enable/disable, per-skill options). This is intentional
duplication of a data source, not of a UI — implementers should back both
from one list component so they can never drift out of sync.

## 6. Back / forward semantics

- **Modes** do not push browser-style history entries the user "back-button"
  scrolls through — the left nav is the only navigation for modes, and
  switching away from a mode preserves its scroll/tab state for when the
  user returns (per §2, modes don't reload).
- **Overlays** always close on `Esc` or scrim-click, returning to exactly the
  underlying mode/state that was present before they opened — no data loss,
  no re-fetch.
- **Project Workspace tabs** (Files/Overview/Tasks/etc., §3) behave like
  in-mode tabs, not sub-navigation — switching tabs and back preserves editor
  cursor position, scroll offsets, and open terminal sessions.
- **Resuming History** into an Execution Workspace is the one flow that
  changes *two* things at once (switches to that session's project AND opens
  its turn history) — this is acceptable because it's an explicit, singular
  user action ("resume this"), not an ambient side effect.

## 7. What never appears more than one hop away

Per the two-click principle in `15-design-principles.md`, these are the
"always within reach" targets and how they stay that way:

- **Command Palette** — global keyboard shortcut, available as an overlay
  from literally every mode and overlay except a fully modal confirmation.
- **Model switch** — available both globally (Settings) and locally (composer
  badge, §7 of `13-user-flows.md`) so it's never more than one click from
  wherever the user is actively working.
- **Fix with AI** — appears inline at the point of failure (Problems list,
  Build card, failing Tool Card) rather than requiring a detour through a
  separate "errors" screen.
- **Git status** — visible ambiently (Explorer dots, gutter, Overview card)
  before it's ever a click away in the Git tab, so checking status costs zero
  clicks in the common case.
