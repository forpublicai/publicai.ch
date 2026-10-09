// News pipeline: derives the news
// collection from the content manifest (a page is news by frontmatter —
// date + category present — regardless of folder), sorts it newest-first,
// resolves the locale fallback per article, and builds the news-index
// + article URL shapes shared by routing, SEO, and the homepage teaser.
// Pure functions over the manifest — no node fs, usable in unit tests and
// in the browser/prerender runtimes alike. The serialized manifest carries
// `localesPresent: string[]` (JSON round-trip), so input types stay loose
// (the seo module's PageLike pattern).
import type { PageEntry } from "./content-discovery";
import { titleFor, descriptionFor } from "./mdx-page-model";
import type { PageLike, SitemapUrl, Alternate } from "./seo";
import { LOCALES, type Config, type Locale } from "./config";

// Loose page shape accepted from the serialized virtual manifest.
type LoosePage = PageLike & { type?: PageEntry["type"] };

// A news article as the index/teaser consume it: manifest entry + the
// resolved display locale for the requested locale ( chain).
export type NewsArticle = {
  page: LoosePage;
  slug: string;
};

// Reserved news-index slug ; its URL is a generated page.
export const NEWS_INDEX_SLUG = "news";

// URL shapes (directory style, EN root):
// index: `/news/` + `/de/news/`, `/fr/news/`, …
// article: `/news/<slug>/` + `/de/news/<slug>/`, …
export function newsIndexPath(locale: Locale | undefined): string {
  return !locale || locale === "en" ? "/news/" : `/${locale}/news/`;
}
export function newsArticlePath(articleSlug: string, locale: Locale | undefined): string {
  const base = `/news/${articleSlug}/`;
  return !locale || locale === "en" ? base : `/${locale}${base}`;
}

// Filter the manifest to published (non-draft) news articles with a route
// (externalUrl link-outs excluded —: no standalone route).
export function newsPages(manifest: { pages: readonly LoosePage[] }): LoosePage[] {
  return manifest.pages.filter(
    (p) =>
      p.type === "news" &&
      !p.frontmatter.draft &&
      p.frontmatter.externalUrl === undefined,
  );
}

// True when a manifest page is a news link-out article: published,
// news-frontmatter, externalUrl set — no route, linked directly from the
// index/teaser. routes.ts uses this to skip route generation.
export function isNewsLinkOut(page: LoosePage): boolean {
  return (
    page.type === "news" &&
    !page.frontmatter.draft &&
    page.frontmatter.externalUrl !== undefined
  );
}

// fallback chain (requested → en → de → first available) for one page.
export function resolveSectionLocale(page: LoosePage, requested: Locale): Locale {
  const has = (l: Locale): boolean => page.localesPresent.includes(l);
  if (has(requested)) return requested;
  if (has("en")) return "en";
  if (has("de")) return "de";
  return (LOCALES as readonly Locale[]).find((l) => has(l)) ?? requested;
}

// The news collection for one locale, newest-first by frontmatter date (
// sort key). Each entry carries the resolved display locale so the renderer
// knows whether it is showing fallback content (notice per).
export type NewsListItem = {
  article: NewsArticle;
  // Locale whose section will actually render for the requested locale.
  resolvedLocale: Locale;
  isFallback: boolean;
};

export function newsCollection(
  manifest: { pages: readonly LoosePage[] },
  requested: Locale,
): NewsListItem[] {
  const items = newsPages(manifest).map((page) => {
    const resolvedLocale = resolveSectionLocale(page, requested);
    return {
      article: { page, slug: page.slug },
      resolvedLocale,
      isFallback: resolvedLocale !== requested,
    };
  });
  items.sort((a, b) => {
    const da = a.article.page.frontmatter.date ?? "";
    const db = b.article.page.frontmatter.date ?? "";
    if (da !== db) return da < db ? 1 : -1; // newest first
    return a.article.slug.localeCompare(b.article.slug); // stable tiebreak
  });
  return items;
}

// ---------------------------------------------------------------------------
// News feed (user decision 2026-10-01): ONE dynamically-rendered feed on
// /news/ — category filtering + pagination happen IN PLACE (client state),
// not via subpage URLs. buildNewsFeed is the data model future expansions
// (live sources, tags, search) plug into: a locale-resolved, sorted list of
// presentation-ready entries.
// ---------------------------------------------------------------------------

export type NewsFeedEntry = {
  // The actual article language, including fallback links on other locales.
  resolvedLocale?: Locale;
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  heroImage?: string;
  author?: { authorId: string; name: string; affiliation?: string };
  href: string;
  external: boolean;
};

export function buildNewsFeed(
  manifest: {
    pages: readonly LoosePage[];
    authors?: readonly { authorId: string; frontmatter: { name: string; affiliation?: string } }[];
  },
  requested: Locale,
): NewsFeedEntry[] {
  return newsCollection(manifest, requested).map((item) => {
    const page = item.article.page;
    const fm = page.frontmatter;
    const linkOut = fm.externalUrl;
    const authorRecord = fm.author
      ? manifest.authors?.find((a) => a.authorId === fm.author)
      : undefined;
    return {
      slug: page.slug,
      resolvedLocale: item.resolvedLocale,
      title: titleFor(fm, item.resolvedLocale),
      excerpt: descriptionFor(fm, item.resolvedLocale),
      category: fm.category,
      date: fm.date,
      heroImage: fm.heroImage,
      author: authorRecord
        ? {
            authorId: authorRecord.authorId,
            name: authorRecord.frontmatter.name,
            affiliation: authorRecord.frontmatter.affiliation,
          }
        : undefined,
      href: linkOut ?? newsArticlePath(page.slug, item.resolvedLocale),
      external: linkOut !== undefined,
    };
  });
}

// External link-out articles: published news pages WITH externalUrl —
// they appear on the index/teaser linking out directly, but have no route.
export function newsLinkOuts(manifest: { pages: readonly LoosePage[] }): LoosePage[] {
  return manifest.pages.filter(isNewsLinkOut);
}

// News index sitemap entry: the index exists in ALL locales (the
// listing always renders, via fallback), so it lists every locale href.
export function newsIndexSitemapUrls(config: Config): SitemapUrl[] {
  const base = config.site.canonicalBase.replace(/\/$/, "");
  const alternates: Alternate[] = [
    ...LOCALES.map((lang) => ({
      lang,
      href: `${base}${newsIndexPath(lang)}`,
    })),
    { lang: "x-default", href: `${base}${newsIndexPath("en")}` },
  ];
  return alternates
    .filter((a) => a.lang !== "x-default")
    .map((alt) => ({ loc: alt.href, alternates }));
}

// ---------------------------------------------------------------------------
// Author routes and news-list state helpers 
// ---------------------------------------------------------------------------

// Articles per listing page.
export const NEWS_PAGE_SIZE = 10;

// Author page URL shapes.
export function authorPagePath(authorId: string, locale: Locale | undefined): string {
  return !locale || locale === "en" ? `/authors/${authorId}/` : `/${locale}/authors/${authorId}/`;
}
export function authorListPath(locale: Locale | undefined): string {
  return !locale || locale === "en" ? "/authors/" : `/${locale}/authors/`;
}

// Legacy category URL formatter retained for existing callers/fixtures.
// The current router does not generate these URLs: category filters live on
// the news index. New UI links must use newsIndexPath instead.
export function newsCategoryPath(category: string, locale: Locale | undefined): string {
  const slug = categorySlug(category);
  const base = `/news/category/${slug}/`;
  return !locale || locale === "en" ? base : `/${locale}${base}`;
}
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replaceAll(/[äöüß]/g, (c) => ({ "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss" })[c] ?? c)
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Legacy pagination URL formatter retained for existing callers/fixtures.
// The current router does not generate /page/N routes; pagination is local
// news-index state. This formatter must not be used for live navigation.
export function newsListPagePath(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  return `${basePath.replace(/\/$/, "")}/page/${page}/`;
}

// Which categories actually have published articles, preserving
// config.news.categories order.
export function usedCategories(
  manifest: { pages: readonly LoosePage[] },
  config: Config,
): string[] {
  const used = new Set(
    manifest.pages
      .filter((p) => p.type === "news" && !p.frontmatter.draft)
      .map((p) => p.frontmatter.category ?? ""),
  );
  return (config.news?.categories ?? []).filter((c) => used.has(c));
}

// Total listing pages for a filtered collection.
export function pageCount(itemCount: number): number {
  return Math.max(1, Math.ceil(itemCount / NEWS_PAGE_SIZE));
}

// Return up to ten entries. On page one the renderer presents the first entry
// in the featured slot and the remaining entries in the regular grid.
export function pageSlice<T>(items: T[], pageIndex1Based: number): T[] {
  const start = (pageIndex1Based - 1) * NEWS_PAGE_SIZE;
  return items.slice(start, start + NEWS_PAGE_SIZE);
}

// Build-time news cross-reference gate :
//  1. every news article's category ∈ config.news.categories
//  2. every news article's author ∈ the discovered authorID set
// Both fail naming the file (and, for authors, the author file).
export type NewsRefIssue = { file: string; message: string };

export function verifyNewsRefs(
  manifest: { pages: readonly LoosePage[]; authors: ReadonlyMap<string, { authorId: string }> },
  config: Config,
): void {
  const categories = new Set(config.news?.categories ?? []);
  const issues: NewsRefIssue[] = [];
  for (const page of manifest.pages) {
    if (page.type !== "news") continue;
    const fm = page.frontmatter;
    if (fm.category !== undefined && !categories.has(fm.category)) {
      issues.push({
        file: (page as { file?: string }).file ?? page.slug,
        message: `category "${fm.category}" is not in config.json news.categories ([${categories.size === 0 ? "" : [...categories].join(", ")}])`,
      });
    }
    if (fm.author !== undefined && !manifest.authors.has(fm.author)) {
      issues.push({
        file: (page as { file?: string }).file ?? page.slug,
        message: `author id "${fm.author}" has no record — create content/authors/${fm.author}.mdx (§ 6.4a)`,
      });
    }
  }
  if (issues.length > 0) {
    throw new Error(
      `news frontmatter references failed validation:\n${issues.map((i) => `- ${i.file}: ${i.message}`).join("\n")}`,
    );
  }
}

// Sitemap entries for the author directory: /authors/ index (all
// locales) + one page per author in each locale the bio carries.
export function authorSitemapUrls(
  authors: readonly { authorId: string; localesPresent: readonly string[] }[],
  config: Config,
): SitemapUrl[] {
  const base = config.site.canonicalBase.replace(/\/$/, "");
  const urls: SitemapUrl[] = [];
  const indexAlternates: Alternate[] = [
    ...LOCALES.map((lang) => ({ lang, href: `${base}${authorListPath(lang)}` })),
    { lang: "x-default", href: `${base}${authorListPath("en")}` },
  ];
  urls.push(
    ...indexAlternates
      .filter((a) => a.lang !== "x-default")
      .map((alt) => ({ loc: alt.href, alternates: indexAlternates })),
  );
  for (const author of authors) {
    const alternates: Alternate[] = [];
    if (author.localesPresent.includes("en")) {
      alternates.push({ lang: "x-default", href: `${base}${authorPagePath(author.authorId, "en")}` });
    }
    for (const lang of LOCALES) {
      if (author.localesPresent.includes(lang)) {
        alternates.push({ lang, href: `${base}${authorPagePath(author.authorId, lang)}` });
      }
    }
    for (const alt of alternates.filter((a) => a.lang !== "x-default")) {
      urls.push({ loc: alt.href, alternates });
    }
  }
  return urls;
}
