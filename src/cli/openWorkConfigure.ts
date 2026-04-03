import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { DEFAULT_OPENAI_BASE_URL } from '../services/api/providerConfig.js'
import {
  loadOpenWorkPublicConfig,
  loadOpenWorkSecrets,
  OPENWORK_DIR,
  saveOpenWorkProviderState,
} from '../utils/openworkProviderStore.js'

type Preset = {
  id: string
  label: string
  baseUrl: string
  models: string[]
  keyHint: string
}

const PRESETS: Preset[] = [
  {
    id: 'openai',
    label: 'OpenAI',
    baseUrl: DEFAULT_OPENAI_BASE_URL,
    models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini'],
    keyHint: 'Create a key at https://platform.openai.com/api-keys',
  },
  {
    id: 'ollama',
    label: 'Ollama (local)',
    baseUrl: 'http://localhost:11434/v1',
    models: ['llama3.1:8b', 'llama3.2:3b', 'qwen2.5-coder:7b'],
    keyHint: 'No API key needed for the default local URL.',
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-coder'],
    keyHint: 'Keys at https://platform.deepseek.com/',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'google/gemini-2.0-flash-001'],
    keyHint: 'Keys at https://openrouter.ai/keys',
  },
  {
    id: 'custom',
    label: 'Custom base URL',
    baseUrl: '',
    models: [],
    keyHint: 'Use any OpenAI-compatible Chat Completions endpoint.',
  },
]

function isLocalBaseUrl(url: string): boolean {
  try {
    const u = new URL(url.trim())
    const h = u.hostname.toLowerCase()
    return h === 'localhost' || h === '127.0.0.1' || h === '::1'
  } catch {
    return false
  }
}

function maskKey(key: string | undefined): string {
  if (!key) return '(none saved)'
  if (key.length <= 8) return '********'
  return `${key.slice(0, 4)}…${key.slice(-4)}`
}

function parseChoiceIndex(line: string, max: number): number | null {
  const n = Number.parseInt(line.trim(), 10)
  if (!Number.isFinite(n) || n < 1 || n > max) return null
  return n - 1
}

/**
 * Interactive OpenWork provider wizard. Writes ~/.openwork/provider.json and encrypted credentials.
 */
export async function runOpenWorkConfigure(): Promise<void> {
  if (!input.isTTY || !output.isTTY) {
    // biome-ignore lint/suspicious/noConsole: CLI output
    console.error(
      'openwork configure requires an interactive terminal. Set OPENAI_API_KEY, OPENAI_BASE_URL, and OPENAI_MODEL in your environment, or use:\n' +
        '  openwork --model openai/MODEL --baseUrl=URL --apiKey=KEY',
    )
    process.exit(1)
  }

  const rl = readline.createInterface({ input, output })

  const pub = loadOpenWorkPublicConfig()
  const sec = loadOpenWorkSecrets()

  // biome-ignore lint/suspicious/noConsole: CLI output
  console.log('\nOpenWork — configure your OpenAI-compatible LLM provider')
  // biome-ignore lint/suspicious/noConsole: CLI output
  console.log(`Settings are stored under ${OPENWORK_DIR}/ (encrypted API key).\n`)

  if (pub?.baseUrl || pub?.model || sec.openaiApiKey) {
    // biome-ignore lint/suspicious/noConsole: CLI output
    console.log('Current saved profile:')
    // biome-ignore lint/suspicious/noConsole: CLI output
    console.log(`  Base URL: ${pub?.baseUrl ?? '(not set)'}`)
    // biome-ignore lint/suspicious/noConsole: CLI output
    console.log(`  Model:    ${pub?.model ?? '(not set)'}`)
    // biome-ignore lint/suspicious/noConsole: CLI output
    console.log(`  API key:  ${maskKey(sec.openaiApiKey)}\n`)
  }

  // biome-ignore lint/suspicious/noConsole: CLI output
  console.log('Choose a provider:\n')
  PRESETS.forEach((p, i) => {
    // biome-ignore lint/suspicious/noConsole: CLI output
    console.log(`  ${i + 1}. ${p.label}`)
  })
  // biome-ignore lint/suspicious/noConsole: CLI output
  console.log('')

  let preset: Preset
  for (;;) {
    const line = await rl.question(`Enter 1–${PRESETS.length} [1]: `)
    const raw = line.trim() === '' ? '1' : line.trim()
    const idx = parseChoiceIndex(raw, PRESETS.length)
    if (idx !== null) {
      preset = PRESETS[idx]!
      break
    }
    // biome-ignore lint/suspicious/noConsole: CLI output
    console.log('Invalid choice. Try again.')
  }

  let baseUrl = preset.baseUrl
  if (preset.id === 'custom') {
    for (;;) {
      const line = await rl.question('Base URL (must include /v1 for most providers): ')
      const u = line.trim()
      if (u) {
        try {
          void new URL(u)
          baseUrl = u
          break
        } catch {
          // biome-ignore lint/suspicious/noConsole: CLI output
          console.log('That is not a valid URL.')
        }
      } else {
        // biome-ignore lint/suspicious/noConsole: CLI output
        console.log('URL is required for custom.')
      }
    }
  } else {
    const line = await rl.question(`Base URL [${baseUrl}]: `)
    if (line.trim()) {
      try {
        void new URL(line.trim())
        baseUrl = line.trim()
      } catch {
        // biome-ignore lint/suspicious/noConsole: CLI output
        console.log('Invalid URL, keeping default.')
      }
    }
  }

  const local = isLocalBaseUrl(baseUrl)
  let model: string

  if (preset.models.length > 0) {
    // biome-ignore lint/suspicious/noConsole: CLI output
    console.log('\nPick a model:\n')
    preset.models.forEach((m, i) => {
      // biome-ignore lint/suspicious/noConsole: CLI output
      console.log(`  ${i + 1}. ${m}`)
    })
    // biome-ignore lint/suspicious/noConsole: CLI output
    console.log(`  ${preset.models.length + 1}. Other (type model id yourself)\n`)

    for (;;) {
      const line = await rl.question(
        `Enter 1–${preset.models.length + 1} [1]: `,
      )
      const raw = line.trim() === '' ? '1' : line.trim()
      const idx = parseChoiceIndex(raw, preset.models.length + 1)
      if (idx === null) {
        // biome-ignore lint/suspicious/noConsole: CLI output
        console.log('Invalid choice.')
        continue
      }
      if (idx < preset.models.length) {
        model = preset.models[idx]!
        break
      }
      const custom = (await rl.question('Model id: ')).trim()
      if (custom) {
        model = custom
        break
      }
      // biome-ignore lint/suspicious/noConsole: CLI output
      console.log('Model id cannot be empty.')
    }
  } else {
    for (;;) {
      const line = await rl.question('Model id (as expected by the API): ')
      const m = line.trim()
      if (m) {
        model = m
        break
      }
    }
  }

  let openaiApiKey: string | undefined

  // biome-ignore lint/suspicious/noConsole: CLI output
  console.log(`\n${preset.keyHint}`)
  if (local) {
    const line = await rl.question(
      'API key (optional for localhost; press Enter to skip / clear): ',
    )
    openaiApiKey = line.trim() === '' ? '' : line.trim()
  } else {
    const hint =
      sec.openaiApiKey != null && sec.openaiApiKey !== ''
        ? `press Enter to keep ${maskKey(sec.openaiApiKey)}`
        : 'required for this endpoint'
    const line = await rl.question(`API key (${hint}): `)
    if (line.trim() === '') {
      if (sec.openaiApiKey) {
        openaiApiKey = sec.openaiApiKey
      } else {
        // biome-ignore lint/suspicious/noConsole: CLI output
        console.error('\nAn API key is required for non-local providers.')
        await rl.close()
        process.exit(1)
      }
    } else {
      openaiApiKey = line.trim()
    }
  }

  saveOpenWorkProviderState({
    model,
    baseUrl,
    openaiApiKey,
  })

  await rl.close()

  // biome-ignore lint/suspicious/noConsole: CLI output
  console.log('\nSaved. Run `openwork` to start.')
  // biome-ignore lint/suspicious/noConsole: CLI output
  console.log(
    'To use Anthropic only for one session: OPENWORK_SKIP_STORE=1 openwork\n',
  )
}
