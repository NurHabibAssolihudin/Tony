# 13 - Security audit (data egress & telemetry)

This document records what the vendored Letta Code engine can send off the
machine, the controls that disable it, the "safe profile" Tony ships, and the
automated audit that runs on every change and every re-vendor.

> Machine-readable baseline: [`security-baseline.json`](security-baseline.json).
> Enforced by [`scripts/tony/audit-egress.mjs`](../scripts/tony/audit-egress.mjs)
> in CI (`.github/workflows/tony-guardrails.yml`) and by the re-vendor script.

## Data-egress inventory

| Surface | Destination | When | Default | Control |
|---|---|---|---|---|
| **Telemetry** | `POST https://api.letta.com/v1/metadata/telemetry` | CLI / server runs | **on** | `LETTA_CODE_TELEM=0`, `DO_NOT_TRACK=1` |
| **Scarf** (`@scarf/scarf`) | `scarf.sh` | dependency install (postinstall) | **on** | `SCARF_ANALYTICS=false`, `DO_NOT_TRACK=1`, `--ignore-scripts` |
| **Backend `api`** | `getServerUrl()` → `https://api.letta.com` | always by default | **on** | use backend `local`, or set `LETTA_BASE_URL` |
| **MemFS git sync** | defaults to `api.letta.com` | when memory sync enabled | follows default | override MemFS base URL |
| **Auto-updater** | npm registry for `@letta-ai/letta-code` | startup | on | `DISABLE_AUTOUPDATER=1` |
| **LLM providers** | the provider **you** configure (OpenAI/Anthropic/OpenRouter/…) | every turn | — | inherent to using a cloud model |

Code references: telemetry endpoint `engine/src/backend/api/metadata.ts:39-56`;
opt-outs `engine/src/telemetry/index.ts:357-369`; default server
`engine/src/backend/api/client.ts:112-119`; updater default
`engine/src/updater/auto-update.ts:33`.

### What telemetry actually contains

- `session_start`: `startup_command` (**your CLI args**, which can include a
  prompt if passed via `-p`), version, platform, node version.
- `user_input`: **metadata only** — length, whether it was a command, command
  name, model id (NOT the message text). `engine/src/telemetry/index.ts:730-744`.
- `tool_usage`, `reflection_*`: names/ids/model.
- `error`: `error_message`, `recent_chunks`, `debug_log_tail`
  (`engine/src/telemetry/index.ts:707-723`) — **can contain sensitive content**.

The message body you type is NOT sent through the `user_input` telemetry event;
the higher-risk paths are the **`api` backend** (sends agent/conversation/memory
to the server) and **error telemetry**.

## Safe profile

Tony ships a conservative default intended to avoid unintentional egress.
See `docker/Dockerfile` and `.env.example`:

| Variable | Value | Effect |
|---|---|---|
| `LETTA_CODE_TELEM` | `0` | Disable Letta Code telemetry |
| `DO_NOT_TRACK` | `1` | General "do not track" (telemetry + install analytics) |
| `SCARF_ANALYTICS` | `false` | Disable install-time Scarf analytics |
| `DISABLE_AUTOUPDATER` | `1` | Disable the npm self-updater |
| `LETTA_LOCAL_BACKEND_EXPERIMENTAL` | `1` | (optional) in-process local backend — no Letta server/cloud |

The first four are set by default in the engine image. The local-backend flag is
documented but **not** forced, because it changes the runtime backend; enable it
when you want a fully server-free, no-cloud setup. Update this document and
`.env.example` together whenever the profile changes.

For the strongest guarantee, also constrain container egress (allow only the LLM
provider you use); the audit below is about *code*, the firewall is about
*network*.

## Automated audit

`scripts/tony/audit-egress.mjs`:

1. **Marker checks (must exist):** telemetry opt-out envs, the telemetry
   endpoint, the updater opt-out, and the `@scarf/scarf` dependency — so these
   safety controls cannot silently disappear on an upstream update.
2. **Host delta:** extracts every `http(s)://host` from engine source (plus
   `docker/` and `.env.example`), ignoring tests, prompts and markdown, and
   fails on any host not listed in `security-baseline.json`.
3. Exits non-zero on any drift.

It runs:

- in CI on every PR and push to `main` (`Tony Guardrails`), and
- from `scripts/tony/re-vendor.mjs` after replacing `engine/`, so a new upstream
  egress surface blocks the re-vendor until reviewed.

### When the audit fails

1. Identify the new host/marker and where it comes from (the audit prints files).
2. Decide: is the egress intended?
   - **Intended** → add it to `security-baseline.json` (with a category comment)
     and update this document, then commit.
   - **Unintended** → remove/disable it (env, config, or a recorded `localEdit`
     in `docs/vendor-manifest.json`), then re-run the audit.
3. Never widen the baseline "to make CI green" without a reason.

## Re-vendor checklist (privacy)

Run in addition to `docs/12-vendor-sync.md`:

- [ ] `node scripts/tony/audit-egress.mjs` passes (or the delta was reviewed).
- [ ] Telemetry opt-outs still present (`LETTA_CODE_TELEM`, `DO_NOT_TRACK`).
- [ ] Check for NEW telemetry event fields, especially in `error`/`user_input`
      (`engine/src/telemetry/index.ts`) — payload changes are not fully caught
      automatically.
- [ ] Updater default target and `DISABLE_AUTOUPDATER` unchanged.
- [ ] Safe-profile env (`docker/Dockerfile`, `.env.example`) still applies.
