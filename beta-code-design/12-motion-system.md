# 12 · Motion System

## 1. Principle

Motion in Beta Code communicates state change, never decoration. If an
animation doesn't answer "what just changed" it doesn't ship. Base tokens are
defined in `01-design-system.md` §5 (`instant/fast/base/slow`); this document
catalogues every recurring motion moment referenced across the other screen
specs, so implementers have one place to check for consistency.

## 2. Catalogue

| Moment | Token | Behavior |
|---|---|---|
| Button hover | `instant` (80ms) | Background/opacity step only, no movement |
| Button press | `fast` (140ms) | Scale to 0.98, springs back on release |
| Toggle / switch flip | `fast` | Thumb slides across track, `cubic-bezier(.2,.8,.2,1)` |
| Tab switch | `fast` | Underline slides to new position (width-aware, not just fade) |
| Sidebar collapse/expand | `slow` (360ms), fade-then-shrink | Labels fade out (`fast`) before width animates (`base`) — sequenced, not simultaneous |
| Right panel resize | continuous, follows pointer | Snap settle uses `base` easing once released |
| Right panel collapse to rail | `base` (220ms) | Width animates, content cross-fades at 50% of duration |
| Modal open | `base` | Scale 0.98→1 + fade, scrim fades in `base` concurrently |
| Modal close | `fast` | Fade only, no scale, feels "quicker to dismiss than to summon" |
| Command palette open | `base` | Scale 0.96→1 + fade |
| Command palette close | `fast` | Fade + 4px scale-down, no slide |
| Toast enter | `base` | Slide up 8px + fade |
| Toast exit | `fast` | Fade only |
| Dropdown/menu open | `fast` | Fade + 2px slide from trigger edge |
| Tooltip show | 120ms delay, then `instant` | No delay on hide |
| Card expand (tool card, agent card) | `base` | Height auto-animates; inner content fades in during final 80ms to avoid reflow-flicker |
| Phase transition (Understanding→Planning etc.) | `slow` | Phase-indicator dot fill animates, accent color of the turn's active elements cross-fades to the new phase's color |
| Streaming text | continuous, token cadence | Steady per-token reveal; caret blink follows terminal-cursor timing (500ms) as the sole exception to "no idle loops" |
| Plan-step status glyph | `fast` | Spinner → check: 140ms scale-in on the check glyph, not a hard cut |
| Progress bar fill | continuous, matches real progress | No easing tricks that fake progress — fill width always reflects true state |
| Indeterminate progress / spinner | continuous, constant velocity | No ease-in/out — communicates "ongoing," not "arriving" |
| Agent ambient glow | none (static) | Presence/absence only — appears instantly when running starts, disappears instantly on completion |
| Diff viewer reveal (collapsed context expand) | `fast` | Height auto-animate, no fade needed (text, not layout, is the payload) |
| File tree expand/collapse | `fast` | Chevron rotates 90°, children height-animate together |
| Notification badge appear (nav dot) | `instant` | Opacity only, no bounce |
| New-content scroll pill | `fast` in / `fast` out | Appears when auto-scroll disengages during streaming |
| Marketplace detail panel open | `base` | Slides in from right edge, grid behind stays static (no parallax) |
| Theme live-preview swap | `base` | Color tokens cross-fade rather than hard-cutting, so a theme preview doesn't strobe |
| Settings inline-save confirmation | `fast` in, 1.2s hold, `fast` out | Checkmark only, no color flash on the whole row |
| Drag-resize snap (panels) | `fast` on release | Magnetic pull to nearest snap point once within capture radius |

## 3. What never animates

- Text content reflow while streaming past a fixed container width (width is
  fixed before streaming begins to prevent horizontal jitter).
- Status colors on success (no green flash-then-fade on a tool card's whole
  background) — only the glyph itself changes, per `05-tool-cards.md` §5.
- Anything on a fixed interval purely for attention (no pulsing badges, no
  looping shimmer beyond the deliberately slow/subtle skeleton shimmer in
  `01-design-system.md` §6.18).
- Window-level chrome (title bar, sidebar rail width when not actively being
  toggled) — these stay perfectly still so they read as a stable frame around
  whatever is animating inside them.

## 4. Reduced motion

All `base`/`slow` transitions collapse to a straight `instant` opacity
cross-fade when the OS-level reduced-motion preference is set; `fast`
interactions (button press, toggle) keep their scale/slide since those are
short enough to remain comfortable and communicate direct manipulation
feedback that users still need even with motion sensitivity.
