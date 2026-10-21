# 12 - Vendored engine sync (Letta Code)

Tony builds on the **Letta Code** engine as a *vendored dependency*: a pinned copy
of upstream source lives in `engine/` and is treated as external code. This
document defines what Tony owns, what upstream owns, and how to re-vendor safely.

> Machine-readable source of truth: [`vendor-manifest.json`](vendor-manifest.json).
> Used by `scripts/tony/re-vendor.mjs` and `scripts/tony/check-pins.mjs`.

## Ownership

| Area | Owner | Paths |
|------|-------|-------|
| Engine (vendored Letta Code) | upstream | `engine/` - `src`, `scripts`, `assets`, `hooks`, `nix`, `bin`, `vendor`, `.cursor`, `.skills`, `.husky`, `docs`, `package.json`, `bun.lock`, build/ts/nix config |
| Tony | this project | `docs/`, `docker/`, `compose.yaml`, `README.md`, `NOTICE`, `LICENSE`, `.gitignore`, `.gitattributes`, `.dockerignore`, `.env.example`, root `package.json`, root `AGENTS.md`, `scripts/tony/`, `.github/` |

Notes:

- `.github/` stays at the **repo root** even though its content originates from
  upstream - GitHub only reads workflows from the repo root.
- `engine/vendor/` (patched `ink` / `ink-text-input` build files) is upstream's
  mechanism but **must stay tracked in git**; `.gitignore` anchors its
  build-output rule (`/build/`) so it does not swallow `engine/vendor/**/build`.
- The engine is **self-contained**: it keeps its own `node_modules` and
  `bun.lock`, so engine tests that use relative `../../node_modules/...` paths
  work. Install with `bun run setup` (i.e. `bun install --cwd engine`).

## Local edits to the engine

Prefer a Tony-owned layer (mods, config, wrapper) over editing `engine/`.
When an edit is unavoidable, record it in `vendor-manifest.json` under
`localEdits` and keep the patched file under `docs/vendor-local-edits/` mirroring
its `engine/` path, so the re-vendor script can re-apply it. Never edit
`engine/` without recording it here.

Current local edits: **none**.

## Re-vendor runbook

Use the script (dry-run first):

```bash
node scripts/tony/re-vendor.mjs --to vX.Y.Z            # plan only
node scripts/tony/re-vendor.mjs --to vX.Y.Z --apply    # perform it
```

It will:

1. refuse to run on a dirty tree,
2. clone the target upstream tag,
3. replace `engine/` with the fresh clone,
4. re-apply recorded `localEdits`,
5. update `vendor-manifest.json` and the pinned version references,
6. run `bun run setup` and `bun run check`.

Manual equivalent:

```powershell
git rm -rf engine
git clone --depth 1 --branch vX.Y.Z https://github.com/letta-ai/letta-code engine
# update the pin in docs/vendor-manifest.json + README.md, NOTICE, docs/02, 05, 07, docs/app/*.md
# re-apply any localEdits
bun run setup
bun run check
```

`docs/app/` is Tony-curated and must be synced by hand against the upstream
release notes after a re-vendor (see ADR-011).

## Guardrails

`.github/workflows/tony-guardrails.yml` fails a change when:

- `engine/vendor` is not tracked in git, or
- the pinned version references drift from `engine/package.json`
  (`scripts/tony/check-pins.mjs`).

Run the pin check locally:

```bash
node scripts/tony/check-pins.mjs
```
