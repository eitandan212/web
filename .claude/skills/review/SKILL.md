---
name: review
description: Self-review a Pulse diff adversarially before shipping — read it as a reviewer who wants to reject it. Use after verify passes and before ship, on every change.
---

# Review

`verify` proves the change runs. `review` asks whether it should exist in this shape.
Read your own diff as someone looking for a reason to send it back.

## Steps

1. **Read the diff, not your memory of it.**
   ```bash
   git diff main...HEAD
   ```
   Read every hunk. The failure mode is skimming a file you wrote twenty minutes ago and
   seeing what you intended rather than what is there.
2. **Check the scope boundary.** Every hunk must trace to the request. A hunk you cannot
   justify out loud is scope creep — revert it, or say in your summary why it was
   unavoidable.
3. **Walk the checklist below.**
4. **Fix what you find, then re-run `verify`.** A review that ends in a list of caveats
   rather than commits has not been done.

## Checklist

**Correctness**
- [ ] Every `useCallback` / `useMemo` / `useEffect` you touched has a dependency array that
      lists what the body actually reads. No linter checks this — you are the linter.
- [ ] No stale-closure risk: nothing registers a long-lived listener that captures a value
      which changes later.
- [ ] `index === null` (no track selected) is handled everywhere you added a read of
      `current`.
- [ ] Array indices come from `TRACKS`, never from a filtered or sorted view.
- [ ] `likes` is replaced, not mutated.

**Fit with the codebase**
- [ ] A reader cannot tell your lines from the surrounding ones — same prop naming, same
      Tailwind idioms, same component shape.
- [ ] No helper duplicates `gradientOf` or `formatTime`.
- [ ] Comment density matches the file. `App.tsx` uses sparse section banners
      (`// --- audio wiring ---`); components carry almost none. Do not narrate.
- [ ] No new dependency, no new media asset, no new file that only one caller uses.

**Mobile**
- [ ] Touch targets ≥36px.
- [ ] Nothing overlaps the 64px nav or the mini player at `bottom-[68px]`.
- [ ] `truncate` still has its `min-w-0 flex-1` parent.
- [ ] Icon-only buttons have `aria-label`.

**Leftovers**
- [ ] No `console.log`, no commented-out code, no `TODO` without a name and a reason.
- [ ] No debug styling (`border-red-500`, `bg-pink-500/50`) left behind.
- [ ] No stray `eslint-disable` added — the repo already has inert ones; do not add more.

```bash
git diff main...HEAD | grep -nE '^\+.*(console\.(log|debug)|TODO|FIXME|debugger|border-red-500)' || echo "clean"
```

## Verification gate

- [ ] The full diff was read hunk by hunk.
- [ ] Every checklist box is ticked or explicitly waived with a reason.
- [ ] Everything found was fixed and `verify` re-run, or is named in the summary as a known
      limitation.

Then hand off to `ship`.

## Anti-rationalization

| The thought | Why it is wrong here | Do this instead |
|---|---|---|
| "I just wrote it, I know what's in it." | You know what you meant. The diff is what you did. They differ most on the files you edited last. | Read the diff. |
| "This extra cleanup is obviously an improvement." | Unrequested cleanup mixed into a feature diff makes the feature unreviewable and the cleanup unattributable. | Separate it, or name it in the summary. |
| "I'll note the dependency-array doubt in my summary." | Nobody re-reads a summary. The next session inherits the bug. | Resolve it now, or write the reasoning into a code comment. |
| "The `eslint-disable` next to it means it's intentional." | Those are template leftovers with no linter behind them. They record nothing. | Verify the array yourself. |
| "It matches the style well enough." | "Well enough" is how a file acquires three conventions for the same thing. | Match the adjacent lines exactly. |
| "It's verified, so review is a formality." | `verify` cannot see scope creep, a duplicated helper, or a debug border. That is the entire point of this step. | Walk the checklist. |
