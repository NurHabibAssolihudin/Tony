# Tony Engine Configuration

> Documentation of Tony's native engine (vendored Letta Code v0.30.32).
> Curated snapshot owned by the Tony project; sync manually on re-vendor.

## Prerequisites

- **Node.js 22.19+** (`node --version`) — the published bundle targets Node
- **Python 3 + make + g++** — needed to compile native dependencies at install time
- Install: `npm install -g @letta-ai/letta-code` (alternative install paths: [nix.md](nix.md))

## First run

```bash
letta
```

A local agent is created automatically; state is stored locally and **no account/login is
required** for self-hosted use.

## LLM provider & model

| Step | Command | Notes |
|---|---|---|
| Connect provider | `/connect` | OpenAI/ChatGPT, Anthropic, Z.ai coding plan, Ollama, LM Studio, etc.; some providers support OAuth flows |
| Pick model | `/model` | Switchable at any time per agent |

Provider credentials are stored locally under `~/.letta`. Never commit them.

## Where state lives

| Path / mechanism | Content |
|---|---|
| `~/.letta/` | Root state directory (MemFS, conversations, auth, settings) |
| MemFS | Agent memory & context, tracked via git → back up by copying/backing up `~/.letta`, or sync to a remote repo with `/memory-repository set git@github.com:...` |
| `.agents/skills/` (per project) | Project-scoped skills |
| `~/.letta/mods/` | Local mods (see [mods-examples.md](mods-examples.md)) |

## Permissions & safety

- Permission modes control how much the agent may do without asking (auto-approve /
  auto-deny rules per action type).
- Workspace sandboxing constrains filesystem access.
- Recommendation for Tony: start with narrow working directories and strict approval;
  expand as trust grows.

## Hooks

Custom scripts can run at key points of agent execution to automate workflows
(configure via `/hooks` or by asking the agent itself).

## Environment variables (engine-level)

| Variable | Effect |
|---|---|
| `LETTA_DEBUG=1` | Verbose debug output |
| `LETTA_LOCAL_BACKEND_EXPERIMENTAL=1` | Enable local in-process backend experiment |
| `LETTA_LOCAL_BACKEND_DIR` | Override local-backend storage root (defaults to `~/.letta/lc-local-backend`) |
| `LETTA_MODS_DIR` | Point a session at a custom mods directory |

## Self-configuring tip

The engine is designed to configure itself: ask the agent to set up skills, behavior,
hooks, or permissions for you instead of hand-editing config.
