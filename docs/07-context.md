# Context Document — Project Tony

Contextual document: decision rationale (ADR summary), assumptions, license status, and
references. Full decisions live in `09-adr.md`.

## 1. Decision Summary

| No | Decision | Rationale | Status |
|----|-----------|--------|--------|
| ADR-001 | **Letta**, not LobeHub | Apache 2.0 (permissive) + memory/learning | ⚖️ Accepted |
| ADR-002 | Foundation Letta (Apache 2.0) + automation (candidate Activepieces MIT) | Supports open-source, portfolio, commercial derivatives | 📋 **Re-evaluating** |
| ADR-003 | ~~Build custom "Tony UI"~~ | No UI needed → use the CLI | ❌ Superseded (ADR-010) |
| ADR-004 | Role separation: Brain (Letta) / (later) Hands (automation) | Modular, auditable | ⚖️ Accepted (revised: no "Face") |
| ADR-005 | Letta ↔ automation bridge via MCP | Open standard, supported by both sides | 📋 Phase 2 — under evaluation |
| ADR-006 | Unified monorepo | One toolchain & deploy | ⚖️ Accepted |
| ADR-007 | App Server not exposed publicly | Security | ⚖️ Accepted |
| ADR-008 | ~~"Tony UI" shape~~ | Interface = first-party CLI | ❌ Superseded (ADR-010) |
| ADR-009 | Agent memory via MemFS + backup | Tony's memory is a core asset | ⚖️ Accepted |
| ADR-010 | **Phase 1 interface = pure Letta CLI; no extra components** | Small UI need; ready-made CLI | ⚖️ Accepted |

## 2. License Status (Analysis)

| Component | License | Implication |
|----------|---------|-------------|
| **Letta Code** | **Apache 2.0** | ✅ Commercial use, modification, distribution, paid derivatives allowed; attribution/NOTICE required |
| **Activepieces** | **Dual-license**: Community Edition **MIT** + enterprise features (RBAC/SSO/audit) **commercial** | ✅ CE is free; watch paid features if used |
| n8n (candidate) | Fair-code / Sustainable Use | ⚠️ Not fully open-source |
| Dify (candidate) | Modified Apache 2.0 (multi-tenant SaaS/logo restrictions) | ⚠️ Similar to the rejected LobeHub restrictions |

### Letta Interfaces (research findings, 2026)

| Interface | Self-host-friendly? | Notes |
|-----------|--------------------|---------|
| **CLI** (`letta`) | ✅ | Phase 1 main path |
| **Channels** (Telegram/Slack/Discord/WhatsApp/Signal) | ✅ | First-party via `letta server --channels <x>` |
| **Desktop app** (Win/macOS/Linux) | ✅ | Letta branding; shares local state with CLI |
| **App Server** (`letta server --listen`) | ✅ | WebSocket protocol + optional OpenAI-compatible API; token auth for non-loopback binds |
| **chat.letta.com** (web/mobile) | ❌ | Cloud-only; **cannot** host self-hosted agents |

> Conclusion: the assumption "we must build our own UI because Letta's web app is
> cloud-only" was **wrong** — Letta has a CLI and other first-party interfaces that run on
> top of a local/self-hosted backend.

## 3. Assumptions

- Self-hosting Letta via the **CLI** (`@letta-ai/letta-code`), Node 22.19+, needs python/make/g++.
- Final LLM provider undecided; initial assumption OpenAI/Anthropic; switchable (`/connect`).
- Phase 1 interface = **CLI**; other interfaces (channels/desktop) postponed (ADR-010).
- Automation component (Phase 2) **unselected**; evaluation in `10-eval-activepieces.md`.
- Server: Ubuntu VPS + systemd/Docker (optional, for an always-on App Server).
- Engine source vendored at `letta-code/` pinned to release tag **v0.30.32**.

## 4. Risks & Mitigations

| Risk | Impact | Mitigation |
|--------|--------|----------|
| Letta project changes fast | Upgrades/maintenance | Pin version; monitor changelog; document |
| Letta native deps (install) | Build failure | Install python3/make/g++; try WSL/Docker |
| API key leak | Abuse | Store safely (keyring/.env); never commit |
| Agent memory loss | Tony "forgets" | Scheduled MemFS backup (`~/.letta`); git-backed memory repo |
| Premature automation commitment | Wrong architecture choice | Evaluate first; decide via ADR |

## 5. References & Sources

- Letta Code (repo): https://github.com/letta-ai/letta-code
- Letta docs: https://docs.letta.com
- Letta self-hosting: https://docs.letta.com/self-hosting
- Letta CLI: https://docs.letta.com/platform/cli
- Letta Channels: https://docs.letta.com/configuration/channels
- Letta License (Apache 2.0): https://raw.githubusercontent.com/letta-ai/letta-code/main/LICENSE
- Activepieces (repo): https://github.com/activepieces/activepieces
- Activepieces MCP: https://www.activepieces.com/docs/mcp/overview
- Model Context Protocol: https://modelcontextprotocol.io

## 6. Exploration Notes

- `@letta-ai/letta-code` v0.30.x: interactive CLI (`letta`), subcommands (`agents`, `memory`,
  `messages`, `channels`, `cron`, `skills`, `server`, `environments`), state in `~/.letta` (MemFS).
- App Server: `letta server --backend local --listen ws://127.0.0.1:4500`; supports
  capability/JWT auth for non-loopback listeners and an OpenAI-compatible API (`--openai-api`).
- Channels: `letta server --backend local --channels <telegram|slack|discord|whatsapp|signal>`.
- Slash commands: `/connect`, `/model`, `/new`, `/resume`, `/agent`, `/search`, `/skills`.
- Native prerequisites: python3, make, g++; Node 22.19+.
