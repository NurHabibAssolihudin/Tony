# "Hands" Component (Automation) Evaluation — Phase 2

> Working document for deciding Tony's Phase 2 automation/action component.
> **No decision has been made yet.** After the evaluation, the outcome is recorded as an
> ADR in `09-adr.md`.

## 1. Purpose

Phase 1 Tony = **pure Letta Code** (brain + CLI). In Phase 2 Tony should **act**: email,
CRM, notifications, webhooks, etc. This document compares automation-engine candidates
before any commitment.

## 2. Evaluation Criteria

| Criterion | Weight | Notes |
|----------|--------|-------|
| **Permissive license** | High | Must support open-source/portfolio/paid derivatives |
| **Self-hosted** | High | Data & control stay on our VPS |
| **Bridge to Letta (MCP)** | High | Letta uses MCP client/tools |
| Required integrations | Medium | Email, CRM, notifications, webhooks (fairly common) |
| Operational effort (ops) | Medium | DB, Redis, updates, backups |
| Extensibility (custom pieces) | Low–Medium | If custom integrations are needed |

## 3. Candidates & Comparison

### 3.1 Activepieces

- **License:** Community Edition **MIT** + enterprise features (RBAC/SSO/audit)
  **commercial**.
- **Self-host:** ✅ Yes (Docker; lightweight, ~1 CPU / 512MB–2GB RAM). Paid cloud also exists.
- **MCP:** ✅ **Native** — pieces automatically become MCP servers; ~280–400 MCP servers;
  AI-agent support.
- **Integrations:** 700+ pieces (TypeScript); email/CRM/notifications/webhooks available.
- **Stack:** TypeScript, Fastify + BullMQ, PostgreSQL + Redis, React + Tailwind.
- **Notes:** AI-first; **per-flow pricing** in cloud (self-host free, unlimited runs).
- **Verdict:** leading candidate — most permissive & MCP-native.

### 3.2 n8n

- **License:** **Fair-code (Sustainable Use)** — not fully open-source; restrictions on
  commercial derivative distribution.
- **Self-host:** ✅ Yes (free Community Edition).
- **MCP:** ✅ Supported (added later; not as native as Activepieces).
- **Integrations:** 500+ nodes; the largest ecosystem/template set in this category.
- **Stack:** TypeScript, MySQL/Postgres, Vue.
- **Notes:** More mature UI/UX; largest community.
- **Verdict:** strong functionally, **main weakness is the license**.

### 3.3 Dify

- **License:** **Modified Apache 2.0** — forbids multi-tenant SaaS without a commercial
  license + logo must be kept (similar to the rejected LobeHub restrictions).
- **Self-host:** ✅ Yes (Community Edition, feature-par with Cloud).
- **MCP:** ✅ Supported.
- **Positioning:** An **LLM app builder** platform (RAG, agents, prompt IDE) — it competes
  with **Letta as the "brain"**, not the "hands".
- **Verdict:** ❌ **Not suitable as "hands"**; using it would overlap Letta's role and
  violate the permissive-license spirit.

### 3.4 Make / Zapier

- **License:** **Proprietary**.
- **Self-host:** ❌ Cloud-only.
- **Notes:** Very broad integrations, but incompatible with self-hosting & free-license
  principles.
- **Verdict:** ❌ Rejected.

## 4. Summary Table

| Candidate | License | Self-host | MCP-native | Position | Status |
|----------|---------|-----------|------------|---------|--------|
| **Activepieces** | MIT (CE) + commercial EE | ✅ | ✅ (best) | Hands | ⭐ Recommendation |
| n8n | Fair-code | ✅ | ⚠️ | Hands | Fallback |
| Dify | Modified Apache 2.0 | ✅ | ✅ | Brain (overlap) | ❌ |
| Make/Zapier | Proprietary | ❌ | — | — | ❌ |

## 5. Preliminary Recommendation

**Activepieces** as the primary "hands" choice because:

1. Most permissive license (MIT CE) — aligned with project goals.
2. **MCP native** — the most natural bridge to Letta (Letta MCP client → AP MCP server).
3. Lightweight self-host on the same VPS.
4. TypeScript stack aligned with the ecosystem.

n8n as fallback if features/ecosystem matter more than pure MIT (with fair-code caveats).

## 6. Open Questions (for the final decision)

- [ ] Which concrete integrations will Tony *definitely* need? (email? which CRM? which notifications?)
- [ ] Is **MCP** needed as the bridge, or are **webhooks** enough?
- [ ] Automation volume/traffic: is a small self-host enough?
- [ ] Willing to accept fair-code licensing (n8n) if ecosystem outweighs pure MIT?
- [ ] Decision deadline? (suggested: after Phase 1 stabilizes)

## 7. Decision (to fill after evaluation)

- **Decision date:** _(TBD)_
- **Chosen component:** _(TBD)_
- **Rationale:** _(TBD)_
- **Bridge:** _(TBD — MCP / webhook)_
- **Recorded as:** ADR-002 / ADR-005 update in `docs/09-adr.md`.
