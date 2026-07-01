# 22 · File System Presentation

## 1. Purpose

The Explorer (`06-project-workspace.md` §3, component base in
`01-design-system.md` §6.16) is the user's map of the project. This document
specifies everything about how files are represented, filtered, and searched
— the rules that make that map trustworthy at a glance.

## 2. File status glyphs (recap + full rule set)

Each Explorer row shows at most **one** trailing status dot, in this
priority order when multiple could apply:

1. `status.error` — conflicted (merge conflict present)
2. `status.success` — new/untracked (git-added, not yet committed)
3. `accent.secondary` — modified (tracked, has uncommitted changes)
4. *(none)* — clean, tracked, unmodified

Only the highest-priority applicable state is shown — a modified file that's
also new shows only the "new" dot, since "new" already implies uncommitted.
This avoids stacking multiple glyphs on one row, which would violate the
"clarity at a glance" rule (`15-design-principles.md` Rule 2) by turning a
simple scan into a legend-lookup exercise.

Folders roll up the highest-priority status of any file inside them,
shown on the folder row only while collapsed — expanding the folder moves
the signal down to the actual files, so status is never duplicated at two
depths simultaneously.

## 3. Ignored files

Files matched by `.gitignore` (or an equivalent ignore file for non-git
projects) are hidden from the Explorer by default, matching the mental model
of "this tree shows what the project actually is," not every artifact on
disk. A single toggle in the Explorer's own overflow menu — **Show ignored
files** — reveals them inline at `text.disabled` opacity with a small `git-
ignored` `Badge` at row end, rather than in a separate section, so their
position in the real folder hierarchy stays legible. Toggling this setting
is remembered per-project.

Ignored files are excluded from `⌘⇧F` project search results by default,
with the same toggle available inline in the search panel's filter row
(§7) rather than requiring a trip back to the Explorer.

## 4. Hidden files

Dotfiles (`.env`, `.eslintrc`, etc.) are distinct from ignored files: they're
often tracked and important, so they show by default at full opacity, sorted
alongside regular files (not segregated to a separate "hidden" section) —
Beta Code doesn't treat "starts with a dot" as a signal of irrelevance the
way ignored-by-git does. A **Show dotfiles** toggle exists for users who
prefer to hide them, off by default (i.e., dotfiles are visible out of the
box), the inverse of the ignored-files default, because tracked dotfiles are
usually configuration a developer needs to see.

## 5. Large files

Files above a size threshold (default 5MB, configurable in Settings →
Workspace) show a small size `Badge` (`caption`, `text.tertiary`, e.g.
"12MB") trailing the filename instead of the status dot, since size becomes
the more useful glance-fact for these. Opening a large file in the Editor
shows an interstitial instead of loading it directly:

```
  This file is 42MB — opening it may be slow.
                              [ Open anyway ]   [ Open read-only ]
```

`Open read-only` disables editing and syntax highlighting but still allows
viewing/scrolling, which is fast even for very large files. Large files are
excluded from project-wide search indexing by default (with the same reveal
toggle pattern as ignored files) so a single huge log file doesn't degrade
search performance for the whole project.

## 6. Binary files

Detected by content sniffing, not just extension. The Explorer shows a
generic binary-file icon (distinct from the type-colored code icons, per
`01-design-system.md` §6.16) and — critically — the file never attempts to
open as text. Instead, the Editor area shows a type-appropriate viewer:

| Type | Viewer |
|---|---|
| Image (png/jpg/svg/webp) | Inline image preview, checkerboard background for transparency, zoom controls |
| Font | Type specimen rendering (the font rendering its own name at several sizes) |
| Archive (zip/tar) | A read-only file-tree preview of the archive's contents, reusing the Explorer's own tree component |
| PDF | Inline paginated viewer |
| Unrecognized binary | `Empty state`-style message: "Beta Code can't preview this file type." + `Open with system default` action |

AI tool calls (Read File) against a binary file return the same
type-appropriate summary rather than raw bytes — e.g. reading a PNG surfaces
its dimensions and a thumbnail in the Tool Card, not a wall of encoded data.

## 7. Search

**Quick file open** (`⌘P`) — fuzzy filename/path match only, instant,
renders in the same list style as Command Palette file results
(`07-command-palette.md` §5), since it's effectively that same feature scoped
to the current project.

**Project-wide search** (`⌘⇧F`) — opens as a panel (not a modal — matches
Rule 3 in `15-design-principles.md`), either inline in the sidebar (replacing
the Explorer temporarily, with a `← Back to Explorer` affordance) or as its
own right-panel tab depending on window width, consistent with the
`02-application-shell.md` §5.2 responsive rule for tabs.

```
┌───────────────────────────────┐
│  ← Search                        │
│  rateLimiter              ⚙ ⌄     │
│  ▤ 12 results in 4 files            │
│                                       │
│  ▾ src/middleware/rate.ts (3)          │
│      12  export function rateLimiter…  │
│      28  const rateLimiter = new …      │
│  ▾ src/auth/login.ts (1)                 │
│      4   import { rateLimiter } from…    │
└───────────────────────────────┘
```

Filter row (⚙): case-sensitive, whole-word, regex, include/exclude glob,
include ignored files, include large files — all as compact toggles/inputs
consistent with the `Dropdown`/`Checkbox` components, not a bespoke search-
options widget. Results group by file (matching the Problems list's grouping
pattern for consistency, `06-project-workspace.md` §3), each match line
showing line number + `mono.sm` snippet with the match itself highlighted in
`accent.primary`. Clicking a match opens that file at that line in the
Editor.

**Symbol search** (`⌘⇧O`, scoped to current file, or via Command Palette `@`
for project-wide) reuses the Outline component's data — same tree, just
presented as a flat filtered list while typing.

## 8. Consistency rule

Every one of these presentations — status dots, ignored/hidden toggles, size
badges, binary viewers — appears identically whether the user is looking at
the Explorer, a Search result, a Tool Card's file reference
(`05-tool-cards.md` §4), or the Git tab's changed-file list
(`06-project-workspace.md` §7). A file's visual identity does not change
depending on which screen is currently showing it.
