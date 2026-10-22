#!/usr/bin/env node
// Tony security egress audit.
//
// Scans the vendored engine (plus docker/ and .env.example) for outbound
// hosts and telemetry markers, and fails when something is NOT in the curated
// baseline (docs/security-baseline.json). This runs on every CI change and is
// invoked by scripts/tony/re-vendor.mjs so new egress surfaces cannot slip in
// on an upstream update without review.
//
// Usage:
//   node scripts/tony/audit-egress.mjs

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const baselinePath = join(repoRoot, "docs", "security-baseline.json");

const BINARY_EXTENSIONS = new Set([
  ".png",
  ".gif",
  ".jpg",
  ".jpeg",
  ".webp",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".pdf",
  ".node",
  ".wasm",
  ".map",
]);

function toPosix(p) {
  return p.replaceAll("\\", "/");
}

function globToRegExp(glob) {
  const normalized = toPosix(glob);
  let out = "^";
  for (let i = 0; i < normalized.length; i++) {
    const c = normalized[i];
    if (c === "*") {
      if (normalized[i + 1] === "*") {
        // "**" — match across path separators; consume a trailing slash if any.
        if (normalized[i + 2] === "/") {
          out += "(?:.*/)?";
          i += 2;
        } else {
          out += ".*";
          i += 1;
        }
      } else {
        out += "[^/]*";
      }
    } else if (c === "?") {
      out += "[^/]";
    } else if ("\\^$+?.()|{}[]".includes(c)) {
      out += `\\${c}`;
    } else {
      out += c;
    }
  }
  out += "$";
  return new RegExp(out);
}

function hostMatchesPattern(host, pattern) {
  const p = pattern.toLowerCase();
  if (p.startsWith("*.")) {
    const base = p.slice(2);
    return host === base || host.endsWith(`.${base}`);
  }
  return globToRegExp(p).test(host);
}

function isAllowedHost(host, baseline) {
  if (baseline.allowHosts.includes(host)) return true;
  return baseline.allowHostPatterns.some((pattern) =>
    hostMatchesPattern(host, pattern),
  );
}

function listFiles(scanRoots) {
  const out = [];
  const skippedDirs = new Set(["node_modules", ".git", "dist", "build"]);

  function walk(root, rel) {
    const abs = join(root, rel);
    let stat;
    try {
      stat = statSync(abs);
    } catch {
      return;
    }
    if (stat.isFile()) {
      out.push(toPosix(rel));
      return;
    }
    for (const entry of readdirSync(abs, { withFileTypes: true })) {
      if (skippedDirs.has(entry.name)) continue;
      const child = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(root, child);
      else if (entry.isFile()) out.push(toPosix(child));
    }
  }

  for (const scanRoot of scanRoots) {
    walk(repoRoot, toPosix(scanRoot));
  }
  return out;
}

function main() {
  const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
  const ignoreMatchers = (baseline.ignoreGlobs ?? []).map((glob) => ({
    glob,
    regex: globToRegExp(glob),
  }));

  const files = listFiles(baseline.scanRoots).filter((file) => {
    if (ignoreMatchers.some((m) => m.regex.test(file))) return false;
    const dot = file.lastIndexOf(".");
    const ext = dot >= 0 ? file.slice(dot).toLowerCase() : "";
    return !BINARY_EXTENSIONS.has(ext);
  });

  const hostToFiles = new Map();
  const hostRegex = /https?:\/\/([A-Za-z0-9._-]+)/g;

  for (const file of files) {
    let contents;
    try {
      contents = readFileSync(join(repoRoot, file), "utf8");
    } catch {
      continue;
    }
    for (const match of contents.matchAll(hostRegex)) {
      const host = match[1].toLowerCase().replace(/\.+$/, "");
      if (!host) continue;
      if (!hostToFiles.has(host)) hostToFiles.set(host, new Set());
      hostToFiles.get(host).add(file);
    }
  }

  const unexpected = [];
  for (const [host, sources] of hostToFiles) {
    if (!isAllowedHost(host, baseline)) {
      unexpected.push({ host, sources: [...sources].sort() });
    }
  }

  const missingMarkers = [];
  for (const marker of baseline.markers ?? []) {
    let contents;
    try {
      contents = readFileSync(join(repoRoot, marker.file), "utf8");
    } catch {
      missingMarkers.push({ ...marker, reason: "file not found" });
      continue;
    }
    if (!contents.includes(marker.contains)) {
      missingMarkers.push({ ...marker, reason: "substring missing" });
    }
  }

  console.log(
    `audit-egress: scanned ${files.length} file(s); ${hostToFiles.size} host(s) seen`,
  );

  if (unexpected.length === 0 && missingMarkers.length === 0) {
    console.log("audit-egress: OK (no unapproved egress; markers intact)");
    return;
  }

  if (unexpected.length > 0) {
    console.error("\naudit-egress: NEW/UNKNOWN outbound host(s) detected:");
    for (const { host, sources } of unexpected) {
      console.error(`  - ${host}`);
      for (const source of sources.slice(0, 5)) {
        console.error(`      ${relative(repoRoot, join(repoRoot, source))}`);
      }
    }
  }

  if (missingMarkers.length > 0) {
    console.error("\naudit-egress: expected marker(s) missing/changed:");
    for (const marker of missingMarkers) {
      console.error(
        `  - ${marker.file} :: "${marker.contains}" (${marker.reason}) — ${marker.note ?? ""}`,
      );
    }
  }

  console.error(
    "\nReview the change, then update docs/security-baseline.json and",
    "docs/13-security-audit.md if the new egress is intended.",
  );
  process.exit(1);
}

main();
