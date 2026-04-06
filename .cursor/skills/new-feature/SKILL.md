---
name: new-feature
description: >-
  Starts user-visible work on a dedicated git branch and records a Changesets
  entry so the change ships in the next automated release (changelog + npm +
  GitHub Release). Use when the user invokes /new-feature, names a new feature,
  or asks to begin feature work that should appear in CHANGELOG.md.
---

# New feature (branch + Changesets)

## When this applies

Use for **work that should appear in the next release** (features, fixes, breaking changes). Skip a changeset only for **no-release** edits (docs-only, internal refactors with zero user impact) — then use `bunx changeset --empty` only if Changesets still complains locally.

If requirements or scope are unclear, use the **brainstorming** skill first, then return here.

## Package name

Changeset frontmatter must use the npm name from `package.json`:

`@jambulab/openwork`

## Workflow (execute in order)

1. **Branch**
   - `git fetch origin` and ensure base is current `main` (rebase or merge if the repo already uses another default — prefer `main` here).
   - Create `feat/<slug>` where `<slug>` is a short **kebab-case** ASCII slug derived from the user’s description (drop articles; max ~48 chars).
   - Example: “OAuth login for CLI” → `feat/cli-oauth-login`.

2. **Implement**
   - Match existing project patterns; keep scope to the described feature unless the user expands it.

3. **Changeset (required before the PR is merge-ready)**
   - **Preferred (human or TTY):** `bunx changeset` and follow prompts.
   - **Agent / non-interactive:** create `.changeset/<slug>.md` (unique name, kebab-case) with this shape:

```markdown
---
"@jambulab/openwork": minor
---

<User-facing summary in imperative or neutral tone; appears in CHANGELOG.md>
```

   - Pick the semver bump:
     - **`minor`** — new behavior or feature, backwards compatible (default for `/new-feature`).
     - **`patch`** — bugfix or small correction with no new capability.
     - **`major`** — breaking change for consumers or CLI contract.

4. **Validate**
   - `bun run build` (or at least what CI runs: install frozen + build + smoke if touching runtime code).
   - `CI=true bunx changeset status` must exit **0** once the changeset file exists.

5. **Commit**
   - Include **both** code and the new `.changeset/*.md` in the same PR (or split only if the team explicitly prefers a follow-up commit — default: same PR).

## Release linkage (no extra steps in this skill)

Merging to `main` triggers `.github/workflows/release.yml`: pending changesets become a **Version packages** PR; merging that PR publishes npm (build via `prepack`) and opens a GitHub Release. The agent does **not** manually tag or edit `package.json` version for normal releases.

## Checklist

Copy and complete:

```
- [ ] Branch feat/<slug> from up-to-date main
- [ ] Implementation done and scoped
- [ ] .changeset/<slug>.md added (correct bump + user-facing line)
- [ ] CI=true bunx changeset status passes
- [ ] build/smoke as appropriate
```
