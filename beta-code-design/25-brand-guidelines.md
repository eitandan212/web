# 25 · Brand Guidelines

## 1. Purpose

How Beta Code presents itself as a piece of software with a name, a mark, and
a voice — the layer above the design system that makes the product
recognizable in a screenshot, a marketing page, or a single line of error
copy, without ever contradicting `01-design-system.md`.

## 2. Name usage

- Always **Beta Code**, two words, both capitalized. Never "BetaCode,"
  "beta-code" (except as a literal file/repo/package slug), or "Beta code."
- Never abbreviated in-product ("BC") — the full name is short enough to use
  everywhere: title bar, About screen, onboarding, error messages ("Beta Code
  couldn't reach Anthropic," not "BC couldn't reach...").
- The tagline, used only in the About screen and any external marketing
  surface, never inline in the working UI: **"An AI operating system for
  builders."** — Not "for developers" alone, since the brief's ambition
  spans developers, engineers, designers, and creators; "builders" is the one
  word that covers all four without sounding like a slogan for any single
  discipline.
- First-person product voice is always "Beta Code" in third person ("Beta
  Code found 2 issues"), never "I" — this keeps the tone professional and
  tool-like per the brief's "not a chatbot" premise, distinct from
  individual agents, which *do* get named, personified identities
  (`04-multi-agent-system.md` §2) because they represent delegated workers,
  not the product itself speaking.

## 3. Logo mark

- A single geometric mark: a diamond/rhombus (◆) built from two overlapping
  angle-brackets — evoking both a compiled unit (a diamond as a "core") and
  code (`< >`) without literally rendering the punctuation marks, which
  would read as generic/stock. Rendered in `accent.primary` on dark surfaces,
  monochrome `text.primary` in single-color contexts (title bar favicon
  scale, print).
- Two lockups: **full lockup** (mark + "Beta Code" wordmark, used in the
  sidebar header at full width per `02-application-shell.md` §3.1, in the
  About screen, and in any external material) and **mark-only** (used in the
  collapsed sidebar rail, the app icon, favicons, and the loading splash).
- Minimum clear space around the mark: equal to the mark's own height on all
  sides. Never placed on a busy background, never recolored to a gradient,
  never rotated — the one static, unchanging visual anchor in a product that
  otherwise adapts constantly (themes, density, layout).
- The mark never animates as a loading spinner substitute — loading states
  use the standard indeterminate progress token (`01-design-system.md` §5),
  keeping the logo itself dignified and still, never spun or pulsed for
  "personality."

## 4. Iconography relationship to brand

Beta Code's functional icon set (`01-design-system.md` §4) is intentionally
neutral/geometric so that it never competes with the logo mark for
"brand" attention — the mark is the only icon in the product allowed a
distinct silhouette that doesn't follow the 1.5px-stroke functional-icon
grid. Agent identity chips (`04-multi-agent-system.md` §2) and provider
marks (`10-settings-and-providers.md` §4.1) are the only other elements
permitted solid-color/branded glyphs, and both are visually subordinate to
the logo (smaller scale, never placed in the title bar's primary logo slot).

## 5. Color as brand signal

The dark graphite canvas plus electric-blue accent (`01-design-system.md`
§1.1–1.2) *is* the brand at the
system level — Beta Code should be identifiable from a color-blocked
screenshot thumbnail alone, the way a handful of premium dev tools are
recognizable by their signature dark-plus-one-accent palette. This is why
`01-design-system.md` §1.5 restricts gradient/glow usage so tightly: a brand
built on restraint loses its signature the moment restraint is abandoned
anywhere in the product.

## 6. Typographic voice

Inter + JetBrains Mono (`01-design-system.md` §2.1) are brand decisions, not
just legibility decisions — the pairing of a humanist grotesque UI face with
a genuinely coder-grade monospace is what makes the product read as "built
by people who write code," rather than "a general productivity app that also
shows code." Marketing/About-screen headlines may use `display` weight at
larger sizes than any in-app usage, but never a different family.

## 7. Tone of voice

- **Direct, plain, unembellished.** "Beta Code couldn't reach Anthropic,"
  not "Oops! Something went wrong on our end." No exclamation points in
  system copy, ever (an exception: none — this is absolute, matching the
  brief's "avoid cartoon styling" instruction extending to language).
- **States facts, not feelings.** Never "Great job!" on a successful build;
  a checkmark and "Passing" already say enough (Rule 9 &10,
  `15-design-principles.md`).
- **Explains, doesn't apologize excessively.** One clear sentence on what
  happened and what to do, per `19-error-handling.md` §3 — no "we're sorry
  for the inconvenience" padding.
- **Second person for the user, third person for the product and agents.**
  "You approved this plan." / "Beta Code is running 3 agents." / "The
  Testing agent found 2 failures."
- **No filler words.** Never "simply," "just," "easily," or "just click" in
  UI copy — these presume a difficulty the interface should already have
  removed, and their presence undercuts the "premium/professional" pillar.

## 8. Motion as brand signature

Per `12-motion-system.md`, everything is fast (≤400ms) and non-bouncy
(`cubic-bezier(.2,.8,.2,1)` family, never spring/overshoot easing). This
restraint is itself a recognizable brand trait — a user who has used Beta
Code for a week should be able to tell, from timing alone, whether a
recording is of this product or a more playful consumer competitor.

## 9. What Beta Code is never depicted as

- Not a mascot-led brand — no character, no avatar for "Beta Code" itself
  (individual *agents* have identity chips, per §2 above, but these are
  abstract geometric chips, never illustrated characters or faces).
- Not a gradient-hero, marketing-site-style product — even external
  marketing surfaces (out of scope for this brief but noted for
  consistency) should use the same dark-canvas-plus-restrained-accent system,
  not a separate, flashier "marketing palette."
- Not shown mid-glow/mid-pulse in static marketing screenshots — screenshots
  used to represent the product should reflect real, calm resting or
  active-but-static states (per `01-design-system.md` §1.5's "no idle
  animation" rule), never a stylized glow effect that doesn't occur in the
  actual running product.

## 10. Application to future material

Any future document, screen, or external asset representing Beta Code should
be checked against this file the same way visual work is checked against
`15-design-principles.md` — if a new marketing page, onboarding illustration,
or press asset can't be justified against §§2–9 above, it's off-brand
regardless of how polished it looks in isolation.
