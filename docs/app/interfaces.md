# Tony Interfaces

> Documentation of Tony's native engine (vendored Letta Code v0.30.32).
> Curated snapshot owned by the Tony project; sync manually on re-vendor.

All interfaces below are first-party: none require custom UI code.

## CLI (primary interface — Phase 1)

```bash
letta                # interactive TUI; local agent is created automatically on first run
```

Key slash commands inside the TUI:

| Command | Purpose |
|---|---|
| `/connect` | Connect an LLM provider (OpenAI/ChatGPT, Anthropic, Z.ai, Ollama, LM Studio, ...) — some support OAuth |
| `/model` | Switch model |
| `/new`, `/resume` | New conversation / continue a previous one |
| `/agent` | Switch between agents |
| `/search` | Search across messages and agents |
| `/skills` | View skills · `/skill-creator` create one |
| `/palace`, `/doctor`, `/sleeptime` | Inspect, audit, and train memory |
| `/memory-repository set <git-url>` | Sync MemFS context to a git repository |
| `/hooks`, `/permissions`, `/cron`, `/mods`, `/secret` | Automation & policy management |

Create a dedicated agent from preset:

```bash
letta --new-agent --personality tutorial
```

### Headless / scripting

```bash
letta -p --agent <agent-id> "message"   # one-shot message, prints response, exits
letta --agent <agent-id>                # continue a specific agent interactively
```

## Desktop app

First-party desktop app for Windows/macOS/Linux. It shares the same local state
(`~/.letta`) as the CLI, so agents created in either place appear in both.
Branding is Letta's; a Tony-branded client would be a separate project later
(see App Server below).

## Channels (Telegram, Slack, Discord, WhatsApp, Signal)

Chat with the same self-hosted agent from messaging apps:

```bash
letta server --backend local --channels telegram     # or slack,discord,whatsapp,signal
letta server --install-channel-runtimes              # install missing runtime deps
```

This is the zero-code way to get a "Tony in your pocket" before any custom mobile app exists.

## App Server (self-hosted "cloud")

The App Server exposes agents over WebSocket and HTTP so external clients can talk to them:

```bash
# loopback only (default posture, see ADR-007)
letta server --listen ws://127.0.0.1:4500

# non-loopback with authentication
letta server --listen ws://0.0.0.0:4500 \
  --ws-auth capability-token --ws-token-file /path/to/token
  # alternative: signed-bearer-token (+ --ws-shared-secret-file/--ws-issuer/--ws-audience)

# also expose an OpenAI-compatible REST API (/v1/models, /v1/chat/completions, /v1/responses;
# each agent is exposed as a model)
letta server --openai-api
```

Client integration paths:

1. **WebSocket protocol** — documented protocol types live in `letta-code/src/types/app-server-protocol.ts`;
   the npm package exports an official client library (`app-server-client.js`) usable by Node/Electron/Tauri apps.
2. **OpenAI-compatible REST API** — simplest path for third-party clients (including a future Android app):
   anything that can call the OpenAI API can talk to Tony.

State stays wherever the server runs (`~/.letta`). Tools execute on the machine running the
harness — file access never routes through any cloud.

## Remote environments (requires Letta Cloud sign-in)

Register machines as execution environments for cloud-stored agents (`--env-name`,
`letta environments list`, `--environment "work-laptop"`). Out of scope for self-hosted
Tony per ADR-002/ADR-010; noted here for completeness.
