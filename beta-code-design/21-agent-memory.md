# 21 · Agent Memory

## 1. Purpose

"Project awareness" (the brief's core promise) requires the system to
remember things across turns, sessions, and projects — but memory that's
invisible is memory a user can't trust or correct. This document specifies
the memory model as a *visible, editable* part of the product, not a hidden
backend detail, and where each layer surfaces in the UI already specified
elsewhere in this brief.

## 2. The four layers

```
┌─────────────────────────────────────────────┐
│  Long-term Memory      (cross-project, user)   │
│  ┌───────────────────────────────────────┐   │
│  │  User Memory          (cross-project)     │   │
│  │  ┌───────────────────────────────────┐   │   │
│  │  │  Project Memory       (per project)  │   │   │
│  │  │  ┌───────────────────────────────┐   │   │   │
│  │  │  │  Session Memory   (per thread)   │   │   │   │
│  │  │  │  ┌───────────────────────────┐   │   │   │   │
│  │  │  │  │  Context Window (per turn) │   │   │   │   │
│  │  │  │  └───────────────────────────┘   │   │   │   │
│  │  │  └───────────────────────────────┘   │   │   │
│  │  └───────────────────────────────────┘   │   │
│  └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

Each layer is a strict superset scope of the one inside it. Anything true at
an outer layer is available to every inner layer; nothing at an inner layer
leaks outward automatically — promotion between layers is always an explicit
action (§6), never silent inference the user can't see happen.

## 3. Context Window

The literal token budget available to the model for the current turn —
system context, conversation history, attached files, tool outputs. This is
the only layer with a hard, visible numeric limit.

**Surfaced**: the right context panel's **Environment** tab
(`02-application-shell.md` §5.2) shows a live token-usage bar exactly like an
Agent Card's resource row (`04-multi-agent-system.md` §3) — current turn's
usage over budget, switching to `status.warning` past 80% and `status.error`
past 95%. Clicking it expands a breakdown: system prompt, conversation
history, attached context docs, tool outputs — each as a labeled segment of
the same bar, so a user can see exactly what's eating the budget.

**Managed automatically** via summarization when a thread approaches its
limit — handled the same way this harness's own context compression works:
older turns compress into a summary while recent turns and anything pinned
(§5) stay verbatim. This compression is itself logged as a system line in
the thread ("Earlier turns were summarized to stay within context"), never
silent.

## 4. Session Memory

Everything said and done within the current conversation thread — the full
turn history a user scrolls through in the Execution Workspace
(`03-ai-execution-experience.md` §5). This is what makes "Branch here"
(§3.6 of that document) and mid-thread references ("like you did above")
work without re-explaining.

**Surfaced**: the thread itself is the UI — no separate memory screen needed,
since the turns are already the visible record. Session Memory ends when a
thread ends; nothing here survives into a new session unless explicitly
promoted.

## 5. Project Memory

Durable facts, decisions, and pinned context specific to one project:
architecture decisions, coding conventions the AI has learned to follow,
pinned files/docs (the Context references strip,
`06-project-workspace.md` §9), and a running summary of past sessions'
outcomes relevant to future work in this project.

**Surfaced**: the right context panel's **Memory** tab
(`02-application-shell.md` §5.2), scoped to the current project:

```
┌───────────────────────────────┐
│  Memory                          │
│  ─────────────────────────────  │
│  Pinned                           │
│  📄 rate-limits.md                │
│  📄 login.ts                       │
│                                     │
│  Learned                           │
│  "Uses 2-space indentation,          │
│   prefers named exports"        [✕]  │
│  "Tests live alongside source        │
│   as *.spec.ts"                  [✕]  │
│                                     │
│  [ + Add memory ]                    │
└───────────────────────────────┘
```

- **Pinned**: identical to the Context references strip — pinning here or
  there is the same action (`06-project-workspace.md` §9), reinforcing Rule 5
  in `15-design-principles.md`.
- **Learned**: facts the system inferred from working in the project,
  each individually removable (✕) — a user who sees an incorrect inferred
  convention can delete exactly that fact rather than the whole memory.
  Each entry shows which turn/session it was learned from as a small
  `caption` provenance link, so "why does it think that" is always answerable.
- **+ Add memory**: lets a user manually add a fact/instruction directly,
  same visual treatment as a Learned entry but with a small "Added by you"
  provenance tag instead of a turn link.

This is exactly the content that also feeds Documentation
(`11-project-management.md` §9) and Architecture (§10 of the same document)
generation — Project Memory is the substrate, those screens are two of its
rendered views.

## 6. User Memory

Cross-project facts about how this specific person likes to work: preferred
frameworks, tone/verbosity preference for AI responses, standing instructions
("always write tests before implementation," "never use default exports").

**Surfaced**: Settings → Agents → **Your preferences** section
(`10-settings-and-providers.md` §3), same Learned/Pinned/+Add pattern as §5
but with no project scope — and additionally reachable inline: any time the
AI infers something durable about the user's preferences during a normal
turn, a small inline affordance appears next to the relevant sentence in that
turn — "Remember this?" (ghost link) — clicking it promotes that fact from
Session Memory straight into User Memory without a detour through Settings.
This is the one explicit promotion gesture referenced in §2 above.

## 7. Long-term Memory

The umbrella covering both Project Memory and User Memory together — this
brief does not model it as a separate storage tier with its own UI, since
that would create a place for facts to live that neither the Memory tab nor
Settings surfaces (violating Rule 8, auditability). "Long-term" is simply the
property that Project Memory and User Memory both persist indefinitely (until
edited/removed) across sessions, as opposed to Session Memory (thread-scoped)
and the Context Window (turn-scoped, subject to compression).

## 8. Visibility & trust rules

1. Every memory fact is attributable to a source (a specific turn, or "Added
   by you") — never an opaque, unsourced belief the system just "has."
2. Every memory fact is individually deletable, never only clearable in bulk
   — a user must be able to correct one wrong inference without losing
   everything else the system has learned.
3. Nothing is promoted from Session → Project/User Memory silently; the only
   automatic cross-layer behavior is the Context Window's summarization
   (§3), which compresses rather than promotes, and is always logged.
4. Memory contents are plain text/markdown the user can read in full — never
   an opaque embedding or a black box the user must trust without
   inspection.

## 9. Interaction with Multi-Agent System

Each agent type (`04-multi-agent-system.md` §2) reads Project and User Memory
the same way — memory is not per-agent-siloed, since a fact the Developer
agent learned about coding conventions should equally inform the Testing
agent. An agent's own working notes *during* a run (its reasoning, its
current plan) are Session Memory, scoped to that turn, and don't get
independently promoted — only facts a human or the summarizer explicitly
promotes persist beyond the session, keeping the promotion rule in §8
consistent regardless of how many agents are involved.
