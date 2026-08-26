# Architecture Decision Records (ADR) — Project Tony

> Format: [Status] — Title. Status: `Accepted` / `Proposed` / `Superseded` /
> `Under review`.
> Dates follow the Tony project planning iterations.

---

## ADR-001 — Replace LobeHub (f/k/a LobeChat) with Letta as the assistant foundation

- **Status:** Accepted
- **Date:** 2026-08
- **Context:** Tony was initially planned on LobeHub (f/k/a LobeChat) for its polished AI
  chat UI. However, the project's goal is **open-source + portfolio + allowing paid
  derivatives**, and LobeHub uses the **LobeHub Community License**, which restricts
  modified commercial derivatives.
- **Decision:** Use **Letta** (f/k/a MemGPT) as the assistant "brain".
  - Letta is licensed **Apache 2.0** (permissive).
  - Letta provides **stateful agents with memory** — aligned with "a remembering Tony".
- **Consequences (pros):**
  - Free to use, modify, distribute, and build paid derivatives on (with attribution).
  - Memory/learning capability distinguishes Tony from plain chat assistants.
- **Consequences (cons):**
  - No ready-made self-hostable web chat (see ADR-010 → solution: CLI).
- **Alternatives evaluated:** LobeHub (Community License — rejected), Open WebUI (license +
  branding-retention requirement — rejected), LibreChat (MIT — good, but without Letta-grade
  native memory).

## ADR-002 — Permissive foundation: Letta (Apache 2.0) + automation component (under evaluation)

- **Status:** Under review
- **Context:** Originally planned **Activepieces (MIT)** as the automation/action engine.
  After research, Activepieces' license is **dual-license** (CE MIT + commercial enterprise
  features), and other candidates exist (n8n, Dify, etc.).
- **Decision:** The "brain" foundation stays **Letta (Apache 2.0)**. The choice of the
  "hands" component (Phase 2) is **not final** — compared in `10-eval-activepieces.md`.
- **Consequences:**
  - Pros: evidence-based decisions; commercially friendly stack.
  - Cons: must honor Apache 2.0 attribution terms and the chosen component's license.

## ADR-003 — Build a custom "Tony UI" web app (React + Next.js) — **SUPERSEDED**

- **Status:** Superseded (by ADR-010)
- **Context:** Original plan to build our own frontend for branding.
- **Decision:** ~~Build "Tony UI" (React + Next.js) on the Letta Agent SDK~~ **cancelled**.
- **Reason superseded:** Phase 1 interface = **pure Letta CLI**; UI need is small; Letta has
  other first-party interfaces (channels/desktop) usable without custom code.
- **Consequences:** No frontend development effort in Phase 1; custom branding postponed.

## ADR-004 — Role separation: Brain (Letta) / (later) Hands (automation)

- **Status:** Accepted (revised — no "Face" layer)
- **Context:** Avoid a monolith and ease evolution.
- **Decision:** Modular architecture with clear bridges:
  - Brain: Letta (memory, agents, execution) + CLI interface.
  - Hands: automation/action component — Phase 2 (unselected).
  - ~~Custom Face/UI~~ removed (ADR-010).
- **Consequences:** Clear boundaries → easier to test, maintain, and swap per component.

## ADR-005 — Letta ↔ automation bridge via MCP (Model Context Protocol)

- **Status:** Proposed (Phase 2 — awaiting component decision)
- **Context:** We want Tony to act, not just chat.
- **Potential decision:** Connect the Letta agent (which supports **MCP client/tools**) to
  the automation component. If Activepieces is chosen: use its **MCP server** (`/mcp`).
- **Consequences:** Open standard supported by both sides; requires MCP config + auth.

## ADR-006 — Unified monorepo (git)

- **Status:** Accepted
- **Context:** All components (vendored Letta source + later automation) in one project.
- **Decision:** Single repository; `letta-code/` (vendored source), `docs/`, `README.md`.
  A pnpm workspace will be created **only** if we ship our own applications (none today).
- **Consequences:** One source of truth, unified deploys; boundary discipline required.

## ADR-007 — The Letta App Server is not exposed publicly

- **Status:** Accepted
- **Context:** The App Server has filesystem & shell access; credentials must never leak publicly.
- **Decision:** The App Server (if used) runs only on `127.0.0.1:4500` (internal); accessed
  via SSH/CLI, not directly from the internet.
- **Consequences:** Safer; proper client-server architecture. If remote clients are added
  later (e.g., mobile/desktop apps), revisit via a new ADR using token auth (`--ws-auth`)
  and/or an overlay network.

## ADR-008 — Shape of "Tony UI" — **SUPERSEDED**

- **Status:** Superseded (by ADR-010)
- **Context:** Earlier options for the interface/UI (custom web / desktop / chat channels).
- **Decision:** ~~Option (a): custom web chat~~ **cancelled**; interface = CLI (ADR-010).
  Channels/desktop remain available as optional complements if needed later.

## ADR-009 — Agent state & memory storage via Letta MemFS + backups

- **Status:** Accepted
- **Context:** Tony's memory is a core asset that must persist and stay safe.
- **Decision:** Use Letta's default MemFS mechanism (`~/.letta`); schedule backups.
- **Consequences:** Persistence assured; needs a backup & recovery strategy.

## ADR-010 — Phase 1 interface = pure Letta CLI; no extra components

- **Status:** Accepted
- **Date:** 2026-08
- **Context:** Interface/UI needs are tiny; the project rejects extra complexity
  (custom UI, Agent SDK, web frontend) before it is truly required.
- **Decision:**
  - Phase 1 uses **pure Letta Code**, primary interface = **CLI** (`letta`).
  - **No** extra components: no custom UI, no Agent SDK, no frontend.
  - Other first-party interfaces (channels/desktop) are recorded as options, **out of scope**.
- **Consequences:**
  - Pros: small scope, fast to live, zero frontend effort.
  - Cons: no own web interface; custom branding postponed.
- **References:** Letta interface research in `07-context.md`
  (CLI/channels/desktop/web-chat-cloud).

## ADR-011 — Engine documentation promoted to project-level (`docs/app/`)

- **Status:** Accepted
- **Date:** 2026-08
- **Context:** Letta Code is treated as a native part of this project. Its user-facing docs
  previously lived inside the vendored tree (`letta-code/README.md`, `letta-code/docs/`),
  duplicating root documentation and mixing vendor material with project material.
- **Decision:**
  - Curate engine documentation into **`docs/app/`** (English), owned by this project:
    features, interfaces, configuration, memory & skills, mods examples, nix install.
  - Merge duplicate README content into one curated root `README.md`.
  - Delete moved originals from `letta-code/`; keep only source-intrinsic docs there
    (`LICENSE`, `AGENTS.md`, `CONTRIBUTING.md`, `AI_POLICY.md`, `docs/plans/`,
    embedded `src/**/*.md`).
  - All project documentation is written in English.
- **Consequences:**
  - Pros: single source of truth per topic; vendor tree stays pristine for diffing;
    docs survive re-vendoring untouched.
  - Cons: `docs/app/` must be synced manually against upstream releases (see
    `05-dev-guide.md` § Vendored engine).

## ADR-012 — Tony Web UI ("the Face") is planned; supersedes ADR-010 at implementation

- **Status:** Proposed
- **Date:** 2026-08
- **Context:** Phase 1 correctly shipped with the CLI as the only interface
  (ADR-010). The product direction now calls for a web-based control panel where
  all configuration happens (providers, MCP, agents, skills, channels,
  schedules, memory) plus **conversational self-configuration** — the user asks
  Tony in natural language to wire an integration (e.g., "connect Telegram") and
  the agent performs it, requesting only required credentials.
- **Proposal:** Build a Tony-owned web UI as a client of the existing App Server
  management protocol (`connect-providers`, `settings`, `skills-agents`,
  `secrets`, `cron`, `agents-conversations`, `model-catalog`, …) — the same
  surface the official desktop app uses. Configuration actions requested via
  chat are executed by a Tony-owned admin mod (tools such as
  `channel.configure/test`, `provider.set`, `mcp.add`, `secret.set`) so the
  vendored engine stays pristine. Secrets enter through a secure-input widget
  and are stored in the secrets store, never in transcripts or memory files.
- **Decided within this direction:** Telegram as the pilot channel; internal-only
  exposure first (LAN/Tailscale); small user scale (~2–5).
- **Open items:** web framework choice; **multi-user mechanism** (personal
  agent per user vs one shared assistant vs hybrid with shared-memory team
  brain) — engine evidence recorded in `11-web-ui-design.md` § 8.
- **Consequences:**
  - Pros: full control surface without touching engine internals; aligns with
    the multi-device self-hosted server direction; reuses a mature protocol.
  - Cons: new application to build/maintain; revises ADR-010's "no custom UI"
    stance for this phase (CLI remains fully supported).
- **Design document:** `11-web-ui-design.md`.

---

## Appendix: Decision Flow

1. Evaluate licenses (LobeHub ✗ → Letta/Open WebUI/LibreChat).
2. Choose Letta (Apache 2.0) as the brain.
3. Decide Phase 1 interface = pure CLI, no extra components (ADR-010).
4. Evaluate the Phase 2 automation component (`10-eval-activepieces.md`) before integrating.
5. Document, initialize git, then execute Phase 1.
