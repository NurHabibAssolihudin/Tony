# Developer Guide — Project Tony

> Phase 1 focus: run **pure Letta Code** — install, connect an LLM, create the "Tony"
> agent, and verify memory — **without building any extra UI/frontend**.

## 1. Local Prerequisites

- **Git**
- **Node.js 22.19+** (`node --version`)
- **Python 3 + make + g++** (for Letta native deps during install)
- **Docker/systemd** (optional, for an always-on App Server)

## 2. Local Setup

### 2.1 Install the Letta Code CLI

```powershell
# install CLI (native compile -> needs python/make/g++)
npm install -g @letta-ai/letta-code
```

### 2.2 Launch the CLI & create the "Tony" agent

```powershell
# open your working directory, then:
letta
```

- On first run a local agent is created automatically; state is stored locally,
  **no login required**.
- You can also create an agent from a preset:

```powershell
letta --new-agent --personality tutorial   # demo agent
```

- Main slash commands inside the CLI:
  - `/connect` — connect an LLM provider (OpenAI/ChatGPT, Anthropic, Ollama, LM Studio, Z.ai, etc.)
  - `/model` — pick a model
  - `/new` — start a new conversation · `/resume` — continue one
  - `/agent` — switch agents · `/search` — search messages/agents · `/help` — help
  - `/skills` — view skills · `/palace`, `/doctor`, `/sleeptime` — memory audit/management
- **Headless / non-interactive:**

```powershell
letta -p --agent <agent-id> "message"        # send one message
letta --agent <agent-id>                     # continue a specific agent
```

### 2.3 Verify cross-conversation memory

```powershell
# 1) Tell Tony something, note its answer
# 2) Exit (Ctrl+D), run letta again, then /new for a fresh conversation
# 3) Ask: "What did I tell you earlier?" -> Tony must remember
```

Optionally inspect memory state via subcommands:

```powershell
letta memory status --agent <agent-id>
letta memory diff --agent <agent-id>
```

### 2.4 App Server (optional — always-on / remote)

```powershell
letta server --backend local --listen ws://127.0.0.1:4500
```

- The process prints its base URL on start.
- State/memory is stored in `~/.letta` (MemFS, git-backed).
- > **Windows:** make sure `python`, `make` (via mingw/choco), and `g++` are available; or use
  > WSL/Docker for convenience.

## 3. Repository Layout

```
tony/
├── letta-code/        # vendored engine source (pinned v0.30.32, reference/dev)
├── docs/
│   ├── app/           # native application documentation (curated from letta-code)
│   └── 01–10          # major development plan
└── README.md
```

### Vendored engine & documentation ownership

The engine is vendored as a plain copy (no `.git`) from an upstream **release tag**,
currently **v0.30.32** (commit `1e78870`). To update the vendor:

```powershell
Remove-Item -Recurse -Force letta-code
git clone --depth 1 --branch vX.Y.Z https://github.com/letta-ai/letta-code letta-code
Remove-Item -Recurse -Force letta-code\.git
# then re-pin the version in README.md, NOTICE, and this document,
# and manually sync docs/app/ against the upstream release notes/changelog
```

> `docs/app/` is owned by this project (moved out of `letta-code/`). Re-vendoring resets
> only `letta-code/`; the curated docs must be synced by hand per release.

## 4. Other Interfaces (out of Phase 1 scope)

Letta Code ships first-party interfaces that need zero custom code — recorded here for
reference:

- **Channels:** `letta server --backend local --channels telegram` (also slack, discord,
  whatsapp, signal) → chat from messaging apps you already use.
- **Desktop app** (Windows/macOS/Linux) — Letta branding.
- **chat.letta.com** — **cloud-only**, cannot be used with self-hosted agents.

Decisions about additional interfaces are postponed (ADR-010).

## 5. Conventions & Workflow

- **Commits:** conventional commits (`feat:`, `fix:`, `docs:`).
- **Documentation:** every new decision → add an ADR (`docs/09-adr.md`).
- **Language:** project documentation is written in English.

## 6. Validation (Phase 1)

- [ ] `letta` runs & LLM connected (`/connect`)
- [ ] Interactive chat works
- [ ] Cross-session memory verified (§ 2.3)
- [ ] (Optional) App Server `letta server` alive
- [ ] (Optional) Scheduled backup of `~/.letta`

## 7. Common Troubleshooting

| Problem | Solution |
|---------|----------|
| `letta` not recognized | `npm install -g @letta-ai/letta-code`; check PATH |
| Native build fails | Install python3/make/g++; try WSL/Docker |
| Model not responding | Re-run `/connect`; check API key; switch model via `/model` |
| Memory lost after restart | Make sure `~/.letta` was not deleted; back up regularly |
| Port conflict | Change the port via the `--listen` flag |

## 8. Security Notes

- Never expose the App Server directly to the public internet.
- Store API keys safely (keyring / local `.env`, never committed).

## 9. License Notes

- Letta: **Apache 2.0** — include attribution/NOTICE when distributing.
- Automation component (Phase 2): undecided (see `10-eval-activepieces.md`).
