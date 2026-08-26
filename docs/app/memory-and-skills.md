# Tony Memory & Skills

> Documentation of Tony's native engine (vendored Letta Code v0.30.32).
> Curated snapshot owned by the Tony project; sync manually on re-vendor.

Memory is Tony's defining capability: the engine descends from MemGPT and
sleep-time ("dreaming") compute research, and agents manage their own context.

## Memory model

- **Memory blocks** — editable units of system-prompt-level context. The agent rewrites
  them programmatically as it learns about you (system-prompt learning).
- **MemFS** — all agent context (including memory blocks) lives under `~/.letta` and is
  tracked via **git**, which makes memory inspectable, diffable, backup-friendly, and
  portable.
- **Skill learning** — the agent distills reusable procedures into skills over time.

## Memory commands

| Command | Purpose |
|---|---|
| `/palace` | View the agent's current memory state |
| `/doctor` | Audit memory quality |
| `/sleeptime` | Configure periodic "dreaming": offline reflection that improves memory between conversations |
| `/search <query>` | Search across all messages/agents |
| `letta memory status --agent <id>` / `letta memory diff --agent <id>` | Inspect memory from outside the TUI |
| `/memory-repository set git@github.com:...` | Sync MemFS to a git repository |

## Verifying cross-session memory (Tony acceptance test)

1. Tell Tony something in a conversation, note its reply.
2. Exit (`Ctrl+D`), start `letta` again, open `/new`.
3. Ask *"What did I tell you earlier?"* — it should remember.

## Skills

Three scopes:

| Scope | Location | Notes |
|---|---|---|
| Global | `~/.letta/skills/` | Available to all agents on the machine |
| Project | `.agents/skills/` in a repo | Scoped to that working directory |
| Agent-scoped | Stored in the agent's MemFS | Travels with the agent |

Commands:

```bash
/skills                                   # view loaded skills
/skill-creator                            # author a new skill interactively
letta skills list --agent <agent-id>
letta skills install https://github.com/owner/repo            # from GitHub (repo/tree/blob URLs work)
letta skills install <skill-slug>                             # ClawHub / Hermes sources
letta skills delete <skill-name> --agent <agent-id>
```

## Backups

Because MemFS is git-backed, backing up `~/.letta` (or pushing the memory repository)
is sufficient to preserve everything Tony knows. See the deployment guide for a
scheduled-backup recipe (`docs/06-deployment-guide.md`).
