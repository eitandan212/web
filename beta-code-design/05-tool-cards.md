# 05 · Tool Cards

## 1. Purpose

Every discrete action the system takes — reading a file, running a command,
opening a browser — renders as a Tool Card. These are the moment-to-moment
texture of "watching the AI work," so they get the most craft of any recurring
element in the product: consistent enough to scan quickly, detailed enough to
audit fully.

## 2. Anatomy (collapsed — default state)

```
┌──────────────────────────────────────────────────────────┐
│ 📄  Read File            auth/login.ts            ✓ 0.4s │
└──────────────────────────────────────────────────────────┘
```

- **Tool icon**: 20px, monochrome, per-tool glyph (see §4 table). Sits inside
  a 28px `radius.sm` chip with a 10%-opacity tint of the tool's category color
  (file ops = blue-neutral, terminal = slate, git = orchid, browser = violet —
  reusing the agent identity palette from `04-multi-agent-system.md` §2 so
  tools and the agents that run them feel like one system).
- **Tool name**: `body.sm` weight 600, `text.primary`.
- **Primary input summary**: the single most useful piece of context — a file
  path, a command, a URL, a search query — `mono.sm`, `text.secondary`,
  truncated from the left when long (so the meaningful filename tail stays
  visible: `…/middleware/rate.ts` rather than `middleware/rate.t…`).
- **Status + duration**, right-aligned: a status glyph (spinner while running,
  `status.success` check, `status.error` ✕, `status.warning` for "completed
  with warnings") followed by elapsed/total time, `caption`, tabular-nums.

Card container: `surface.raised`, `border.default`, `radius.md` (one step
smaller than a content Card's `radius.lg`, since tool cards are dense and
frequently repeated — a slightly tighter radius keeps a long stack of them
from feeling like a stack of separate "documents"). 1px `border.subtle`
between stacked cards belonging to the same plan step, `space.sm` gap between
different steps.

## 3. Expanded state

Click anywhere on the collapsed row (not just a chevron — the whole card is
the affordance) to expand:

```
┌──────────────────────────────────────────────────────────┐
│ 📄  Read File            auth/login.ts            ✓ 0.4s │
│ ──────────────────────────────────────────────────────── │
│  Input                                                     │
│  path: auth/login.ts                                       │
│                                                              │
│  Output                                                     │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 1  import { Router } from 'express';                 │   │
│  │ 2  import { rateLimiter } from '../middleware/rate'; │   │
│  │ ⋯  47 more lines                                      │   │
│  └────────────────────────────────────────────────────┘   │
│                                                              │
│  Summary                                                    │
│  Found the login handler; no existing rate limiting.        │
│                                                              │
│  Files affected: auth/login.ts (read only)                  │
│                                                              │
│                                          [ ⧉ Copy ]  [⟳ Retry]│
└──────────────────────────────────────────────────────────┘
```

Sections appear only if they have content for that tool (a Read File card has
no "Files affected: modified" line since it made no changes; a Terminal card
replaces "Output" with a live console log, see §4). Expand/collapse animates
height via `motion.base`, content fades in over the last 80ms of the expand
so text doesn't visibly reflow while the container is still growing.

**Retry** appears on any card, always — even successful ones, since re-running
a read or search is harmless and users sometimes want a fresh look. **Copy**
copies the output content (path, command, or file contents) depending on tool
type.

## 4. Per-tool variants

| Tool | Icon | Primary input shown | Output shown | Notes |
|---|---|---|---|---|
| Read File | document | file path (+ line range if partial) | syntax-highlighted excerpt, `Code block` component | Read-only badge, never shows "Files affected" |
| Write File | document-plus | file path | full new-file content, collapsed after 12 lines with "Show all" | Shows a `status.success` "Created" badge distinct from Edit's "Modified" |
| Edit File | pencil | file path | `Diff viewer` component (`01-design-system.md` §6.14), unified by default | The single most-viewed card type; diff renders inline, not behind an extra click |
| Run Terminal | terminal chevron `›_` | the command string, `mono.sm` in a slate-tinted chip | live-streaming `Terminal` block, stdout/stderr colored per §6.17 | Only tool card with a live-updating body while `Running`; shows a Stop (icon button) during execution |
| Search Project | magnifier | query string + scope (e.g. "in `src/`") | ranked list of file matches, each a mini file-tree row with the matching line snippet, `mono.sm` | Clicking a match opens that file in Project Workspace |
| Preview Website | window/browser glyph | URL | a live thumbnail screenshot (16:9, `radius.sm`) with a "Open full preview" ghost button | Thumbnail refreshes once per completion, not continuously |
| Open Browser | browser glyph, filled variant | URL + short action description ("navigating, filling form") | step-by-step action log (numbered, like the Plan list) plus a final screenshot | Used for multi-step browser automation, distinct from the single-shot Preview Website |
| Git Commit | branch glyph | commit message, first line | file list with add/remove line counts per file (`+12 −3` in success/error colors), commit hash badge | Includes a `View diff` ghost button opening the full `Diff viewer` |
| Fix Error | wrench glyph, amber tint | the error message being addressed | before/after `Diff viewer` plus a one-line root-cause explanation above it | Category color is amber (matches `status.warning`) rather than the neutral blue file-op tint, since this card always follows a failure |
| Install Package | box glyph | package name(s) + version | terminal-style install log, collapsed to just the final "N packages added" line on success | Shows a lockfile-changed badge when applicable |

## 5. States

| State | Visual difference from default |
|---|---|
| Running | Status column shows a 12px indeterminate spinner instead of a check; card border stays `border.default` (not accented) so a whole turn full of running cards doesn't turn into a wall of blue |
| Success | `status.success` check glyph; no persistent color wash on the card itself — success is communicated by the glyph and duration, not a green-tinted card background, to keep long threads calm |
| Warning | `status.warning` triangle glyph; a single-line amber note appended just below the header explaining the warning (e.g. "completed, but 2 deprecation warnings") |
| Failed | `status.error` ✕ glyph; card gets a 1px `status.error` left-edge bar (4px, full height) — the one card state allowed a persistent color accent, since failures must be scannable in a long thread; auto-expands on first render |
| Needs approval | Used for actions gated by user settings (e.g. destructive terminal commands). Header shows an amber "Approval needed" badge in place of duration; body shows the full input up front (uncollapsed) plus an inline `Approve` / `Deny` action row |

## 6. Grouping

Consecutive tool cards belonging to the same plan step are visually grouped
under that step's label (see `03-ai-execution-experience.md` §3.4) with a
thin connecting rule on the left, rather than repeating the plan-step text on
every card. When an agent produces the cards (multi-agent turns), a small
agent identity chip (`04-multi-agent-system.md` §2) sits to the left of the
group label instead of on every individual card, to avoid repeating the same
chip a dozen times in a row.

## 7. Density rule

A turn showing more than 6 tool cards from the same step auto-collapses the
middle ones into a single "⋯ 4 more actions" summary row (expandable), keeping
the default view scannable while preserving full detail on demand. This
summary row still shows an aggregate status (if any of the hidden cards
failed, the summary row itself shows the error glyph, not just "4 more").
