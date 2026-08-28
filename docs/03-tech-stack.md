# Tech Stack — Project Tony

## 1. Summary

Tony runs purely on **Letta Code** (Apache 2.0) as the assistant brain and CLI interface.
There is no custom frontend, no Agent SDK application, and the automation component
(Phase 2) is still **under evaluation**.

## 2. Phase 1 Stack — Letta Code (stateful agent + CLI)

### 2.1 Runtime & Install

| Component | Technology | Why |
|----------|-----------|-----|
| Harness / CLI | **`@letta-ai/letta-code`** (npm, Node 22.19+) | The official way to run Letta; interactive CLI |
| Package runtime | **Bun** (bun.lock, internal bundling) | Letta's official package manager/build |
| Native deps | **Python 3 + make + g++** | Required at install time (native compile) |
| App Server (optional) | `letta server --backend local --listen ws://127.0.0.1:4500` | Always-on / remote access via SSH |
| Model inference | Providers via CLI: OpenAI, Anthropic, Ollama, LM Studio, etc. | Model-agnostic (`/connect`, `/model`) |
| Storage | **MemFS** (git-based agent memory) in `~/.letta/...` | Local state & memory, easy to back up |

### 2.2 License

- **Apache 2.0** — permissive: commercial use, modification, distribution, and paid
  derivatives allowed; attribution/NOTICE only.

## 3. Interfaces (Phase 1)

| Interface | Status | Notes |
|-----------|--------|-------|
| **Interactive CLI** (`letta`) | ✅ Primary path | Chat, `/connect`, `/model`, `/new`, `/agent` |
| Channels (Telegram/Slack/Discord/WhatsApp/Signal) | 📋 First-party option | Out of Phase 1 scope; zero custom code |
| Letta desktop app | 📋 First-party option | Letta branding; out of scope |
| chat.letta.com (web/mobile) | ❌ Cloud-only | Cannot be used with self-hosted agents |
| Custom UI / Agent SDK | ❌ Postponed | Small need; decided later |

## 4. Phase 2 Stack — Automation ("hands", **undecided**)

Candidates under evaluation in `10-eval-activepieces.md`:

| Candidate | Stack | License | Notes |
|----------|-------|---------|-------|
| Activepieces | TypeScript/Fastify/BullMQ, PostgreSQL+Redis, React+Tailwind | **MIT (CE)** + commercial (enterprise features) | MCP-native; leading candidate |
| n8n | TypeScript, MySQL/Postgres | Fair-code (Sustainable Use) | Not fully open-source |
| Dify | Python/Flask, Postgres, Vue | Modified Apache 2.0 (multi-tenant/logo restrictions) | More a "brain" than "hands" |
| Make / Zapier | — | Proprietary | Cloud-only |

## 5. Integration Bridge (Phase 2, if decided)

- Letta supports **MCP client/tools**.
- Activepieces ships a native **MCP server** — a natural bridge.
- Final decision pending; depends on the evaluation outcome.

## 6. Deployment Infrastructure

| Component | Technology | Remarks |
|----------|-----------|---------|
| App Server (optional) | systemd or Docker `letta server` | Always-on on a VPS |
| Reverse proxy | — | Not needed in Phase 1 (no web) |
| Node.js | 22.19+ | Letta Code CLI runtime |
| Backup | cron/rsync of `~/.letta` | State & memory |

## 7. Monorepo Design

```
tony/                              # = this repository
├── src/                           # engine source (moved from letta-code/ to root)
├── docs/
│   ├── app/                       # native application docs (curated from letta-code)
│   ├── 01–10                      # major development plan (this set)
│   └── ...
└── README.md
```

> No pnpm workspace for Phase 1 — Tony does not build its own application yet.
> `apps/`, `packages/`, `infra/` will be created only when truly needed.

## 8. Supporting Tooling

| Tool | Role |
|------|------|
| Git | Version control |
| Node 22.19+ | Letta Code CLI runtime |
| Python/make/g++ | Native deps at install time |
| Docker/systemd (optional) | Always-on App Server |

## 9. Justification of Key Choices

- **Letta Code (Apache 2.0):** permissive license + memory/learning capabilities that
  distinguish Tony as "an assistant that remembers", plus a ready-made CLI → **no frontend
  needed**.
- **No custom UI:** interface needs are small; Letta ships first-party CLI & other interfaces.
- **Automation postponed:** avoids premature commitment before license/architecture clarity.
