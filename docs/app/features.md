# Tony Engine Features

> Documentation of Tony's native engine (vendored Letta Code v0.30.32).
> This is a curated snapshot owned by the Tony project; sync manually against
> upstream release notes when re-vendoring.
>
> Tags: **[self-hosted ✅]** works fully offline/self-hosted · **[cloud 🔑]** requires
> signing in with Letta Cloud — out of scope for self-hosted Tony.

Tony runs on **Letta Code**, a stateful agent harness. Its agents have memory,
identity, and a sense of experience over time: they learn and evolve across long
horizons by rewriting their own memory, skills, prompts, and even the harness
itself (through *mods*).

## Feature overview

| Feature | Description | Scope |
|---|---|---|
| Self-improvement & learning | Agents programmatically rewrite their context to improve and adapt over time — system-prompt learning via [memory blocks] and skill learning. Configure periodic "dreaming" with `/sleeptime`, audit memory quality with `/doctor`, inspect memory with `/palace`. | self-hosted ✅ |
| Message search | Search across all messages and agents with `/search`. Agents can also search their own or other agents' conversations. | self-hosted ✅ |
| MemFS | All context (including memory blocks) is tracked via git under `~/.letta`. Sync context to a custom GitHub repository with `/memory-repository set git@github.com:...`. | self-hosted ✅ |
| Skills | Global skills (`~/.letta`), project-scoped skills (`.agents/skills`), and agent-scoped skills (stored in MemFS). View with `/skills`, create with `/skill-creator`, install from GitHub/ClawHub/Hermes with `letta skills install <skill>`. | self-hosted ✅ |
| Subagents & multi-agent | Built-in subagents (general-purpose, forked, recall, history-analyzer), callable async or sync. Any agent can call any other agent (including itself) as a subagent. | self-hosted ✅ |
| Messaging integrations | Chat with the same agent from Telegram, Slack, Discord, WhatsApp, Signal, or custom channels — powered by the self-hosted App Server. | self-hosted ✅ |
| Hooks | Run custom scripts at key points of agent execution to automate workflows. | self-hosted ✅ |
| Permissions | Permission modes plus fine-grained auto-approve / auto-deny rules per action. | self-hosted ✅ |
| Crons & schedules | Heartbeats and crons let agents work proactively across time with self-managed schedules. | self-hosted ✅ |
| Mods | Trusted local TypeScript extensions that can alter harness behavior; agents can even generate new ones ("mod learning"). See [mods-examples.md](mods-examples.md). | self-hosted ✅ |
| MCP client | Connect external MCP servers as tools — the planned bridge to automation (Phase 2). Includes OAuth support. | self-hosted ✅ |
| Built-in toolset | Shell/bash, file read/write/edit/multi-edit, glob/grep, LSP read, image viewing, task management, todo tracking, git worktrees, process monitoring, and more. | self-hosted ✅ |
| Remote & multi-env routing | Run one cloud-stored agent across many registered machines (`--env-name`, `--environment`). | cloud 🔑 |
| Secrets manager | Obfuscated environment-variable secrets synced across machines. | cloud 🔑 |
| chat.letta.com web/mobile UI | Hosted web & mobile interface. Cloud-only — cannot be used against self-hosted agents. | cloud 🔑 ❌ |

## What this means for Tony

- Everything tagged **self-hosted ✅** runs locally with no Letta account: state lives in
  `~/.letta` (MemFS, git-backed) on your machine/VPS.
- The engine's own research lineage (MemGPT, sleep-time/"dreaming" compute) backs the
  memory features that define Tony as "an assistant that remembers".
- Cloud-tagged features are explicitly out of scope per ADR-002/ADR-010; revisit only if
  the self-hosted principle changes.

## References

- Upstream repo: https://github.com/letta-ai/letta-code
- Upstream docs: https://docs.letta.com
- Vendored source: [`letta-code/`](../../letta-code/) (v0.30.32, commit `1e78870`)
