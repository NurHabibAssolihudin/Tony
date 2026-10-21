# Tony - repository guide

Tony is a self-hosted personal AI assistant built natively on the **Letta Code**
engine. This repository is a **monorepo**: Tony's own material lives at the repo
root, and the vendored engine lives in `engine/`.

## Layout

| Path | Owner | Notes |
|------|-------|-------|
| `engine/` | upstream (vendored Letta Code) | Source, scripts, build config. Do **not** hand-edit; re-vendor per `docs/12-vendor-sync.md`. |
| `engine/vendor/` | upstream (patched) | Vendored `ink` / `ink-text-input` build files. Tracked in git; applied by `engine/scripts/postinstall-patches.js`. |
| `docker/`, `compose.yaml` | Tony | Engine runtime image + compose. |
| `docs/01..12`, `docs/app/` | Tony | Project plan, curated engine docs. |
| `README.md`, `NOTICE`, `LICENSE`, `.gitignore` | Tony | |
| `.github/` | upstream content, root-owned | GitHub only reads workflows from the repo root. |
| `vendor` policy | see `docs/12-vendor-sync.md` | |

## Running

```bash
bun run setup        # install engine deps (bun install --cwd engine)
bun run check        # lint + typecheck + structural checks (proxies to engine/)
bun run build        # bundle the engine CLI
bun run dev          # run the engine from source
```

The root `package.json` is a thin wrapper: every script delegates to `engine/`
with `bun run --cwd engine ...`. The engine keeps its own `node_modules` and
`bun.lock` (self-contained) so engine tests that use relative
`../../node_modules/...` paths keep working. Prefer the root scripts.

Docker:

```bash
docker compose build
docker compose run --rm tony
```

## Working on the engine

- The engine is vendored from upstream `letta-ai/letta-code` (pinned; see
  `engine/package.json` and `docs/12-vendor-sync.md`). Keep it pristine so
  re-vendoring produces a small, reviewable diff.
- Engine-local conventions live in `engine/AGENTS.md` and its nested
  `AGENTS.md` files (for example `engine/src/cli/AGENTS.md`). Those apply when
  editing under `engine/`.
- If you need a behaviour change in the engine, prefer a Tony-owned layer (mods,
  config, wrapper) over editing vendored files. If an edit is unavoidable,
  record it in `docs/12-vendor-sync.md` so it is re-applied after re-vendor.

## Conventions

- Conventional Commits, one logical change per PR.
- Run `bun run check` before committing.
- Never commit secrets. `.env` is gitignored; use `.env.example` as the template.
