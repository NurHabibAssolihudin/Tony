# Mods & Examples

> Documentation of Tony's native engine (vendored Letta Code v0.30.32).
> Curated snapshot owned by the Tony project; sync manually on re-vendor.
> Example sources live in [`examples/mods/`](examples/mods/).

Mods are trusted local TypeScript extensions that can alter harness behavior.
Install one by copying it into `~/.letta/mods/` and running `/reload`, or point a
session at a custom directory via `LETTA_MODS_DIR=/path/to/mods`.

## Bundled example: `memory-citations.ts`

Prototype mod for ChatGPT-style memory references. It:

- injects a turn-start reminder asking the agent to cite observed memory use;
- tracks tool calls whose args reference the current MemFS memory directory;
- registers `memory_citation_snapshot`, a read-only tool the model can call before its
  final answer;
- optionally registers `/memory-citations` in interactive sessions.

The v0 provenance is intentionally conservative: `tool_start` fires *before* execution,
so the mod observes memory paths passed to tools rather than successful reads.
Shell-command matches are marked `medium` confidence.

## Mod learning (dogfooding)

The upstream learning harness (`scripts/mod-learning/learn-mod.ts` in the vendored
source) uses the mod system to generate new mods:

1. read a target env/demo;
2. ask a fresh headless agent to generate a candidate mod;
3. run a second headless eval with `LETTA_MODS_DIR` pointed at the candidate directory;
4. save prompts, stdout/stderr, the candidate, and a pass/fail report under
   `.letta/mod-learning-runs/`.

```bash
bun run mod-learning:memory-citations      # from letta-code/ source checkout
```

Inside the TUI: `/mods learn memory-citations` streams progress into the transcript and
writes the same artifacts. Learned mods are **never installed automatically** — review
the candidate first, then copy it into your mods directory and `/reload`.

Shell usage runs detached by default (`background.stdout`, `background.stderr`,
`background.json` in the run directory). Pass `--foreground` to block and get a
pass/fail exit code (e.g., for CI).

Options: default env is `examples/mods/learning/memory-citations.env.json`;
`--candidate path/to/mod.ts` skips generation; `--promote-to <path>` copies a passing
candidate into a repo path.

## Why mods matter for Tony

Mods are the deepest extension point: Tony can evolve its own harness behavior over
time (with human review). Treat them like code — small, reviewed, versioned.
