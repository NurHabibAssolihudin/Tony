#!/usr/bin/env node
// Tony unit-test runner (thin orchestration over `bun test`).
//
// Runs the engine unit tests, excluding the API-gated integration suite
// (engine/src/integration-tests). Bun shares module mocks / process globals
// across files in one process, so files listed in engine/scripts/
// isolated-unit-tests.json are each run in their own process (mirroring the
// upstream requirement). Everything else runs in chunked `bun test` batches.
//
// Modes:
//   full (default)   -> all unit tests (used on main push, nightly, re-vendor)
//   --changed-only   -> only unit targets touched by a PR's changed files
//
// Usage:
//   node scripts/tony/run-unit-tests.mjs
//   node scripts/tony/run-unit-tests.mjs --changed-only --base <sha> --head <sha>

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const engineDir = join(repoRoot, "engine");

const UNIT_ROOTS = ["src"];
const EXTRA_ROOTS = ["scripts/claude-watch", "scripts/codex-watch"];
const SKIP_DIR_NAMES = new Set(["node_modules", ".git", "dist", "integration-tests"]);
// Tests that need a system secret service (libsecret / OS keychain) which CI
// runners do not provide. Kept out of the suite so it stays deterministic; see
// docs/13-security-audit.md (manual note).
const ENV_DEPENDENT_SKIPS = new Set(["src/mcp-oauth.test.ts"]);
const BULK_TIMEOUT_MS = 15000;
const MAX_CHUNK_CHARS = 20000;

function parseArgs(argv) {
  const args = { changedOnly: false, base: null, head: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--changed-only") args.changedOnly = true;
    else if (a === "--base") args.base = argv[++i];
    else if (a === "--head") args.head = argv[++i];
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

function isTestFile(name) {
  return name.endsWith(".test.ts") || name.endsWith(".test.tsx");
}

function walkTests(relRoot) {
  const out = [];
  const rootAbs = join(engineDir, relRoot);
  function walk(rel) {
    let entries;
    try {
      entries = readdirSync(join(engineDir, rel), { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (SKIP_DIR_NAMES.has(entry.name)) continue;
        walk(`${rel}/${entry.name}`);
      } else if (entry.isFile() && isTestFile(entry.name)) {
        out.push(`${rel}/${entry.name}`);
      }
    }
  }
  walk(relRoot);
  void rootAbs;
  return out;
}

function loadIsolated() {
  const manifestPath = join(engineDir, "scripts", "isolated-unit-tests.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const map = new Map();
  for (const entry of manifest.tests ?? []) {
    map.set(entry.path, { timeoutMs: entry.timeoutMs, env: entry.env ?? {} });
  }
  return map;
}

function gitChangedFiles(base, head) {
  return execFileSync("git", ["diff", "--name-only", base, head], {
    cwd: repoRoot,
    encoding: "utf8",
  })
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function selectChangedFiles(changed, allFiles) {
  const dirsTouched = new Set();
  const filesTouched = new Set();
  for (const file of changed) {
    if (file.startsWith("engine/src/")) {
      const rest = file.slice("engine/src/".length);
      const segments = rest.split("/");
      if (segments[0] === "integration-tests") continue;
      if (segments.length > 1) dirsTouched.add(`src/${segments[0]}`);
      else if (isTestFile(rest)) filesTouched.add(`src/${rest}`);
    } else if (file.startsWith("engine/scripts/")) {
      for (const extra of EXTRA_ROOTS) {
        if (file.startsWith(`engine/${extra}/`)) dirsTouched.add(extra);
      }
    }
  }
  const selected = new Set();
  for (const file of allFiles) {
    if (filesTouched.has(file)) selected.add(file);
    else if ([...dirsTouched].some((d) => file.startsWith(`${d}/`))) {
      selected.add(file);
    }
  }
  return [...selected].sort();
}

function chunkByLength(files) {
  const chunks = [];
  let chunk = [];
  let chars = 0;
  for (const file of files) {
    const next = file.length + 3;
    if (chunk.length > 0 && chars + next > MAX_CHUNK_CHARS) {
      chunks.push(chunk);
      chunk = [];
      chars = 0;
    }
    chunk.push(file);
    chars += next;
  }
  if (chunk.length > 0) chunks.push(chunk);
  return chunks;
}

function runBunTest(targets, timeoutMs, extraEnv = {}) {
  execFileSync("bun", ["test", ...targets, "--timeout", String(timeoutMs)], {
    cwd: engineDir,
    stdio: "inherit",
    // Default telemetry off for tests (matching upstream). Isolated telemetry
    // contract tests opt back in via their manifest env (LETTA_CODE_TELEM=1).
    env: { ...process.env, LETTA_CODE_TELEM: "0", ...extraEnv },
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const allFiles = [
    ...new Set([...UNIT_ROOTS, ...EXTRA_ROOTS].flatMap(walkTests)),
  ]
    .filter((file) => !ENV_DEPENDENT_SKIPS.has(file))
    .sort();
  const isolated = loadIsolated();

  let files = allFiles;
  if (args.changedOnly) {
    if (!args.base || !args.head) {
      console.warn(
        "run-unit-tests: --changed-only without --base/--head; running all files",
      );
    } else {
      files = selectChangedFiles(gitChangedFiles(args.base, args.head), allFiles);
      if (files.length === 0) {
        console.log(
          "run-unit-tests: no engine unit tests impacted by the change; nothing to run",
        );
        return;
      }
      console.log(
        `run-unit-tests: changed-only ${files.length}/${allFiles.length} file(s)`,
      );
    }
  } else {
    console.log(`run-unit-tests: running all ${allFiles.length} file(s)`);
  }

  const bulk = files.filter((f) => !isolated.has(f));
  const isolatedFiles = files.filter((f) => isolated.has(f));

  // Run isolated (stateful/mock-heavy) suites first, each in a fresh process,
  // so they cannot poison the shared batch.
  for (const file of isolatedFiles) {
    const { timeoutMs, env } = isolated.get(file);
    console.log(`run-unit-tests: isolated ${file}`);
    runBunTest([file], timeoutMs ?? BULK_TIMEOUT_MS, env);
  }

  for (const chunk of chunkByLength(bulk)) {
    runBunTest(chunk, BULK_TIMEOUT_MS);
  }

  console.log(
    `run-unit-tests: OK (${isolatedFiles.length} isolated + ${bulk.length} batched)`,
  );
}

main();
