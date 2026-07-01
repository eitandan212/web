# 24 · Model Routing

## 1. Purpose

Beta Code supports multiple simultaneously-active AI providers
(`10-settings-and-providers.md` §4.2). Model routing is the layer that
decides, for any given piece of work, which model actually handles it — set
manually by the user, or handled automatically by the system when the user
opts into that. This document defines both the guidance a user sees when
choosing manually, and the behavior of automatic routing.

## 2. Design stance

Routing must always be **inspectable and overridable** — a user can always
see which model handled a given turn (the composer's model badge,
`03-ai-execution-experience.md` §2) and can always override it, whether
routing was manual or automatic. Auto-routing is an assistive default, never
a black box the user has to fight.

## 3. Model characteristics reference

Shown to the user inline wherever they're choosing a model manually (the
model picker described in `10-settings-and-providers.md` §4.4) as compact
capability badges — this table is the source of truth for those badges, not
a separate marketing comparison:

| Provider / model family | Strengths | Best suited for |
|---|---|---|
| **Claude** (Anthropic) | Strong reasoning, careful multi-step execution, large context, reliable tool use | Default for planning, multi-file edits, agent orchestration, anything where correctness matters more than raw speed |
| **GPT** (OpenAI) | Broad general knowledge, strong at conversational explanation | Documentation generation, general Q&A, brainstorming |
| **Google** (Gemini family) | Very large context windows, strong multimodal (image/video) understanding | Large-codebase analysis, working with screenshots/designs, long document review |
| **NVIDIA** (hosted OSS models) | Fast inference, cost-efficient at scale | High-volume, low-complexity tasks (batch linting, simple refactors) |
| **GLM** | Strong at code generation, competitive cost | Routine code generation, boilerplate, test scaffolding |
| **Qwen** | Strong multilingual and code performance | Projects with non-English codebases/comments, general coding |
| **DeepSeek** | Deep reasoning specialization, strong at math/algorithmic problems | Algorithm design, performance optimization, tricky debugging |
| **Ollama** (local models) | Zero network dependency, full data privacy, no per-token cost | Offline work, sensitive/regulated codebases, quick iterative loops where latency-to-first-token matters more than peak capability |

This table is presented to the user (condensed) as a **"Which model should I
use?"** help panel reachable from the model picker's footer — plain
sentences, not a marketing chart, consistent with Rule 9 in
`15-design-principles.md` (numbers/claims are earned, not decorative) — it
only states relative strengths already reflected in the capability badges
(`Vision`, `128k`, `Tools`, etc.) rather than inventing new unverifiable
claims.

## 4. Manual routing (default behavior)

By default, every session uses the single **Default model** set in Settings
(`10-settings-and-providers.md` §4.2) unless the user overrides it inline via
the composer badge for that message, or unless a specific agent type carries
its own per-agent override (`04-multi-agent-system.md` §4.2). This is the
same three-tier override chain already specified in `13-user-flows.md` §7:
global default → per-agent override → per-message override, each taking
precedence over the one before it.

## 5. Automatic routing agent

An optional capability (Settings → Agents → **Auto-route models**, off by
default so behavior never changes underneath a user who hasn't opted in) that
inserts a lightweight routing decision at the start of Planning
(`03-ai-execution-experience.md` §3.3), before Execution begins: given the
plan's steps, pick the best-fit *active* model per step from §3's guidance,
never a model the user hasn't configured as Active.

**Surfaced in the UI**: when auto-routing selects a non-default model for a
step, that step's Tool Card group header (`05-tool-cards.md` §6) shows a
small model badge next to the plan-step label — the same visual pattern used
for agent identity chips grouping tool cards, applied to model choice instead
of agent identity, since both answer "who/what is doing this specific piece
of work." Hovering the badge shows a one-line rationale ("Routed to DeepSeek
— algorithmic optimization task").

```
  2. Optimize the sort algorithm         [ DeepSeek ⓘ ]
     [ Tool Card: Read File ]
     [ Tool Card: Edit File ]
```

**User override**: clicking the badge opens the same inline model picker as
the composer's own badge — overriding it for that step re-runs just that
step's tool calls under the newly chosen model, matching the turn-scoped
Retry semantics in `19-error-handling.md` §6.

## 6. Auto-routing and multi-agent orchestration

When auto-routing is active alongside a multi-agent plan
(`04-multi-agent-system.md` §4), each agent gets independently routed per its
own task, not the whole job routed to one model — a Research agent's browsing
task might route to a large-context Gemini model while the Developer agent's
edit in the same job routes to Claude. The Orchestration swimlane
(`04-multi-agent-system.md` §4.1) shows each node's routed model as the same
small badge described in §5, so the whole job's model allocation is visible
in one glance at the swimlane, not just per individual card.

## 7. Fallback behavior

If auto-routing (or a manual choice) selects a provider that then errors
(per `19-error-handling.md` §4.2/4.4), the routing layer automatically falls
back to the next best-fit *Active* provider for that step rather than failing
the whole turn — this fallback attempt is itself shown as a brief inline note
("Anthropic was unavailable — routed to GLM instead") rather than happening
invisibly, consistent with Rule 8 in `15-design-principles.md`. If no other
Active provider can serve the step, the standard provider-error UI applies.

## 8. What auto-routing never does

- Never routes to a provider the user hasn't explicitly activated in
  Settings — "available" is not the same as "consented to use."
  - Never silently changes the model for calls the user has manually pinned
  via the per-message or per-agent override tiers (§4) — manual choice always
  wins over automatic routing, at any tier.
- Never optimizes purely for cost without the user opting into a
  cost-priority mode (a secondary toggle alongside Auto-route models, "Prefer
  lower-cost models when capability is comparable") — the default
  optimization target is fit-for-task per §3, not price.
