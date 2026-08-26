# Tony Web UI — Product & Technical Design (Draft)

> Design document for Tony's web-based interface ("the Face"). Pre-implementation
> draft: page structure, protocol mapping, self-configuration flows, security
> model. Implementation decisions (framework, repository layout) are deferred.
>
> Status: **design only** — nothing in this document is built yet.

## 1. Vision & Goals

Tony's engine runs headless and stateful on a server; the web UI is its primary
human surface:

1. **One control panel** — every operational concern is configurable from the UI:
   LLM connections, MCP servers, agents, skills, channels, schedules, memory.
2. **Conversational self-configuration** — the user can *ask* Tony in natural
   language to wire something up ("connect Telegram"), and the agent performs the
   setup itself, prompting only for required credentials.
3. **Internal-first security** — served on an internal network / overlay VPN;
   never exposed publicly without a separate decision.
4. **Small scale** — designed for a handful of users (~2–5), not an org fleet.

## 2. Recorded Decisions

| Decision | Choice | Status |
|----------|--------|--------|
| First channel integration (self-config pilot) | **Telegram** | Decided |
| Network exposure of the UI | Internal / LAN / Tailscale first; public+HTTPS later | Decided |
| Web framework / stack | TBD | Deferred |
| Multi-user mechanism (personal-per-user vs shared agent vs hybrid) | **OPEN** — see § 8 | To be discussed |
| Multi-user scale context | Small (~2–5 users) | Decided |
| Relationship to ADR-010 ("no custom UI in Phase 1") | Supersedes it when implementation starts | Noted (ADR-012 Proposed) |

## 3. Architecture Placement

```
Browser — Tony Web UI (chat + config panels)
    │  WebSocket: App Server protocol (+ auth token)
    ▼
┌──────────────────────── VPS ────────────────────────────┐
│ tony-server  (letta server --listen ws://127.0.0.1:4500) │
│   ├── agents + MemFS state (central)                     │
│   ├── channels gateway (Telegram/Slack/Discord/...)      │
│   └── [Tony admin mod] configure_channel/provider.set/   │
│       mcp.add/secret.set  ← used by the agent on request │
└──────────────────────────────────────────────────────────┘
    ▲                                   ▲
 other laptops                    messaging apps
 (CLI via LETTA_BASE_URL          (Telegram etc., via
  + token — future ADR-013)        channels gateway)
```

The UI is a client of the App Server protocol. No new backend service beyond the
server itself plus static hosting of the UI assets (hosting shape decided with
the stack).

## 4. Information Architecture

| Page | Purpose | Key elements |
|------|---------|--------------|
| **Chat** (home) | Talk to the active agent; where self-config requests happen | Conversation list, streaming transcript, tool-call approval prompts, input box, agent switcher |
| Dashboard | At-a-glance health | Backend mode, connected providers, channel status, upcoming cron runs, engine version |
| Agents | Manage agents | List/create/delete, model & toolset per agent, memory-blocks viewer, pinned/default |
| Connections | LLM providers | Provider cards (OAuth or API-key forms), default model picker |
| MCP | External tool servers | Add/remove servers (stdio/http), OAuth flows, enable/disable, tools preview |
| Skills | Procedural memory | Installed skills by scope, install from GitHub URL/slug, toggle |
| Channels | Messaging integrations | Card per channel (Telegram/Discord/Slack/WA/Signal): enabled, masked token fields, connection state, "send test message" |
| Memory | Inspect what Tony remembers | Memory blocks list & sizes, MemFS git history, trigger memory audit (`/doctor` equivalent) |
| Crons | Schedules & heartbeats | Upcoming runs, create/edit/delete |
| Settings | Everything else | Stored secrets (masked), general settings, version/update info |

## 5. Protocol Mapping (existing engine surface)

Panels are thin views over the App Server management protocol
(`letta-code/src/websocket/listener/commands/`) — the same surface the official
desktop app consumes. Client library: `app-server-client.js` (exported by the
npm package).

| Panel / feature | Existing command(s) |
|------------------|---------------------|
| Agents list/conversations | `agents-conversations` |
| Connections (providers) | `connect-providers` |
| Default model & catalog | `model-catalog`, `model-toolset` |
| Skills | `skills-agents` |
| Secrets | `secrets` |
| General settings | `settings` |
| Crons | `cron` |
| Chat streaming/runtime | `runtime-start`, input/stream frames |
| Memory sync/view | `memory`, `memory-command-sync` |

**Gaps to fill with a Tony-owned admin mod** (keeps the vendored engine pristine):

| Gap | Proposed tool |
|-----|---------------|
| Enable/configure a channel with credentials at runtime | `channel.configure(name)` / `channel.test(name)` |
| Store provider credential non-interactively | `provider.set(...)` (delegates to secrets store) |
| Add/remove MCP server entries | `mcp.add(...)` / `mcp.remove(...)` |
| Set a secret from chat without leaking it to transcript | `secret.set(name)` (paired with secure-input widget, § 6) |

## 6. Self-Configuration Flows ("ask Tony to wire it")

Contract between chat UX and configuration actions:

1. User asks in natural language: *"connect Telegram"*.
2. Agent loads its admin tools (mod-provided) and determines required inputs.
3. When a credential is needed, the agent does **not** ask for it as plain text:
   it emits a structured request that the UI renders as a **secure input widget**
   (masked field). The value goes into the secrets store and never appears in
   the transcript or memory files.
4. Agent applies configuration via the admin tool (writes config + secret),
   restarts/reloads the affected gateway component, verifies, and reports back.

### Telegram onboarding wizard (pilot flow)

```
User: "connect Telegram"
  → Agent: needs a bot token. Create one via @BotFather, then paste it below
      [UI renders secure input widget]
  → User: <token>            (masked; stored as TELEGRAM_BOT_TOKEN secret)
  → Agent: channel.configure("telegram")  → gateway reload
  → Agent: channel.test("telegram")       → sends test message to bound chat id
  → Agent: confirms success / reports error with next steps
```

Chat-id binding for who may talk to the bot is part of the same wizard
(ingress policy exists upstream: `channels/*/ingress-policy`).

## 7. Security Model

- UI served on internal network / overlay VPN only (Tailscale/LAN); no public
  exposure in this phase. Public exposure requires a new ADR (reverse proxy,
  HTTPS, hardened auth).
- All protocol traffic authenticated (capability token at minimum); UI holds a
  server-side session after login.
- Secrets are write-only from the UI's perspective: masked display, never
  rendered plaintext, never written into transcripts or agent memory files.
- Admin mod tools are permission-gated like any other tool (approval modes).

### Non-goals (this phase)

- Multi-tenant RBAC, org management, audit logs
- Public internet exposure
- Native mobile apps

## 8. Multi-User Support — OPEN DESIGN QUESTION

**Scale context:** small (~2–5 users). **Mechanism: deliberately undecided.**

Observations recorded for the future decision:

- The engine's memory model is **one principal human per agent** (single
  `human.md` persona block); each agent has fully isolated MemFS, recall
  history, and identity.
- The App Server protocol already threads **`acting_user_id`** end-to-end
  (inbound frames, approval queues, batching, conversation attribution,
  outbound `created_by_id`). Today Letta Cloud stamps it; a self-hosted web UI
  can supply it per logged-in user.
- **Shared knowledge across agents is natively supported**: `letta
  shared-memory` manages org-owned git repos attachable to multiple agents
  (create/attach/detach/sync).
- Channels attribute inbound senders (`acting-user-attribution`,
  ingress policies), enabling username→user routing tables later.

Candidate models (to be discussed before web UI implementation):

| Model | Shape | Pros | Cons |
|-------|-------|------|------|
| **A. Personal agent per user** | Each login maps to that user's own Tony agent; shared knowledge via attached shared-memory repos | Perfect memory privacy; matches engine design; simple mental model | Per-user LLM cost; needs account→agent binding layer |
| **B. One shared assistant** | Everyone talks to the same agent (e.g., a group Telegram) | Simplest ops; agent knows everyone | Memories & histories mix across users (privacy leak) |
| **C. Hybrid** | Personal agents + team-brain shared-memory repo(s) + optional shared agent | Best of both | Most configuration complexity |

Decision checklist for the future discussion: privacy expectations between
users; whether a "team brain" is wanted; cost model per user; how Telegram
users map to accounts (one bot routed per user vs bot-per-agent).

Until decided, the design keeps the account/session layer thin so any model can
be adopted without rework.

## 9. Delivery Outline (when implementation starts)

| Stage | Outcome |
|-------|---------|
| P2-A | Always-on `tony-server` compose service (token auth) + multi-device CLI access experiment (`LETTA_BASE_URL`) → ADR |
| P2-B | Web UI MVP: chat + dashboard over the existing protocol, auth-gated, internally hosted |
| P2-C | Config panels complete (§ 4) over existing commands |
| P2-D | Admin mod + self-config wizards (Telegram pilot) |

Framework choice and repository placement (`apps/web` workspace activation per
ADR-006) happen at P2-B kickoff.

## 10. References

- Engine docs: [`docs/app/`](app/) (features, interfaces, configuration)
- Deployment: [`docs/06-deployment-guide.md`](06-deployment-guide.md)
- ADRs: [`docs/09-adr.md`](09-adr.md) — ADR-010 (interface), ADR-006 (monorepo),
  ADR-012 (Proposed, this direction)
