# 16 · Accessibility

## 1. Purpose

Beta Code is a professional tool used for hours at a time; accessibility here
is a correctness requirement, not an add-on pass at the end. Every component
in `01-design-system.md` §6 is specified with its accessible behavior inline
below rather than as a separate parallel system.

## 2. Keyboard navigation

Beta Code is designed to be fully operable without a mouse.

- **Focus order** follows visual/DOM order: sidebar → title bar → center
  workspace → composer → right panel, matching reading order. Overlays
  (modals, palette, dropdowns) trap focus within themselves until dismissed
  and restore focus to the triggering element on close.
- **Tab** moves between interactive elements; **Shift+Tab** reverses.
  **Arrow keys** move within a composite widget (file tree rows, menu items,
  agent card lists, table rows) without leaving the widget — Tab exits it.
- **Every** icon-only button (`01-design-system.md` §6.1 `icon` variant) is
  reachable via Tab and has a keyboard-triggerable action identical to its
  click behavior — no hover-only affordances (e.g. a Tool Card's Copy button,
  normally hover-revealed for a mouse user, is always present-but-visually-
  minimized for keyboard users navigating via Tab, appearing the instant it
  receives focus).
- **Escape** is universally "back out one level": closes the focused overlay,
  collapses an expanded card, or exits an inline edit — never closes more
  than one layer at a time, so repeated Escape presses are predictable.
- Full shortcut reference lives in `17-shortcuts.md`; every shortcut listed
  there has no mouse-only equivalent-only feature behind it — everything a
  shortcut does is also reachable via Command Palette or a visible control.

## 3. Contrast

All token pairs in `01-design-system.md` §1.4 are chosen to meet:

- **Body text** (`text.primary`, `text.secondary` at their documented sizes)
  against their surface: **4.5:1 minimum** (WCAG AA).
  `text.tertiary` is contrast-checked at 4.5:1 too where it is ever used for
  content the user must read (it is restricted to metadata per Rule in
  `01-design-system.md` §1.4, but that metadata must still be legible, not
  merely decorative).
- **Large text** (`display`, `title.lg`, `title.md`): **3:1 minimum**.
- **Non-text UI** (borders that convey meaning, focus rings, status dots,
  icon glyphs used as the sole state indicator): **3:1 minimum** against
  adjacent surfaces, per WCAG 1.4.11.
- **Semantic colors** (`status.success/warning/error`) are each verified at
  3:1 against both `surface.raised` and `surface.canvas`, since status glyphs
  appear on both. Where a semantic color alone would fall under 3:1 for a
  given surface (e.g. amber-on-navy edge cases), the glyph gains a 1px
  outline in `text.primary` at low opacity rather than the palette being
  altered per-instance.
- Every place color communicates state (Rule 2 in `15-design-principles.md`)
  is paired with shape/position/icon redundancy — colorblind users lose no
  information relying on shape alone (e.g. success = filled check + green,
  never green fill alone).

## 4. Screen reader support

- All interactive components carry semantic roles and labels matching their
  visual function (buttons are `button`, the file tree is a `tree` with
  `treeitem` nodes and `aria-expanded` state, tabs use `tablist`/`tab`/
  `tabpanel`, the Command Palette is a `dialog` containing a `listbox`).
- **Live regions**: streaming AI text (`03-ai-execution-experience.md` §4) is
  announced via a polite live region that reads completed sentences/blocks
  rather than every token, so a screen reader user isn't flooded with
  per-character announcements. Phase transitions (Understanding → Planning →
  …) announce once, briefly, at the moment they change ("Beta Code is now
  executing the plan").
- **Tool Cards** expose their collapsed-state summary (tool name, input
  summary, status, duration) as the accessible name/description of the
  row, so a screen reader user gets the same "scan the list" experience a
  sighted user gets from the collapsed view, and can opt into the expanded
  detail the same way a sighted user clicks to expand.
- **Agent Cards** announce state transitions (Running → Blocked → Done) via
  a live region scoped to that card, not globally, so multiple simultaneous
  agents don't produce overlapping announcements.
- **Icons never carry information without a text alternative** — every
  status glyph, agent identity chip, and file-type icon has an
  `aria-label`/accessible name matching what a sighted user reads from its
  color+shape+adjacent label.
- **Diagrams** (Architecture view, Agent orchestration swimlane) ship a
  structured text alternative (a nested list of nodes and their connections)
  toggleable from the diagram's own toolbar, since a canvas-rendered graph
  cannot itself be made meaningfully accessible.

## 5. Focus states

- Every focusable element has a visible focus indicator: 2px `accent.primary`
  ring, 2px offset from the element's edge (per `01-design-system.md` §6.1),
  applied consistently across buttons, inputs, cards, rows, and custom
  controls (sliders, switches) — no component is allowed to suppress the
  focus ring for aesthetic reasons.
- Focus rings are **keyboard-triggered only** by default (`:focus-visible`
  semantics) — mouse clicks don't leave a lingering ring, keeping the calm
  aesthetic for pointer users while guaranteeing it for keyboard users.
- Focus never becomes trapped unintentionally: any component that does trap
  focus (modals, the Command Palette, dropdown menus) documents its trap
  boundary and always provides an Escape/close path back out.
- When a mode changes (`14-navigation-map.md` §2), focus moves to that mode's
  primary heading or first interactive element, announced via a page-title-
  equivalent live region update — never left stranded on a control that no
  longer exists.

## 6. Text scaling & density

- All type tokens (`01-design-system.md` §2.2) are defined in relative units
  and scale together when the user increases the OS/app font-size setting
  (Settings → Appearance → Font size scale, `10-settings-and-providers.md`
  §3) up to 200% without breaking layout — containers reflow (wrap, stack)
  rather than truncate critical content at larger scales.
- The **Density** setting (Comfortable/Compact, same section) only affects
  spacing tokens, never type size — a user who needs larger text is never
  forced to also accept a sparser layout that pushes content further away
  from their scroll position, and a user who wants compact spacing isn't
  forced into smaller text to get it.
- Line length caps (§2.2's 72ch prose rule) are re-evaluated at scale — they
  cap in `ch` units (character-relative), so the cap remains readable rather
  than becoming physically wider than the viewport at large font sizes.
- Minimum interactive target size is 28×28px at 100% scale (matching the
  smallest `Button` size token) and scales proportionally — no target ever
  shrinks below that regardless of density setting.

## 7. Motion sensitivity

Covered in full in `12-motion-system.md` §4 (reduced-motion fallback); noted
here as an accessibility requirement, not merely a nice-to-have: Beta Code
respects the OS-level `prefers-reduced-motion` setting automatically, with no
separate in-app toggle required to get the reduced experience, though one is
also exposed in Settings → Appearance for users who want to force it
independent of the OS setting.

## 8. Testing bar

A screen is not considered complete against this brief until: it can be
fully operated by keyboard alone, its status information survives a
grayscale filter, its screen-reader announcement order matches its visual
reading order, and it holds correct contrast at both the default and 200%
text-scale settings.
