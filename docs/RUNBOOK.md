# OpenWork — Runbook

Operational reference for running this codebase: wire any **OpenAI Chat Completions–compatible** endpoint, keep machine-local profiles out of git, and debug provider issues with the built-in checks.

---

## 1. What you have

- A CLI agent loop with file, terminal, and web tools — same UX regardless of backend.
- All model traffic goes through the OpenAI-shaped path: `OPENAI_BASE_URL`, `OPENAI_MODEL`, and `OPENAI_API_KEY` (omitted when the host does not require one).
- Repo-local profiles: `profile:init` writes `.openwork-profile.json`; `dev:profile` loads it and starts the CLI after `doctor:runtime`.
- Diagnostics: `doctor:runtime`, `doctor:runtime:json`, `doctor:report`, plus `smoke` / `hardening:*` from `package.json`.

> Installed-from-npm users typically use `openwork configure` and `~/.openwork/` instead of `.openwork-profile.json`; the environment variables are the same.

---

## 2. Mental model

One harness, many hosts. Three knobs:

1. A base URL that speaks **Chat Completions** (`…/v1` on most vendors).
2. The model string your host expects.
3. An API key when the host requires it; omit or leave empty for most LAN endpoints.

`profile:init` supports `openai`, `ollama`, `codex`, and `gemini` presets. You can override `--base-url` and `--model` on any run. For a host not covered by a preset, start from `openai` and point `--base-url` at your gateway (OpenRouter, DeepSeek, Azure OpenAI, etc.).

---

## 3. Daily start

```bash
bun run dev:profile
```

`dev:profile` runs `doctor:runtime` first. If it passes, the CLI starts.

---

## 4. Creating or switching a profile

Each of the following overwrites `.openwork-profile.json` in the current directory:

```bash
# Remote OpenAI-compatible (key required)
bun run profile:init -- --provider openai --api-key sk-... --model gpt-5.2

# Local Ollama (key optional)
bun run profile:init -- --provider ollama --model llama3.1:8b

# Auto-detect: uses Ollama if localhost:11434 responds, otherwise OpenAI
bun run profile:init

# Codex
bun run profile:init -- --provider codex --model codexplan

# Gemini
bun run profile:init -- --provider gemini --api-key ... --model gemini-2.0-flash

# Custom base URL
bun run profile:init -- --provider openai --base-url https://api.example.com/v1 --api-key ... --model your-model-id
```

Inspect the result:

```bash
cat .openwork-profile.json
```

---

## 5. Diagnostics

```bash
bun run doctor:runtime
bun run doctor:runtime:json
bun run doctor:report    # writes reports/doctor-runtime.json
```

Hardening checks:

```bash
bun run hardening:check
bun run hardening:strict
```

---

## 6. Provider reference

| Mode | `OPENAI_BASE_URL` | Key |
|------|-------------------|-----|
| OpenAI API | `https://api.openai.com/v1` | Required |
| Other HTTPS Chat Completions host | Vendor URL + `/v1` | If required |
| LAN OpenAI-compatible (Ollama, LM Studio…) | `http://localhost:11434/v1` | Usually omitted |
| Codex preset | From `providerConfig` default | `CODEX_API_KEY` or CLI auth file |
| Gemini preset | Gemini-specific env | `GEMINI_API_KEY` |

`doctor:runtime` treats localhost-style base URLs as local for key requirements; remote URLs without a key fail early.

---

## 7. Troubleshooting

### `Script not found "dev"`

Not in the repo root, or deps missing. `cd` to this repository and run `bun install`.

### `Provider reachability failed`

- Confirm the URL matches the vendor's Chat Completions base (trailing `/v1` is common).
- For a local process: start it, then re-run `doctor:runtime`.

### `Missing key for non-local provider URL`

Remote endpoint without `OPENAI_API_KEY`. Add a real key via `profile:init` or env.

### Placeholder key rejected

Replace with a real key. Local profiles should use a localhost base URL if no cloud key is intended.

### Codex / Gemini errors

Both paths have extra requirements (Codex auth file, Gemini API key). Fix credentials, then re-run `doctor:runtime`.

---

## 8. Model selection

- Tool-calling quality matters more than benchmark scores for this CLI.
- Smaller local models are useful for latency experiments; expect weaker tool chains.
- After changing model, confirm the session shows the new ID and run a short task to validate tool calls work.

---

## 9. Operational rules

- Run `doctor:runtime` before chasing "model weirdness."
- Prefer `dev:profile` over manually setting env vars across shells.
- Keep `.openwork-profile.json` local (gitignored). Never commit keys.
- Capture `doctor:report` when reproducing a provider issue with someone else.

---

## 10. Recovery sequence

```bash
bun run doctor:runtime
bun run doctor:report
bun run smoke
```

If using a local daemon (e.g. Ollama) and doctor says unreachable: start the daemon, wait for the HTTP endpoint to respond, then repeat `doctor:runtime`.

---

## 11. Command reference

```bash
# Profiles
bun run profile:init
bun run profile:init -- --provider openai --api-key sk-... --model gpt-5.2
bun run profile:init -- --provider ollama --model llama3.1:8b
bun run profile:init -- --provider codex --model codexplan
bun run profile:init -- --provider gemini --api-key ... --model gemini-2.0-flash

# Launch
bun run dev:profile
bun run dev:profile -- ollama
bun run dev:profile -- openai

# Diagnostics
bun run doctor:runtime
bun run doctor:runtime:json
bun run doctor:report

# Quality
bun run smoke
bun run hardening:check
bun run hardening:strict
```

---

## 12. Success criteria

- `bun run doctor:runtime` passes reachability and credential checks for your chosen base URL.
- `bun run dev:profile` starts the CLI without provider errors.
- The active model ID matches what you configured in the profile.
