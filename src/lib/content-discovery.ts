// Discover and validate content/**/*.mdx, excluding templates.
// Builds the page and author manifests and detects duplicate or reserved slugs.
// Used by routing, prerendering, and the missing-language report; Node only.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import {
  validatePageFile,
  validateAuthorFile,
  PageModelError,
  type PageModel,
  type AuthorModel,
} from "./mdx-page-model";
import { LOCALES, type Locale } from "./config";

export const RESERVED_SLUGS = ["news", "authors"] as const;
const TEMPLATES_DIR = "templates";
const AUTHORS_DIR = "authors";

export type PageEntry = PageModel & {
  // Repo-relative posix path (e.g. `cooperative/mission.mdx`) for reports.
  file: string;
};

export type AuthorEntry = AuthorModel & {
  // Repo-relative posix path (e.g. `authors/joshua-tan.mdx`).
  file: string;
};

export type ContentManifest = {
  pages: PageEntry[];
  // Slugs seen (flat namespace) to detect collisions.
  bySlug: Map<string, PageEntry>;
  // Author records: content/authors/*.mdx keyed by authorID.
  authors: Map<string, AuthorEntry>;
};

// Recursively collect `*.mdx` files under `contentDir`, as posix-ish paths
// relative to `contentDir` (e.g. `news/2026-08-28-kickoff.mdx`).
function collectMdxFiles(dir: string, prefixDir: string = ""): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (prefixDir === "" && name === TEMPLATES_DIR) continue; // excluded from routing
      out.push(...collectMdxFiles(full, prefixDir ? `${prefixDir}/${name}` : name));
    } else if (name.endsWith(".mdx")) {
      out.push(prefixDir ? `${prefixDir}/${name}` : name);
    }
  }
  return out;
}

// Discover + validate the whole content tree. Throws PageModelError (or a
// collision/reserved-slug error) listing the offending file(s). Files under
// `content/authors/` are author records , not standard pages — they
// never enter `pages`.
export function discoverContent(contentDir: string): ContentManifest {
  const pages: PageEntry[] = [];
  const bySlug = new Map<string, PageEntry>();
  const authors = new Map<string, AuthorEntry>();

  for (const file of collectMdxFiles(contentDir)) {
    const source = readFileSync(join(contentDir, ...file.split("/")), "utf8");
    // Author records: any.mdx directly inside content/authors/.
    if (file.startsWith(`${AUTHORS_DIR}/`)) {
      const model = validateAuthorFile(source, file);
      const entry: AuthorEntry = { ...model, file };
      const previous = authors.get(model.authorId);
      if (previous) {
        throw new PageModelError(
          file,
          `duplicate authorID "${model.authorId}" — already defined by ${previous.file}`,
        );
      }
      authors.set(model.authorId, entry);
      continue;
    }
    let model: PageModel;
    try {
      model = validatePageFile(source, file);
    } catch (error) {
      if (error instanceof PageModelError) throw error;
      throw new PageModelError(file, String(error));
    }
    const entry: PageEntry = { ...model, file };
    const reserved = (RESERVED_SLUGS as readonly string[]).find((s) => s === entry.slug);
    if (reserved && entry.type !== "news") {
      throw new PageModelError(
        file,
        `slug "${entry.slug}" is reserved (the news index is generated; name the page differently or give the file news frontmatter)`,
      );
    }
    const collision = bySlug.get(entry.slug);
    if (collision) {
      throw new PageModelError(
        file,
        `duplicate slug "${entry.slug}" — already used by ${collision.file}. Slugs must be globally unique across all theme folders (folders carry no routing semantics).`,
      );
    }
    bySlug.set(entry.slug, entry);
    pages.push(entry);
  }
  return { pages, bySlug, authors };
}

// Standard (non-news) page URL path per locale: EN bare-root, others
// `/<locale>/<slug>/`. News handled by the news pipeline.
export function pagePath(entry: PageEntry, locale: Locale | undefined): string {
  const base = `/${entry.slug}/`;
  return !locale || locale === "en" ? base : `/${locale}${base}`;
}

// All publishable route paths for a manifest (prerender input): every
// non-draft page in every locale the page carries ( hreflang only for
// locales a page actually has). Sitemap/hreflang use the same locale list.
export function allRoutePaths(manifest: ContentManifest): string[] {
  const paths: string[] = [];
  for (const page of manifest.pages) {
    if (page.frontmatter.draft) continue;
    const locales = page.localesPresent.length > 0 ? page.localesPresent : LOCALES;
    for (const locale of locales) paths.push(pagePath(page, locale));
  }
  return paths.sort();
}

// Author URL per locale: `/authors/` index + `/authors/<id>/`.
export function authorPath(authorId: string, locale: Locale | undefined): string {
  const base = `/authors/${authorId}/`;
  return !locale || locale === "en" ? base : `/${locale}${base}`;
}
export function authorIndexPath(locale: Locale | undefined): string {
  return !locale || locale === "en" ? "/authors/" : `/${locale}/authors/`;
}

// Untranslated-sections report input: which locales each page
// is missing, EN-first ordering.
export function missingLocales(entry: PageEntry): Locale[] {
  return LOCALES.filter((l) => !entry.localesPresent.includes(l));
}
export { sep };