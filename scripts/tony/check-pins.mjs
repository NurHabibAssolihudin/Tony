#!/usr/bin/env node
// Verifies that the pinned Letta Code version/commit recorded in docs matches
// the vendored engine (engine/package.json), and that every documented pin
// reference in the manifest is present. Run in CI (Tony Guardrails workflow).

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");

function read(rel) {
  return readFileSync(join(repoRoot, rel), "utf8");
}

function loadManifest() {
  return JSON.parse(read("docs/vendor-manifest.json"));
}

function render(template, upstream) {
  return template
    .replaceAll("{version}", upstream.version)
    .replaceAll("{tag}", upstream.tag)
    .replaceAll("{shortCommit}", upstream.shortCommit)
    .replaceAll("{commit}", upstream.commit);
}

function main() {
  const manifest = loadManifest();
  const upstream = manifest.upstream;
  const failures = [];

  const enginePackage = JSON.parse(read(join(upstream.dir, "package.json")));
  if (enginePackage.version !== upstream.version) {
    failures.push(
      `engine/package.json version "${enginePackage.version}" != manifest version "${upstream.version}"`,
    );
  }

  for (const ref of manifest.pinReferences) {
    const expected = render(ref.contains, upstream);
    let contents;
    try {
      contents = read(ref.file);
    } catch {
      failures.push(`${ref.file}: file not found`);
      continue;
    }
    if (!contents.includes(expected)) {
      failures.push(`${ref.file}: missing pin reference "${expected}"`);
    }
  }

  if (failures.length > 0) {
    console.error("check-pins: FAILED");
    for (const failure of failures) console.error(`  - ${failure}`);
    console.error(
      "\nUpdate docs/vendor-manifest.json and the pin references after re-vendoring",
      "(see docs/12-vendor-sync.md), or fix the drifted text.",
    );
    process.exit(1);
  }

  console.log(
    `check-pins: OK (pinned v${upstream.version}, ${upstream.shortCommit}; ${manifest.pinReferences.length} references verified)`,
  );
}

main();
