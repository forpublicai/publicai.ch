// Generate routes from the validated content tree. English uses root URLs;
// other languages use locale prefixes. News articles use /news/<dated-slug>/.
// Drafts and external news link-outs have no routes. Author routes follow
// the authorsEnabled release switch. Restart dev when route membership changes.
import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { discoverContent } from "../src/lib/content-discovery";
import { LOCALES, type Locale } from "../src/lib/config";
import {
  newsIndexPath,
  newsArticlePath,
  isNewsLinkOut,
  authorPagePath,
  authorListPath,
} from "../src/lib/news";
import { resolve } from "node:path";
import { buildConfig } from "../src/lib/seo-config-loader";

const RENDERER = "routes/mdx-page.tsx";
const NEWS_INDEX_RENDERER = "routes/news-index.tsx";
const NEWS_ARTICLE_RENDERER = "routes/news-article.tsx";
const AUTHOR_RENDERER = "routes/author-page.tsx";

const staticRoutes = [
  index("routes/home.tsx", { id: "home-en" }),
  route("de", "routes/home.tsx", { id: "home-de" }),
  route("fr", "routes/home.tsx", { id: "home-fr" }),
  route("it", "routes/home.tsx", { id: "home-it" }),
  route("rm", "routes/home.tsx", { id: "home-rm" }),
  route("*", "routes/not-found.tsx"),
];

// Per-locale route emission helper: one route per locale in `locales`, path
// built by `pathFor`, id prefixed by `idPrefix`.
function routesForLocales(
  locales: readonly string[],
  idPrefix: string,
  pathFor: (locale: Locale) => string,
  renderer: string,
) {
  return locales
    .filter((l): l is Locale => (LOCALES as readonly string[]).includes(l))
    .map((locale) =>
      route(pathFor(locale).replace(/^\/|\/$/g, ""), renderer, { id: `${idPrefix}-${locale}` }),
    );
}

export default (() => {
  // `app/` is the cwd base for the config loader; content lives at repo root.
  const contentRoot = resolve(process.cwd(), "content");
  const manifest = discoverContent(contentRoot);
  const authorsEnabled = buildConfig(process.cwd()).news?.authorsEnabled !== false;
  // News index: ALL locales (the listing always renders via fallback).
  const newsIndexRoutes = routesForLocales(
    LOCALES, "news-index", newsIndexPath, NEWS_INDEX_RENDERER,
  );

  // Author directory: index in ALL locales (bios may be sparse; the listing
  // renders regardless), each author page in the locales its bio carries.
  const authorIndexRoutes = authorsEnabled ? routesForLocales(
    LOCALES, "authors-index", authorListPath, AUTHOR_RENDERER,
  ) : [];
  const authorPageRoutes = authorsEnabled ? [...manifest.authors.values()].flatMap((author) =>
    routesForLocales(
      author.localesPresent.length > 0 ? author.localesPresent : [...LOCALES],
      `author-${author.authorId}`,
      (locale) => authorPagePath(author.authorId, locale),
      AUTHOR_RENDERER,
    ),
  ) : [];

  // Content routes: for every non-draft page, one route per locale the page
  // carries ( hreflang truthfulness). Route id `page-<locale>-<slug>`.
  const contentRoutes = manifest.pages.flatMap((page) => {
    if (page.frontmatter.draft) return [];
    if (page.type === "news") {
      // externalUrl link-out articles have no standalone route:
      // index + teaser link directly to the external URL.
      if (isNewsLinkOut(page)) return [];
      return routesForLocales(
        page.localesPresent.length > 0 ? page.localesPresent : [...LOCALES],
        `news-${page.slug}`,
        (locale) => newsArticlePath(page.slug, locale),
        NEWS_ARTICLE_RENDERER,
      );
    }
    return routesForLocales(
      page.localesPresent.length > 0 ? page.localesPresent : [...LOCALES],
      `page-${page.slug}`,
      // Locale-prefixed route paths: EN bare-root, others `/<locale>/<slug>/`.
      (locale) => (locale === "en" ? `/${page.slug}/` : `/${locale}/${page.slug}/`),
      RENDERER,
    );
  });

  return [
    ...staticRoutes,
    ...newsIndexRoutes,
    ...authorIndexRoutes,
    ...authorPageRoutes,
    ...contentRoutes,
  ] satisfies RouteConfig;
})();
