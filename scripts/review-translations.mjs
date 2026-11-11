#!/usr/bin/env node
// review-translations.mjs — LLM review of the site's co-located UI translations.
//
// Scans .tsx files for `Record<Locale, ...>` dictionaries (the co-located
// translation pattern used across src/ and app/), extracts every locale's
// strings — plain strings as well as arrays/objects of strings — and has an
// LLM verify each non-source locale against the source for accuracy,
// grammar, spelling and register.
//
// Connection settings are read from `.env` (or `env`) in the project root:
//   LLM_BASE_URL   e.g. https://api.publicai.co/v1
//   LLM_MODEL      e.g. swiss-ai/apertus-v1.5-70b
//   LLM_API_KEY    bearer token (never printed)
// Locales and the source locale come from config.json (site.locales,
// site.defaultLocale), with hardcoded fallbacks.
//
// Dictionaries that hold no prose (asset paths, locale codes, webform ids,
// base64 blobs) are skipped automatically. Extra skips: --skip <file:KEY>.
//
// Usage:
//   node scripts/review-translations.mjs [options] [files...]
// Options:
//   files...                .tsx files to review
//                           (default: discover under src/, app/, tools/)
//   --dry-run               show what would be reviewed, no API calls
//   --fix                   propose corrections instead of only verdicts;
//                           files are never modified — apply proposals manually
//   --source <locale>       override the source locale
//                           (default: config.json site.defaultLocale)
//   --locales <a,b,c>       restrict which locales get reviewed
//   --skip <file:KEY|KEY>   skip one dictionary (repeatable); a bare KEY
//                           skips that dictionary name in every file
//   --concurrency <n>       parallel API calls (default 3)
//   --json-out <path>       also write the full report as JSON
//   -h, --help
// Exit code: 0 when every reviewed string is accurate, 1 otherwise.

import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const USAGE = `Usage: node scripts/review-translations.mjs [options] [files...]
  --dry-run               show what would be reviewed, no API calls
  --fix                   propose corrections (writes nothing; apply manually)
  --source <locale>       override the source locale
  --locales <a,b,c>       restrict which locales get reviewed
  --skip <file:KEY|KEY>   skip one dictionary (repeatable)
  --concurrency <n>       parallel API calls (default 3)
  --json-out <path>       also write the full report as JSON
  -h, --help`;

// --- CLI -----------------------------------------------------------------

const argv = process.argv.slice(2);
const opts = {
  dryRun: false,
  fix: false,
  source: null,
  locales: null,
  skip: [],
  concurrency: 3,
  jsonOut: null,
  files: [],
};
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--dry-run") opts.dryRun = true;
  else if (a === "--fix") opts.fix = true;
  else if (a === "--source") opts.source = argv[++i];
  else if (a === "--locales") opts.locales = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
  else if (a === "--skip") opts.skip.push(argv[++i]);
  else if (a === "--concurrency") opts.concurrency = Math.max(1, Number(argv[++i]) || 3);
  else if (a === "--json-out") opts.jsonOut = argv[++i];
  else if (a === "-h" || a === "--help") { console.log(USAGE); process.exit(0); }
  else opts.files.push(a);
}

const LOCALE_FALLBACK = ["de", "en", "fr", "it", "rm"];

// --- config + env --------------------------------------------------------

function loadConfig() {
  const path = join(ROOT, "config.json");
  if (!existsSync(path)) return { locales: LOCALE_FALLBACK, defaultLocale: "en" };
  try {
    const site = JSON.parse(readFileSync(path, "utf8")).site ?? {};
    return {
      locales: Array.isArray(site.locales) && site.locales.length ? site.locales : LOCALE_FALLBACK,
      defaultLocale: site.defaultLocale ?? "en",
    };
  } catch {
    return { locales: LOCALE_FALLBACK, defaultLocale: "en" };
  }
}

function loadEnv() {
  for (const name of [".env", "env"]) {
    const path = join(ROOT, name);
    if (!existsSync(path)) continue;
    const env = Object.fromEntries(
      readFileSync(path, "utf8")
        .split(/\r?\n/)
        .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
        .map((l) => {
          const i = l.indexOf("=");
          return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
        }),
    );
    if (env.LLM_BASE_URL && env.LLM_MODEL && env.LLM_API_KEY) {
      return { file: name, baseUrl: env.LLM_BASE_URL.replace(/\/+$/, ""), model: env.LLM_MODEL, apiKey: env.LLM_API_KEY };
    }
  }
  console.error("No env file with LLM_BASE_URL, LLM_MODEL and LLM_API_KEY found (tried .env, env).");
  process.exit(1);
}

const config = loadConfig();
const SOURCE_LOCALE = opts.source ?? config.defaultLocale;
const REVIEW_LOCALES = opts.locales ?? config.locales.filter((l) => l !== SOURCE_LOCALE);

// --- lexing helpers ------------------------------------------------------

const skipWs = (src, i) => {
  while (i < src.length && /\s/.test(src[i])) i++;
  return i;
};

const CLOSERS = { "{": "}", "[": "]", "(": ")" };

function balancedEnd(src, start) {
  const closer = CLOSERS[src[start]];
  if (!closer) return -1;
  let depth = 0;
  let inStr = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") i++;
      else if (c === inStr) inStr = null;
    } else if (c === '"' || c === "'" || c === "`") inStr = c;
    else if (c === src[start]) depth++;
    else if (c === closer) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function readStringLiteral(src, i) {
  let j = i + 1;
  while (j < src.length) {
    if (src[j] === "\\") { j += 2; continue; }
    if (src[j] === '"') { j++; break; }
    j++;
  }
  const raw = src.slice(i, j);
  let text = raw;
  try { text = JSON.parse(raw); } catch { /* keep raw on unexpected escapes */ }
  return { text, end: j };
}

// --- dictionary extraction ----------------------------------------------

function findDictionaries(src) {
  const dicts = [];
  const re = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*:\s*Record\s*<\s*Locale\s*,\s*([^>]+?)\s*>\s*=\s*/g;
  let m;
  while ((m = re.exec(src))) {
    let i = skipWs(src, m.index + m[0].length);
    if (src[i] !== "{") continue;
    const end = balancedEnd(src, i);
    if (end < 0) continue;
    dicts.push({ name: m[1], typeText: m[2].trim(), bodyStart: i, bodyEnd: end + 1 });
    re.lastIndex = end + 1;
  }
  return dicts;
}

function parseLocaleEntries(src, bodyStart, bodyEnd) {
  const entries = new Map();
  let i = bodyStart + 1;
  const end = bodyEnd - 1;
  while (i < end) {
    i = skipWs(src, i);
    if (i >= end || src[i] === "}") break;
    if (src[i] === ",") { i++; continue; }
    const km = /^([A-Za-z_$][\w$]*)\s*:/.exec(src.slice(i, end));
    if (!km) { i++; continue; }
    const key = km[1];
    i = skipWs(src, i + km[0].length);
    const c = src[i];
    if (c === '"') {
      const s = readStringLiteral(src, i);
      entries.set(key, { kind: "string", text: s.text });
      i = s.end;
    } else if (CLOSERS[c]) {
      const e = balancedEnd(src, i);
      if (e < 0) break;
      entries.set(key, { kind: c === "[" ? "array" : "object", start: i, end: e + 1 });
      i = e + 1;
    } else {
      while (i < end && src[i] !== ",") i++;
    }
  }
  return entries;
}

function parseArrayItems(src, start, end) {
  const items = [];
  let i = start + 1;
  let n = 0;
  while (i < end) {
    i = skipWs(src, i);
    if (i >= end || src[i] === "]") break;
    if (src[i] === ",") { i++; continue; }
    const pos = i;
    const c = src[i];
    if (c === '"') i = readStringLiteral(src, i).end;
    else if (CLOSERS[c]) { const e = balancedEnd(src, i); if (e < 0) break; i = e + 1; }
    else { while (i < end && src[i] !== ",") i++; }
    items.push({ label: `#${++n}`, pos });
  }
  return items;
}

function parseObjectEntries(src, start, end) {
  const entries = [];
  let i = start + 1;
  while (i < end) {
    i = skipWs(src, i);
    if (i >= end || src[i] === "}") break;
    if (src[i] === ",") { i++; continue; }
    const km = /^([A-Za-z_$][\w$]*)\s*:/.exec(src.slice(i, end));
    if (!km) { i++; continue; }
    const valuePos = skipWs(src, i + km[0].length);
    entries.push({ label: km[1], pos: valuePos });
    const c = src[valuePos];
    if (c === '"') i = readStringLiteral(src, valuePos).end;
    else if (CLOSERS[c]) { const e = balancedEnd(src, valuePos); if (e < 0) break; i = e + 1; }
    else { i = valuePos; }
  }
  return entries;
}

// Flattens a dictionary value into an ordered list of leaf strings with path
// labels, so structured values (arrays of {title, body}, …) can be reviewed
// pairwise against the source locale.
function flattenValue(src, node) {
  const leaves = [];
  if (node.kind === "string") {
    leaves.push({ path: "", text: node.text });
    return leaves;
  }
  const walk = (pos, path) => {
    const c = src[pos];
    if (c === '"') {
      const s = readStringLiteral(src, pos);
      leaves.push({ path, text: s.text });
      return;
    }
    if (c === "[") {
      const e = balancedEnd(src, pos);
      for (const item of parseArrayItems(src, pos, e)) {
        walk(item.pos, path ? `${path} ${item.label}` : item.label);
      }
      return;
    }
    if (c === "{") {
      const e = balancedEnd(src, pos);
      for (const entry of parseObjectEntries(src, pos, e)) {
        walk(entry.pos, path ? `${path} ${entry.label}` : entry.label);
      }
    }
  };
  walk(node.start, "");
  return leaves;
}

// --- skip heuristics -----------------------------------------------------

// True for values that are clearly not translatable prose: asset paths,
// URLs, base64/hex blobs, numeric ids, bare locale codes.
function looksNonProse(text) {
  const t = text.trim();
  if (!t) return true;
  if (/\s/.test(t)) return false;
  return (
    t.startsWith("/") ||
    t.startsWith("http") ||
    /^[A-Za-z0-9+/=]{24,}$/.test(t) ||
    /^\d+$/.test(t) ||
    /^[A-Z]{2,4}$/.test(t)
  );
}

function isSkipped(relPath, dictName) {
  return opts.skip.some((s) => (s.includes(":") ? s === `${relPath}:${dictName}` : s === dictName));
}

// --- file discovery ------------------------------------------------------

function discoverFiles() {
  if (opts.files.length) return opts.files.map((f) => join(ROOT, f));
  const files = [];
  for (const dir of ["src", "app", "tools"]) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const rel of readdirSync(abs, { recursive: true })) {
      if (rel.endsWith(".tsx")) files.push(join(abs, rel));
    }
  }
  return files.filter((f) => /Record\s*<\s*Locale\s*,/.test(readFileSync(f, "utf8")));
}

function toPosix(p) {
  return relative(ROOT, p).split("\\").join("/");
}

// --- review jobs ---------------------------------------------------------

const LOCALE_NOTES = {
  de: "Swiss High German: never use ß (write ss). Home-page copy addresses readers with informal 'du'.",
  fr: "Swiss French; formal 'vous' for reader address.",
  it: "Swiss Italian.",
  rm: "Romansh: match the variety/register of the site's existing strings (they lean Vallader, e.g. 'Nus manain en Svizra Apertus …', 'Il chat è gratuit'). Only report concrete grammar, spelling or mistranslation issues; never propose a 'correction' that is identical to the original.",
};

function renderLeaves(leaves) {
  if (leaves.length === 1 && !leaves[0].path) return `"${leaves[0].text}"`;
  return leaves.map((l, i) => `  ${i + 1}. ${l.path}: "${l.text}"`).join("\n");
}

function buildPrompt(job) {
  const { relPath, dict, source } = job;
  const lines = [
    "Review translations for one UI string dictionary of the Public AI Switzerland website (a Swiss non-profit).",
    "",
    `File: ${relPath}`,
    `Dictionary: ${dict.name} (Record<Locale, ${dict.typeText}>; individual strings may be UI fragments, not full sentences)`,
    "",
    `Source (${source}):`,
    renderLeaves(dict.entries.get(source)),
    "",
    "Translations to verify:",
  ];
  for (const locale of job.targets) {
    lines.push(`- ${locale}:`);
    lines.push(renderLeaves(dict.entries.get(locale)));
  }
  lines.push(
    "",
    "Per-locale notes:",
    ...job.targets.map((l) => (LOCALE_NOTES[l] ? `- ${l}: ${LOCALE_NOTES[l]}` : `- ${l}: (none)`)),
    "",
    "For each target locale, judge accuracy against the source, grammar, spelling, naturalness and register.",
    "Strings with a path label are paired across locales by path label (and number).",
    "Respond ONLY with JSON, no markdown fences and no commentary:",
    '{"reviews":[{"locale":"de","verdict":"accurate","issues":[]}]}',
    "Rules: verdict is \"accurate\" or \"needs changes\"; there must be exactly one review object per target locale.",
    'Each issue must be a concrete, actionable problem (mistranslation, grammar, spelling, terminology); if you propose a fix, include the full corrected string in the issue text.',
    "Never report a problem whose correction equals the original text. Currency values and brand names identical across locales are fine.",
  );
  return lines.join("\n");
}

// --- API -----------------------------------------------------------------

const env = opts.dryRun ? null : loadEnv();

function runCurl(args) {
  return new Promise((resolve, reject) => {
    execFile("curl", args, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) { err.message = stderr ? `${err.message}\n${stderr.trim()}` : err.message; reject(err); }
      else resolve(stdout);
    });
  });
}

async function callApertus(prompt, id, maxTokens = 1500) {
  const payloadPath = join(tmpdir(), `review-translations-${process.pid}-${id}.json`);
  writeFileSync(
    payloadPath,
    JSON.stringify({
      model: env.model,
      temperature: 0.1,
      max_tokens: maxTokens,
      messages: [
        {
          role: "system",
          content:
            "You are a meticulous translation reviewer for a Swiss non-profit website. You know German, French, Italian and Romansh (including Vallader, Puter and Rumantsch Grischun). Respond only with the requested JSON.",
        },
        { role: "user", content: prompt },
      ],
    }),
  );
  try {
    const out = await runCurl([
      "-sS", "--max-time", "180",
      "-H", "Content-Type: application/json",
      "-H", `Authorization: Bearer ${env.apiKey}`,
      "-d", `@${payloadPath}`,
      `${env.baseUrl}/chat/completions`,
    ]);
    const data = JSON.parse(out);
    if (data.error) throw new Error(JSON.stringify(data.error).slice(0, 300));
    return data.choices?.[0]?.message?.content?.trim() ?? "";
  } finally {
    try { unlinkSync(payloadPath); } catch { /* best effort */ }
  }
}

function parseReviewJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("no JSON object in response");
  const parsed = JSON.parse(text.slice(start, end + 1));
  if (!Array.isArray(parsed.reviews)) throw new Error("response missing reviews[]");
  return parsed.reviews;
}

// The reviewer sometimes "corrects" a string to itself (e.g. 'x' should be
// 'x'). Such no-op suggestions are noise: drop them when the issue quotes the
// same text as both the original and the correction and asks for a change.
function isNoOpIssue(issue) {
  if (!/should|correct/i.test(issue)) return false;
  const quotes = [...issue.matchAll(/['\u00ab'`]([^'\u00bb'`]+?)['\u00bb'`]/g)]
    .map((m) => m[1].trim())
    .filter(Boolean);
  if (quotes.length < 2) return false;
  if (quotes[0] === quotes[quotes.length - 1]) return true;
  const adjacent = /['\u00ab`]([^'\u00ab\u00bb`]+)['\u00bb`][^'\u00ab\u00bb`]{0,120}?should\s+(?:be|read)\s*:?[\s]*['\u00ab`]([^'\u00ab\u00bb`]+)['\u00bb`]/i.exec(issue);
  return Boolean(adjacent) && adjacent[1].trim() === adjacent[2].trim();
}

async function reviewJob(job, id) {
  try {
    const raw = await callApertus(buildPrompt(job), id);
    const reviews = parseReviewJson(raw);
    const byLocale = new Map(reviews.map((r) => [r.locale, r]));
    const results = job.targets.map((locale) => {
      const r = byLocale.get(locale);
      if (!r) return { locale, verdict: "error", issues: [`no review returned (raw: ${raw.slice(0, 120)})`], ignoredIssues: [] };
      const rawIssues = Array.isArray(r.issues) ? r.issues.map(String) : [];
      const issues = rawIssues.filter((x) => !isNoOpIssue(x));
      const ignoredIssues = rawIssues.filter((x) => isNoOpIssue(x));
      return {
        locale,
        verdict: issues.length ? "needs changes" : "accurate",
        issues,
        ignoredIssues,
      };
    });
    return { ...job, results };
  } catch (err) {
    return { ...job, results: job.targets.map((locale) => ({ locale, verdict: "error", issues: [err.message] })) };
  }
}

async function runPool(jobs, worker, concurrency) {
  const results = new Array(jobs.length);
  let next = 0;
  async function lane() {
    while (next < jobs.length) {
      const i = next++;
      results[i] = await worker(jobs[i], i);
      const done = results.filter(Boolean).length;
      process.stdout.write(`\r  processed ${done}/${jobs.length} dictionaries…`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, lane));
  process.stdout.write("\n");
  return results;
}

// --- fix mode ------------------------------------------------------------

function buildFixPrompt(job) {
  const lines = [
    "Review and, if needed, improve translations for one UI string dictionary of the Public AI Switzerland website (a Swiss non-profit).",
    "",
    `File: ${job.relPath}`,
    `Dictionary: ${job.dict.name} (Record<Locale, ${job.dict.typeText}>; individual strings may be UI fragments, not full sentences)`,
    "",
    `Source (${job.source}):`,
    renderLeaves(job.dict.entries.get(job.source)),
    "",
    "Translations:",
  ];
  for (const locale of job.targets) {
    lines.push(`- ${locale}:`);
    lines.push(renderLeaves(job.dict.entries.get(locale)));
  }
  lines.push(
    "",
    "Per-locale notes:",
    ...job.targets.map((l) => (LOCALE_NOTES[l] ? `- ${l}: ${LOCALE_NOTES[l]}` : `- ${l}: (none)`)),
    "",
    "Propose a corrected translation ONLY for a locale whose translation has a concrete problem:",
    "mistranslation, grammar or spelling error, broken register (German 'du', French 'vous'), or terminology",
    "inconsistent with the rest of the site. Do NOT retranslate correct strings for style, and never propose",
    "a text that equals the original. Keep meaning, tone and length close to the source.",
    "",
    "Respond ONLY with JSON, no markdown fences and no commentary:",
    '{"suggestions":[{"locale":"de","original":"<current>","proposed":"<corrected>","reason":"<short>"}]}',
    "- At most one suggestion per target locale, and only where proposed differs from the original; use [] when everything is fine.",
    job.structured
      ? '- This dictionary uses numbered leaves: "original" and "proposed" must be arrays with exactly one string per leaf, in the same order, including unchanged leaves.'
      : '- "original" and "proposed" are single strings.',
  );
  return lines.join("\n");
}

function parseFixJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("no JSON object in response");
  const parsed = JSON.parse(text.slice(start, end + 1));
  if (!Array.isArray(parsed.suggestions)) throw new Error("response missing suggestions[]");
  return parsed;
}

async function fixJob(job, id) {
  try {
    const raw = await callApertus(buildFixPrompt(job), id, 3500);
    const { suggestions } = parseFixJson(raw);
    const proposals = [];
    const notes = [];
    for (const s of suggestions) {
      const locale = String(s.locale ?? "");
      const leaves = job.dict.entries.get(locale);
      if (!leaves) { notes.push(`ignored suggestion for unknown locale "${locale}"`); continue; }
      if (job.structured) {
        if (!Array.isArray(s.proposed) || s.proposed.length !== leaves.length) {
          notes.push(`ignored ${locale} suggestion (proposed does not match ${leaves.length} leaves)`);
          continue;
        }
        const changed = [];
        leaves.forEach((leaf, i) => {
          const proposedText = String(s.proposed[i] ?? leaf.text);
          if (proposedText !== leaf.text) changed.push({ path: leaf.path, original: leaf.text, proposed: proposedText });
        });
        if (changed.length) proposals.push({ locale, reason: String(s.reason ?? ""), leaves: changed });
      } else {
        const proposedText = String(s.proposed ?? "");
        const currentText = leaves[0].text;
        if (!proposedText || proposedText === currentText) continue;
        if (typeof s.original === "string" && s.original !== currentText) {
          notes.push(`ignored ${locale} suggestion (stale original)`);
          continue;
        }
        proposals.push({ locale, reason: String(s.reason ?? ""), leaves: [{ path: "", original: currentText, proposed: proposedText }] });
      }
    }
    return { ...job, proposals, notes, error: null };
  } catch (err) {
    return { ...job, proposals: [], notes: [], error: err.message };
  }
}

// --- main ----------------------------------------------------------------

const jobs = [];
for (const abs of discoverFiles()) {
  const relPath = toPosix(abs);
  const src = readFileSync(abs, "utf8");
  for (const d of findDictionaries(src)) {
    const rawEntries = parseLocaleEntries(src, d.bodyStart, d.bodyEnd);
    const entries = new Map();
    let structured = false;
    for (const [locale, node] of rawEntries) {
      if (!config.locales.includes(locale)) continue;
      const leaves = node.kind === "string" ? [{ path: "", text: node.text }] : flattenValue(src, node);
      if (node.kind !== "string") structured = true;
      entries.set(locale, leaves);
    }
    const dict = { name: d.name, typeText: d.typeText, entries };
    const allStrings = [...entries.values()].flat().map((l) => l.text);

    if (isSkipped(relPath, dict.name)) {
      console.log(`skip (by flag)   ${relPath} :: ${dict.name}`);
      continue;
    }
    if (entries.size < 2) {
      console.log(`skip (single locale) ${relPath} :: ${dict.name}`);
      continue;
    }
    if (allStrings.length && allStrings.every(looksNonProse)) {
      console.log(`skip (not prose) ${relPath} :: ${dict.name}`);
      continue;
    }

    const source = entries.has(SOURCE_LOCALE) ? SOURCE_LOCALE : [...entries.keys()][0];
    const targets = REVIEW_LOCALES.filter((l) => entries.has(l) && l !== source);
    if (!targets.length) {
      console.log(`skip (no targets) ${relPath} :: ${dict.name}`);
      continue;
    }
    jobs.push({ relPath, dict, structured, source, targets });
  }
}

console.log(
  `${jobs.length} dictionaries to review across ${new Set(jobs.map((j) => j.relPath)).size} files ` +
    `(source: ${SOURCE_LOCALE}, targets: ${REVIEW_LOCALES.join(", ")})`,
);

if (opts.dryRun) {
  for (const j of jobs) {
    console.log(`\n===== ${j.relPath} :: ${j.dict.name} =====`);
    console.log(opts.fix ? buildFixPrompt(j) : buildPrompt(j));
  }
  process.exit(0);
}

console.log(`Reviewer model: ${env.model} @ ${env.baseUrl} (env file: ${env.file})`);
const results = await runPool(jobs, opts.fix ? fixJob : reviewJob, opts.concurrency);

// --- report --------------------------------------------------------------

const byFile = new Map();
for (const r of results) {
  if (!byFile.has(r.relPath)) byFile.set(r.relPath, []);
  byFile.get(r.relPath).push(r);
}

let ok = 0;
let flagged = 0;
let errors = 0;
const report = [];

if (opts.fix) {
  let proposalCount = 0;
  for (const [relPath, fileResults] of byFile) {
    console.log(`\n==== ${relPath} ====`, );
    for (const r of fileResults) {
      if (r.error) {
        errors++;
        console.log(`  ${r.dict.name}: ERROR — ${r.error}`);
      } else if (!r.proposals.length) {
        ok++;
        console.log(`  ${r.dict.name}: no changes proposed`);
      } else {
        proposalCount += r.proposals.length;
        for (const p of r.proposals) {
          console.log(`  ${r.dict.name} [${p.locale}] — ${p.reason || "(no reason given)"}`);
          for (const leaf of p.leaves) {
            console.log(`    ${leaf.path || "(string)"}`);
            console.log(`      current:  ${JSON.stringify(leaf.original)}`);
            console.log(`      proposed: ${JSON.stringify(leaf.proposed)}`);
          }
        }
      }
      for (const n of r.notes ?? []) console.log(`    note: ${n}`);
      report.push({ file: relPath, dictionary: r.dict.name, proposals: r.proposals, notes: r.notes, error: r.error });
    }
  }
  console.log(`\nDone (fix mode): ${proposalCount} proposal(s), ${ok} dictionaries fine, ${errors} error(s). No files were modified.`);
  if (opts.jsonOut) {
    writeFileSync(opts.jsonOut, JSON.stringify(report, null, 2));
    console.log(`Report written to ${opts.jsonOut}`);
  }
  process.exitCode = errors > 0 ? 1 : 0;
} else {
  for (const [relPath, fileResults] of byFile) {
    console.log(`\n==== ${relPath} ====`, );
    for (const r of fileResults) {
      const needsChanges = r.results.some((x) => x.verdict === "needs changes");
      const hasError = r.results.some((x) => x.verdict === "error");
      if (hasError) errors++;
      else if (needsChanges) flagged++;
      else ok++;
      const summary = r.results.map((x) => `${x.locale} ${x.verdict}`).join(", ");
      console.log(`  ${r.dict.name}: ${summary}`);
      for (const x of r.results) {
        for (const issue of x.issues) console.log(`    - ${x.locale}: ${issue}`);
        if (x.ignoredIssues?.length) {
          console.log(`    - ${x.locale}: (ignored ${x.ignoredIssues.length} no-op suggestion(s): ${x.ignoredIssues.join(" | ")})`);
        }
      }
      report.push({
        file: relPath,
        dictionary: r.dict.name,
        kind: r.structured ? "structured" : "string",
        source: r.source,
        results: r.results,
      });
    }
  }

  console.log(
    `\nDone: ${ok} accurate, ${flagged} need changes, ${errors} errors ` +
      `(${results.length} dictionaries, source "${SOURCE_LOCALE}").`,
  );

  if (opts.jsonOut) {
    writeFileSync(opts.jsonOut, JSON.stringify(report, null, 2));
    console.log(`Report written to ${opts.jsonOut}`);
  }

  process.exitCode = flagged + errors > 0 ? 1 : 0;
}
