---
name: ship
description: Commit and push a verified, reviewed change to Pulse with an honest summary of what was and was not checked. Use as the last step, after verify and review both pass.
---

# Ship

## Preconditions

Do not start until all three hold. If one does not, go back to the skill that owns it.

- [ ] `npm run verify` exits 0.
- [ ] `review`'s checklist is walked and its findings fixed.
- [ ] The browser check was done, or its absence is written into the summary.

## Steps

1. **Confirm the branch.**
   ```bash
   git branch --show-current
   ```
   Never commit to `main`. Work goes on the session's designated branch.
2. **Stage deliberately.**
   ```bash
   git status --short
   git add <paths>
   ```
   Stage named paths, not `git add -A`. `.gitignore` already covers `node_modules`, `dist`
   and editor files, so the risk is not build output — it is sweeping up an unrelated
   working-tree edit into a focused commit.
3. **Commit.** Subject in the imperative, under ~65 characters, naming the user-visible
   change rather than the mechanism:
   ```
   Add a play queue with drag-to-reorder
   Fix prev button skipping two tracks when shuffle is on
   ```
   Not `Update App.tsx` and not `Refactor state`. Body only when the *why* is not obvious
   from the subject — what was tried and rejected, or what constraint forced the shape.
4. **Push.**
   ```bash
   git push -u origin <branch>
   ```
   Retry network failures with backoff (2s, 4s, 8s, 16s). Do not retry an auth failure —
   report it.
5. **Summarize honestly.** Three parts, in this order:
   - what changed, in user terms;
   - what was verified and how (`npm run verify`, which browser paths were walked);
   - **what was not verified**, named specifically.

   If audio was not listened to, say so. If only the desktop frame was checked, say so.
   A summary that omits the third part is the one thing this pack exists to prevent.

## Do not

- Open a pull request unless it was explicitly asked for.
- Commit unrelated working-tree changes alongside the feature.
- Amend or force-push a branch someone else may have checked out.
- Describe work as "done", "working" or "verified" beyond what you actually ran.

## Verification gate

- [ ] Branch is not `main`.
- [ ] Staged paths reviewed; nothing unrelated to this change included.
- [ ] Commit subject names the user-visible change.
- [ ] Push confirmed to have succeeded.
- [ ] Summary names what was not verified.

## Anti-rationalization

| The thought | Why it is wrong here | Do this instead |
|---|---|---|
| "`git add -A` is faster." | It stages every unrelated edit in the tree alongside your change, which is how a two-file fix arrives as a seven-file diff nobody can review. | Stage named paths. |
| "The caveat will just worry them." | An unstated caveat becomes their bug report tomorrow. Stating it costs one sentence. | Name it. |
| "It typechecks and builds, so 'works' is fair." | "Works" claims user-facing behaviour. The gate claims compilation. | Say "typechecks and builds; not exercised in a browser." |
| "I'll open a PR so they can see it." | Unasked-for PRs create notifications, review load, and sometimes CI spend. | Push the branch; offer the PR. |
| "The commit message can say what file changed." | `git diff` already says that. The message must carry what the diff cannot: intent. | Describe the change in user terms. |
