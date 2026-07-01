# 15 · Design Principles

## 1. Purpose

`00-overview.md` states the pillars (Intelligent, Minimal, Professional,
Fast, Calm, Premium, Purposeful). This document turns those into rules that
can be checked against a specific screen or PR — if a design or
implementation decision cannot be justified against one of these, it doesn't
ship, regardless of how good it looks in isolation.

## 2. The rules

### Rule 1 — Two clicks to any action

Every primary action reachable from the app's default state (Dashboard) must
be reachable in **two clicks or fewer**: one to navigate to context, one to
act. Exceptions are permitted only where a third click represents a genuine
risk confirmation (destructive git operations, granting an agent
file/terminal/browser permissions, spending money via a paid provider) —
never for lack of a shortcut. Every documented flow in `13-user-flows.md`
states explicitly where it uses an exception and why.

**Check:** if a new feature needs a 3rd click and it isn't a risk
confirmation, either the entry point is in the wrong place or a shortcut/
Command Palette command is missing.

### Rule 2 — Clarity at a glance

A user must be able to determine a screen's state — what's running, what
succeeded, what needs them — without reading body text, purely from
layout, color, and iconography conventions defined in
`01-design-system.md`. Status is always communicated by (a) a semantic color
token, (b) a consistent glyph, and (c) position (e.g. errors surface at the
top of their container), never by color alone and never by prose alone.

**Check:** squint-test — blur the screen enough to lose text legibility; can
you still tell what's succeeding, failing, or running?

### Rule 3 — No unnecessary modals

A modal is justified only when the interaction (a) requires the user's full
attention because skipping it has consequences (deleting a project,
approving agent permissions), or (b) collects structured input that doesn't
fit inline (New Project's multi-field form). Everything else — previewing an
item, viewing a diff, adjusting a setting, expanding a card — happens inline
or in the right context panel. Beta Code has exactly five modal use-cases in
this brief: New Project, Launch Agent, Share Workspace, destructive
confirmations, and Marketplace permission approval. Any new modal proposal
should be checked against this list before being added as a sixth.

**Check:** could this modal be a right-panel tab, an inline expand, or a
slide-in overlay instead? If yes, it should be.

### Rule 4 — Every animation serves a purpose

An animation must communicate a state change (per `12-motion-system.md` §1);
if you can delete the animation and the interface communicates the same
information just as fast, delete it. This rules out: idle pulsing, looping
attention-seekers, decorative parallax, bounce/overshoot easing "for
delight," and animating things the user didn't act on and doesn't need to
notice yet.

**Check:** can you name, in one sentence, what fact this animation tells the
user that a static state change wouldn't? If no, cut it.

### Rule 5 — Absolute consistency across screens

A component behaves identically everywhere it appears. A `Diff viewer` in
chat, in the Project Workspace, and in a Git Commit Tool Card is the same
component with the same interactions. A "Fix with AI" action looks and
behaves the same whether it's triggered from Problems, a failing Build card,
or a vulnerable dependency row. New screens are built by composing the
existing component and pattern library (`01-design-system.md` §6) — a new
visual pattern is added to that library first, before it's used once in a
single screen.

**Check:** does this screen introduce a new visual pattern for something an
existing pattern already solves? If yes, reuse the existing one instead.

### Rule 6 — One primary action per screen state

Every screen state has exactly one visually dominant action (a filled
`primary` button); everything else is `secondary` or `ghost`. Two primary
buttons competing for attention on the same screen is treated as a defect.

**Check:** count the filled/primary-colored buttons visible in a given state.
If more than one, demote all but the single most important.

### Rule 7 — Density is chosen, not accidental

Generous spacing (per `01-design-system.md` §2.3) is the default; a screen is
allowed to be dense (Marketplace grid, Dependencies table, Command Palette
results) only when the content itself is a list of comparable, scannable
items where density aids comparison. Anything that is a single focal task
(a turn in the Execution Workspace, a Settings section, the Dashboard) uses
the full spacing rhythm even if that means more scrolling.

**Check:** is this screen dense because the content benefits from
comparison, or because we ran out of vertical rhythm budget? Only the first
justifies it.

### Rule 8 — The system never acts silently on anything destructive

Any action that deletes, overwrites, or executes a shell command with
side effects is either auto-approved under an explicit, user-set threshold
(`10-settings-and-providers.md` → Agents) or requires a visible approval step
(`03-ai-execution-experience.md` §3.3). There is no tier of action that
happens invisibly regardless of settings — the settings can turn
confirmation off, but the underlying event is still always logged to the
turn's Tool Card history so it remains auditable after the fact.

**Check:** if this action fails or does something unexpected, can the user
find, in the turn/timeline history, exactly what happened and why?

### Rule 9 — Numbers are earned, not decorative

A stat, percentage, or ETA is shown only when the system has real signal to
back it (see `04-multi-agent-system.md` §3's ETA rule). Fake/placeholder
progress, inflated review counts, or vanity metrics never appear.

**Check:** if this number were removed, would anything actually be lost, or
was it just filling space?

### Rule 10 — Text explains itself once

Copy states what happened/what's needed in plain language at the point of
the action (error messages, empty states, tooltips) rather than requiring a
help article. If a control needs a paragraph of explanation to be usable, the
control is redesigned rather than annotated further.

**Check:** could a new user understand this screen's primary action without
a tooltip? If the tooltip is load-bearing, fix the label instead.

## 3. How these interact with the pillars

| Pillar | Enforced primarily by |
|---|---|
| Minimal | Rules 3, 6, 7 |
| Fast | Rules 1, 4 |
| Calm | Rules 4, 9 |
| Professional | Rules 9, 10 |
| Purposeful | Rules 2, 5, 8 |
| Premium | Rules 5, 7 |
| Intelligent | Rules 2, 8, 10 |

Every future document in this brief, and every future screen not yet
designed, is expected to pass all ten rules before it's considered complete.
