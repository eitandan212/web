# Beta Code — Product Design Brief

**An AI Operating System for developers, engineers, designers, and creators.**

This directory is the complete product design specification for Beta Code, a premium
desktop application. It is a design deliverable — screen specs, a design system, and
interaction models — intended for a design/engineering team to build from. It contains
no implementation code.

---

## 1. What Beta Code Is

Beta Code is not a chat window with a text box. It is a workspace: a desktop
application that understands a project, plans work, executes it across files,
terminals, and browsers, coordinates multiple specialized agents, and gives the
user continuous visibility into what is happening and why.

The defining product idea: **a prompt is not a message, it is a job.** Submitting
one transforms the interface from "conversation" into "execution workspace" —
with distinct visual states for understanding the request, planning the approach,
executing it, verifying the result, and completing it. The user is always able to
see, pause, redirect, or inspect what the system is doing.

## 2. Design Pillars

| Pillar | What it means in practice |
|---|---|
| Intelligent | The UI surfaces reasoning and plans, not just answers. Nothing feels automatic-magic; everything feels inspectable. |
| Minimal | One primary action per screen state. Secondary information is present but recedes until asked for. |
| Professional | No mascots, no playful copy, no gamified progress bars. Confident, quiet, precise. |
| Fast | Perceived latency is treated as a design material — skeletons, streaming, and optimistic states are used deliberately. |
| Calm | Motion is short and purposeful. Nothing pulses or loops for attention. |
| Premium | Materials (glass, hairline borders, shadow) are consistent and restrained, not decorative. |
| Purposeful | Every panel answers "what is happening, what changed, what do I do next." |

**Explicitly avoided:** cartoon styling, gaming HUD aesthetics, neon glow, decorative
gradients, dashboard clutter, oversized touch-style buttons, default-Tailwind look
(pure grays + one blue + rounded-md everywhere).

## 3. Document Map

| File | Contents |
|---|---|
| `01-design-system.md` | Color tokens, typography, spacing/radius/elevation, iconography, core component specs (buttons, inputs, cards, modals, tables, etc.) |
| `02-application-shell.md` | Three-column adaptive layout: sidebar, center workspace, right context panel; collapse/resize behavior |
| `03-ai-execution-experience.md` | The Understanding → Planning → Execution → Verification → Completion model; streaming responses; reasoning sections |
| `04-multi-agent-system.md` | Agent roster, agent card anatomy, orchestration/timeline view, pause/stop/retry |
| `05-tool-cards.md` | Tool call visualization — anatomy, states, per-tool variants |
| `06-project-workspace.md` | The IDE surface: explorer, tabs, editor, minimap, terminal, git, preview, problems |
| `07-command-palette.md` | Universal command palette |
| `08-dashboard.md` | Home screen |
| `09-marketplace.md` | Agents/skills/templates/workflows/themes/extensions marketplace |
| `10-settings-and-providers.md` | Settings sections; AI provider management (OpenAI, Anthropic, Google, NVIDIA, Ollama, GLM, Qwen, DeepSeek, local) |
| `11-project-management.md` | Project overview, dependencies, build status, timeline, docs, architecture |
| `12-motion-system.md` | Micro-interaction catalogue and timing/easing tokens |

## 4. How To Read The Screen Specs

Each screen document follows the same structure:

1. **Purpose** — the one job this screen does.
2. **Layout** — an ASCII wireframe at desktop width (1440px reference), annotated.
3. **Regions** — a walkthrough of every zone in the wireframe.
4. **States** — empty, loading, active, error, where relevant.
5. **Key interactions** — what the primary flows feel like, in words.
6. **Design system references** — which tokens/components from `01-design-system.md` it uses.

Wireframes use a fixed character grid; they communicate proportion and hierarchy, not
literal pixel geometry. Treat bracketed labels `[Like This]` as component placeholders
and `···` as truncation/overflow.
