#!/usr/bin/env node
// Safe re-vendor runbook for the vendored Letta Code engine.
//
// Replaces engine/ with a fresh clone of an upstream release tag, re-applies
// Tony-owned local edits, updates the pinned version references, and (with
// --apply) reinstalls + verifies. Dry-run by default.
//
// Usage:
//   node scripts/tony/re-vendor.mjs --to v0.31.0            # dry run (plan only)
//   node scripts/tony/re-vendor.mjs --to v0.31.0 --apply    # perform the re-vendor
//
// See docs/12-vendor-sync.md for the human runbook and ownership manifest.

import { execFileSync, execSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const manifestPath = join(repoRoot, "docs", "vendor-manifest.json");

function parseArgs(argv) {
  const args = { to: null, apply: false, allowDirty: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--to") args.to = argv[++i];
    else if (arg === "--apply") args.apply = true;
    else if (arg === "--allow-dirty") args.allowDirty = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.to) throw new Error("Missing required --to <tag> (e.g. --to v0.31.0)");
  return args;
}

function log(step, message) {
  console.log(`[${step}] ${message}`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function git(args, cwd = repoRoot) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function isCleanTree() {
  return git(["status", "--porcelain"]) === "";
}

function assertCleanTree(allowDirty) {
  if (allowDirty) return;
  if (!isCleanTree()) {
    throw new Error(
      "Working tree is not clean. Commit or stash first, or pass --allow-dirty.",
    );
  }
}

function updatePinReferences(manifest, next) {
  const previous = manifest.upstream;
  const replacements = [
    [previous.version, next.version],
    [previous.tag, next.tag],
    [previous.shortCommit, next.shortCommit],
    [previous.commit, next.commit],
  ];
  const changed = [];
  for (const ref of manifest.pinReferences) {
    const file = join(repoRoot, ref.file);
    let contents = readFileSync(file, "utf8");
    let updated = contents;
    for (const [from, to] of replacements) {
      if (from && from !== to) updated = updated.split(from).join(to);
    }
    if (updated !== contents) {
      writeFileSync(file, updated);
      changed.push(ref.file);
    }
  }
  return changed;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = readJson(manifestPath);
  const upstream = manifest.upstream;
  const engineDir = join(repoRoot, upstream.dir);
  const tmpDir = join(tmpdir(), `tony-revendor-${args.to.replace(/^v/, "")}`);

  log("plan", `upstream ${upstream.repo}`);
  log("plan", `current pin v${upstream.version} (${upstream.shortCommit})`);
  log("plan", `target tag  ${args.to}`);
  log("plan", `engine dir  ${upstream.dir}/`);
  log("mode", args.apply ? "APPLY (will modify the repo)" : "dry-run (no changes)");

  assertCleanTree(args.allowDirty);

  if (!args.apply) {
    log("dry-run", "would replace engine/ with a fresh clone of the target tag");
    log("dry-run", "would re-apply localEdits (none currently)");
    log("dry-run", "would rewrite pin references in docs/README/NOTICE");
    log("dry-run", "would run: node scripts/tony/audit-egress.mjs");
    log("dry-run", "would run: bun run setup && bun run check");
    log("dry-run", "re-run with --apply to perform the re-vendor");
    return;
  }

  log("clone", `fetching ${args.to} into ${tmpDir}`);
  rmSync(tmpDir, { recursive: true, force: true });
  git(["clone", "--depth", "1", "--branch", args.to, upstream.repo, tmpDir]);
  const commit = git(["rev-parse", "HEAD"], tmpDir);
  const shortCommit = git(["rev-parse", "--short", "HEAD"], tmpDir);
  const version = args.to.replace(/^v/, "");

  log("replace", `replacing ${upstream.dir}/ with the fresh clone`);
  rmSync(engineDir, { recursive: true, force: true });
  cpSync(tmpDir, engineDir, {
    recursive: true,
    filter: (src) => !src.includes(`${join(tmpDir, ".git")}`),
  });

  for (const edit of manifest.localEdits ?? []) {
    log("local-edit", `re-applying ${edit.from} -> ${edit.to}`);
    cpSync(join(repoRoot, edit.from), join(repoRoot, edit.to), { recursive: true });
  }

  manifest.upstream = {
    ...upstream,
    version,
    tag: args.to,
    shortCommit,
    commit,
  };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  const changed = updatePinReferences({ ...manifest, upstream }, manifest.upstream);
  log("pin", `updated manifest + ${changed.length} file(s): ${changed.join(", ")}`);

  log("audit", "running egress/telemetry audit (docs/13-security-audit.md)");
  execSync("node scripts/tony/audit-egress.mjs", { cwd: repoRoot, stdio: "inherit" });

  log("install", "running bun run setup");
  execSync("bun run setup", { cwd: repoRoot, stdio: "inherit" });
  log("verify", "running bun run check");
  execSync("bun run check", { cwd: repoRoot, stdio: "inherit" });

  log("done", `re-vendored Letta Code ${args.to}. Review, then commit.`);
}

main();
