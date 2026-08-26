# Project Specification — Tony

## 1. Purpose of This Document

Establish the scope, functional/non-functional requirements, and acceptance criteria for
Tony. The current focus is **Phase 1**: **pure Letta Code** (self-host + CLI interface)
**with no extra components**.

## 2. Components & Licenses

| Component | Role | License | Status |
|----------|-------|---------|--------|
| Letta Code (CLI + harness) | Assistant brain (stateful agent, memory) + CLI interface | Apache 2.0 | In use |
| Additional interface/UI | Postponed — small need, decision later | — | Postponed |
| Activepieces ("hands" candidate) | Automation/action engine | MIT (CE) | Phase 2 — under evaluation |

## 3. Phase 1 Scope

- ✅ Install the **Letta Code CLI** (`@letta-ai/letta-code`) on a local machine / VPS.
- ✅ Connect an **LLM provider** (OpenAI, Anthropic, Ollama, etc.) via `/connect`.
- ✅ Create the **"Tony"** agent and chat via the **CLI**.
- ✅ Verify **memory** across conversations.
- ✅ (Optional) Run the **App Server** (`letta server`) for always-on / remote access.
- ✅ (Optional) Back up agent state/memory (`~/.letta/...` / MemFS).
- ❌ **NOT** building a frontend / "Tony UI" / custom web chat in Phase 1.
- ❌ **NOT** using the Agent SDK for custom applications in Phase 1.
- ❌ **NOT** touching automation components (still under evaluation; decided before Phase 2).

## 4. Functional Requirements (Phase 1)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-01 | Letta Code CLI installed & running | `letta` launches the interactive interface |
| FR-02 | LLM provider connected | `/connect` succeeds; agent can answer |
| FR-03 | "Tony" agent active via CLI | Interactive chat works (input → streamed reply) |
| FR-04 | Tony **remembers** across conversations | A new session retains context/memory |
| FR-05 | (Optional) Self-hosted App Server | `letta server` runs; state in MemFS |
| FR-06 | (Optional) Memory backup | `~/.letta` can be backed up/restored |

## 5. Non-Functional Requirements (Phase 1)

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Availability | App Server (if used) `restart: always` / systemd |
| NFR-02 | Security | API keys stored safely (`.env`/keyring); never committed; App Server never exposed directly to the public internet |
| NFR-03 | Performance | Chat responses are smooth; memory stored efficiently (MemFS) |
| NFR-04 | Maintainability | Structured monorepo; complete documentation |
| NFR-05 | Portability | Letta easy to reinstall/move (Node 22.19+ + native deps) |
| NFR-06 | Backups | Agent state/memory (`~/.letta` / MemFS) & config backed up |
| NFR-07 | Licensing | Letta (Apache 2.0) used per its terms (attribution) |

## 6. Deployment Architecture (Phase 1)

```
        User ──terminal/SSH──►  Letta Code CLI (local / VPS)
                                   │  MemFS state ~/.letta
                                   ▼
                              LLM provider (API)
        (optional, always-on)
        User ──SSH──►  Letta App Server (letta server, :4500 internal)
```

- The primary interface is the **CLI**; nothing web-facing is exposed publicly in Phase 1.
- Nginx/HTTPS/domain only become relevant when a web interface/channel is added later —
  out of scope for now.

## 7. Phase 2 Scope (Summary / Undecided)

- **Evaluate** the automation component ("hands"): Activepieces vs n8n vs Dify vs others —
  see `10-eval-activepieces.md`.
- The decision is recorded as an ADR before integration starts.
- Detailed planning in `08-plan.md`.

## 8. Explicitly Out of Scope Right Now

- Building a custom frontend/web UI.
- Deep modifications to the Letta harness internals.
- Real automation integration (awaiting the evaluation decision).

## 9. Vendored Engine

The engine source is vendored at `letta-code/` (pinned **v0.30.32**, upstream commit
`1e78870`). Its application documentation is curated under `docs/app/` and owned by this
project — it does not reset when re-vendoring upstream releases.
