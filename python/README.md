# python/

Experimental Python utilities for OpenWork. These are standalone modules — they are **not** part of the main Node/Bun build pipeline.

## Modules

| File | Purpose |
|------|---------|
| `ollama_provider.py` | Async Ollama HTTP client: chat, streaming, Anthropic-to-Ollama message translation |
| `smart_router.py` | Multi-provider auto-router: scores providers by latency/cost/health and routes requests optimally |

## Setup

```bash
pip install -r requirements.txt
```

## Status

These modules are experimental. `smart_router.py` is designed to integrate with a `server.py` HTTP layer (not yet implemented in this repo).
