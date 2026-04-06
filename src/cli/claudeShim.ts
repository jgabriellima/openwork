import { access, appendFile, readFile, writeFile } from 'fs/promises'
import { homedir } from 'os'
import { join } from 'path'
import chalk from 'chalk'

const MARKER_BEGIN = '# openwork-make-claude-shim: begin'
const MARKER_END = '# openwork-make-claude-shim: end'

const RC_FILES = ['.zshrc', '.bashrc', '.bash_profile', '.profile']

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function pickRcFile(): Promise<string> {
  const home = homedir()
  const shell = process.env.SHELL ?? ''

  const candidates: string[] = []

  if (shell.endsWith('zsh')) {
    candidates.push(join(home, '.zshrc'))
  } else if (shell.endsWith('bash')) {
    candidates.push(join(home, '.bashrc'), join(home, '.bash_profile'))
  }

  // Always append the full list as fallbacks
  for (const rc of RC_FILES) {
    const p = join(home, rc)
    if (!candidates.includes(p)) candidates.push(p)
  }

  for (const candidate of candidates) {
    if (await fileExists(candidate)) return candidate
  }

  // Create default based on shell
  return shell.endsWith('zsh') ? join(home, '.zshrc') : join(home, '.profile')
}

async function removeBlockFromFile(filePath: string): Promise<boolean> {
  if (!(await fileExists(filePath))) return false

  const content = await readFile(filePath, 'utf8')
  if (!content.includes(MARKER_BEGIN)) return false

  const lines = content.split('\n')
  const kept: string[] = []
  let skipping = false

  for (const line of lines) {
    if (line.startsWith(MARKER_BEGIN)) {
      skipping = true
      continue
    }
    if (line.startsWith(MARKER_END)) {
      skipping = false
      continue
    }
    if (!skipping) kept.push(line)
  }

  await writeFile(filePath, kept.join('\n'), 'utf8')
  return true
}

function buildShimLine(openworkBin?: string): string {
  if (openworkBin) {
    // Single-quote escape for POSIX shells
    const escaped = openworkBin.replace(/'/g, "'\\''")
    return `claude() { '${escaped}' "$@"; }`
  }
  return 'claude() { command openwork "$@"; }'
}

export async function installClaudeShim(openworkBin?: string): Promise<void> {
  const home = homedir()

  // Validate custom bin path upfront
  if (openworkBin && !(await fileExists(openworkBin))) {
    process.stderr.write(chalk.red(`--bin path does not exist: ${openworkBin}\n`))
    process.exit(1)
  }

  // Check if already installed across all known rc files
  for (const rc of RC_FILES) {
    const filePath = join(home, rc)
    if (await fileExists(filePath)) {
      const content = await readFile(filePath, 'utf8')
      if (content.includes(MARKER_BEGIN)) {
        process.stdout.write(
          chalk.yellow(`Shim already installed in ${filePath}. Run: openwork claude-shim-revert\n`),
        )
        return
      }
    }
  }

  const rcFile = await pickRcFile()
  const shimLine = buildShimLine(openworkBin)

  const block =
    [
      '',
      MARKER_BEGIN,
      '# claude → OpenWork (revert: openwork claude-shim-revert)',
      'unalias claude 2>/dev/null || true',
      shimLine,
      MARKER_END,
    ].join('\n') + '\n'

  await appendFile(rcFile, block, 'utf8')

  process.stdout.write(chalk.green(`Installed claude → openwork in ${rcFile}\n`))
  process.stdout.write(`Open a new terminal or run: ${chalk.bold(`source ${rcFile}`)}\n`)
}

export async function removeClaudeShim(): Promise<void> {
  const home = homedir()
  let anyRemoved = false

  for (const rc of RC_FILES) {
    const filePath = join(home, rc)
    const removed = await removeBlockFromFile(filePath)
    if (removed) {
      process.stdout.write(`Removed claude → openwork shim from ${filePath}\n`)
      anyRemoved = true
    }
  }

  if (!anyRemoved) {
    process.stdout.write(chalk.yellow('No claude shim found in any rc file.\n'))
  } else {
    process.stdout.write('Open a new shell or run: source ~/.zshrc (or your rc file).\n')
  }
}
