# Project Overview — Tony

## 1. Vision

**Tony** is a self-hostable personal AI assistant built on an open-source foundation with a
**permissive** license, so anyone is free to use it, share it, and build commercial
derivatives on top of it. Tony is designed as **a single unified monorepo** without
unnecessary extra components.

In this phase Tony runs purely on **Letta Code** (Apache 2.0) — no custom frontend, no
Agent SDK, no additional UI components. The primary interface is the **CLI**.

Tony is designed to be an assistant that:

- **Remembers & learns** — powered by Letta Code (a stateful agent with memory), it recalls
  conversations and develops over time.
- **(Phase 2) Can act** — real automation integration (email, CRM, notifications, webhooks,
  etc.) is under evaluation; the component has not been chosen yet.
- **Fully self-hosted** — your data, your control.

## 2. Foundation: Open-Source Components

| Component | Role | License |
|----------|-------|---------|
| **Letta Code** (f/k/a MemGPT) | Assistant "brain" + CLI interface: stateful agent with memory, skills, subagents, MCP | **Apache 2.0** ✅ permissive |
| *(Additional interface/UI)* | Undecided; small need → postponed | — |
| Activepieces ("hands" candidate) | Automation/action engine (Phase 2) | **MIT (CE)** ⏳ under evaluation |

## 3. Problems Solved

1. **Dependence on restrictive licenses** → Letta (Apache 2.0) removes barriers to
   distributing commercial derivatives.
2. **Assistants that "forget"** → Letta provides long-term memory & continual learning.
3. **Cloud web interfaces that cannot be self-hosted** → solution: use the **CLI** /
   first-party Letta interfaces instead of building our own frontend (see ADR-010).
4. **Unnecessary complexity** → no custom UI keeps Phase 1 scope small and fast.

## 4. Two-Phase Roadmap

| Phase | Scope | Outcome |
|------|---------|---------|
| **Phase 1 (now)** | **Pure Letta Code**: self-host, connect LLM provider, create the "Tony" agent, verify memory, CLI interface | A remembering, self-hosted Tony used from the terminal |
| **Phase 2 (later)** | **Evaluate & choose** the automation component ("hands"); integrate if selected | Tony can create and run real automations |

## 5. High-Level Architecture (End Target)

```
                 ┌───────────────────────────────────┐
   User ──►      │  Letta Code (Apache 2.0)           │
 (terminal/SSH)  │  • interactive CLI                 │
                 │  • stateful agent, memory (MemFS)  │
                 └───────────────┬───────────────────┘
                                 │  tools / execution
                                 ▼
                           LLM provider (API)
```

Phase 1: only the **Letta Code** block (CLI). Phase 2: add the automation component **if**
the evaluation supports it — without changing the foundation.

## 6. Persona & Primary Use Cases

- **Persona:** individuals/developers who want a self-hosted AI assistant with memory that
  can eventually act, and that is legally safe as the base of an open-source/paid project.
- **Phase 1 use case:** personal chat via terminal, cross-session conversation memory.
- **Phase 2 use cases (examples):** "send meeting summary by email", "add lead to CRM",
  "create a reminder" — components still under evaluation.

## 7. Definition of Success

- **Phase 1:** Letta Code runs self-hosted; LLM connected; the "Tony" agent active via CLI;
  cross-conversation memory verified; clean, well-documented monorepo.
- **Phase 2:** automation component decision documented (ADR); integration running if selected.
