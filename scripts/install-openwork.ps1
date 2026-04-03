# OpenWork install (Windows PowerShell). Run in a normal window, not double-click, so you see errors:
#   irm https://raw.githubusercontent.com/jgabriellima/openwork/main/scripts/install-openwork.ps1 | iex
#
# Requires: Git, Node 20+, Bun (https://bun.sh), npm.

$ErrorActionPreference = "Stop"
$RepoUrl = if ($env:OPENWORK_REPO_URL) { $env:OPENWORK_REPO_URL } else { "https://github.com/jgabriellima/openwork.git" }
$Ref = if ($env:OPENWORK_GITHUB_REF) { $env:OPENWORK_GITHUB_REF } else { "main" }
$InstallDir = if ($env:OPENWORK_INSTALL_DIR) { $env:OPENWORK_INSTALL_DIR } else { Join-Path $HOME ".openwork-source" }

function Die($msg) {
    Write-Host ""
    Write-Host "openwork install: $msg" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual: git clone $RepoUrl ; cd openwork ; bun install ; bun run build ; npm link"
    exit 1
}

foreach ($cmd in @("git", "node", "npm", "bun")) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Die "$cmd not found on PATH. Install Git, Node.js LTS, and Bun (https://bun.sh)."
    }
}

Write-Host "OpenWork installer"
Write-Host "  Repo:  $RepoUrl ($Ref)"
Write-Host "  Path:  $InstallDir"
Write-Host ""

if (Test-Path (Join-Path $InstallDir ".git")) {
    Write-Host "Updating existing clone..."
    Push-Location $InstallDir
    try {
        git fetch origin $Ref 2>$null
        git checkout $Ref 2>$null
        git pull --ff-only origin $Ref 2>$null
        if ($LASTEXITCODE -ne 0) { git pull --ff-only 2>$null }
    } finally {
        Pop-Location
    }
} else {
    if (Test-Path $InstallDir) { Remove-Item -Recurse -Force $InstallDir }
    Write-Host "Cloning..."
    git clone --depth 1 --branch $Ref $RepoUrl $InstallDir
    if ($LASTEXITCODE -ne 0) { Die "git clone failed" }
}

Set-Location $InstallDir

Write-Host "bun install..."
bun install
if ($LASTEXITCODE -ne 0) { Die "bun install failed" }

Write-Host "bun run build..."
bun run build
if ($LASTEXITCODE -ne 0) { Die "bun run build failed" }

if (-not (Test-Path "dist/cli.mjs")) { Die "dist/cli.mjs missing after build" }

Write-Host "npm link..."
npm link
if ($LASTEXITCODE -ne 0) { Die "npm link failed (try: Run as Administrator, or fix npm global path)" }

$ow = Get-Command openwork -ErrorAction SilentlyContinue
if ($ow) {
    & openwork --version
} else {
    Die "openwork not on PATH. Add npm global bin to your PATH (npm bin -g)."
}

Write-Host ""
Write-Host "Done. Next: openwork configure   then   openwork"
Write-Host ""

if ($env:OPENWORK_PAUSE -eq "1") {
    Read-Host "Press Enter to exit"
}
