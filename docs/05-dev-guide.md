# Developer Guide — Project Tony

> Phase 1 focus: run **pure Letta Code** — install, connect an LLM, create the "Tony"
> agent, and verify memory — **without building any extra UI/frontend**.

## 1. Local Prerequisites

- **Git**
- **Docker Desktop** (Linux containers) — *recommended runtime; see § 2.1*
- **Node.js 22.19+ + Bun** — only for the non-Docker runtime options

## 2. Local Setup

### 2.1 Runtime options (pick one)

| Option | Command | When to use |
|--------|---------|-------------|
| **Docker (recommended)** | `docker compose run --rm tony` | Runs the **engine source** from this repo in a Linux container; no Windows native-deps pain; local patches take effect |
| Source (dev) | `bun install && bun run dev` | Same code path as Docker, on the host directly |
| npm global | `npm install -g @letta-ai/letta-code` | Upstream release binary — **does not execute this repo's code**; use only as a fallback |

> Philosophy note: Tony treats this repo as its native engine. The Docker image
> (`docker/Dockerfile`) builds and runs the engine source via `bun run dev`, so any
> local modification is live. The upstream-provided npm package (`@letta-ai/letta-code`)
> installs from npm and does **not** have this property.

**Docker usage:**

```powershell
docker compose build                 # build the engine image (vendored source)
docker compose run --rm tony         # interactive CLI session
# tip: alias it, e.g. in PowerShell profile:
#   function letta { docker compose run --rm tony @args }
```

- Agent state/memory persists in the named volume `tony-state` (`/root/.letta`).
- API keys go through environment variables (uncomment `env_file: [.env]` in
  `compose.yaml`; never commit `.env`) or `/connect` inside the session.
- Mount directories Tony should access under `/workspace` (see commented example in
  `compose.yaml`).

### 2.2 Launch & first-run backend choice

```powershell
# with the Docker runtime (or `letta` if you use the alias/host install):
docker compose run --rm tony backend local   # once: make local the saved default backend
docker compose run --rm tony                 # then launch the interactive CLI
```

- On first run a local agent is created automatically; state is stored locally,
  **no login required**. Without a saved backend, first-run setup may offer Letta
  Cloud sign-in — pick **local mode** (or set `backend local` as above).
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
├── src/               # engine source (moved from letta-code/ to root)
├── docs/
│   ├── app/           # native application documentation (curated from letta-code)
│   └── 01–10          # major development plan
└── README.md
```

### Engine source & documentation ownership

The engine source was vendored from Letta Code release **v0.30.32** (commit `1e78870`).
The vendored `letta-code/` directory has been moved to root level for cleaner project
structure. To re-vendor from upstream:

```powershell
# Remove current source and clone fresh from upstream release
git rm -rf src
git clone --depth 1 --branch vX.Y.Z https://github.com/letta-ai/letta-code src
# then re-pin the version in README.md, NOTICE, and this document,
# and manually sync docs/app/ against the upstream release notes/changelog
```

> `docs/app/` is owned by this project (curated from upstream). Re-vendoring resets
> only `src/`; the curated docs must be synced by hand per release.

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
