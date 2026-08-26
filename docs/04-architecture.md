# Architecture — Project Tony

## 1. Architecture Principles

1. **Unified monorepo** — the whole project lives in one repository (vendored Letta source + docs).
2. **Nothing unnecessary** — Phase 1 uses pure Letta Code (CLI).
3. **Permissive-license foundation** — Letta (Apache 2.0).
4. **Incremental evolution** — Phase 1 (Letta CLI), Phase 2 (add automation component **if** selected).
5. **Self-hosted & secure** — the App Server is never exposed directly to the public internet.

## 2. Phase 1 Architecture (Pure Letta Code)

```
        User ──terminal/SSH──►  Letta Code CLI (local / VPS)
                                    │  stateful agent
                                    │  memory/state ~/.letta (MemFS, git-backed)
                                    ▼
                               LLM provider (API)

        (optional: always-on / remote access)
        User ──SSH──►  Letta App Server (letta server, bind internal 127.0.0.1:4500)
```

- The **CLI** runs the agent in-process; all state (memory, conversations, provider
  connections) lives on the local machine — **no Letta account needed**.
- **MemFS** tracks all context via git → easy to back up, move, or sync to a repo.
- The optional App Server exists only for *always-on* / remote needs; it stays internal.

### State vs execution (key concept)

Agent **state** (memory, history) and **tool execution** (file access) are separate:
tools always run on the machine where the harness runs, regardless of where memory is
stored. Nothing about file access routes through any cloud.

## 3. Monorepo Layout (Phase 1)

```
tony/
├── letta-code/                  # vendored engine source (pinned v0.30.32)
├── docs/
│   ├── app/                     # native application docs (curated from letta-code)
│   ├── 01-project-overview.md   # major development plan (this set)
│   └── ...
└── README.md
```

## 4. Data Flow (Phase 1)

1. User runs `letta` in a terminal (locally or via SSH to a VPS).
2. User sends a message → Letta Code assembles context from the agent's **memory**, calls
   the LLM, and returns a streamed answer.
3. Messages & context are stored in agent memory (MemFS) → Tony "remembers" across sessions.

## 5. Phase 2 Integration Map (Automation — undecided)

```
                    Letta Code (CLI / App Server)
                        │  MCP tools (potential)
                        ▼
              automation component (candidate: Activepieces MCP server)
                        │
                   flows / integrations
```

- The "hands" component decision is **not made yet**; see `10-eval-activepieces.md`.
- Bridge principle (if Activepieces): Letta agent uses its **MCP client** → the
  **Activepieces MCP server** (`/mcp`).

## 6. Key Architecture Decisions (ADR summary)

| Decision | Rationale | Status |
|-----------|--------|--------|
| Letta as brain (not LobeHub) | Apache 2.0 license + memory/learning | ⚖️ ADR-001 |
| **No custom UI** — use the Letta CLI | Small interface need; first-party interfaces exist | ⚖️ ADR-010 (ADR-003 superseded) |
| App Server not exposed publicly | Security | ⚖️ ADR-007 |
| Unified monorepo | One toolchain & deploy | ⚖️ ADR-006 |
| Automation = evaluate first | Avoid commitment before a mature decision | 📋 ADR-002/005 (evaluation) |

> Full ADR details: `09-adr.md`.
