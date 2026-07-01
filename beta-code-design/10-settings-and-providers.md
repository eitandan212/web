# 10 · Settings & Provider Management

## 1. Purpose

Settings is where Beta Code's considerable configurability lives without
leaking complexity into the daily workspace. Structured as a classic
two-pane preferences screen — a pattern users already have a fast mental
model for — rather than inventing a novel settings paradigm the brief didn't
ask for.

## 2. Layout

```
┌──────────────────┬────────────────────────────────────────────┐
│  Settings          │  Providers                                  │
│  ──────────────    │  Manage the AI providers Beta Code can use.  │
│  General            │                                              │
│  Appearance          │  ┌────────────────────────────────────┐    │
│▸ Models & Providers   │  │ 🟣 Anthropic          Active  [ ⚙ ]  │    │
│  Agents               │  │    Claude Sonnet 5, Opus 4.8          │    │
│  Skills                │  └────────────────────────────────────┘    │
│  Workspace              │  ┌────────────────────────────────────┐  │
│  Editor                  │  │ ⚪ OpenAI              Active  [ ⚙ ]  │
│  Terminal                  │  │    GPT-5.x                        │
│  Notifications                │  └────────────────────────────────┘
│  Privacy                       │  ┌────────────────────────────────┐
│  Updates                        │  │ 🔵 Google         Not configured │
│  Advanced                        │  │    [ Add API key ]              │
│  About                             │  └────────────────────────────────┘
└──────────────────┴────────────────────────────────────────────┘
```

Left rail: 220px, fixed, `surface.base`, same nav-item visual language as the
main app sidebar (`01-design-system.md` §... / `02-application-shell.md` §3.2)
for continuity — settings navigation should feel like the same product, not a
separate preferences app. Right pane: single-column content, max-width 720px,
`space.2xl` section spacing, scrolls independently of the rail.

## 3. Section list

| Section | Contents |
|---|---|
| General | Language, startup behavior, default workspace, telemetry opt-in |
| Appearance | Theme (dark default; light reserved for future), accent color override, font size scale, density (comfortable/compact) |
| Models & Providers | See §4 |
| Agents | Default agent behaviors, auto-approve thresholds (ties into `03-ai-execution-experience.md` §3.3), per-agent-type model overrides |
| Skills | Installed skills list, enable/disable, per-skill settings |
| Workspace | Workspace switcher defaults, pinned projects management |
| Editor | Font, tab size, formatting-on-save, minimap on/off, keybinding profile |
| Terminal | Shell selection, font, scrollback length |
| Notifications | Which agent/system events produce toasts vs. silent log entries |
| Privacy | Data retention, what context is sent to which provider, local-only mode toggle |
| Updates | Current version, channel (stable/beta), changelog |
| Advanced | Experimental features, config file access, reset options |
| About | Version, licenses, links |

Each section header uses `title.lg`, a one-line `text.secondary` subtitle
under it (as shown for Providers above) so a user landing on any section
immediately knows its scope without reading every row.

## 4. Models & Providers

### 4.1 Provider list

Each configured/available provider is a row-card: identity chip (solid brand
mark on a neutral `surface.raised` tile — the one place outside agent
identities a colored logo mark is allowed, since recognizing "this is
Anthropic vs. OpenAI" at a glance matters more here than icon-system purity),
provider name, a one-line list of available models, and a status `Badge`:
`Active` (green, in use), `Configured` (neutral, key present but not
currently routed), `Not configured` (`text.tertiary`, shows an "Add API key"
action instead of the gear icon).

Supported providers, shipped as first-class rows: **OpenAI, Anthropic,
Google, NVIDIA, Ollama, GLM, Qwen, DeepSeek**, plus a permanent **Local
models** row (for on-device/self-hosted runners — no API key needed, instead
shows a "Detected: 2 local models" status via a local model-discovery scan).

### 4.2 Multiple active providers

Beta Code explicitly supports more than one active provider at once — this is
a core capability, not an edge case, so the design treats "Active" as a
multi-select state across the whole list rather than a single radio choice.
A small **default model** control sits above the list:

```
Default model for new sessions:   Claude Sonnet 5 ▾
```

This dropdown lists every model across every *Active* provider in one flat,
searchable list, grouped by provider (`caption` group labels, matching the
Command Palette's grouping pattern). Any individual composer, agent
assignment, or per-task model override (`03-ai-execution-experience.md` §2,
`04-multi-agent-system.md` §4.2) can select any active-provider model
independently of this default.

### 4.3 Provider configuration panel

Clicking a provider's `⚙` opens an inline expand (not a modal — this is
routine, frequent configuration, not a rare confirming action) directly below
its row:

```
┌────────────────────────────────────────────────┐
│  API key           ●●●●●●●●●●●●1F3A     [ Edit ] │
│  Base URL (optional) ______________________       │
│  Organization ID      ______________________       │
│                                                      │
│  Models                                              │
│  ☑ Claude Sonnet 5      ☑ Opus 4.8    ☐ Haiku 4.5     │
│                                                      │
│  [ Test Connection ]                 [ Remove ]      │
└────────────────────────────────────────────────┘
```

API keys always render masked with only the last 4 characters visible;
`Edit` swaps the masked field for a real input inline, `paste`-friendly, with
a reveal-eye toggle. `Test Connection` gives immediate inline feedback (a
small `status.success`/`status.error` inline banner, not a toast, since the
result is only relevant to this open panel). Local/Ollama-style providers
replace API key with a **Host address** field (default `localhost:11434`)
and a live-detected model list instead of manual checkboxes.

### 4.4 Model picker (shared component)

The dropdown described in §4.2, and the composer's own model badge
(`03-ai-execution-experience.md` §2), are the same component: grouped list,
provider identity chip per group header, model row shows name + a small
capability badge set (`Vision`, `128k`, `Tools`) in `caption`/`text.tertiary`.
Unavailable models (provider configured but this specific model not
enabled) are hidden from this picker entirely rather than shown disabled —
reduces noise for the common case.

## 5. Privacy section — provider data flow

Because multiple providers may be active, Privacy includes a plain-language
table clarifying, per provider, whether prompts/code context are sent to a
third-party API versus staying local (relevant especially for the Local
models / Ollama row, which is always "stays on this machine"). This is a
trust surface, not just a toggle list — treated with the same directness as
the Marketplace's Permissions section (`09-marketplace.md` §4).

## 6. Save behavior

Settings changes apply immediately on interaction (no separate "Save" button
for most rows) with a subtle inline confirmation (a checkmark that fades in
next to the changed control for 1.2s, `motion.fast` in / lingering / fade
out) — consistent with the product's "fast, calm" pillars: users should never
wonder whether a settings change took effect. Destructive actions (Remove
provider, Reset to defaults) always confirm via the standard `Modal` pattern.
