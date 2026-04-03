# Dicionário de Variáveis e Parâmetros de Configuração - OpenWork

Documentação completa de todas as variáveis de ambiente, parâmetros de configuração e constantes utilizadas pelo OpenWork.

---

## Índice

1. [Configuração de API (OpenAI-compatível)](#1-configuração-de-api-openai-compatível)
2. [Configuração Anthropic (Nativo)](#2-configuração-anthropic-nativo)
3. [Configuração de Other Model Providers](#3-configuração-de-other-model-providers)
4. [Configuração de Autenticação OAuth](#4-configuração-de-autenticação-oauth)
5. [Configuração do OpenTelemetry (OTEL)](#5-configuração-do-opentelemetry-otel)
6. [Configuração de Tracing e Observabilidade](#6-configuração-de-tracing-e-observabilidade)
7. [Configuração de Feature Flags](#7-configuração-de-feature-flags)
8. [Configuração de UI/Terminal](#8-configuração-de-uiterminal)
9. [Configuração de Performance e Limites](#9-configuração-de-performance-e-limites)
10. [Configuração de Desenvolvimento/Debug](#10-configuração-de-desenvolvimentodebug)
11. [Configuração de Comunicação e Bridge](#11-configuração-de-comunicação-e-bridge)
12. [Configuração de Privacidade e Segurança](#12-configuração-de-privacidade-e-segurança)
13. [Configuração de Parceiros e Integrações](#13-configuração-de-parceiros-e-integrações)
14. [Configuração de Ambiente e Runtime](#14-configuração-de-ambiente-e-runtime)
15. [Chaves do Config Global](#15-chaves-do-config-global)
16. [Chaves do Config de Projeto](#16-chaves-do-config-de-projeto)

---

## 1. Configuração de API (OpenAI-compatível)

### Variáveis Principais

| Variável | Obrigatória | Padrão | Descrição |
|----------|-------------|--------|-----------|
| `CLAUDE_CODE_USE_OPENAI` | Sim | - | Ativa o provider OpenAI. Defina como `1` para habilitar o shim OpenAI-compatível |
| `OPENAI_API_KEY` | *Condicional | - | Chave de API da OpenAI. *Opcional para modelos locais (Ollama, LM Studio) |
| `OPENAI_BASE_URL` | Não | `https://api.openai.com/v1` | URL base da API OpenAI |
| `OPENAI_MODEL` | Sim | `gpt-4o` | Nome do modelo a ser utilizado |
| `OPENAI_API_BASE` | Não | - | Alternativa para `OPENAI_BASE_URL` |

### Codex (ChatGPT)

| Variável | Obrigatória | Padrão | Descrição |
|----------|-------------|--------|-----------|
| `CODEX_API_KEY` | Codex only | - | Token de acesso Codex/ChatGPT |
| `CODEX_AUTH_JSON_PATH` | Codex only | `~/.codex/auth.json` | Caminho para arquivo auth.json do Codex CLI |
| `CODEX_HOME` | Codex only | `~/.codex` | Diretório home alternativo do Codex |

**Modelos Codex Alias:**
- `codexplan` → `gpt-5.4` (high reasoning)
- `codexspark` → `gpt-5.3-codex-spark`

**Exemplos de Provedores:**

```bash
# OpenAI
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-...
export OPENAI_MODEL=gpt-4o

# DeepSeek
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-...
export OPENAI_BASE_URL=https://api.deepseek.com/v1
export OPENAI_MODEL=deepseek-chat

# Ollama (local)
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_MODEL=llama3.3:70b

# Together AI
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=...
export OPENAI_BASE_URL=https://api.together.xyz/v1
export OPENAI_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo

# Groq
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=gsk_...
export OPENAI_BASE_URL=https://api.groq.com/openai/v1
export OPENAI_MODEL=llama-3.3-70b-versatile

# Mistral
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=...
export OPENAI_BASE_URL=https://api.mistral.ai/v1
export OPENAI_MODEL=mistral-large-latest
```

---

## 2. Configuração Anthropic (Nativo)

| Variável | Obrigatória | Padrão | Descrição |
|----------|-------------|--------|-----------|
| `ANTHROPIC_API_KEY` | Para uso nativo | - | Chave API Anthropic |
| `ANTHROPIC_AUTH_TOKEN` | Não | - | Token de autenticação OAuth |
| `ANTHROPIC_BASE_URL` | Não | - | URL base customizada da API |
| `ANTHROPIC_MODEL` | Não | - | Modelo Anthropic a ser usado |
| `ANTHROPIC_BETAS` | Não | - | Beta features habilitadas |
| `ANTHROPIC_UNIX_SOCKET` | Não | - | Socket Unix para conexão |

### Configurações de Modelo

| Variável | Descrição |
|----------|-----------|
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Modelo Sonnet padrão |
| `ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION` | Descrição do modelo Sonnet |
| `ANTHROPIC_DEFAULT_SONNET_MODEL_NAME` | Nome do modelo Sonnet |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Modelo Haiku padrão |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL_DESCRIPTION` | Descrição do Haiku |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME` | Nome do modelo Haiku |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Modelo Opus padrão |
| `ANTHROPIC_DEFAULT_OPUS_MODEL_DESCRIPTION` | Descrição do Opus |
| `ANTHROPIC_DEFAULT_OPUS_MODEL_NAME` | Nome do modelo Opus |
| `ANTHROPIC_SMALL_FAST_MODEL` | Modelo pequeno e rápido |
| `ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION` | Região AWS para modelo rápido |

### AWS Bedrock

| Variável | Descrição |
|----------|-----------|
| `ANTHROPIC_BEDROCK_BASE_URL` | URL base do Bedrock |
| `BEDROCK_BASE_URL` | URL alternativa do Bedrock |
| `AWS_REGION` | Região AWS |
| `AWS_DEFAULT_REGION` | Região AWS padrão |
| `AWS_EXECUTION_ENV` | Ambiente de execução AWS |
| `AWS_LAMBDA_FUNCTION_NAME` | Nome da função Lambda |
| `AWS_BEARER_TOKEN_BEDROCK` | Token Bearer para Bedrock |

### Google Vertex AI

| Variável | Descrição |
|----------|-----------|
| `ANTHROPIC_VERTEX_PROJECT_ID` | ID do projeto Vertex |
| `ANTHROPIC_FOUNDRY_API_KEY` | Chave API do Foundry |
| `ANTHROPIC_FOUNDRY_BASE_URL` | URL base do Foundry |
| `ANTHROPIC_FOUNDRY_RESOURCE` | Recurso do Foundry |
| `VERTEX_BASE_URL` | URL base do Vertex |

---

## 3. Configuração de Other Model Providers

### Google Gemini

| Variável | Descrição |
|----------|-----------|
| `GEMINI_API_KEY` | Chave API Gemini |
| `GOOGLE_API_KEY` | Alias para GEMINI_API_KEY |
| `GEMINI_BASE_URL` | URL base da API Gemini |
| `GEMINI_MODEL` | Modelo Gemini a ser usado |

### Groq

| Variável | Descrição |
|----------|-----------|
| `GROQ_API_KEY` | Chave API Groq |
| `GROQ_MODEL` | Modelo Groq a ser usado |

---

## 4. Configuração de Autenticação OAuth

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_CUSTOM_OAUTH_URL` | URL customizada para OAuth |
| `CLAUDE_BRIDGE_OAUTH_TOKEN` | Token OAuth para bridge |
| `USE_STAGING_OAUTH` | Usar ambiente de staging |
| `USE_LOCAL_OAUTH` | Usar OAuth local |

---

## 5. Configuração do OpenTelemetry (OTEL)

### OpenTelemetry Anthropic (Produção)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `ANT_OTEL_EXPORTER_OTLP_ENDPOINT` | - | Endpoint OTLP Anthropic |
| `ANT_OTEL_EXPORTER_OTLP_HEADERS` | - | Headers OTLP Anthropic |
| `ANT_OTEL_EXPORTER_OTLP_PROTOCOL` | - | Protocolo OTLP (http/protobuf ou grpc) |
| `ANT_OTEL_TRACES_EXPORTER` | - | Exportador de traces |
| `ANT_OTEL_METRICS_EXPORTER` | - | Exportador de métricas |
| `ANT_OTEL_LOGS_EXPORTER` | - | Exportador de logs |

### OpenTelemetry Padrão (Langfuse/Custom)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | - | Endpoint OTLP para traces |
| `OTEL_EXPORTER_OTLP_HEADERS` | - | Headers OTLP (Base64 format) |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | - | Protocolo de exportação |
| `OTEL_EXPORTER_OTLP_TRACES_PROTOCOL` | - | Protocolo para traces |
| `OTEL_EXPORTER_OTLP_LOGS_PROTOCOL` | - | Protocolo para logs |
| `OTEL_EXPORTER_OTLP_METRICS_PROTOCOL` | - | Protocolo para métricas |
| `OTEL_TRACES_EXPORTER` | - | Tipo de exportador de traces |
| `OTEL_METRICS_EXPORTER` | - | Tipo de exportador de métricas |
| `OTEL_LOGS_EXPORTER` | - | Tipo de exportador de logs |
| `OTEL_TRACES_EXPORT_INTERVAL` | - | Intervalo de exportação de traces |
| `OTEL_METRIC_EXPORT_INTERVAL` | - | Intervalo de exportação de métricas |
| `OTEL_LOGS_EXPORT_INTERVAL` | - | Intervalo de exportação de logs |

### Headers Específicos

| Variável | Descrição |
|----------|-----------|
| `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` | Endpoint específico para logs |
| `OTEL_EXPORTER_OTLP_LOGS_HEADERS` | Headers específicos para logs |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | Endpoint para métricas |
| `OTEL_EXPORTER_OTLP_METRICS_HEADERS` | Headers para métricas |
| `OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE` | Certificado cliente |
| `OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY` | Chave cliente |
| `OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE` | Preferência de temporalidade |
| `OTEL_EXPORTER_OTLP_TRACES_HEADERS` | Headers para traces |

### Configuração Langfuse

| Variável | Descrição |
|----------|-----------|
| `LANGFUSE_PUBLIC_KEY` | Chave pública Langfuse |
| `LANGFUSE_SECRET_KEY` | Chave secreta Langfuse |
| `LANGFUSE_BASE_URL` | URL base do Langfuse |

### Logging de Conteúdo

| Variável | Descrição |
|----------|-----------|
| `OTEL_LOG_USER_PROMPTS` | Incluir prompts do usuário nos spans |
| `OTEL_LOG_TOOL_CONTENT` | Incluir conteúdo de ferramentas |
| `OTEL_LOG_TOOL_DETAILS` | Incluir detalhes das ferramentas |

---

## 6. Configuração de Tracing e Observabilidade

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `CLAUDE_CODE_ENABLE_TELEMETRY` | - | Habilitar telemetria |
| `CLAUDE_CODE_ENHANCED_TELEMETRY_BETA` | - | Telemetria beta aprimorada |
| `ENABLE_BETA_TRACING_DETAILED` | - | Tracing detalhado beta |
| `BETA_TRACING_ENDPOINT` | - | Endpoint para tracing beta |
| `CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS` | - | Timeout para flush OTEL |
| `CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS` | - | Timeout para shutdown OTEL |
| `CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS` | - | Debounce do helper de headers |
| `DEFAULT_OTEL_HEADERS_DEBOUNCE_MS` | - | Debounce padrão de headers |
| `ANT_CLAUDE_CODE_METRICS_ENDPOINT` | - | Endpoint de métricas Anthropic |

---

## 7. Configuração de Feature Flags

### Switches Principais

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_USE_OPENAI` | Usar provider OpenAI (1=habilitado) |
| `CLAUDE_CODE_ENABLE_TASKS` | Habilitar sistema de tasks |
| `CLAUDE_CODE_ENABLE_TELEMETRY` | Habilitar telemetria |
| `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` | Anexar uso de tokens |
| `CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING` | Streaming granular de ferramentas |
| `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION` | Sugestões de prompt |
| `CLAUDE_CODE_ENABLE_SDK_FILE_CHECKPOINTING` | Checkpointing de arquivos SDK |
| `CLAUDE_CODE_ENABLE_CFC` | Habilitar CFC |
| `CLAUDE_CODE_ENABLE_XAA` | Habilitar XAA |

### Switches de Desabilitação

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_DISABLE_1M_CONTEXT` | Desabilitar contexto 1M |
| `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING` | Desabilitar thinking adaptativo |
| `CLAUDE_CODE_DISABLE_ADVISOR_TOOL` | Desabilitar ferramenta advisor |
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | Desabilitar anexos |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | Desabilitar memória automática |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | Desabilitar tasks em background |
| `CLAUDE_CODE_DISABLE_CLAUDE_MDS` | Desabilitar arquivos CLAUDE.md |
| `CLAUDE_CODE_DISABLE_COMMAND_INJECTION_CHECK` | Desabilitar checagem de injection |
| `CLAUDE_CODE_DISABLE_CRON` | Desabilitar cron |
| `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` | Desabilitar betas experimentais |
| `CLAUDE_CODE_DISABLE_FAST_MODE` | Desabilitar modo rápido |
| `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY` | Desabilitar pesquisa |
| `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING` | Desabilitar checkpointing |
| `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS` | Desabilitar instruções git |
| `CLAUDE_CODE_DISABLE_LEGACY_MODEL_REMAP` | Desabilitar remapeamento legado |
| `CLAUDE_CODE_DISABLE_MESSAGE_ACTIONS` | Desabilitar ações de mensagem |
| `CLAUDE_CODE_DISABLE_MOUSE` | Desabilitar mouse |
| `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` | Desabilitar cliques de mouse |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Desabilitar tráfego não essencial |
| `CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK` | Desabilitar fallback não-streaming |
| `CLAUDE_CODE_DISABLE_OFFICIAL_MARKETPLACE_AUTOINSTALL` | Desabilitar auto-instalação |
| `CLAUDE_CODE_DISABLE_POLICY_SKILLS` | Desabilitar skills de policy |
| `CLAUDE_CODE_DISABLE_PRECOMPACT_SKIP` | Desabilitar skip de precompact |
| `CLAUDE_CODE_DISABLE_SESSION_DATA_UPLOAD` | Desabilitar upload de sessão |
| `CLAUDE_CODE_DISABLE_TERMINAL_TITLE` | Desabilitar título do terminal |
| `CLAUDE_CODE_DISABLE_THINKING` | Desabilitar thinking |
| `CLAUDE_CODE_DISABLE_VIRTUAL_SCROLL` | Desabilitar scroll virtual |

---

## 8. Configuração de UI/Terminal

### Temas e Aparência

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `BAT_THEME` | - | Tema para syntax highlighting |
| `CLAUDE_CODE_THEME` | `dark` | Tema do Claude Code |

### Editor

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `EDITOR` | `vim` | Editor padrão |
| `VISUAL` | - | Editor visual |

### Terminal

| Variável | Descrição |
|----------|-----------|
| `TERM` | Tipo de terminal |
| `TERM_PROGRAM` | Programa do terminal |
| `TERM_PROGRAM_VERSION` | Versão do programa |
| `TERMINAL` | Terminal alternativo |
| `TERMINAL_EMULATOR` | Emulador de terminal |
| `TMUX` | Indica execução no tmux |
| `TMUX_PANE` | ID do painel tmux |
| `STY` | Screen session ID |
| `SHELL` | Shell padrão |
| `CLAUDE_CODE_FORCE_FULL_LOGO` | Forçar logo completa |
| `CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR` | Mostrar indicador de sandbox |

### Notificações

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_PREFFERED_NOTIF_CHANNEL` | Canal de notificação preferido |
| `taskCompleteNotifEnabled` | Notificação de task completa |
| `inputNeededNotifEnabled` | Notificação de input necessário |
| `agentPushNotifEnabled` | Notificação push de agente |

---

## 9. Configuração de Performance e Limites

### API e Tokens

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `API_TIMEOUT_MS` | - | Timeout da API em ms |
| `API_MAX_INPUT_TOKENS` | - | Máximo de tokens de input |
| `API_TARGET_INPUT_TOKENS` | - | Target de tokens de input |
| `BASH_MAX_OUTPUT_LENGTH` | - | Tamanho máximo de saída do Bash |
| `TASK_MAX_OUTPUT_LENGTH` | - | Tamanho máximo de saída de task |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET` | - | Budget de caracteres para comandos slash |
| `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` | - | Limite de tokens para leitura de arquivo |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | - | Override do limite de blocking |

### Compactação e Auto-compact

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_AUTO_COMPACT_WINDOW` | Janela de auto-compact |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | Override de porcentagem |
| `CLAUDE_AFTER_LAST_COMPACT` | Após último compact |
| `CLAUDE_CODE_DISABLE_PRECOMPACT_SKIP` | Desabilitar precompact skip |

---

## 10. Configuração de Desenvolvimento/Debug

### Logging

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_DEBUG_LOG_LEVEL` | Nível de log debug |
| `CLAUDE_CODE_DEBUG_LOGS_DIR` | Diretório de logs de debug |
| `CLAUDE_CODE_DIAGNOSTICS_FILE` | Arquivo de diagnósticos |
| `DEBUG` | Debug geral |
| `VERBOSE` | Modo verbose |
| `CLAUDE_CODE_VERBOSE` | Verbose específico |

### Debug Features

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_DEBUG_REPAINTS` | Debug de repaints |
| `CLAUDE_CODE_FRAME_TIMING_LOG` | Log de timing de frames |
| `CLAUDE_CODE_EAGER_FLUSH` | Flush antecipado |
| `CLAUDE_CODE_EXIT_AFTER_FIRST_RENDER` | Sair após primeiro render |
| `CLAUDE_CODE_EXIT_AFTER_STOP_DELAY` | Delay para sair após stop |
| `CLAUDE_CODE_DUMP_AUTO_MODE` | Dump de auto mode |

### Teste

| Variável | Descrição |
|----------|-----------|
| `TEST_ENABLE_SESSION_PERSISTENCE` | Habilitar persistência de sessão |
| `VCR_RECORD` | Gravação VCR |
| `SWE_BENCH_INSTANCE_ID` | ID da instância SWE-Bench |
| `SWE_BENCH_RUN_ID` | ID do run SWE-Bench |
| `SWE_BENCH_TASK_ID` | ID da task SWE-Bench |

---

## 11. Configuração de Comunicação e Bridge

### Bridge/CCR

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_CCR_MIRROR` | Mirror CCR |
| `CCR_ENABLE_BUNDLE` | Habilitar bundle CCR |
| `CCR_FORCE_BUNDLE` | Forçar bundle CCR |
| `CLAUDE_BRIDGE_BASE_URL` | URL base do bridge |
| `CLAUDE_BRIDGE_SESSION_INGRESS_URL` | URL de ingress da sessão |
| `SESSION_INGRESS_URL` | URL de ingress da sessão |
| `CLAUDE_BRIDGE_USE_CCR_V2` | Usar CCR v2 |

### Multi-Agente

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_AGENT` | Agente ativo |
| `CLAUDE_CODE_AGENT_ID` | ID do agente |
| `CLAUDE_CODE_AGENT_NAME` | Nome do agente |
| `CLAUDE_CODE_AGENT_COLOR` | Cor do agente |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | Equipes de agentes experimentais |
| `CLAUDE_CODE_AGENT_LIST_IN_MESSAGES` | Listar agentes em mensagens |
| `CLAUDE_CODE_COORDINATOR_MODE` | Modo coordenador |
| `CLAUDE_CODE_COWORKER_TYPE` | Tipo de coworker |
| `COWORKER_TYPE_TELEMETRY` | Telemetria do tipo coworker |

---

## 12. Configuração de Privacidade e Segurança

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_ADDITIONAL_PROTECTION` | Proteção adicional |
| `CLAUDE_CODE_BUBBLEWRAP` | Bubblewrap habilitado |
| `CLAUDE_CODE_FORCE_SANDBOX` | Forçar sandbox |
| `CLAUDE_CODE_DONT_INHERIT_ENV` | Não herdar env |
| `NO_PROXY` | Proxy desabilitado |
| `no_proxy` | Proxy desabilitado (lowercase) |
| `SSL_CERT_FILE` | Arquivo de certificado SSL |
| `NODE_EXTRA_CA_CERTS` | Certificados CA extras |

---

## 13. Configuração de Parceiros e Integrações

### Git

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_BASE_REF` | Referência base para git |
| `CLAUDE_CODE_COMMIT_LOG` | Log de commits |
| `CLAUDE_CODE_GIT_BASH_PATH` | Caminho do Git Bash |

### Contêiner/Cloud

| Variável | Descrição |
|----------|-----------|
| `CLAUDE_CODE_CONTAINER_ID` | ID do container |
| `CI` | Ambiente CI |
| `CF_PAGES` | Cloudflare Pages |
| `CIRCLECI` | CircleCI |
| `BUILDKITE` | Buildkite |
| `VERCEL` | Vercel |
| `NETLIFY` | Netlify |
| `RAILWAY_ENVIRONMENT_NAME` | Ambiente Railway |
| `RAILWAY_SERVICE_NAME` | Serviço Railway |
| `RENDER` | Render |
| `REPL_ID` | Replit ID |
| `REPL_SLUG` | Replit slug |

### MCP (Model Context Protocol)

| Variável | Descrição |
|----------|-----------|
| `ALLOW_ANT_COMPUTER_USE_MCP` | Permitir MCP de computer use |
| `MCP_XAA_IDP_CLIENT_SECRET` | Client secret MCP XAA |

---

## 14. Configuração de Ambiente e Runtime

### Paths

| Variável | Descrição |
|----------|-----------|
| `HOME` | Diretório home |
| `USER` | Usuário |
| `USERNAME` | Nome de usuário |
| `USERPROFILE` | Perfil do usuário (Windows) |
| `PWD` | Diretório atual |
| `TEMP` | Diretório temp |
| `TMPDIR` | Diretório temp |
| `XDG_CONFIG_HOME` | Config home XDG |
| `PATH` | Path do sistema |
| `APPDATA` | AppData (Windows) |

### Node.js

| Variável | Descrição |
|----------|-----------|
| `NODE_ENV` | Ambiente Node (development/production) |
| `NODE_OPTIONS` | Opções do Node |
| `UV_THREADPOOL_SIZE` | Tamanho do threadpool |

### Runtime

| Variável | Descrição |
|----------|-----------|
| `RUNNER_ENVIRONMENT` | Ambiente do runner |
| `RUNNER_OS` | OS do runner |

---

## 15. Chaves do Config Global

Configurações persistentes armazenadas em `~/.claude/config.json`:

| Chave | Tipo | Descrição |
|-------|------|-----------|
| `apiKeyHelper` | string | @deprecated - Helper de API key |
| `installMethod` | string | Método de instalação |
| `autoUpdates` | boolean | Atualizações automáticas |
| `autoUpdatesProtectedForNative` | boolean | Proteção para updates nativos |
| `theme` | string | Tema (`dark`, `light`, `system`) |
| `verbose` | boolean | Modo verbose |
| `preferredNotifChannel` | string | Canal de notificação preferido |
| `shiftEnterKeyBindingInstalled` | boolean | Keybinding Shift+Enter |
| `editorMode` | string | Modo do editor (`normal`, `vim`) |
| `hasUsedBackslashReturn` | boolean | Usou backslash return |
| `autoCompactEnabled` | boolean | Auto-compact habilitado |
| `showTurnDuration` | boolean | Mostrar duração do turno |
| `diffTool` | string | Ferramenta de diff |
| `env` | object | Variáveis env persistentes |
| `tipsHistory` | object | Histórico de dicas |
| `todoFeatureEnabled` | boolean | Feature TODO habilitada |
| `showExpandedTodos` | boolean | Mostrar TODOs expandidos |
| `messageIdleNotifThresholdMs` | number | Threshold de notificação idle |
| `autoConnectIde` | boolean | Auto-conectar IDE |
| `autoInstallIdeExtension` | boolean | Auto-instalar extensão IDE |
| `fileCheckpointingEnabled` | boolean | Checkpointing habilitado |
| `terminalProgressBarEnabled` | boolean | Barra de progresso no terminal |
| `showStatusInTerminalTab` | boolean | Mostrar status na aba |
| `taskCompleteNotifEnabled` | boolean | Notificação de task completa |
| `inputNeededNotifEnabled` | boolean | Notificação de input |
| `agentPushNotifEnabled` | boolean | Notificação push do agente |
| `respectGitignore` | boolean | Respeitar .gitignore |
| `claudeInChromeDefaultEnabled` | boolean | Claude no Chrome padrão |
| `hasCompletedClaudeInChromeOnboarding` | boolean | Onboarding Chrome completo |
| `lspRecommendationDisabled` | boolean | Desabilitar recomendação LSP |
| `lspRecommendationNeverPlugins` | array | Plugins nunca recomendados |
| `lspRecommendationIgnoredCount` | number | Contador de ignorados |
| `copyFullResponse` | boolean | Copiar resposta completa |
| `copyOnSelect` | boolean | Copiar ao selecionar |
| `permissionExplainerEnabled` | boolean | Explicador de permissões |
| `prStatusFooterEnabled` | boolean | Footer de status PR |
| `remoteControlAtStartup` | boolean | Controle remoto no startup |
| `remoteDialogSeen` | boolean | Diálogo remoto visto |

---

## 16. Chaves do Config de Projeto

Configurações específicas do projeto (armazenadas por path):

| Chave | Tipo | Descrição |
|-------|------|-----------|
| `allowedTools` | array | Ferramentas permitidas |
| `mcpContextUris` | array | URIs de contexto MCP |
| `mcpServers` | object | Configuração de servidores MCP |
| `hasTrustDialogAccepted` | boolean | Trust dialog aceito |
| `hasCompletedProjectOnboarding` | boolean | Onboarding completo |
| `projectOnboardingSeenCount` | number | Contador de onboarding |
| `hasClaudeMdExternalIncludesApproved` | boolean | Includes externos aprovados |
| `hasClaudeMdExternalIncludesWarningShown` | boolean | Aviso de includes mostrado |
| `enabledMcpjsonServers` | array | Servidores MCP.json habilitados |
| `disabledMcpjsonServers` | array | Servidores MCP.json desabilitados |
| `enableAllProjectMcpServers` | boolean | Habilitar todos MCP do projeto |
| `disabledMcpServers` | array | Servidores MCP desabilitados |
| `enabledMcpServers` | array | Servidores MCP habilitados |
| `activeWorktreeSession` | object | Sessão worktree ativa |
| `remoteControlSpawnMode` | string | Modo de spawn (same-dir/worktree) |
| `exampleFiles` | array | Arquivos de exemplo |
| `exampleFilesGeneratedAt` | number | Timestamp de geração |

---

## Exemplo de Arquivo .env Completo

```bash
# ===== Provider OpenAI (Obrigatório para OpenWork) =====
CLAUDE_CODE_USE_OPENAI=1
OPENAI_API_KEY=sua-chave-aqui
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o

# ===== Alternativa: Together AI =====
# OPENAI_BASE_URL=https://api.together.xyz/v1
# OPENAI_MODEL=moonshotai/Kimi-K2.5

# ===== Alternativa: Ollama Local =====
# OPENAI_BASE_URL=http://localhost:11434/v1
# OPENAI_MODEL=llama3.3:70b

# ===== Telemetria e Observabilidade =====
CLAUDE_CODE_ENABLE_TELEMETRY=1
ENABLE_BETA_TRACING_DETAILED=1

# Langfuse OTLP
BETA_TRACING_ENDPOINT=https://us.cloud.langfuse.com/api/public/otel
OTEL_EXPORTER_OTLP_HEADERS=Authorization="Basic base64encoded"
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_BASE_URL=https://us.cloud.langfuse.com

# Logging de conteúdo
OTEL_LOG_USER_PROMPTS=1
OTEL_LOG_TOOL_CONTENT=1

# ===== Outros Providers (alternativas) =====
# GROQ_API_KEY=gsk_...
# GEMINI_API_KEY=AIzaSy...
# GOOGLE_API_KEY=AIzaSy...

# ===== Features =====
CLAUDE_CODE_ENABLE_TASKS=1
CLAUDE_CODE_ENABLE_XAA=1

# ===== Desabilitações opcionais =====
# CLAUDE_CODE_DISABLE_FAST_MODE=1
# CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

---

## Referência de Constantes do Sistema

### Canais de Notificação

```typescript
['auto', 'iterm2', 'iterm2_with_bell', 'terminal_bell', 'kitty', 'ghostty', 'notifications_disabled']
```

### Modos de Editor

```typescript
['normal', 'vim']
```

### Modos de Teammate

```typescript
['auto', 'tmux', 'in-process']
```

---

*Documentação gerada para OpenWork v0.1.4*
