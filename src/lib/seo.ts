// SEO generation: canonical URLs,
// hreflang alternates + x-default, Open Graph tags, sitemap URL list, and
// robots.txt — all derived from the content manifest + config.json. Pure
// functions; the vite build post-step and the renderer consume them.
import type { Config } from "./config";
import type { PageEntry } from "./content-discovery";
import { titleFor, descriptionFor } from "./mdx-page-model";

// Structural constraint used by seo functions: any page-like record whose
// locales list is plain strings (the serialized manifest is Locale-loose).
export type PageLike = Omit<PageEntry, "localesPresent"> & { localesPresent: readonly string[] };
import { LOCALES, type Locale } from "./config";

// Canonical URL for a page in a locale (: trailing slash; EN root).
// `pathFor` overrides the per-locale URL shape for generated page types whose
// paths are not the flat slug scheme — the news pipeline passes a
// builder (receiving the PAGE) so articles canonicalize to `/news/<slug>/`.
export function pageCanonical(
  page: PageLike,
  locale: Locale,
  config: Config,
  pathFor?: (page: PageLike, l: Locale) => string,
): string {
  const base = config.site.canonicalBase.replace(/\/$/, "");
  return `${base}${pathFor ? pathFor(page, locale) : defaultSlugPath(page, locale)}`;
}

// Default flat-slug URL path: EN bare-root, others `/<locale>/<slug>/`.
function defaultSlugPath(page: PageLike, locale: Locale): string {
  return locale === "en" ? `/${page.slug}/` : `/${locale}/${page.slug}/`;
}

// hreflang alternates: ONLY locales the page actually carries plus
// x-default → EN (old-site convention). `pathFor` threads through from
// pageCanonical for news article paths.
export type Alternate = { lang: string; href: string };

export function pageAlternates(
  page: PageLike,
  config: Config,
  pathFor?: (page: PageLike, l: Locale) => string,
): Alternate[] {
  const alternates: Alternate[] = [];
  for (const locale of LOCALES) {
    if (page.localesPresent.includes(locale)) {
      alternates.push({ lang: locale, href: pageCanonical(page, locale, config, pathFor) });
    }
  }
  if (page.localesPresent.includes("en")) {
    alternates.push({ lang: "x-default", href: pageCanonical(page, "en", config, pathFor) });
  }
  return alternates;
}

// Meta descriptor shape (React Router meta returns a list of these).
export type MetaTag = {
  title?: string;
  tagName?: "meta" | "link";
  name?: string;
  property?: string;
  rel?: string;
  href?: string;
  content?: string;
  hrefLang?: string;
};

// Full per-locale meta set: title/description (from frontmatter, per-locale
// overrides via titleFor/descriptionFor — user decision 2026-09-30),
// canonical, hreflang alternates, Open Graph. noindex pages emit robots +
// NO canonical pointing elsewhere (Google uses noindex), alternates kept
// for crawlers. `pathFor` overrides the URL shape for news articles.
export function pageMetaTags(
  page: PageLike,
  locale: Locale,
  config: Config,
  pathFor?: (page: PageLike, l: Locale) => string,
): MetaTag[] {
  const tags: MetaTag[] = [];
  const base = config.site.canonicalBase.replace(/\/$/, "");
  const canonical = pageCanonical(page, locale, config, pathFor);
  const title = `${titleFor(page.frontmatter, locale)} — ${config.site.name.en}`;
  const description = descriptionFor(page.frontmatter, locale);

  tags.push({ title });
  tags.push({ name: "description", content: description });
  if (page.frontmatter.noindex) {
    tags.push({ name: "robots", content: "noindex, nofollow" });
  }
  // Canonical + hreflang MUST be <link> elements (not meta): RR meta
  // descriptors need tagName: "link" to render in <head> as links.
  tags.push({ tagName: "link", rel: "canonical", href: canonical });
  for (const alt of pageAlternates(page, config, pathFor)) {
    tags.push({ tagName: "link", rel: "alternate", hrefLang: alt.lang, href: alt.href });
  }
  tags.push({ property: "og:title", content: titleFor(page.frontmatter, locale) });
  tags.push({ property: "og:description", content: description });
  tags.push({ property: "og:url", content: canonical });
  tags.push({ property: "og:site_name", content: config.site.name.en });
  tags.push({ property: "og:type", content: "website" });
  // og:locale of the CURRENT locale; og:alternate:locale per other locale.
  tags.push({ property: "og:locale", content: OG_LOCALE[locale] });
  for (const other of LOCALES.filter((l) => l !== locale && page.localesPresent.includes(l))) {
    tags.push({ property: "og:locale:alternate", content: OG_LOCALE[other] });
  }
  void base;
  return tags;
}

// OG locale codes (facebook formats: language_REGION).
const OG_LOCALE: Record<Locale, string> = {
  en: "en_GB", // Swiss default
  de: "de_CH",
  fr: "fr_CH",
  it: "it_CH",
  rm: "rm_CH",
};

// Sitemap URL entries: published (=not draft, not noindex) pages,
// excluding config.pages.excluded slugs; each entry lists its alternates.
// `pathFor` overrides the per-locale URL shape — the news pipeline
// passes a builder so news articles emit `/news/<slug>/` URLs; the news INDEX
// entry is added by the caller (news module) since it has no MDX page.
// lastmod: updatedAt, falling back to the news date for articles.
export type SitemapUrl = {
  loc: string;
  alternates: Alternate[];
  lastmod?: string;
};

export function sitemapUrls(
  pages: readonly PageLike[],
  config: Config,
  pathFor?: (page: PageLike, l: Locale) => string,
): SitemapUrl[] {
  const excluded = new Set(config.pages?.excluded ?? []);
  const urls: SitemapUrl[] = [];
  for (const page of pages) {
    if (page.frontmatter.draft || page.frontmatter.noindex) continue;
    if (excluded.has(page.slug)) continue;
    const lastmod = page.frontmatter.updatedAt ?? (page.type === "news" ? page.frontmatter.date : undefined);
    // externalUrl link-out articles have no route: no sitemap entry.
    if (page.type === "news" && page.frontmatter.externalUrl !== undefined) continue;
    const alternates = pageAlternates(page, config, pathFor);
    for (const alt of alternates.filter((a) => a.lang !== "x-default")) {
      urls.push({ loc: alt.href, alternates, lastmod });
    }
  }
  return urls;
}

// robots.txt: reference the sitemap; static site so no disallow.
export function robotsTxt(config: Config): string {
  const base = config.site.canonicalBase.replace(/\/$/, "");
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${base}/sitemap.xml`, ""].join("\n");
}