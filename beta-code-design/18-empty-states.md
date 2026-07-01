# 18 · Empty States

## 1. Purpose

Every screen that can have "nothing in it yet" is catalogued here in one
place, so empty states are designed as a deliberate set rather than
discovered ad hoc per screen. All entries follow the base pattern from
`01-design-system.md` §6.19 (centered icon + headline + one line of
explanation + optional single primary action) unless a deviation is called
out explicitly with its reason.

## 2. Base pattern recap

```
        ◻  (24×24, text.tertiary)

     No projects yet
     Open a folder or create a new project to get started.

          [ New Project ]
```

`title.sm` headline, `body.sm` `text.secondary` explanation, `space.lg`
gaps. No illustrations, no mascots, per the brief's constraints.

## 3. Catalogue

| Screen / region | Icon | Headline | Explanation | Primary action | Notes |
|---|---|---|---|---|---|
| Dashboard, first run | folder | "No projects yet" | "Open a folder or create a new project to get started." | New Project | Quick Launch row stays visible beneath it (`08-dashboard.md` §9) |
| Dashboard → Running now | — (section hidden entirely) | — | — | — | Section doesn't render at all rather than showing an empty variant — an idle workspace isn't a deficiency worth mentioning |
| Dashboard → Recent conversations | clock | "Nothing here yet" | "Conversations you start will show up for quick access." | none | No action — this fills in naturally through use |
| Dashboard → Suggested actions | — (section hidden entirely) | — | — | — | Only ever rendered when there's a genuine signal to suggest from |
| Projects list | folder | "No projects" | "Create your first project to start working with Beta Code." | New Project | |
| Project Workspace → Explorer | — | — | — | — | Cannot be empty — a project always has at least a root folder; if the folder truly has zero files, Explorer shows a single "+ Create a file" inline row instead of the standard empty-state block, since this is a micro-region, not a full screen |
| Project Workspace → Problems | check circle, `status.success` tint | "No problems detected" | (no second line needed) | none | The one empty state allowed a positive/success framing rather than neutral, since "empty" here is the desired outcome |
| Project Workspace → Editor (no file open) | document | "No file open" | "Select a file from the Explorer or ask Beta Code to create one." | none | Matches the Execution Workspace cold-start copy tone from `03-ai-execution-experience.md` §6 |
| Execution Workspace, cold start | Beta Code mark | "What are we building?" | Suggested action cards render below in place of a single explanation line | composer (already focused) | Deviates from the base pattern by design — this is the product's most important empty state, specified fully in `03-ai-execution-experience.md` §6 |
| Right context panel, nothing selected | none | (no icon) | "Nothing to show yet. Open a file or start a task." | none | Deliberately the most minimal empty state in the product per `02-application-shell.md` §5.4 — it's a resting default, not a result of a user action |
| Agents screen, no agents ever run | agent/bot outline glyph | "No agents running" | "Launch an agent manually or start a task to see them here." | Launch Agent | |
| Agents screen → Orchestration | — (section hidden) | — | — | — | Only renders when a multi-step job with dependencies exists |
| Skills | puzzle-piece outline | "No skills installed" | "Browse the Marketplace to add skills." | Browse Marketplace | |
| Tasks | checklist outline | "No open tasks" | "Tasks created manually or by agents will appear here." | none | |
| History (global or project-scoped) | clock | "No sessions yet" | "Your conversations with Beta Code will show up here." | none | |
| Marketplace, no results | magnifier | "No results" | "Try a different search or clear your filters." | Clear filters | Deviates from "no action" default — always offers a way back to browsing (`09-marketplace.md` §7) |
| Marketplace category, genuinely empty (e.g. no Themes published yet) | tag outline | "Nothing here yet" | "Check back soon, or explore other categories." | none | |
| Settings → Models & Providers, no providers configured | plug outline | "No providers configured" | "Add a provider to start using Beta Code." | Add provider | The Local Models row itself is never "empty" — it always renders with a live detection status |
| Settings → Agents, no per-agent overrides set | — | — | — | — | Renders the full agent-type list with each row showing "Uses default model" rather than a blank-screen empty state, since the list itself (all agent types) is never actually empty |
| Notifications panel/history | bell outline | "You're all caught up" | (no second line needed) | none | Positive framing, same reasoning as Problems |
| Diff Viewer, no changes | — | — | — | — | Not shown as an empty state at all — if there's nothing to diff, the surface that would have opened a Diff Viewer (e.g. Git tab) shows its own "No changes" line instead, so a Diff Viewer component is never seen in a null state |
| Architecture view, not yet generated | diagram outline | "No architecture diagram yet" | "Generate one from your current codebase." | Generate | Routes into an Architect-agent execution turn (`11-project-management.md` §10) |
| Documentation, no docs found | document outline | "No documentation found" | "Add a README or ask Beta Code to write one." | Generate with AI | |
| Dependencies, project has none (e.g. zero-dependency project) | box outline | "No dependencies" | (no second line needed) | none | Positive/neutral framing — this is often a true and fine state, not a gap |
| Search (project-wide, `⌘⇧F`) | magnifier | "No matches" | "Try a different query." | none | Matches Marketplace's tone but has no "clear filters" equivalent to offer since a text search has no filter state to reset |

## 4. Rules for adding a new empty state

1. Default to the base pattern (§2) unless the screen has a specific reason
   to deviate (see the Notes column above for the three sanctioned
   deviations: cold-start, positive-framing states, and sections that hide
   entirely rather than render empty).
2. A section that only ever appears when there's real content (Running Now,
   Suggested Actions, Orchestration) is hidden entirely when empty rather
   than shown with a placeholder — per Rule 9 in `15-design-principles.md`
   ("numbers/content are earned, not decorative"), an empty container that
   always renders is itself a kind of decorative noise.
3. Never use an illustration or mascot, per the brief's core constraints —
   the icon is always the same monochrome glyph system used everywhere else
   in the product (`01-design-system.md` §4).
4. If an empty state's primary action exists elsewhere within one click
   (e.g. New Project is always in Quick Launch), it's still fine to repeat it
   here — empty states are a legitimate second entry point, not a
   navigation shortcut that needs deduplication.
