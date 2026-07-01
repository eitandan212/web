# 07 · Command Palette

## 1. Purpose

The universal entry point for doing anything without leaving the keyboard:
opening files, switching models, launching agents, creating projects,
navigating between screens, or triggering any command exposed by settings,
skills, or the marketplace. `⌘K` from anywhere in the app.

## 2. Layout

```
┌──────────────────────────────────────────────────────────┐
│  🔍  Type a command or search…                             │
├──────────────────────────────────────────────────────────┤
│  SUGGESTED                                                  │
│  ◆  Open login.ts                                            │
│  ◆  Continue "Rate limiting" session                         │
│                                                                │
│  FILES                                                       │
│  📄  src/auth/login.ts                                        │
│  📄  src/middleware/rate.ts                                   │
│                                                                │
│  COMMANDS                                                    │
│  ⚙  Switch model → GLM 4.6                       ⌘⇧M         │
│  ▶  Launch Testing Agent                                      │
│  ＋  New Project                                  ⌘N          │
│                                                                │
│  NAVIGATE                                                     │
│  ▤  Dashboard        🧩 Marketplace       ⚙ Settings           │
└──────────────────────────────────────────────────────────┘
```

Centered overlay, 640px wide, elevation 3, `surface.glass`, `radius.xl`.
Scrim behind it dims the app (`rgba(4,5,7,0.6)`) but the app remains visible
and slightly desaturated rather than fully hidden — reinforces that this is a
transient utility layered over the workspace, not a new screen.

## 3. Input

56px tall, no visible border (the palette's own edge is the field's edge),
leading search icon, `title.md` size text — noticeably larger than standard
inputs since this is the single most-used control in the product and
deserves to feel immediate and effortless to hit. Placeholder text rotates
contextually ("Search files, agents, commands…" default; "Ask a question or
run a command…" if invoked with text already selected).

## 4. Result grouping & ranking

Results are grouped under `caption`-weight section labels (`text.tertiary`,
uppercase, letter-spaced) in a fixed priority order: **Suggested** (contextual
— recent file, resumable session, "continue where you left off"), **Files**,
**Commands**, **Agents**, **Navigate**. A group is omitted entirely if empty
rather than shown with a "no results" placeholder, keeping the list tight.

Within a query, fuzzy-match highlighting bolds the matched characters in
`accent.primary` against the default `text.primary`/`text.secondary` label.
Keyboard `↑`/`↓` moves selection across group boundaries seamlessly (it's one
continuous list visually grouped, not independently-navigable sub-lists);
`Tab` accepts an inline completion when one command clearly dominates (e.g.
typing "model" jumps straight to the model-switch flow).

## 5. Row anatomy

28px height (denser than a standard menu row per `01-design-system.md` §6.6,
since palette lists can be long), leading icon (file-type glyph, tool icon,
or agent identity chip depending on result type), label, optional right-aligned
metadata (a keyboard shortcut in `caption`/`text.tertiary`, or a secondary
detail like a file's folder path in `text.tertiary`). Hover/selected state:
`surface.raised` background wash, `radius.sm`, inset 6px from the palette's
edges.

## 6. Command modes

Typing a prefix switches the palette into a scoped mode without leaving the
same input — consistent with the composer's inline triggers
(`03-ai-execution-experience.md` §2), since both are "one field, many modes"
by design:

| Prefix | Mode | Behavior |
|---|---|---|
| *(none)* | Universal | Blended files/commands/navigation as above |
| `>` | Command-only | Every registered command, Settings-style categorized list |
| `@` | File/symbol | Jumps straight to file+symbol search, opens the file on select |
| `/` | Skills & agents | Lists installed skills and launchable agents |
| `#` | Recent sessions | Chronological list of past conversations/turns, grouped by day |

A small mode indicator (a `Badge`) appears left of the input once a prefix is
active, and Backspace on an empty field pops back to Universal mode — same
"un-commit" gesture pattern as clearing a filter chip elsewhere in the app.

## 7. Inline actions

Some rows carry a secondary hover action beyond "select": model rows show a
"Set as default" ghost link, agent rows show "View details," recent-session
rows show a trailing timestamp that becomes a "Resume" button on hover. These
never replace the primary click target (clicking anywhere else on the row
still performs the default action — open/select).

## 8. Behavior notes

- Opening the palette while text is selected in the editor auto-populates an
  `@selection` context chip, so "ask something about this" is a single
  keystroke away.
- Palette state does not persist between opens — it always starts at
  Universal mode with an empty, focused field. Persistence would fight the
  palette's job as a fast, disposable utility.
- Closing: `Esc`, click on scrim, or selecting a result. Exit animation is a
  fast fade + 4px scale-down (`motion.fast`), no slide, to keep it feeling
  instantaneous rather than like a panel that "lives" somewhere and closes to
  a location.
