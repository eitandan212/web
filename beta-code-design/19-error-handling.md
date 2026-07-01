# 19 · Error Handling

## 1. Purpose

Beta Code fails often enough — network hiccups, provider outages, a tool
call that errors, a plan that doesn't verify — that error handling has to be
a designed system, not a fallback. The governing rule is Rule 10 in
`15-design-principles.md`: text explains itself once, in plain language, at
the point of failure. This document is the canonical list of every error
category, how it's surfaced, and how the user recovers.

## 2. Error categories

| Category | Where it surfaces | Recoverable by user? |
|---|---|---|
| AI reasoning/generation error (model returns malformed output, refuses, or times out) | Inline in the turn, replacing the phase that failed | Yes — Retry, or switch model |
| API/provider error (auth failure, rate limit, quota exceeded) | Inline in the turn + a persistent Provider badge state in Settings | Yes — depends on cause (see §4) |
| Connection lost (network drop, app loses reachability) | A persistent app-wide banner, not per-turn | Yes — automatic reconnect, manual retry |
| Provider offline (a specific provider's API is down) | Provider row in Settings, and inline if a turn was routed to it | Yes — switch to another active provider |
| Tool call failed (Read/Write/Terminal/Browser/Git error) | The Tool Card itself | Yes — Retry the tool call, or let the AI propose a fix |
| Verification failed (tests/lint/build fail after a change) | The Verification phase of the turn | Yes — automatic recovery loop, or manual Retry |
| Local/system error (disk full, permission denied, file locked) | The Tool Card, with an unambiguous system message | Depends — often requires user action outside the app |

## 3. Shared visual language

All error surfaces reuse the same primitives, per Rule 5
(`15-design-principles.md`):

- **Color**: `status.error` for the glyph/accent, never a full red card
  background (per `05-tool-cards.md` §5 — a persistent color wash would make
  a long thread feel alarming rather than calm).
- **Icon**: a single alert-triangle glyph, consistent across every category.
- **Structure**: what failed (one line, plain language) → why, if known (one
  line, technical detail collapsed by default) → what you can do about it
  (1–2 actions, `secondary`/`ghost` buttons — never a `primary`/filled button
  for "Retry," since a filled error-adjacent button would visually compete
  with the calm color discipline in `01-design-system.md` §1.5).

```
⚠ Couldn't reach Anthropic
  Request timed out after 30s.
                        [ Retry ]   [ Switch provider ]
```

## 4. Category detail

### 4.1 AI reasoning/generation error

Replaces the active phase (Understanding/Planning/Execution) with an inline
error block using the shared structure above. Message states plainly what
happened ("The model didn't return a usable response") without exposing raw
API stack traces in the primary line — a collapsed "Show details" reveals the
raw error for debugging. Actions: `Retry` (re-attempts the same phase with
the same input) and, if more than one provider is active
(`10-settings-and-providers.md` §4.2), `Switch model` inline.

### 4.2 API/provider error

| Cause | Message | Primary action |
|---|---|---|
| Auth failure (bad/expired key) | "Your Anthropic API key was rejected." | `Update key` → deep-links to Settings → Models & Providers, that provider's panel already expanded |
| Rate limit | "Anthropic is rate-limiting requests right now." | `Retry in 30s` (button shows a live countdown, auto-retries at zero) or `Switch provider` |
| Quota/billing exceeded | "This provider reports your usage quota is exceeded." | `Open billing` (external link, clearly marked) or `Switch provider` |

Providers also carry this state visibly at rest in Settings (§4 of
`10-settings-and-providers.md`): a provider row's status `Badge` reflects the
most recent error (`Error` in `status.error`, replacing `Active`/`Configured`)
so a user browsing Settings — not just one mid-failure turn — can see a
provider needs attention.

### 4.3 Connection lost

A thin, persistent banner at the very top of the app shell (above the title
bar, full width, `status.warning` background at low opacity, not
`status.error` — a dropped connection is a degraded state, not a failure of
anything the user did):

```
⚠ You're offline — changes are saved locally and will sync when reconnected.
```

Local-only actions (editing files, browsing Explorer, viewing History)
continue to work; anything requiring a provider queues with a visible
`Queued` badge on the composer's Run control rather than failing outright.
The banner dismisses itself automatically the instant connectivity returns,
with a brief `status.success` flash replacing it for 2s ("Back online") —
this is one of the few places a state auto-dismisses with a success color
flash, justified because it's app-wide and infrequent, not a per-item pattern
that would violate Rule 4/9 elsewhere.

### 4.4 Provider offline

Distinct from "connection lost" — the user's own connection is fine, but a
specific third-party provider's API is unreachable. Surfaced exactly like
§4.2's provider errors (row badge in Settings, inline in any turn routed to
it) with the message "Anthropic appears to be down" and a direct `Switch
provider` action, pre-filtered to the user's other Active providers
(`10-settings-and-providers.md` §4.2) so recovery is a single click if any
alternative is configured.

### 4.5 Tool call failed

Handled at the Tool Card level per `05-tool-cards.md` §5: `status.error` ✕
glyph, 4px left-edge accent bar, auto-expanded to show the failing
input/output. The card's own `Retry` button re-attempts just that tool call
in isolation. If the failure is one the AI can plausibly self-correct
(a wrong file path, a missing dependency before running a command), the
system proposes a nested recovery step automatically rather than waiting for
the user to click Retry — matching the recovery flow in `13-user-flows.md`
§5b.

### 4.6 Verification failed

Never presented as a terminal failure on first occurrence — it triggers the
automatic recovery loop described in `03-ai-execution-experience.md` §3.5.
Only after a bounded number of automatic attempts (2, matching §5b of
`13-user-flows.md`) does the turn surface a final, explicit failure state at
Completion: `status.error` accent on the phase indicator, plain-language
summary ("I wasn't able to get the tests passing after two attempts"), and
two actions: `Retry manually` (re-opens with the diff as-is, lets the user
edit and re-run verification themselves) and `Undo changes` (see §5).

### 4.7 Local/system errors

Surfaced with the exact system message when it's already plain language
(e.g. "Permission denied") and a translated, human summary above it when it
isn't (e.g. wrapping an `ENOSPC` errno as "Your disk is full"). These often
have no in-app fix — the action row reflects that honestly (`Open Finder/
Explorer` to free space, rather than a `Retry` that would just fail again
identically).

## 5. Undo

Any AI-authored file change can be undone from the turn's Completion action
row (`03-ai-execution-experience.md` §3.6) via a dedicated `Undo` ghost
action, appearing whenever a turn produced file writes — distinct from
`⟳ Retry` (which re-runs the task) and from the Editor's standard `⌘Z`
(which undoes at the single-file, single-keystroke level). Turn-level Undo
reverts every file the turn touched back to its pre-turn state in one action,
producing its own Git-style diff-of-the-revert so the reversal is itself
auditable in history — undo is a first-class, visible operation, never a
silent rollback.

## 6. Retry semantics (cross-reference)

To keep "Retry" meaning one thing everywhere (Rule 5,
`15-design-principles.md`): Retry always re-attempts the exact same scope it
appears on — a Tool Card's Retry redoes only that tool call, a turn's Retry
redoes the whole turn from Planning, an Agent Card's Retry per
`04-multi-agent-system.md` §3 restarts only that agent. Retry never silently
changes the input; if the underlying cause needs a different input to
succeed (e.g. a bad file path), the fix happens via the recovery sub-turn
(§4.5), not by Retry guessing a correction.

## 7. Logging

Every error, regardless of category, is written to that turn's/agent's
persistent history exactly as it appeared (per Rule 8,
`15-design-principles.md`) — nothing is auditable only in the moment. The
right context panel's **Environment** tab surfaces a rolling log of the most
recent app-level errors (connection/provider issues) for cases where no
specific turn was in progress when they occurred.
