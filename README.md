# Tony

> A **self-hosted** personal AI assistant — it remembers, learns, and (eventually) acts.
> Built natively on the **Letta Code** engine (Apache 2.0), with no unnecessary extras.

## What is Tony?

Tony is an assistant that runs on your own infrastructure. This phase runs on
**Letta Code** exclusively — no custom frontend, no Agent SDK, no extra components:

- 🧠 **Remembers & learns** — a stateful agent with git-backed memory (MemFS) that
  rewrites its own context and skills over time.
- 💬 **Speaks via CLI** — chat straight from your terminal (`letta`); one command.
- ⚙️ **(Phase 2) Acts** — real automation integration is still **under evaluation**
  (see [`docs/10-eval-activepieces.md`](docs/10-eval-activepieces.md)).

> Decision: **nothing else gets added in Phase 1** (custom UI, web frontend, etc. are
> postponed; interface needs will be decided later).

## ✨ Capabilities (native engine)

| Area | Highlights |
|---|---|
| Memory & learning | Memory blocks, MemFS (git-backed), `/palace` inspect · `/doctor` audit · `/sleeptime` dreaming |
| Acting | Full built-in toolset: shell, files, grep/glob, tasks, worktrees; MCP client for external tools |
| Extensibility | Skills (global/project/agent-scoped), hooks, crons & schedules, subagents, mods |
| Interfaces | Interactive CLI · headless (`letta -p`) · messaging channels (Telegram/Slack/Discord/WA/Signal) · desktop app |
| Self-hosted server | App Server (`letta server --listen`) with token auth and an optional OpenAI-compatible API |

Details: [`docs/app/features.md`](docs/app/features.md) ·
[`docs/app/interfaces.md`](docs/app/interfaces.md)

> Features requiring Letta Cloud sign-in (remote environments, secrets sync,
> chat.letta.com) are explicitly **out of scope** for self-hosted Tony.

## 🧩 Components & Licenses

| Component | Role | License |
|----------|-------|---------|
| [Letta Code](https://github.com/letta-ai/letta-code) | Brain + interface: stateful agent with memory, run via CLI | ✅ Apache 2.0 (permissive) |
| [Activepieces](https://github.com/activepieces/activepieces) | Automation/action engine (Phase 2) | ⏳ **Under evaluation** (MIT CE) |

> The Letta Code source is vendored at `letta-code/` (pinned **v0.30.32**, upstream commit
> `1e78870`, plain copy without `.git`). Its documentation is curated as part of this
> project under `docs/app/`.

## 📁 Repository Structure

```
tony/
├── letta-code/        # vendored Letta Code engine source (the runtime — built via Docker)
├── docker/            # Tony-owned engine image (Dockerfile + entrypoint)
├── compose.yaml       # `docker compose run --rm tony` -> interactive CLI
├── docs/
│   ├── app/           # native application documentation (curated from letta-code)
│   ├── 01–10          # major development plan (overview → roadmap → ADRs)
│   └── ...
└── README.md
```

## 🚀 Run Locally (Phase 1)

```bash
# 0) One-time: build the engine image from this repo's vendored source
docker compose build

# 1) Make "local" the default backend (no cloud login), then launch the CLI
docker compose run --rm tony backend local
docker compose run --rm tony

# 2) Inside the CLI:
#    /connect          # connect an LLM provider (OpenAI, Anthropic, Ollama, ...)
#    /model            # pick a model
#    /new              # new session — verify cross-session memory
```

> This runs the **vendored Letta Code source** (`letta-code/`) in Bun dev mode inside a
> Linux container — not an npm artifact — so local engine changes take effect. Agent
> state persists in the `tony-state` volume. Alternatives (host source / npm) and details:
> [`docs/05-dev-guide.md`](docs/05-dev-guide.md).

## 📚 Documentation

Major development plan:

| Doc | Contents |
|---------|---------|
| [01-project-overview.md](docs/01-project-overview.md) | Vision, components, roadmap, architecture |
| [02-spec.md](docs/02-spec.md) | Specification & acceptance criteria |
| [03-tech-stack.md](docs/03-tech-stack.md) | Stack & justification |
| [04-architecture.md](docs/04-architecture.md) | Architecture & data flow |
| [05-dev-guide.md](docs/05-dev-guide.md) | Developer guide |
| [06-deployment-guide.md](docs/06-deployment-guide.md) | VPS deployment |
| [07-context.md](docs/07-context.md) | Assumptions, risks, references |
| [08-plan.md](docs/08-plan.md) | Milestones & tasks |
| [09-adr.md](docs/09-adr.md) | Architecture Decision Records |
| [10-eval-activepieces.md](docs/10-eval-activepieces.md) | Phase 2 "hands" evaluation |

Native application documentation (`docs/app/`):

[features.md](docs/app/features.md) · [interfaces.md](docs/app/interfaces.md) ·
[configuration.md](docs/app/configuration.md) · [memory-and-skills.md](docs/app/memory-and-skills.md) ·
[mods-examples.md](docs/app/mods-examples.md) · [nix.md](docs/app/nix.md)

## 🗺️ Roadmap

- **Phase 1:** pure Letta Code — self-host, memory, CLI interface. *(in progress)*
- **Phase 2:** automation/action integration (Activepieces or alternative — **awaiting evaluation**).

## 📄 License & Attribution

Tony's engine is **Apache 2.0** licensed: free to use, modify, distribute, and build
commercial derivatives with attribution. See [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE).
When distributing, include the license/NOTICE of bundled components (the vendored engine
keeps its own copy at `letta-code/LICENSE`).
