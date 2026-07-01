# 09 · Marketplace

## 1. Purpose

Where users discover and install Agents, Skills, Templates, Workflows,
Themes, and Extensions. Designed like a curated software catalogue, not a
consumer app store — no promotional banners, no star-rating gamification,
just clear comparison information and a fast install path.

## 2. Layout

```
┌───────────────────────────────────────────────────────────────┐
│  Marketplace                              Search…         ⌘K   │
│  Agents  Skills  Templates  Workflows  Themes  Extensions       │
├───────────────────────────────────────────────────────────────┤
│  Sort: Recommended ▾        Filter: Compatible only  ▾           │
│                                                                     │
│  [ Item Card ]  [ Item Card ]  [ Item Card ]  [ Item Card ]         │
│  [ Item Card ]  [ Item Card ]  [ Item Card ]  [ Item Card ]         │
└───────────────────────────────────────────────────────────────┘
```

Category strip uses the `Tabs` (underline) pattern, not pills — consistent
with every other categorized surface in the app. Sort/Filter controls are
`Dropdown`s sitting in a single control row beneath the tabs, left-aligned
rather than scattered, so the grid below always starts at a predictable
vertical position regardless of filter state.

## 3. Item card

```
┌────────────────────────────┐
│  [ preview thumbnail 16:9 ] │
│  🧪 Testing Pro              │
│  Automated test generation   │
│  and flaky-test triage        │
│                                │
│  ★ 4.8 (212)     v2.3 · MIT    │
│  by Beta Labs                  │
│                                │
│              [ Install ]       │
└────────────────────────────┘
```

- **Preview**: 16:9 thumbnail — for Agents/Skills, a static illustration of
  the tool card or agent card it produces; for Themes, an actual rendered
  swatch of the app shell in that theme; for Templates, a screenshot of the
  resulting project structure. `radius.lg` top corners matching the card.
- **Title + one-line description**: `title.sm` + `body.sm`/`text.secondary`,
  clamped to 2 lines with ellipsis.
- **Rating row**: star glyph + numeric average + review count in parens, all
  `caption`/`text.tertiary` — deliberately quiet, not a prominent gold-star
  badge, per the "avoid gamified" instruction.
- **Version + license**: `caption`, `text.tertiary`, separated by `·`.
- **Author**: small identity — avatar/initials + name, `caption`.
- **Install**: `secondary` button by default; once installed, becomes a
  `ghost` button reading "Installed ✓" with an overflow `⋯` for
  Configure/Uninstall. Incompatible items (wrong platform, requires a
  provider the user hasn't configured) show a disabled button reading
  "Requires Anthropic API key" instead of Install — actionable, not just
  greyed out silently.

## 4. Detail view

Clicking a card opens a right-side-panel-width detail overlay (slides in from
the right, `motion.base`, same elevation-3 treatment as a modal but anchored
to the edge rather than centered, since the grid behind it stays relevant for
quick back-navigation):

```
┌─────────────────────────────┐
│ ← Back                        │
│ 🧪 Testing Pro                 │
│ Automated test generation and   │
│ flaky-test triage                │
│                                    │
│ [ Install ]   [ ⧉ View source ]   │
│                                    │
│ ▾ Overview                        │
│   (full markdown description)      │
│                                    │
│ ▾ Compatibility                    │
│   Requires: Anthropic or OpenAI    │
│   Platforms: macOS, Windows, Linux  │
│                                    │
│ ▾ Permissions                      │
│   Read files · Run terminal        │
│                                    │
│ ▾ Version history                  │
│   v2.3 — bug fixes                  │
│   v2.2 — added flaky-test triage    │
│                                    │
│ ▾ Reviews (212)                     │
└─────────────────────────────┘
```

**Permissions** is a deliberate, non-optional section for Agents/Skills/
Extensions — a plain list of what the item can access (matches the tool
categories from `05-tool-cards.md` §4: file read/write, terminal, browser,
git), shown before install, not buried in settings after the fact. This is a
trust-and-safety requirement as much as a design one: users should never
install an agent without knowing what it can touch.

## 5. Install flow

Clicking Install on an item requiring permissions opens a compact
confirmation `Modal` (560px, per `01-design-system.md` §6.7) listing exactly
those permissions with an `Approve & Install` primary button — same pattern
as the Execution Workspace's plan-approval bar, reused deliberately so
"approving what an agent can do" feels like one consistent gesture across the
whole product, whether the agent came from a marketplace install or was
spawned mid-conversation. Install itself renders as a brief progress state on
the button (label swaps to "Installing…" with a small inline spinner) then
settles to "Installed ✓."

## 6. Themes

Theme items are the one category whose detail view replaces "Permissions"
with a live preview toggle: selecting a theme temporarily re-skins the
Marketplace screen itself (not the whole app) so the user can evaluate it in
place before committing via Install → Apply. Only token values change (colors
in `01-design-system.md` §1); layout, spacing, and component structure are
fixed across all themes so a theme can never break the product's information
hierarchy — this keeps "premium" and "consistent" guaranteed regardless of
what a third party publishes.

## 7. Empty / no-results state

Search or filter combinations with no matches use the standard `Empty state`
pattern with a "Clear filters" secondary action rather than a "Suggest an
item" dead end — the marketplace should always offer a way back to browsing.
