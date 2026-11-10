// Validate internal menu, Markdown, and MDX component targets during builds.
// Broken references name the config path or content file. External links are
// reported for review; the build does not check remote services.
import type { Config, MenuItemValue } from "./config";

import { RESERVED_SLUGS } from "./content-discovery";

// A config-internal page reference with its config path (for error naming).
export type InternalRef = { path: string; slug: string };
export type ExternalLink = { path: string; url: string };

// Walk every menu collection; children recurse (items are part of
// link checks per).
function walkMenu(items: MenuItemValue[] | undefined, pathSoFar: string, refs: InternalRef[], externals: ExternalLink[]): void {
  (items ?? []).forEach((item, index) => {
    const path = `${pathSoFar}[${index}]`;
    if (item.page !== undefined) refs.push({ path: `${path}.page`, slug: item.page });
    if (item.url !== undefined) externals.push({ path: `${path}.url`, url: item.url });
    if (item.children !== undefined) walkMenu(item.children, `${path}.children`, refs, externals);
  });
}

export function collectConfigInternalRefs(config: Config): InternalRef[] {
  const refs: InternalRef[] = [];
  walkMenu(config.menus.main, "menus.main", refs, []);
  walkMenu(config.menus.utility, "menus.utility", refs, []);
  if (config.menus.cta) {
    walkMenu([config.menus.cta], "menus.cta", refs, []);
  }
  config.footer?.columns?.forEach((col, i) => {
    walkMenu(col.items, `footer.columns[${i}].items`, refs, []);
  });
  return refs;
}

export function collectConfigExternalLinks(config: Config): ExternalLink[] {
  const externals: ExternalLink[] = [];
  walkMenu(config.menus.main, "menus.main", [], externals);
  walkMenu(config.menus.utility, "menus.utility", [], externals);
  if (config.menus.cta) walkMenu([config.menus.cta], "menus.cta", [], externals);
  config.footer?.columns?.forEach((col, i) => {
    walkMenu(col.items, `footer.columns[${i}].items`, [], externals);
  });
  return externals;
}

// Valid slugs = discovered page slugs ∪ reserved generated slugs (news
// index, present since routes exist for it in nav).
export function verifyInternalLinks(config: Config, slugSet: Set<string>): void {
  const reserved = RESERVED_SLUGS.filter((slug) => slug !== "authors" || config.news?.authorsEnabled !== false);
  const valid = new Set([...slugSet, ...reserved]);
  const failures: string[] = [];
  for (const ref of collectConfigInternalRefs(config)) {
    if (!valid.has(ref.slug)) {
      failures.push(`- ${ref.path}: unknown page slug "${ref.slug}"`);
    }
  }
  if (failures.length > 0) {
    throw new Error(
      `config.json references pages that do not exist (add the MDX file or fix the slug):\n${failures.join("\n")}`,
    );
  }
}
// ---------------------------------------------------------------------------
// MDX body link extraction ( +/)
// ---------------------------------------------------------------------------

// Internal (slug) targets with their MDX file for error naming.
export type MdxInternalLink = { file: string; target: string };

// Extract internal targets from an MDX section body:
//  - markdown links `[text](/slug/...)` (site-absolute,)
//  - CTA `to="slug"` / CTA props `to: "slug"` inside JSX/props code
// http(s):, mailto:, # targets are NOT internal (left untouched, same rule).
export function extractMdxInternalLinks(body: string, file: string): MdxInternalLink[] {
  const targets: MdxInternalLink[] = [];
  // Markdown links
  for (const match of body.matchAll(/\[([^\]]*)\]\(([^)\s]+)\)/g)) {
    const target = match[2];
    if (target.startsWith("/")) targets.push({ file, target: cleanSlug(target) });
  }
  // CTA to= (JSX attr + object-prop forms; catches LinkRow's nested `to:` too)
  for (const match of body.matchAll(/\bto(?:=|\s*:\s*)"([^"]+)"/g)) {
    targets.push({ file, target: cleanSlug(match[1]) });
  }
  return targets;
}

// `/mission/`, `/mission`, `mission` → `mission`
function cleanSlug(target: string): string {
  return target.replace(/^\/+|\/+$/g, "");
}
