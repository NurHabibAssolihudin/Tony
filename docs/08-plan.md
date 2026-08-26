# Project Plan — Tony

## 1. Summary

Tony runs in **two phases**. **Phase 1** (current focus): **pure Letta Code** — self-host,
LLM, the "Tony" agent, memory verification — **with no extra components** (no custom UI, no
SDK). **Phase 2**: **evaluate & choose** the automation component ("hands") before any
integration.

## 2. Phase 1 — Pure Letta Code (Detail)

### 2.1 Milestones

| Milestone | Outcome | Definition of Done |
|-----------|----------|-------------------|
| **M1: Local Letta setup** | Letta Code CLI running | `letta` launches the CLI; LLM connected (`/connect`) |
| **M2: "Tony" agent + memory** | Agent active & remembers across sessions | Chat via CLI; context persists in a new session (`/new`) |
| **M3: (Optional) Deploy** | Always-on App Server + backups | `letta server` via systemd/Docker; scheduled backup of `~/.letta` |
| **M4: Validation & docs** | Stable & documented | Go-live checklist; docs & ADRs complete |

### 2.2 Task Breakdown (Phase 1)

- **T1.1** Install `@letta-ai/letta-code`; set up python/make/g++
- **T1.2** Connect LLM provider (`/connect`); pick model (`/model`)
- **T2.1** Create the "Tony" agent (`letta --new-agent` / automatic)
- **T2.2** Chat via CLI; verify cross-conversation memory (`/new`)
- **T3.1** (Optional) Set up an App Server (systemd/Docker) on a VPS
- **T3.2** (Optional) Schedule backups of `~/.letta`
- **T4.1** Run the go-live checklist
- **T4.2** Finalize docs & ADRs (including interface decisions)

### 2.3 Estimates & Priorities

- Critical path: M1 → M2 → M4. M3 parallel/optional.
- Estimates: M1 (0.5–1 hr), M2 (0.5 hr), M3 (1 hr), M4 (0.5 hr).
- **P0:** chat + memory. **P1:** App Server + backup. **P2:** additional interfaces
  (channels) — postponed.

## 3. Phase 2 — Automation ("hands"): Evaluate First

- **F2-M0 (BEFORE integration):** evaluate & choose the automation component — see
  `10-eval-activepieces.md`. Outcome: recommendation + decision ADR.
- **F2-M1** Integrate the chosen component into the architecture (if Activepieces: via MCP).
- **F2-M2** Test the integration: Tony creates & runs flows; document it.

> Principle: **do not start integration before the component decision is final.**

## 4. Prioritization Principles

1. **Stabilize Phase 1 first** before Phase 2.
2. **Strict Phase 1 scope** — pure Letta, nothing extra.
3. **Evaluate before committing** — automation & interface decisions based on evidence/ADRs.

## 5. Schedule Risks

| Risk | Action |
|--------|--------|
| Letta native deps (install) | Install python3/make/g++; test on staging |
| Letta changes fast | Pin version; monitor changelog |
| Automation evaluation deadlock | Set criteria & a decision deadline in `10-eval-activepieces.md` |

## 6. Phase 1 Go-Live Checklist (DoD)

- [ ] Letta Code CLI installed & LLM connected
- [ ] Cross-conversation memory verified
- [ ] Chat via CLI works
- [ ] (Optional) App Server active; `:4500` not exposed publicly; tokens/secrets safe
- [ ] State & config backups running
- [ ] `docs/` (01–10 + `app/`) & `README.md` complete
- [ ] Git repo `main` pushed to origin
