# 13 · User Flows

## 1. Purpose

Screen specs describe rooms; this document describes how a user actually
walks through the building. Every flow below is written as a numbered
sequence of concrete states, each state naming the exact screen/component
that renders it, so the flow can be validated against the other documents
rather than treated as separate narrative fiction. Where a flow can branch
(error, confirmation needed, nothing found), the branch is called out
explicitly rather than assumed.

Every flow in this document is expected to satisfy the click budget in
`15-design-principles.md` §1 ("two clicks to any action") — where a flow
below takes more than two intentional clicks, that is a deliberate,
noted exception (usually because real risk or real choice is involved:
creating a project, approving a destructive command).

---

## 2. Opening a project

1. **Entry point**: Dashboard → Pinned Workspaces (`08-dashboard.md` §5) or
   Command Palette → `@` file mode → any result, or left nav → Projects.
2. Click a `Project Card`. The app shell's center workspace swaps to Project
   Workspace (`06-project-workspace.md` §2); this is a mode swap, not a
   navigation — the sidebar and right panel stay mounted, only their content
   updates (see `14-navigation-map.md` §2 for the shell-vs-screen distinction).
3. Explorer populates the sidebar's project-scoped section; the last file the
   user had open in that project (persisted per-project) opens automatically
   in the Editor with its previous cursor position and scroll offset restored.
4. Right context panel restores to whatever tab was active last time this
   project was open (Files/Git/Agents/etc.), defaulting to **Outline** on
   first-ever open.
5. If the project has running background agents from a previous session, an
   `Agent Card` row fades in above the Editor tabs within ~1s of open — this
   is the one moment content is allowed to appear slightly after the frame
   renders, since agent state must be fetched.

**Branch — project folder missing/moved**: step 2 fails silently to open;
instead an `Error state` (`01-design-system.md` §6.20) renders in place of the
Editor: "Can't find this project" + "Locate folder" (secondary) / "Remove
from list" (ghost).

---

## 3. Creating a new project

This flow intentionally spans more than two clicks — project creation is a
deliberate, infrequent action where a wrong default (wrong location, wrong
template) is costly to undo, so the extra confirmation is a feature, not friction.

1. **Entry point**: Dashboard → Quick Launch → "New Project" (`08-dashboard.md`
   §8), or Command Palette → `New Project` command, or left nav → Projects →
   `+ New` card.
2. `Modal` opens (720px, content-modal size per `01-design-system.md` §6.7):
   name field (autofocused), location field (native picker button), template
   selector (grid of `Item Card`-style tiles: Blank, from a Marketplace
   Template, or "From existing folder").
3. Choosing a Marketplace Template swaps the modal's body to a scoped
   in-modal browse list (same card visual language as `09-marketplace.md` §3,
   without leaving the modal) — selecting one returns to step 2's form with
   the template pre-filled.
4. Click primary `Create`. Modal closes with a `fast` fade; the new project
   opens directly into Project Workspace as in §2 above, but with the
   Execution Workspace's **cold-start empty state**
   (`03-ai-execution-experience.md` §6) shown instead of a restored file,
   since there's no "last file" yet. Suggested actions here are
   template-specific ("Run the dev server," "Add a README").
5. The project is automatically added to Pinned Workspaces.

**Branch — location already contains a project**: inline validation error
under the location field, `Create` stays disabled until resolved — never a
blocking modal-on-modal.

---

## 4. Working with an agent (end-to-end task)

This is the product's core loop, already specified in detail in
`03-ai-execution-experience.md` and `04-multi-agent-system.md`; this section
is the flow-level index tying those together.

1. User types a request in the **Prompt composer**, anywhere it appears
   (Dashboard, Project Workspace, an existing session) — one click/keystroke
   to submit (`⏎`).
2. Center workspace enters the Execution Workspace and the turn begins
   **Understanding** (`03-ai-execution-experience.md` §3.2) — zero additional
   clicks required unless the user wants to redirect after reading the
   restatement.
3. **Planning** renders; if the plan is low-risk, it proceeds automatically
   into Execution with no click. If it needs approval, the user clicks
   **Approve** (one click) or **Adjust** (opens composer, branches back to
   step 1 with the plan as context).
4. If the plan requires more than one agent, the turn silently expands into
   a multi-agent orchestration (`04-multi-agent-system.md` §4.1) — the user
   doesn't have to do anything differently; tool cards simply carry agent
   identity chips.
5. **Execution** streams Tool Cards. The user may, at any point, click
   **Pause** on the turn (one click) to freeze it, or click into any Tool
   Card to inspect it without affecting the run.
6. **Verification** resolves automatically. On failure, the turn loops back
   into a nested recovery Execution sub-branch with no user action needed
   unless the automatic fix itself needs approval (same Approve/Adjust
   pattern as step 3).
7. **Completion** renders the summary + diffs. User reads, then either does
   nothing (implicitly accepting), or clicks `⟳ Retry`, `⎘ Branch here`, or a
   thumbs reaction — all one click.

**Branch — user wants to intervene mid-task with unrelated work**: submitting
a new prompt while a turn is executing does not queue behind it; it opens a
**parallel turn** in the same thread (visually stacked below, its own phase
indicator), letting the user multitask within one project the same way
multiple agents multitask within one turn.

---

## 5. Fixing an error

Two entry points converge on the same recovery pattern, reinforcing the
product's "one consistent affordance per concept" rule (see also
`19-error-handling.md`).

**5a. Error surfaced passively** (a failing build, a lint error, a failing
test visible in Problems or Project Overview):
1. User sees a `status.error` badge/row (Explorer dot, Problems list,
   Overview's Build card, or Timeline entry).
2. Click the row's **Fix with AI** ghost action (one click).
3. This seeds a new execution turn with the error pre-attached as context —
   flow continues exactly as §4 from step 2.

**5b. Error surfaced during execution** (a tool call or verification fails
mid-turn):
1. The failing Tool Card auto-expands with `status.error` styling
   (`05-tool-cards.md` §5); no click needed to see what broke.
2. The AI proposes a fix automatically as a nested recovery sub-turn — by
   default this requires no click if the fix is low-risk (matches the
   auto-approve settings from `10-settings-and-providers.md` §Agents),
   otherwise a single **Approve** click as in §4 step 3.
3. On resolution, the parent turn's phase indicator resumes forward. If the
   recovery attempt itself fails twice, the turn stops and surfaces a
   `status.error` **Completion** with an explicit "I couldn't resolve this
   automatically" message plus a **Retry manually** / **Ask for help**
   action pair — the one place the system explicitly gives up rather than
   looping silently.

---

## 6. Installing an extension/agent/skill

1. **Entry point**: left nav → Marketplace, or a Suggested Action, or an
   in-context prompt (e.g. a project needing a provider the user hasn't
   installed a skill for).
2. Browse or search (`09-marketplace.md` §2); click an `Item Card` to open
   its **Detail view** (one click) — this is not itself an install, so
   browsing multiple candidates costs one click each with no commitment.
3. Click **Install** (second click). If the item requests permissions, a
   confirmation `Modal` lists them; click **Approve & Install** (third click
   — this is the brief's other explicit two-click exception, matching the
   plan-approval precedent from §4, since granting file/terminal/browser
   access is a trust decision).
4. Button shows an inline "Installing…" state, then settles to
   "Installed ✓." The item is now available wherever its type is consumed:
   Agents in the Launch Agent modal (`04-multi-agent-system.md` §4.2), Skills
   in the composer's `/` picker, Templates in the New Project modal (§3
   above), Themes in Settings → Appearance.

---

## 7. Switching model

**Fast path (mid-conversation):** click the model `Badge` in the composer
(`03-ai-execution-experience.md` §2) → picker opens inline → click a model.
One click to open, one to select — applies to the very next message only,
current turn in flight is unaffected.

**Global default:** Settings → Models & Providers → **Default model for new
sessions** dropdown (`10-settings-and-providers.md` §4.2) → select. Takes
effect for new sessions going forward; open sessions keep whatever model they
were already using unless the user explicitly changes them via the fast path.

**Per-agent override:** Settings → Agents → pick an agent type → assign a
specific model that always overrides the session default whenever that agent
type runs — set once, applies silently after that (e.g. always route the
Security agent to a specific reasoning-heavy model).

---

## 8. Sharing a workspace

1. **Entry point**: Workspace switcher (`02-application-shell.md` §3.3) →
   the workspace's row → overflow `⋯` → **Share**, or a `Share` quick action
   in the Project Workspace title bar (`02-application-shell.md` §4.2).
2. `Modal` opens: a shareable link (copy button), a role selector (`Viewer` /
   `Collaborator` — Collaborator can trigger agents and edit, Viewer is
   read-only across sessions/diffs), and an optional expiry.
3. Click **Copy link** or, if the org has member search, type a name to
   invite directly and click **Send** — either path is a single click once
   the modal is open (matching the two-click budget: one to open Share, one
   to complete it).
4. Recipients opening the link land directly on that workspace's Dashboard
   scoped view with the assigned role reflected as a `Badge` in the title
   bar, so a shared session never leaves ambiguity about who can do what.

---

## 9. Git workflow

Git actions are distributed across the Project Workspace rather than
centralized in one screen (per `06-project-workspace.md` §7 and
`11-project-management.md` §11); this flow shows how a full stage → commit →
push cycle actually plays out for a user.

1. Editing files updates the Explorer's per-file dots and the editor gutter
   markers live, with no user action (`06-project-workspace.md` §5).
2. User opens the right context panel's **Git** tab (one click, or it
   auto-surfaces if the panel was already idle when changes were detected —
   see `02-application-shell.md` §5.2's "urgent surface" rule, though it
   never steals a tab the user is actively using).
3. Panel lists changed files with stat counts; clicking a file opens its
   `Diff viewer` inline in the same tab (one click) — no navigation away from
   the panel is required to review a diff.
4. User types a commit message in the panel's bottom composer and clicks
   **Commit** (one click, message field doesn't count against the budget
   since typing isn't a "click"). This produces a **Git Commit Tool Card**
   in the current session's turn history, identical in form whether a human
   or an agent committed (`05-tool-cards.md` §4), preserving one audit trail.
5. **Push**: a `Push` ghost action appears in the same Git tab once there are
   unpushed commits (`Overview`'s Git card shows "3 ahead" per
   `11-project-management.md` §3) — one click, inline progress indicator on
   the button itself, no modal.
6. **Delegating instead of doing it by hand**: at any point in this flow the
   user can instead type "commit and push this" into the composer, which
   produces the same Git Commit Tool Card via the Git Agent
   (`04-multi-agent-system.md` §2) — both paths converge on the identical
   artifact, so a user never needs to remember two different mental models
   for "git done by me" versus "git done by AI."
