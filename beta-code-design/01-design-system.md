# 01 · Design System

The foundation every screen in this brief is built from. Treat this file as the
single source of truth for tokens; screen specs only ever reference these names.

---

## 1. Color

Beta Code is dark-first. There is no light theme in v1 — the product's identity is
the dark surface. (Settings reserves a slot for a future light theme; see
`10-settings-and-providers.md`.)

### 1.1 Surfaces

| Token | Value | Usage |
|---|---|---|
| `surface.canvas` | `#08090C` | App background, the deepest layer (near-black graphite) |
| `surface.base` | `#0E1013` | Sidebar, panel backgrounds |
| `surface.raised` | `#14161B` | Cards, tool cards, list rows |
| `surface.overlay` | `#1A1D23` | Modals, dropdowns, command palette |
| `surface.navy` | `#10131C` | Secondary surface tint — used behind code blocks, terminal, diff viewer |
| `surface.glass` | `rgba(20, 22, 27, 0.72)` + 24px backdrop blur | Floating panels: command palette, agent tray, notifications |
| `border.subtle` | `rgba(255, 255, 255, 0.06)` | Default hairline border between regions |
| `border.default` | `rgba(255, 255, 255, 0.10)` | Card edges, input borders |
| `border.strong` | `rgba(255, 255, 255, 0.16)` | Focused/hovered card edges |

Surfaces step up in lightness by ~2–4% per elevation level — never a jump greater
than that. This is what keeps the interface feeling like one calm material rather
than stacked cards.

### 1.2 Accent

| Token | Value | Usage |
|---|---|---|
| `accent.primary` | `#3D8BFF` (electric blue) | Primary actions, active nav state, focus rings, links, active agent glow |
| `accent.primary.muted` | `rgba(61, 139, 255, 0.14)` | Selected-row backgrounds, subtle highlight fields |
| `accent.secondary` | `#8B6BFF` (soft violet) | Secondary emphasis: AI-authored content markers, reasoning sections, agent-to-agent handoff lines |
| `accent.secondary.muted` | `rgba(139, 107, 255, 0.14)` | Reasoning block backgrounds |

Blue is the "system is acting for you" color. Violet is the "this is AI-generated
content or reasoning" color. Keeping these distinct lets a user scan a screen and
know instantly what's a control versus what's a thought.

### 1.3 Semantic

| Token | Value | Usage |
|---|---|---|
| `status.success` | `#39C589` | Completed states, passing checks, git-clean |
| `status.success.muted` | `rgba(57, 197, 137, 0.12)` | Success banners/badges |
| `status.warning` | `#E8A94B` | Degraded state, needs-attention, pending confirmation |
| `status.warning.muted` | `rgba(232, 169, 75, 0.12)` | Warning badges |
| `status.error` | `#EF5A5A` | Failures, blocking errors |
| `status.error.muted` | `rgba(239, 90, 90, 0.12)` | Error banners/badges |
| `status.info` | `#3D8BFF` | Same as accent.primary — informational, non-blocking |

### 1.4 Text

| Token | Value | Usage |
|---|---|---|
| `text.primary` | `#F5F6F8` | Headings, primary content, active labels |
| `text.secondary` | `rgba(245, 246, 248, 0.72)` | Body copy, descriptions |
| `text.tertiary` | `rgba(245, 246, 248, 0.48)` | Metadata, timestamps, placeholder |
| `text.disabled` | `rgba(245, 246, 248, 0.28)` | Disabled controls |
| `text.on-accent` | `#08090C` | Text on filled blue/violet buttons — near-black for contrast, not pure white |

All body text targets **WCAG AA (4.5:1)** minimum against its surface; large
headings target 3:1 per WCAG large-text allowance. `text.tertiary` is never used
for content the user must read to complete a task — metadata and timestamps only.

### 1.5 Gradients & glow — usage rules

Beta Code uses gradient and glow in exactly three places, each meaningful, never
decorative:

1. **Ambient agent glow** — a very low-opacity (8–12%) radial blue/violet bloom
   behind an *actively running* agent avatar or tool card, signaling "live." It
   stops the instant the task completes. Never animated as a constant pulse —
   opacity is static, only presence/absence communicates state.
2. **Streaming cursor** — a 1px accent-colored caret at the end of streaming text.
3. **Progress fills** — linear, single-hue (accent or status color), never
   multi-color rainbow fills.

Nothing else in the product uses a gradient. No decorative background blobs, no
hero gradients on empty states.

---

## 2. Typography

### 2.1 Families

| Role | Family | Fallback stack |
|---|---|---|
| UI / Interface | **Inter** (var, 14–32) | -apple-system, Segoe UI, sans-serif |
| Code / terminal / diffs | **JetBrains Mono** | SF Mono, Cascadia Code, Consolas, monospace |

Inter is used at slightly tighter tracking than default (-1% to -2% at large
sizes) to read as engineered rather than "webby." JetBrains Mono is used at
+0% tracking with ligatures enabled for operators (`=>`, `!=`, `>=`).

### 2.2 Type scale

| Token | Size / Line height | Weight | Usage |
|---|---|---|---|
| `display` | 32 / 40 | 600 | Dashboard hero, empty-state headlines |
| `title.lg` | 22 / 30 | 600 | Screen titles (Project name, Settings section) |
| `title.md` | 17 / 24 | 600 | Panel headers, modal titles |
| `title.sm` | 14 / 20 | 600 | Card titles, list section headers |
| `body.md` | 14 / 22 | 400 | Default body copy, chat/response text |
| `body.sm` | 13 / 20 | 400 | Secondary copy, form labels |
| `caption` | 12 / 16 | 500 | Metadata, timestamps, badges, tab labels |
| `mono.md` | 13 / 20 | 400 | Inline code, code blocks |
| `mono.sm` | 12 / 18 | 400 | Terminal output, diff lines, logs |

Line length in the center workspace is capped at ~72ch for prose to keep long
AI responses readable — code blocks and tables break out to full column width.

### 2.3 Spacing rhythm

Beta Code uses an 4px base unit with a restricted set of steps so density stays
consistent across the whole app:

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64`

Named tokens: `space.xs=4  space.sm=8  space.md=12  space.lg=16  space.xl=24  space.2xl=32  space.3xl=48`

Rules of thumb:
- Sidebar item padding: `space.md` vertical, `space.lg` horizontal.
- Card internal padding: `space.lg` (compact cards) or `space.xl` (content cards).
- Section gaps in the center workspace: `space.2xl` minimum — this is what gives
  the "generous spacing" feel the brief calls for. Never stack two panels with
  less than `space.lg` between them.

---

## 3. Shape, elevation, borders

| Token | Value | Usage |
|---|---|---|
| `radius.sm` | 8px | Badges, chips, small buttons, inline code |
| `radius.md` | 12px | Buttons, inputs, list rows |
| `radius.lg` | 14px | Cards, tool cards |
| `radius.xl` | 18px | Modals, panels, the app window itself |

Elevation is expressed as **border + shadow**, not brightness jumps alone:

| Level | Shadow | Border | Used for |
|---|---|---|---|
| 0 | none | `border.subtle` | Flush panels (sidebar, context panel) |
| 1 | `0 1px 2px rgba(0,0,0,.4)` | `border.default` | Cards, tool cards, rows |
| 2 | `0 8px 24px rgba(0,0,0,.45)` | `border.default` | Dropdowns, popovers, tooltips |
| 3 | `0 24px 64px rgba(0,0,0,.55)` | `border.strong` | Modals, command palette |

Glass panels (`surface.glass`) always sit at elevation 2 or 3 and always carry a
1px `border.default` edge — the blur alone is not enough separation against
busy content behind it.

---

## 4. Iconography

- Single icon set, 1.5px stroke, 20×20 default / 16×16 compact / 24×24 nav-rail.
- Geometric, rounded joins, no fill except for active/selected state (filled at
  16% opacity behind a stroked icon, e.g. active sidebar item).
- Agent and provider "identity" marks (see `04-multi-agent-system.md` and
  `10-settings-and-providers.md`) are the only icons permitted a solid color
  chip background — everything else is monochrome (`text.secondary`, brightening
  to `text.primary` on hover/active).

---

## 5. Motion tokens

Full catalogue lives in `12-motion-system.md`; the base tokens:

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `motion.instant` | 80ms | linear | Hover color/opacity changes |
| `motion.fast` | 140ms | `cubic-bezier(.2,.8,.2,1)` | Button press, toggle, tab switch |
| `motion.base` | 220ms | `cubic-bezier(.2,.8,.2,1)` | Panel resize, modal open, card expand |
| `motion.slow` | 360ms | `cubic-bezier(.16,1,.3,1)` | Sidebar collapse, phase transitions in execution workspace |

Nothing in the product exceeds 400ms. Loops (spinners, skeleton shimmer) run at
low contrast and constant velocity — never easing in/out — so they read as
"waiting," not "trying to get attention."

---

## 6. Core components

Each entry: anatomy → states → notes. Components not listed here inherit the
nearest listed pattern (e.g. a "chip" follows Badge rules).

### 6.1 Button

**Variants:** `primary` (filled accent), `secondary` (1px border, transparent
fill), `ghost` (no border, text only), `danger` (filled `status.error`),
`icon` (square, icon-only, 32×32 or 36×36).

**Anatomy:** container (radius.md) → leading icon (optional) → label (`body.sm`,
weight 600) → trailing icon/shortcut hint (optional, `text.tertiary`).

**Sizing:** `sm` 28px height / `md` 34px height / `lg` 40px height. There is no
"xl" button — the brief's "avoid oversized buttons" rule is enforced by capping
height at 40px everywhere, including primary CTAs.

**States:** default → hover (background lightens 1 step, 80ms) → active/pressed
(scale 0.98, 80ms) → focus (2px `accent.primary` ring, 2px offset) → disabled
(`text.disabled` label, `border.subtle`, no hover response).

### 6.2 Input / Text field

Anatomy: label (`body.sm`, `text.secondary`) above, field below (`radius.md`,
`border.default`, `surface.raised` fill), optional leading icon, optional
trailing action (clear, reveal-password, unit).

States: default → focus (`border.strong` + 1px `accent.primary` inset ring) →
error (`status.error` border + helper text below in `status.error`) → disabled
(`text.disabled`, `surface.base` fill, no border change on hover).

Height: 34px single-line, auto-grow for multiline (prompt composer — see
`03-ai-execution-experience.md` §2).

### 6.3 Dropdown / Select

Trigger looks like an Input. Menu is elevation 2, `radius.md`, max-height with
internal scroll, 4px padding, rows at 32px height, `radius.sm` hover state
inset by 4px from menu edge. Selected row shows a leading checkmark, not a
background fill, to avoid confusing "selected" with "hovered."

### 6.4 Card

Base container: `surface.raised`, `border.default`, `radius.lg`, `space.lg`
padding, elevation 1. A card has an optional header row (title + meta + action
slot, `border.subtle` bottom rule) and a body region. Cards never nest a card
of the same elevation inside themselves — nested content uses `surface.base`
insets instead, to keep depth reasoning simple.

### 6.5 Tabs

Underline style, not boxed/pill style, inside panels (Explorer/Editor area,
Settings sections). Active tab: `text.primary` label + 2px `accent.primary`
underline. Inactive: `text.tertiary`, underline transparent. Editor tabs are
the one exception — see `06-project-workspace.md` (they carry a close affordance
and a modified-dot).

### 6.6 Menu / Context menu

Elevation 2, `radius.md`, `surface.overlay`. Rows 30px, icon + label + optional
trailing shortcut in `text.tertiary` `caption`. Destructive items use
`status.error` label color, no red background unless hovered (then
`status.error.muted` background).

### 6.7 Modal

Elevation 3, `radius.xl`, max-width 560px (confirmation) or 720px (content
modals e.g. "New Project"). Scrim: `rgba(4,5,7,0.6)`, no blur on the scrim
itself (blur is reserved for the modal's own glass, keeping the dimmed
background legible). Header (`title.md` + close icon-button) → body
(`space.xl` padding) → footer (right-aligned actions, `secondary` then
`primary`, `space.md` gap).

### 6.8 Notification / Toast

Bottom-right stack, `surface.glass`, elevation 2, `radius.lg`, max-width 360px.
Leading status icon (colored per semantic token) + title (`title.sm`) +
description (`body.sm`, `text.secondary`) + optional action link. Auto-dismiss
after 6s for info/success, persists for warning/error until dismissed.
Entrance: slide up 8px + fade, `motion.base`. Exit: fade only, `motion.fast`.

### 6.9 Tooltip

`surface.overlay`, `radius.sm`, `caption` text, 6px/8px padding, 4px offset
from trigger, 120ms delay before showing, no delay on hide. Never used to
convey information not available elsewhere — supplementary only.

### 6.10 Checkbox / Switch / Radio

Checkbox: 16×16, `radius.sm`(4px), `border.default`, checked state fills
`accent.primary` with a white check glyph. Switch: 32×18 track, `surface.base`
off / `accent.primary` on, thumb 14×14 with 2px inset, `motion.fast` slide.
Radio: 16×16 circle, filled dot at 8×8 in `accent.primary` when selected.

### 6.11 Progress bar / Slider

Linear track 4px height, `radius.sm`(full), `surface.base` track,
`accent.primary` fill (or semantic color when representing a status, e.g.
`status.error` fill for "3 tests failing"). Indeterminate state: a 30%-width
segment sweeping left→right, constant velocity, `motion` loop, no easing.
Slider (volume, context-window usage editable controls): 4px track + 12px
thumb, thumb scales to 14px on hover/drag.

### 6.12 Badge / Chip

`radius.sm`, `caption` weight 600, `space.xs`/`space.sm` padding. Neutral
(`surface.base` + `text.secondary`), or semantic (`status.*.muted` background +
`status.*` text). Used for: agent status, model name tags, provider labels,
file-change counts.

### 6.13 Code block

`surface.navy` background, `radius.md`, `mono.md`, 1px `border.subtle`. Header
bar: language label (`caption`, `text.tertiary`) left, copy button right, shown
on hover only. Line numbers in `text.disabled`, non-selectable. Syntax theme:
a custom 8-color scheme tuned to the palette above — keywords in
`accent.secondary`, strings in `status.success`, functions in `accent.primary`,
comments in `text.tertiary` italic. No neon syntax colors.

### 6.14 Diff viewer

Split or unified (user toggle, unified default in chat, split default in
Project Workspace). Added lines: `status.success.muted` background wash,
`+` gutter marker in `status.success`. Removed: `status.error.muted` wash,
`-` marker in `status.error`. Unchanged context collapses after 3 lines with a
"⋯ N unchanged lines" expandable rule, `text.tertiary`, click to reveal.

### 6.15 Table

Header row: `caption` weight 600 `text.tertiary`, bottom `border.default`,
sticky on scroll. Body rows: `body.sm`, 36px height, `border.subtle` row
divider, `surface.raised` hover wash. Numeric columns right-aligned,
tabular-nums.

### 6.16 File tree

20px row height, 16px indent per depth, chevron rotates 90° on expand
(`motion.fast`), folder/file icons colored by type (colors reused from the
code-block syntax theme so a `.tsx` icon and `.tsx` syntax highlighting feel
related). Modified files show a small `accent.secondary` dot; git-new files a
`status.success` dot; conflicts a `status.error` dot — all trailing, right
aligned in the row.

### 6.17 Terminal

`surface.navy`, `mono.sm`, 6px internal padding beyond the block padding.
Prompt glyph in `accent.primary`. stdout in `text.primary`, stderr in
`status.error`, muted/info logs in `text.tertiary`. Cursor: solid block,
500ms blink — the one exception to "no looping animation," because it's the
expected OS-native terminal cursor behavior.

### 6.18 Skeleton / loading state

`surface.raised` base with a 1.5s linear shimmer sweep at 6% opacity delta —
slow and subtle, never the fast shimmer common in consumer apps. Shapes mirror
the real content's geometry (a card skeleton has the same header/body block
proportions as the loaded card) so layout never jumps on load.

### 6.19 Empty state

Centered within its container: a single 24×24 monochrome icon (`text.tertiary`),
`title.sm` headline, one line of `body.sm` `text.secondary` explanation, one
optional primary action. No illustrations, no mascots.

### 6.20 Error state

Same layout skeleton as empty state, icon swapped for a status-colored alert
glyph, headline states what failed in plain language, body gives the reason if
known, action is "Retry" (`secondary` button) plus, where relevant, "View
details" (`ghost` button, opens logs).
