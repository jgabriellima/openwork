#!/usr/bin/env bash
# One-line (macOS / Linux / Git Bash on Windows):
#   curl -fsSL https://raw.githubusercontent.com/jgabriellima/openwork/main/scripts/install-openwork.sh | bash
#
# Requires: git, Node.js 20+, Bun (https://bun.sh), npm (comes with Node).
#
# Env:
#   OPENWORK_INSTALL_DIR  — clone location (default: ~/.openwork-source)
#   OPENWORK_GITHUB_REF   — branch (default: main)
#   OPENWORK_PAUSE=1      — wait for Enter before exit (useful if the window closes too fast)

set -eo pipefail

REPO_URL="${OPENWORK_REPO_URL:-https://github.com/jgabriellima/openwork.git}"
REF="${OPENWORK_GITHUB_REF:-main}"
INSTALL_DIR="${OPENWORK_INSTALL_DIR:-$HOME/.openwork-source}"

die() {
  echo "" >&2
  echo "openwork install: $*" >&2
  echo "" >&2
  echo "Manual fallback:" >&2
  echo "  git clone $REPO_URL && cd openwork && bun install && bun run build && npm link" >&2
  echo "  openwork configure" >&2
  exit 1
}

command -v git >/dev/null 2>&1 || die "git not found. Install Git first."
command -v node >/dev/null 2>&1 || die "Node.js not found. Install Node 20+ from https://nodejs.org/"
command -v npm >/dev/null 2>&1 || die "npm not found (install Node.js LTS)."
command -v bun >/dev/null 2>&1 || die "Bun not found. Install from https://bun.sh (required to build the CLI bundle)."

echo "OpenWork installer"
echo "  Repo:    $REPO_URL ($REF)"
echo "  Clone:   $INSTALL_DIR"
echo ""

if [[ -d "$INSTALL_DIR/.git" ]]; then
  echo "Updating existing clone..."
  git -C "$INSTALL_DIR" fetch origin "$REF" 2>/dev/null || true
  git -C "$INSTALL_DIR" checkout "$REF" 2>/dev/null || git -C "$INSTALL_DIR" checkout -B "$REF" "origin/$REF" 2>/dev/null || true
  git -C "$INSTALL_DIR" pull --ff-only origin "$REF" || git -C "$INSTALL_DIR" pull --ff-only || true
else
  echo "Cloning..."
  rm -rf "$INSTALL_DIR"
  git clone --depth 1 --branch "$REF" "$REPO_URL" "$INSTALL_DIR" || die "git clone failed"
fi

cd "$INSTALL_DIR" || die "cannot cd to $INSTALL_DIR"

echo "Installing dependencies (bun)..."
bun install || die "bun install failed"

echo "Building CLI..."
bun run build || die "bun run build failed"

test -f dist/cli.mjs || die "dist/cli.mjs missing after build"

echo "Linking global command (npm link)..."
npm link || die "npm link failed — try: sudo npm link, or fix npm global bin in PATH"

if command -v openwork >/dev/null 2>&1; then
  openwork --version || true
else
  echo "" >&2
  echo "Warning: openwork not on PATH. Global npm bin is usually:" >&2
  npm bin -g 2>/dev/null || true
  die "add npm global bin to PATH and run: openwork --version"
fi

echo ""
echo "Done. Next:"
echo "  openwork configure"
echo "  openwork"
echo ""

if [[ "${OPENWORK_PAUSE:-}" == "1" ]] && [[ -t 0 ]]; then
  read -r -p "Press Enter to close... " _
fi
