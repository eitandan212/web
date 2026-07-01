# 99 · Product Vision

> This is the compass document for Beta Code. Every other file in this brief
> is downstream of what's written here. When a future decision — design,
> product, or engineering — doesn't have a clear answer in the specific
> screen docs, it gets checked against this file first, not decided in
> isolation.

## 1. The vision, in one paragraph

Beta Code is the workspace where building software stops being "type in an
editor, ask a chatbot on the side, run a terminal in a third window" and
becomes one continuous act: describe what you want, watch it get planned,
watch it get built, verify it yourself in the same breath. It's not a
chat window bolted onto an IDE, and it's not an IDE with an autocomplete
plugin. It's the thing that exists after those two categories finish merging
— designed from a blank page, for that end state, rather than evolved from
either starting point.

## 2. Why this needs to exist

Today, working with an AI coding assistant means living across several
incompatible mental models at once: a chat pane that doesn't know what a
"plan" is versus an "answer," a diff view that shows *what* changed but not
*why* or *who* decided it, a terminal that's a black box the AI reaches into
without explanation, and — the moment more than one AI agent is involved —
no shared visual language for how they hand off work to each other at all.
Users end up doing the integration work in their heads: tracking state
across tools that were never designed to share a state model.

Beta Code's bet is that this integration work belongs in the product, not in
the user's head — and that once it's done properly, "watching the AI work"
stops being tolerated friction and becomes something people actually want to
look at, the way a good build log or a good git history is satisfying to
read even when you didn't have to.

## 3. How Beta Code differs from Claude Code, Cursor, and Codex

This is a design-positioning exercise, not a claim that any of these
products are deficient — each is excellent at what it's built to be. Beta
Code's differentiation is about **shape**, not about being a better version
of the same shape:

| Dimension | Claude Code (CLI) | Cursor (IDE fork) | Codex (API/agent runtime) | **Beta Code** |
|---|---|---|---|---|
| Primary surface | Terminal | Familiar editor with inline AI | Programmatic/headless agent | A native, three-column desktop application purpose-built around AI as the primary actor, not a plugin surface |
| How a request is shown | Streamed text in a scrollback | Inline diffs + a side chat panel | No persistent UI — output is the artifact | A first-class **execution turn** with five distinguishable phases (`03-ai-execution-experience.md`) that stays inspectable forever in history, not just at the moment it streamed |
| Multi-agent work | Sequential, one agent context at a time | Not a primary concept | Supported at the API level, no visual model | A first-class **orchestration view** (`04-multi-agent-system.md`) — agents, dependencies, and handoffs are always visible, never inferred from scrollback |
| Tool calls | Rendered as terminal-style log lines | Inline in the diff/chat, lightly styled | Structured data, no visual form | **Tool Cards** (`05-tool-cards.md`) — a consistent, premium, auditable unit reused everywhere a tool executes, designed to be pleasant to watch, not just legible |
| Model choice | Single provider per session, config-file driven | Provider choice, but not a designed "routing" concept | Caller-specified per request | Multiple **simultaneously active** providers, a visible model badge on every turn, and an optional **auto-routing** layer that explains its own choices (`24-model-routing.md`) |
| Project "memory" | Session-scoped, some project config files | File-based rules/context files | Stateless unless the caller manages it | A four-layer, **visible and editable** memory model surfaced directly in the UI, not buried in config (`21-agent-memory.md`) |
| Target feeling | A powerful, fast command-line collaborator | A familiar editor that got smarter | Infrastructure for other builders | A calm, premium **operating system for the work itself** — the brief's own words, and the one framing none of the above are trying to occupy |

The throughline: the others treat the AI as an addition to an existing
surface (a terminal, an editor, an API). Beta Code treats the *execution of
work* as the surface, and lets code editing, terminals, and browsing live
inside that surface as tools the work uses — which is why this brief
specifies phases, orchestration, and memory as top-level product concepts
with their own screens, rather than as features layered onto a chat window.

## 4. Principles above all design decisions

These are stricter and more permanent than the ten rules in
`15-design-principles.md` (which govern screen-level craft) — these govern
what Beta Code is allowed to become at all:

1. **The user is never surprised by what the system did.** Every action is
   inspectable after the fact (Rule 8, `15-design-principles.md`), and
   nothing destructive happens without a visible approval gate or an
   explicit, user-set threshold. This principle overrides convenience every
   time the two conflict.
2. **Visibility scales with agent count, not just with task size.** As more
   agents get involved, the product's job gets *harder*, not optional — the
   orchestration view, memory model, and tool card system all exist because
   "just show a chat log" stops working past one agent.
3. **Nothing in the product requires trusting a black box.** Auto-routing
   explains its choices; memory shows its sources; verification shows its
   evidence. Confidence in Beta Code comes from what the user can see, never
   from the user being asked to just believe it.
4. **Calm is a feature, not a compromise.** A product that runs multiple
   agents doing real work has every incentive to look busy and impressive.
   Beta Code's competitive advantage is the opposite bet: that a calm
   interface builds more trust over long sessions than a dazzling one, and
   that trust is the actual product.
5. **One concept, one representation.** A diff looks the same in chat, in
   the editor, and in a commit card. A file's status looks the same in the
   Explorer, in search, and in Git. The product must never let the same
   underlying fact be drawn two different ways in two different places —
   every screen doc in this brief was written under this constraint
   explicitly (see the repeated "reuses the exact component" language
   throughout).
6. **The desktop app is the product, not a shell around a website.** Beta
   Code is designed to feel native, fast, and offline-capable wherever
   reasonably possible (local models, local file operations) — it does not
   assume permanent connectivity as a precondition for being useful.

## 5. Long-term feature horizon

Features not yet detailed in the numbered screen docs, listed here so future
documents have a place to be scoped from rather than invented ad hoc:

- **Team workspaces** — multi-user real-time collaboration inside a single
  session (beyond the read-only/collaborator Share flow in
  `13-user-flows.md` §8): concurrent cursors, concurrent agent dispatch with
  conflict-aware merging of parallel turns.
- **Custom agent authoring** — a visual (not just marketplace-install) way
  for users to define new agent types: system prompt, tool permissions,
  default model, published privately or to the Marketplace.
- **Workflow automation** — saved, reusable multi-step plans ("every PR:
  run tests, check for security issues, update changelog") triggerable
  manually, on a schedule, or on a repo event (a git hook, a CI failure).
- **Cross-project intelligence** — Project Memory (`21-agent-memory.md` §5)
  extended to recognize patterns across a user's *multiple* projects
  ("you always configure ESLint this way") without collapsing into one
  undifferentiated global memory — opt-in, inspectable, per Principle 3.
- **Voice input** for the composer, as an additional input modality, not a
  replacement — text remains the primary, auditable record of what was
  asked.
- **Mobile companion** — a read-only/approve-only surface (view running
  agents, approve a blocked plan, get notifications) explicitly not a full
  editing environment, consistent with the brief's desktop-first scope.
- **Plugin SDK** for the Marketplace's Extensions category, letting
  third parties add new Tool Card types, not just new agents/skills.
- **Self-hosted/enterprise deployment** — running Beta Code's orchestration
  layer against a private model gateway and private Marketplace registry.

## 6. Roadmap

Phases are capability milestones, not calendar commitments — each phase is
"done" when its listed capabilities meet the full quality bar of this brief
(design system, accessibility, error handling, motion), not when they merely
exist.

### MVP
Prove the core loop end to end, single-user, single-provider-at-a-time is
acceptable here even though the full design supports more:
- Application shell (`02`), single active provider, one default model.
- Execution Workspace with all five phases (`03`), no multi-agent yet —
  a single implicit "Developer" agent handles everything.
- Tool Cards for the core five tools: Read File, Write File, Edit File, Run
  Terminal, Search Project (`05`).
- Project Workspace basics: Explorer, Tabs, Editor, Terminal, Git tab (`06`).
- Command Palette (`07`), Dashboard (`08`) without Suggested Actions yet.
- Settings: General, Appearance, Models & Providers (single provider),
  Editor, Terminal (`10`, partial).
- Full design system, motion, accessibility, and error-handling baseline
  applied from day one — these are never "phase 2" concerns.

### Beta
Turn the MVP into the multi-agent, multi-provider product the brief
describes:
- Full Multi-Agent System (`04`): roster, agent cards, orchestration view,
  pause/stop/retry.
- Remaining Tool Card variants: Preview Website, Open Browser, Git Commit,
  Fix Error, Install Package (`05`).
- Multiple simultaneously active providers + manual model routing across all
  three override tiers (`10` §4, `24` §4).
- Marketplace (`09`): Agents, Skills, Templates categories live; Workflows/
  Themes/Extensions can trail into v1.0 if needed.
- Agent Memory (`21`): Session and Project Memory live; User Memory can
  follow shortly after.
- Notification System (`20`) in full; Terminal Experience (`23`) multi-
  instance and split view.
- Dashboard's Suggested Actions and full Project Management suite (`11`).

### v1.0
The complete brief, ready to be called a finished, premium product:
- Auto-routing agent (`24` §5–7) as an opt-in capability.
- Full Marketplace including Themes (with live-preview) and Extensions SDK
  surface (read-only for third parties; authoring tooling can follow).
- User Memory complete, with the inline "Remember this?" promotion gesture
  (`21` §6).
- Full accessibility bar met across every screen (`16` §8's testing bar
  applied product-wide, not spot-checked).
- Share Workspace / collaborator roles (`13` §8) fully live.
- Brand and design system fully locked (`25`), including any theme
  ecosystem guidelines needed for third-party Marketplace themes to stay
  on-brand.

### v2.0
The long-term horizon items from §5, prioritized roughly by how directly
they extend the core loop versus how much they expand Beta Code's surface
area beyond a single user working alone:
1. Custom agent authoring (extends the core loop directly).
2. Workflow automation (extends the core loop directly).
3. Cross-project intelligence (extends Agent Memory).
4. Team workspaces (expands to multi-user).
5. Plugin SDK for Extensions (expands the ecosystem).
6. Voice input, Mobile companion, Self-hosted/enterprise (parallel
   investments, sequenced based on user demand signals gathered during v1.0).

## 7. How to use this document

When a new feature is proposed: check it against §4's principles first (does
it violate any?), then §5/§6 (is it already scoped, and at what phase?), then
proceed to the relevant numbered screen document — or, if none exists yet,
write one following the structure in `00-overview.md` §4, and add it to that
file's document map.
