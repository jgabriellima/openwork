#!/usr/bin/env bash
# Smart release: work from main (where Changesets expects the bump), open a PR, merge.
# Requires: gh CLI authenticated (gh auth login), clean working tree, merged feature work
#           on origin/main that still has pending .changeset/*.md entries.
#
# Env:
#   RELEASE_BASE_BRANCH  default: main
#   RELEASE_MERGE        auto (default) = merge when CI green | merge = merge now |
#                        admin = merge now bypassing rules | open = only open PR

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BASE="${RELEASE_BASE_BRANCH:-main}"
MERGE="${RELEASE_MERGE:-auto}"

if ! command -v gh >/dev/null 2>&1; then
  echo "release: install GitHub CLI: https://cli.github.com/  (brew install gh)"
  exit 1
fi

gh auth status >/dev/null 2>&1 || {
  echo "release: run: gh auth login"
  exit 1
}

if [ -n "$(git status --porcelain)" ]; then
  echo "release: working tree is not clean — commit or stash before running."
  exit 1
fi

ORIG_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

cleanup() {
  if [ "$ORIG_BRANCH" != "HEAD" ] && [ "$ORIG_BRANCH" != "$BASE" ]; then
    git checkout "$ORIG_BRANCH" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

echo "→ fetch origin/$BASE"
git fetch origin "$BASE"

echo "→ checkout $BASE"
git checkout "$BASE"
git pull --ff-only "origin/$BASE"

CHANGESETS="$(find .changeset -maxdepth 1 -name '*.md' -type f ! -name 'README.md' 2>/dev/null | wc -l | tr -d ' ')"
if [ "${CHANGESETS:-0}" -eq 0 ]; then
  echo "release: no pending changesets under .changeset/ (excluding README)."
  echo "  Merge your feature PR first if .changeset/*.md are only on that branch."
  exit 1
fi

echo "→ build"
bun run build

echo "→ changeset version"
bun run version-packages

git add package.json CHANGELOG.md .changeset
if git diff --cached --quiet; then
  echo "release: nothing staged after version-packages — unexpected."
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BRANCH="chore/version-packages-${STAMP}"

echo "→ branch $BRANCH"
git checkout -b "$BRANCH"
git commit -m "chore: version packages"

echo "→ push"
git push -u origin "$BRANCH"

echo "→ pull request"
URL="$(gh pr create \
  --base "$BASE" \
  --head "$BRANCH" \
  --title "chore: version packages" \
  --body "Automated version bump via \`make release\` / scripts/make-release-main.sh")"

echo "$URL"

case "$MERGE" in
  open)
    echo "→ RELEASE_MERGE=open: merge the PR manually when ready."
    ;;
  merge)
    echo "→ merge now (fails if branch protection requires passing checks)"
    gh pr merge --merge --delete-branch "$URL"
    ;;
  admin)
    echo "→ merge with --admin (repo admin only)"
    gh pr merge --merge --delete-branch --admin "$URL"
    ;;
  auto)
    echo "→ auto-merge when required checks pass"
    gh pr merge --merge --delete-branch --auto "$URL" || {
      echo "release: --auto not available or checks pending — open the PR above or retry with RELEASE_MERGE=merge once CI is green."
      exit 1
    }
    ;;
  *)
    echo "release: invalid RELEASE_MERGE=$MERGE (use auto|merge|admin|open)"
    exit 1
    ;;
esac

trap - EXIT
git checkout "$BASE"
git pull --ff-only "origin/$BASE"

echo "→ done. Local $BASE is up to date. CI / release.yml will publish to npm if configured."
