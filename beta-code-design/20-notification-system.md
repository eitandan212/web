# 20 · Notification System

## 1. Purpose

Beta Code runs long background jobs — agents, builds, downloads, updates —
that finish while the user's attention is elsewhere. The notification system
is how the product speaks up without becoming noisy. Base toast component is
already specified in `01-design-system.md` §6.8; this document defines the
full system around it: categories, priority, grouping, and the persistent
history a toast leaves behind.

## 2. Principle

A notification interrupts only when the user genuinely needs to know *now*.
Everything else waits quietly in the Notification Center (§5) until the user
looks. This maps directly onto the four severity tiers below.

## 3. Categories & behavior

| Category | Examples | Toast behavior | Sound/OS-level alert |
|---|---|---|---|
| **Success** | Agent completed a background task, build passed, install finished | Auto-dismiss after 6s, `status.success` icon | None |
| **Warning** | Agent blocked waiting for approval, token budget at 80%, provider degraded | Persists until dismissed or acted on, `status.warning` icon | None |
| **Error** | Agent failed, build failed, provider went offline mid-task | Persists until dismissed or acted on, `status.error` icon | Subtle single chime, off by default for anything not user-configured as urgent (see §6) |
| **Background tasks** | Download progress, extension install progress, sync status | Renders as a single persistent low-priority toast with a progress bar, updates in place rather than stacking new toasts per tick | None |

Only Warning and Error categories are allowed to persist indefinitely; a
persistent Success toast would violate Rule 4 in `15-design-principles.md`
(nothing lingers for the sake of lingering once its information has been
conveyed).

## 4. Toast stack behavior

- Position: bottom-right, stacking upward, newest at the bottom of the stack
  (closest to eye-level re-entry point), per `01-design-system.md` §6.8.
- Max 3 visible simultaneously; additional queued toasts collapse into a
  single "+2 more" summary toast at the top of the stack, expandable on
  hover/click — this is the toast-stack equivalent of the Tool Card density
  rule in `05-tool-cards.md` §7.
- Hovering any toast pauses its auto-dismiss timer; moving away resumes it.
- Each toast's leading icon is category-colored per §3, *except* when the
  source is a specific agent — then the agent's identity chip
  (`04-multi-agent-system.md` §2) replaces the generic icon, with the
  severity instead expressed via a small corner badge on the chip, so the
  "who" and the "how urgent" are both visible without competing for the same
  glyph slot.
- Clicking a toast's body (not its dismiss ✕) navigates to the relevant
  context: an agent toast opens that Agent Card, a build toast opens Project
  Overview's Build card, a download toast opens the Notification Center's
  Downloads section.

## 5. Notification Center

A persistent history of every notification ever raised, reachable via a
bell icon in the title bar (badge shows unread count, `caption`-sized,
`accent.primary` fill) or `⌘⇧N`. Opens as a right-anchored overlay
(`01-design-system.md` elevation 2, same slide-in pattern as Marketplace's
detail view, `09-marketplace.md` §4) rather than a modal, since browsing
notification history is a glanceable, non-blocking activity.

```
┌─────────────────────────────┐
│  Notifications         Clear  │
│  ─────────────────────────── │
│  Today                        │
│  ✓ Testing agent finished       │
│     4 min ago                  │
│  ⚠ Git agent needs approval     │
│     12 min ago            [→]  │
│  ✕ Build failed on pulse         │
│     1h ago                 [→]  │
│                                  │
│  Yesterday                       │
│  ⬇ Extension "Testing Pro" installed│
└─────────────────────────────┘
```

Rows use the same flat-list pattern as Dashboard's Recent Conversations
(`08-dashboard.md` §6) grouped by date. Unread rows show a left-edge
`accent.primary` dot; reading (scrolling past, or clicking) marks them read.
`Clear` empties read notifications only — unread/actionable ones (Warning/
Error awaiting a decision) require their action to be resolved or explicitly
dismissed individually, so `Clear` can never accidentally hide something that
still needs a decision.

## 6. Downloads & Updates

**Downloads** (extension/marketplace installs, model downloads for local
providers) get a dedicated section within the Notification Center, each
entry showing the same progress-bar pattern as an Agent Card
(`04-multi-agent-system.md` §3) — file name, progress bar, size/ETA, and a
Cancel action while in flight. Multiple simultaneous downloads stack as
individual rows here rather than individual toasts, since download progress
is exactly the kind of frequent-tick update that would otherwise spam the
toast stack.

**Updates** get one dedicated persistent row (not a toast) that only ever
appears when an update is available — pinned to the top of the Notification
Center with an `Update available` badge and a `Restart to update` action.
This mirrors Settings → Updates (`10-settings-and-providers.md` §3), which
is the authoritative place to check update status; the Notification Center
row is a convenience surface for the same underlying state, never a second
source of truth.

## 7. Priority & interruption rules

| Situation | Interrupts current work? |
|---|---|
| Success in the background, current project unaffected | No — silent toast only, auto-dismissing |
| Warning requiring approval on a background agent | No forced interruption — toast persists, right panel's Agents tab shows the Blocked state, but focus stays with the user's current task per `02-application-shell.md` §5.2's "never steal an explicitly-focused tab" rule |
| Error on the agent/task the user is actively watching | Inline in the turn itself (per `19-error-handling.md`), no separate toast needed — a toast would be redundant with what's already on-screen |
| Error on a *different*, unfocused session/project | Toast, persists until dismissed, since the user has no other way to learn about it |
| Connection lost / Provider offline | App-wide banner (`19-error-handling.md` §4.3), not a toast — severity and scope both exceed what a corner toast should carry |

## 8. User control

Settings → Notifications (`10-settings-and-providers.md` §3) lets the user
configure, per category, whether it produces: a toast + Notification Center
entry, a Notification Center entry only (no toast interruption), or is
suppressed entirely from toasts but still logged (never fully silenced from
history — Rule 8 in `15-design-principles.md` requires everything remain
auditable). Defaults: Success → Center only, Warning/Error → toast + Center,
Background tasks → toast (in-place progress) + Center, Updates → Center
(persistent row) only, no toast interruption.
