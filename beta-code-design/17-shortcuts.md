# 17 · Keyboard Shortcuts

## 1. Purpose

A complete reference of every keyboard shortcut in Beta Code. Shortcuts shown
as `⌘` (macOS) map to `Ctrl` on Windows/Linux unless noted otherwise; the
product ships one canonical mapping per platform rather than letting the two
diverge in meaning. Every shortcut here is discoverable in the UI itself
(menu trailing hints, tooltip, or Command Palette row metadata per
`07-command-palette.md` §5) — nothing in this list is a hidden/undocumented
gesture.

## 2. Global

| Shortcut (macOS) | Windows/Linux | Action |
|---|---|---|
| `⌘K` | `Ctrl+K` | Open Command Palette |
| `⌘\` | `Ctrl+\` | Toggle left sidebar collapse |
| `⌘.` | `Ctrl+.` | Toggle right context panel |
| `⌘N` | `Ctrl+N` | New Project |
| `⌘O` | `Ctrl+O` | Open Folder |
| `⌘,` | `Ctrl+,` | Open Settings |
| `⌘⇧M` | `Ctrl+Shift+M` | Open model switcher |
| `⌘⇧A` | `Ctrl+Shift+A` | Launch Agent |
| `⌘⇧P` | `Ctrl+Shift+P` | Command-only Palette mode (`>` prefix) |
| `Esc` | `Esc` | Close topmost overlay / back out one level |
| `⌘W` | `Ctrl+W` | Close current tab (editor tab, or active overlay if one is open) |
| `⌘⇧T` | `Ctrl+Shift+T` | Reopen last closed tab |
| `⌘1`…`⌘9` | `Ctrl+1`…`Ctrl+9` | Jump to sidebar item N (Dashboard, Projects, Agents, …, in listed order) |

## 3. Composer & conversation

| Shortcut | Action |
|---|---|
| `⏎` | Submit prompt |
| `⇧⏎` | Insert newline in composer without submitting |
| `⌘⏎` (while a turn is running) | Stop the active turn |
| `@` | Open file/symbol reference picker inline in composer |
| `/` | Open skills/commands picker inline in composer |
| `⌥` + click model badge, or `⌘⇧M` | Switch model for the next message |
| `⌘↑` / `⌘↓` | Navigate to previous/next turn in the current thread |
| `⌘⇧C` | Copy the last AI response |
| `⌘⇧R` | Retry the last turn |
| `⌘⇧B` | Branch a new turn from the current point |

## 4. Project Workspace / Editor

| Shortcut | Action |
|---|---|
| `Ctrl+\`` (backtick) | Toggle bottom panel (Terminal/Problems/Preview) |
| `⌘P` | Quick file open (equivalent to Palette `@` mode, scoped to current project) |
| `⌘⇧F` | Search across project |
| `⌘F` | Find in current file |
| `⌘⇧O` | Jump to symbol in current file (Outline search) |
| `⌘B` | Toggle Explorer/sidebar visibility (Project Workspace context — distinct from `⌘\`'s app-wide sidebar collapse; this hides just the file tree section while keeping the rest of the left rail) |
| `⌘\` (within editor) | Split editor |
| `⌘S` | Save current file |
| `⌘⇧S` | Save all |
| `⌘Z` / `⌘⇧Z` | Undo / Redo |
| `⌘/` | Toggle line comment |
| `F2` | Rename symbol |
| `⌘.` (with selection) | Open the floating AI action toolbar (Ask/Explain/Fix/Refactor) for the current selection — same gesture as clicking it, per `06-project-workspace.md` §5 |
| `⌘G` / `⌘⇧G` | Next / previous diagnostic (Problems) |
| `⌘⌥M` | Toggle minimap |

## 5. Terminal

| Shortcut | Action |
|---|---|
| `Ctrl+\`` | Focus/toggle terminal panel |
| `⌘T` (within terminal panel) | New terminal instance |
| `⌘⇧\`` | Split terminal |
| `⌘W` (within terminal panel, focused instance) | Close current terminal instance |
| `⌘K` (within terminal panel, focused instance) | Clear terminal scrollback — note: scoped to the focused terminal only; app-wide `⌘K` still opens the Command Palette everywhere else, so this binding only activates when a terminal instance has keyboard focus |
| `↑` / `↓` (within terminal panel) | Command history navigation |
| `⌘⇧F` | Fix the last failed command with AI (`23-terminal-experience.md` §5) |

## 6. Git

| Shortcut | Action |
|---|---|
| `⌘⇧G` (from Project Workspace, not terminal-focused) | Open Git tab in right context panel |
| `⌘Enter` (within Git tab commit field) | Commit staged changes |
| `⌘⇧U` | Push |
| `⌘⇧K` (within Diff Viewer) | Toggle unified/split diff view |

## 7. Agents & multi-agent

| Shortcut | Action |
|---|---|
| `⌘⇧A` | Launch Agent modal |
| `Space` (with an Agent Card focused) | Pause/Resume that agent |
| `⌘⌫` (with an Agent Card focused) | Stop that agent (confirmation modal per Rule 3 in `15-design-principles.md`, since this is destructive) |
| `⌘R` (with an Agent Card focused) | Retry that agent |

## 8. Marketplace

| Shortcut | Action |
|---|---|
| `⌘F` | Search within current Marketplace category |
| `Enter` (with an item focused) | Open item detail |
| `⌘⏎` (with an item focused) | Install directly, skipping the detail view (still passes through the permission-approval modal if applicable) |

## 9. Lists, tables, and trees (shared conventions)

These apply uniformly to the Explorer, Problems list, Dependencies table,
Timeline, and Command Palette results, so muscle memory transfers across the
whole app:

| Key | Action |
|---|---|
| `↑` / `↓` | Move selection |
| `→` / `←` | Expand / collapse (tree nodes), or move into/out of a nested group |
| `Enter` | Activate default action (open file, open detail, run command) |
| `Space` | Toggle checkbox/selection where applicable (Dependencies bulk-select) |
| Type-ahead | Jump to the next row starting with typed characters |

## 10. Customization

All bindings in this document are user-remappable in Settings → Editor →
Keybindings (`10-settings-and-providers.md` §3), presented as the same table
structure as this document so the settings UI and this reference never
visually diverge. Conflicting bindings are flagged inline at the point of
rebinding rather than silently overwritten.
