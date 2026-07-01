# 04 · Multi-Agent System

## 1. Purpose

Beta Code can dispatch specialized agents that work in parallel or in sequence
on parts of a single job. The design goal is that a user glancing at the
screen always knows: which agents exist, what each is doing right now, how
close it is to done, and how to intervene (pause/stop/retry) — without that
information turning into a busy dashboard of spinners.

## 2. Agent roster

Default agent types shipped with Beta Code:

| Agent | Identity color | Typical tools |
|---|---|---|
| Developer | `accent.primary` (blue) | Read/Write/Edit File, Terminal |
| UI Designer | `accent.secondary` (violet) | Preview, Write File, image tools |
| Architect | `#5FA8FF` (lighter blue) | Search Project, diagram generation |
| Research | `#39C589` (reuses success green as identity, not status) | Browser, Search |
| Documentation | `#E8A94B` (reuses warning amber as identity) | Write File, Search |
| Testing | `#4FC3B0` (teal) | Terminal, Read File |
| Security | `#EF5A5A` (reuses error red as identity — deliberate: security findings read as urgent) | Search Project, Terminal |
| Browser | `#B48CFF` | Open Browser, Preview Website |
| Terminal | `#8FA3B8` (slate) | Run Terminal |
| Git | `#D98CD9` (orchid) | Git Commit, Search |

Each agent has a fixed **identity chip**: a 20px rounded-square with a
monochrome glyph on its identity color at 16% fill (matching the "filled icon"
convention from `01-design-system.md` §4), used everywhere the agent is
referenced — tool cards, the roster, mentions in prose ("the Testing agent
found 2 failures").

Reusing status colors as identity colors for Research/Documentation/Security is
intentional shorthand (Research↔success/verified sources, Docs↔amber/informational,
Security↔red/vigilance) but agent chips are always paired with the agent's name
label, so identity is never inferred from color alone.

## 3. Agent card anatomy

The primary unit of the multi-agent UI, used in the Agents screen (left nav →
Agents), the right context panel's Agents tab, and inline within execution
turns when an agent hands off to another.

```
┌──────────────────────────────────────────────────────────┐
│ 🟦 Developer Agent                          [Running ●]   │
│    Implementing rate limiter in middleware/rate.ts         │
│                                                             │
│    ████████████████████░░░░░░░░  62%        ETA ~40s      │
│                                                             │
│    ▸ Output (3 new lines)                                  │
│    CPU 4%   Mem 180MB   Tokens 12.4k/128k                   │
│                                                             │
│    [ Pause ]   [ Stop ]                          [ ⋯ ]     │
└──────────────────────────────────────────────────────────┘
```

- **Header**: identity chip + agent name (`title.sm`) + status `Badge`
  (`Running` blue / `Waiting` `text.tertiary` / `Blocked` amber / `Done`
  green / `Failed` red / `Paused` amber-outline).
- **Current task**: one line, `body.sm`, truncates with ellipsis; this is the
  agent's own plan-step description, not a generic "working…" string.
- **Progress bar**: uses the standard `Progress bar` component
  (`01-design-system.md` §6.11); indeterminate style when the agent can't
  estimate remaining work (e.g. waiting on a long-running test suite).
- **ETA**: shown only when the agent has enough signal to estimate; omitted
  rather than shown as a fake/placeholder number.
- **Output**: collapsed by default, expands to a scrollable log — this is the
  same visual language as a Tool Card's console log (`05-tool-cards.md` §3)
  since an agent card is, structurally, a container for a sequence of tool
  cards.
- **Resource usage row**: `caption`, `text.tertiary`, three fixed metrics
  (CPU, Memory, context-window tokens used/budget). Token usage bar switches
  to `status.warning` color past 80% of budget, `status.error` past 95%.
- **Controls**: `Pause`/`Stop` as `secondary`/`ghost` buttons while running;
  once stopped or failed, these are replaced by a single `Retry` (`secondary`)
  button. Overflow `⋯` opens: View full transcript, Reassign model, Duplicate
  agent, Remove.

### 3.1 States

| State | Badge | Card treatment |
|---|---|---|
| Queued | `Waiting` (neutral) | Progress bar hidden, task line reads "Waiting for [dependency]" |
| Running | `Running` (blue, filled dot) | Full anatomy above, static low-opacity ambient glow behind identity chip only |
| Blocked | `Blocked` (amber) | Task line explains the block ("Needs approval to run `rm -rf dist/`"), inline Approve/Deny actions replace Pause/Stop |
| Paused | `Paused` (amber outline) | Progress bar freezes at current value, desaturated 40% |
| Failed | `Failed` (red) | Header gets 1px `status.error` top border; output auto-expands to the failing line |
| Done | `Done` (green) | Progress bar replaced by a compact summary line ("4 files changed, 1 test added"), controls collapse to just `⋯` |

## 4. Agents screen (left nav → Agents)

Full-page view for when more than a couple of agents are active or the user
wants an overview across the whole workspace, not just the current session.

```
┌───────────────────────────────────────────────────────────────┐
│  Agents                                    [ + Launch Agent ]  │
│  3 running · 1 blocked · 12 idle                                │
├───────────────────────────────────────────────────────────────┤
│  Active                                                          │
│  [ Agent Card: Developer ]   [ Agent Card: Testing ]             │
│  [ Agent Card: Git — blocked ]                                   │
│                                                                    │
│  Orchestration                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Architect ──▶ Developer ──▶ Testing ──▶ Git                │  │
│  │    done         running       queued      queued            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Available agent types                                            │
│  [ Research ]  [ Documentation ]  [ Security ]  [ Browser ]  ···   │
└───────────────────────────────────────────────────────────────┘
```

### 4.1 Orchestration / timeline view

A horizontal swimlane showing the dependency chain for the current job: each
node is a compact agent chip connected by directional lines in
`accent.secondary` (the "handoff" color, distinct from the blue "acting"
color used inside individual cards). Completed nodes are solid-filled, the
active node has the same static ambient glow as its card, queued nodes are
hollow-outlined. Clicking a node scrolls to/expands that agent's full card.

For jobs with branching (e.g. Research and Security running in parallel before
both feed into Documentation), the swimlane splits into parallel rows that
rejoin at the convergence node — this is the one place a slightly denser
diagram is justified, because the relationship between agents *is* the content.

### 4.2 Launch Agent

`+ Launch Agent` opens a modal: pick an agent type (grid of identity chips +
names), a target (which project/scope), an optional model override, then
`Launch` (primary). This is distinct from the normal flow of agents being
spawned automatically by a plan in Execution — this is the manual/direct path,
useful for e.g. kicking off a Security agent to audit the repo without going
through a full conversational request.

## 5. Right context panel — Agents tab

A condensed version of the Agents screen scoped to the current project only:
just the agent cards in a single column, no orchestration diagram (that lives
on the full screen where there's room), sorted running-first. This is what a
user glances at while working in the Project Workspace to check "is anything
still going in the background."

## 6. Notifications

Agent state transitions that matter while the user's attention is elsewhere
(Blocked needing approval, Failed, Done for a long-running background agent)
surface as a `Notification`/`Toast` (`01-design-system.md` §6.8) with the
agent's identity chip as the leading icon instead of a generic status glyph,
so the source is recognizable at a glance even from the corner of the eye.
