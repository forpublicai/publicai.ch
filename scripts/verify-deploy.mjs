#!/usr/bin/env node
// verify-deploy.mjs — post-deploy check that the live site matches the build.
//
// The FTP deploy action exits 0 even when individual uploads fail (e.g. the
// host's disk quota is full), which once left the live homepage pointing at
// CSS/JS files that were never uploaded. This script fetches every file in
// build/client from the live site and fails unless each one returns HTTP 200
// with exactly the local byte size.
//
// Usage: node scripts/verify-deploy.mjs [baseUrl] [dir]
//   baseUrl defaults to config.json site.canonicalBase, dir to build/client.

import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const CONCURRENCY = 8;
const ATTEMPTS = 3;

const config = JSON.parse(await readFile("config.json", "utf8"));
const baseUrl = (process.argv[2] ?? config.site.canonicalBase).replace(/\/$/, "");
const root = process.argv[3] ?? "build/client";

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return files.flat();
}

async function check(file) {
  const path = "/" + relative(root, file).split(sep).map(encodeURIComponent).join("/");
  const expected = (await stat(file)).size;
  let problem = "";
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(baseUrl + path, { headers: { "cache-control": "no-cache" } });
      const actual = (await res.arrayBuffer()).byteLength;
      if (res.status !== 200) problem = `HTTP ${res.status}`;
      else if (actual !== expected) problem = `size ${actual} bytes, expected ${expected}`;
      else return null;
    } catch (err) {
      problem = `request failed: ${err.message}`;
    }
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
  return `${path}: ${problem}`;
}

const files = await walk(root);
const failures = [];
let next = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < files.length) {
      const failure = await check(files[next++]);
      if (failure) failures.push(failure);
    }
  }),
);

if (failures.length) {
  failures.sort();
  console.error(`::error::${failures.length} of ${files.length} files are missing or differ on ${baseUrl}`);
  for (const f of failures) console.error(`  ${f}`);
  console.error("Check the deploy log for upload errors such as '552 Quota exceeded'.");
  process.exit(1);
}
console.log(`All ${files.length} files in ${root} are live on ${baseUrl}.`);
