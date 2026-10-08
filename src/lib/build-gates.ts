// Reachability crawl + hygiene guard for the
// buildEnd hook. Node-only: reads the prerendered HTML from build/client
// and crawls rendered links breadth-first from the locale homes.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

// Crawl every rendered <a href> from the locale homes (and, transitively,
// every page reachable from them). Pages NOT reachable are returned so the
// caller can decide: config.pages.excluded entries are allowed to be
// unreachable; anything else is a build failure.
export function crawlReachability(
  clientDir: string,
  startPaths: string[],
): { reachable: Set<string>; unreachable: string[] } {
  const visited = new Set<string>();
  const queue = [...startPaths];
  while (queue.length > 0) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);
    const file = pageFileFor(clientDir, path);
    if (!file) continue;
    const html = readFileSync(file, "utf8");
    for (const href of renderedLinks(html)) {
      const normalized = normalizeHref(href, path);
      if (normalized && !visited.has(normalized)) queue.push(normalized);
    }
  }
  return { reachable: visited, unreachable: [] };
}

// All prerendered page paths (dir/index.html → /path/).
export function prerenderedPagePaths(clientDir: string): string[] {
  const out: string[] = [];
  walk(clientDir, "", out);
  return out;
}

function walk(dir: string, prefix: string, out: string[]): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full, `${prefix}/${name}`, out);
    } else if (name === "index.html") {
      out.push(prefix === "" ? "/" : `${prefix}/`);
    }
  }
}

// Map a route path to its prerendered index.html (trailing-slash dirs).
function pageFileFor(clientDir: string, path: string): string | null {
  const trimmed = path === "/" ? "" : path.replace(/\/$/, "");
  const file = resolve(clientDir, `.${trimmed}/index.html`.replace("//", "/"));
  try {
    if (statSync(file).isFile()) return file;
  } catch {
    return null;
  }
  return null;
}

// Rendered internal links in one HTML document (href only; anchors are
// resolved against the page URL; externals/asset files ignored).
export function renderedLinks(html: string): string[] {
  const links: string[] = [];
  for (const match of html.matchAll(/<a[^>]*\shref="([^"]*)"/g)) {
    const href = match[1];
    if (href.startsWith("http://") || href.startsWith("https://")) continue;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.endsWith(".pdf") || href.endsWith(".jpg") || href.endsWith(".png") || href.endsWith(".svg") || href.endsWith(".ico") || href.endsWith(".webp")) continue;
    links.push(href);
  }
  return links;
}

// Resolve an href against the current page path into a SITE-absolute path.
// Handles relative hrefs, #fragments, and query strings. Returns null for
// in-page anchors (no navigation) and external/asset URLs.
function normalizeHref(href: string, fromPath: string): string | null {
  if (href.startsWith("#")) return null;
  if (href.startsWith("//")) return null; // protocol-relative = external
  let target: string;
  if (href.startsWith("/")) {
    target = href;
  } else {
    const baseSegments = fromPath.replace(/\/$/, "").split("/").filter(Boolean);
    baseSegments.pop();
    const segments = [...baseSegments];
    for (const part of href.split("/")) {
      if (part === "" || part === ".") continue;
      if (part === "..") segments.pop();
      else segments.push(part);
    }
    target = `/${segments.join("/")}`;
  }
  target = target.split("#")[0]!.split("?")[0]!;
  if (target === "" ) return "/";
  return target.replace(/\/$/, "") + "/";
}

// Hygiene guard: the build fails if the client output contains
// Contributor documentation, internal notes, and temporary
// files must never be exposed in the deploy artifact.
export function hygieneViolations(clientDir: string): string[] {
  const violations: string[] = [];
  const forbidden = ["docs", "CONTRIBUTING.md", "AI_NOTES.md", "README.md"];
  walkAll(clientDir, (relPath) => {
    for (const name of forbidden) {
      if (relPath === name || relPath.startsWith(`${name}/`)) {
        violations.push(relPath);
        return;
      }
    }
    if (relPath.endsWith(".tmp") || relPath.includes(".tmp/")) violations.push(relPath);
  });
  return violations;
}

function walkAll(dir: string, visit: (rel: string) => void, prefix = ""): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = prefix === "" ? name : `${prefix}/${name}`;
    if (statSync(full).isDirectory()) {
      visit(`${rel}/`);
      walkAll(full, visit, rel);
    } else {
      visit(rel);
    }
  }
}