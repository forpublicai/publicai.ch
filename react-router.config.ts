import type { Config } from "@react-router/dev/config";
import { discoverContent, missingLocales } from "./src/lib/content-discovery";
import { buildConfig } from "./src/lib/seo-config-loader";
import { sitemapUrls, robotsTxt } from "./src/lib/seo";
import { verifyInternalLinks, collectConfigExternalLinks, extractMdxInternalLinks } from "./src/lib/link-verification";
import {
  newsIndexSitemapUrls,
  newsIndexPath,
  newsArticlePath,
  authorSitemapUrls,
  authorPagePath,
  authorListPath,
  isNewsLinkOut,
  verifyNewsRefs,
} from "./src/lib/news";
import { LOCALES, type Locale } from "./src/lib/config";
import { crawlReachability, prerenderedPagePaths, hygieneViolations } from "./src/lib/build-gates";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Default flat-slug URL path (mirrors seo.ts defaultSlugPath; a local copy
// here avoids importing the seo module's private helper).
function defaultPagePath(slug: string, locale: Locale): string {
  return locale === "en" ? `/${slug}/` : `/${locale}/${slug}/`;
}

// Prerender path list: static chrome + standard pages + author
// directory (when enabled) + news index + articles per carried
// locale. externalUrl link-outs are excluded (no route). Paths carry NO
// trailing slashes (the SSG emits `<path>/index.html`); URL shape stays
// directory-style at the canonical level.
export function prerenderPaths(): string[] {
  const manifest = discoverContent(resolve(process.cwd(), "content"));
  const config = buildConfig(process.cwd());
  const paths = new Set<string>();
  // Static chrome: EN home + 4 prefixed locale homes.
  paths.add("/");
  for (const locale of LOCALES.filter((l) => l !== "en")) paths.add(`/${locale}`);
  // Author directory: index (all locales) + pages per carried bio locale.
  if (config.news?.authorsEnabled !== false) {
    for (const locale of LOCALES) {
      const p = authorListPath(locale).replace(/\/$/, "");
      if (p) paths.add(p);
    }
    for (const author of manifest.authors.values()) {
      const locales = author.localesPresent.length > 0 ? author.localesPresent : [...LOCALES];
      for (const locale of locales as Locale[]) {
        paths.add(authorPagePath(author.authorId, locale).replace(/\/$/, ""));
      }
    }
  }
  // News index (all locales) — the feed filters + paginates in-place.
  for (const locale of LOCALES) {
    paths.add(newsIndexPath(locale).replace(/\/$/, ""));
  }
  // Content pages + news articles, per carried locale.
  for (const page of manifest.pages) {
    if (page.frontmatter.draft) continue;
    if (isNewsLinkOut(page)) continue;
    const locales = (page.localesPresent.length > 0 ? page.localesPresent : [...LOCALES]) as Locale[];
    for (const locale of locales) {
      const path =
        page.type === "news" ? newsArticlePath(page.slug, locale) : defaultPagePath(page.slug, locale);
      paths.add(path.replace(/\/$/, "") || "/");
    }
  }
  return [...paths].sort();
}

export default {
  ssr: false,
  prerender: prerenderPaths,
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
  buildEnd: async ({ viteConfig }) => {
    // Post-build SEO + quality gates: sitemap.xml +
    // robots.txt into the client output (the deploy artifact), internal
    // link verification (broken = build failure naming the config path),
    // external-links report. Discovery errors surface here as build
    // failures with file-named messages.
    const { resolve } = await import("node:path");
    const { writeFileSync } = await import("node:fs");
    const root = viteConfig.root;
    const clientDir = resolve(root, "build/client");

    const manifest = discoverContent(resolve(root, "content"));
    const config = buildConfig(root);

    // News frontmatter cross-reference gate: categories ∈
    // config.news.categories, author ids ∈ content/authors/. Fails naming
    // the file(s).
    verifyNewsRefs(manifest, config);

    // link verification gate: config page refs (incl. children) AND
    // MDX content links (markdown + CTA to=) across all carried sections.
    const slugSet = new Set(manifest.pages.filter((p) => !p.frontmatter.draft).map((p) => p.slug));
    verifyInternalLinks(config, slugSet);
    const mdxFailures: string[] = [];
    const mdxExternals: string[] = [];
    for (const page of manifest.pages) {
      if (page.frontmatter.draft) continue;
      const source = readFileSync(resolve(root, "content", ...page.file.split("/")), "utf8");
      for (const link of extractMdxInternalLinks(source, page.file)) {
        if (!slugSet.has(link.target)) {
          mdxFailures.push(`- ${page.file}: internal link target "${link.target}" does not resolve`);
        }
      }
    }
    if (mdxFailures.length > 0) {
      throw new Error(`broken internal links in MDX:\n${mdxFailures.join("\n")}`);
    }
    void mdxExternals;

    // External link report: compiled, not checked over network.
    const externals = collectConfigExternalLinks(config);
    const reportLines = [
      "# External links report (build-time compilation — no network checks)",
      "",
      ...externals.map((e) => `- \`${e.url}\` (${e.path})`),
      "",
    ];
    writeFileSync(resolve(clientDir, "external-links-report.txt"), reportLines.join("\n"));

    // Sitemap: news index + author directory entries + standard
    // pages + routed news articles. Author URLs follow the release switch.
    // sitemapUrls handles draft/noindex/excluded/link-out gating; the
    // pathFor override routes news articles to the /news/<slug>/ shape.
    const newsIndexUrls = newsIndexSitemapUrls(config);
    const authorUrls = config.news?.authorsEnabled === false ? [] : authorSitemapUrls([...manifest.authors.values()], config);
    const pageUrls = sitemapUrls(manifest.pages, config, (page, locale) =>
      page.type === "news" ? newsArticlePath(page.slug, locale) : defaultPagePath(page.slug, locale),
    );
    const urls = [...newsIndexUrls, ...authorUrls, ...pageUrls];

    const alternatesXml = (list: { lang: string; href: string }[]): string =>
      list
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`)
        .join("\n");
    const urlXml = (url: { loc: string; alternates: { lang: string; href: string }[]; lastmod?: string }): string =>
      `  <url>\n    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ""}\n${alternatesXml(url.alternates)}\n  </url>`;

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(urlXml).join("\n")}
</urlset>
`;

    writeFileSync(resolve(clientDir, "sitemap.xml"), sitemap);
    writeFileSync(resolve(clientDir, "robots.txt"), robotsTxt(config));
    // Keep dev-parity copies in public/ (public/ is copied to build/client
    // on NEXT build; these are regenerated every build anyway).
    writeFileSync(resolve(root, "public/sitemap.xml"), sitemap);
    writeFileSync(resolve(root, "public/robots.txt"), robotsTxt(config));

    // Untranslated-sections report: every page + the locales
    // it does not carry (EN first). Drives translation work; NOT a build
    // failure (missing locales render via the fallback chain).
    const untranslatedLines = [
      "# Untranslated sections report",
      "# Locales a page does NOT carry (fallback chain § 7.2 applies in the",
      "# requested locale). EN-first ordering; complete pages are omitted.",
      "",
      ...manifest.pages
        .map((page) => ({ page, missing: missingLocales(page) }))
        .filter(({ missing }) => missing.length > 0)
        .map(({ page, missing }) => `- ${page.file}: missing ${missing.join(", ")}`),
      "",
    ];
    if (untranslatedLines.length > 4) {
      writeFileSync(resolve(clientDir, "untranslated-sections-report.txt"), untranslatedLines.join("\n"));
      viteConfig.logger.info(
        `[content] untranslated-sections-report.txt (${untranslatedLines.length - 5} pages with gaps) → build/client/`,
      );
    } else {
      viteConfig.logger.info("[content] no untranslated sections — report omitted");
    }

    // Reachability crawl: every prerendered page must be
    // reachable from the locale homes via rendered links, unless listed in
    // config.pages.excluded. The crawl runs over the OUTPUT (build/client).
    const allPages = prerenderedPagePaths(clientDir).filter((p) => p !== "/404.html");
    const homes = LOCALES.map((l) => (l === "en" ? "/" : `/${l}/`));
    const { reachable } = crawlReachability(clientDir, homes);
    // Excluded slugs may be unreachable in EVERY locale variant.
    const excluded = new Set<string>(["/404.html"]);
    for (const slug of config.pages?.excluded ?? []) {
      excluded.add(`/${slug}/`);
      for (const l of LOCALES.filter((x) => x !== "en")) excluded.add(`/${l}/${slug}/`);
    }
    const unreachable = allPages.filter((p) => !reachable.has(p) && !excluded.has(p));
    if (unreachable.length > 0) {
      throw new Error(
        `reachability gate failed — pages not reachable from any locale home (§ 12.5):\n${unreachable.map((p) => `- ${p}`).join("\n")}`,
      );
    }
    viteConfig.logger.info(`[gates] reachability crawl: ${allPages.length} pages reachable`);

    // Hygiene guard: forbidden trees/files must not appear in
    // the client output.
    const hygiene = hygieneViolations(clientDir);
    if (hygiene.length > 0) {
      throw new Error(
        `hygiene gate failed — forbidden paths in the build output (§ 12.6):\n${hygiene.map((p) => `- ${p}`).join("\n")}`,
      );
    }

    // Root 404.html : static hosts need a 404 document. We emit
    // a STANDALONE copy of the SPA fallback (client router renders the
    // localized 404 from __spa-fallback.html), plus a robots noindex meta
    // injection so crawl-bots never index the fallback URL.
    const spaFallback = readFileSync(resolve(clientDir, "__spa-fallback.html"), "utf8");
    const root404 = spaFallback.includes("<meta name=\"robots\"")
      ? spaFallback
      : spaFallback.replace("</title>", "</title>\n    <meta name=\"robots\" content=\"noindex\" />");
    writeFileSync(resolve(clientDir, "404.html"), root404);

    // Redirects : static hosts cannot do server
    // rewrites, so config.pages.redirects emit as meta-refresh HTML stubs
    // (from → to). Each stub is a full URL-path directory page.
    for (const redirect of config.pages?.redirects ?? []) {
      const from = redirect.from.replace(/^\/|\/$/g, "");
      if (!from) continue;
      const to = redirect.to;
      const stub = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0; url=${to}" />
    <link rel="canonical" href="${config.site.canonicalBase.replace(/\/$/, "")}${to}" />
    <title>Redirecting…</title>
  </head>
  <body>
    <p>This page has moved. Continue to <a href="${to}">${to}</a>.</p>
  </body>
</html>
`;
      const { mkdirSync } = await import("node:fs");
      mkdirSync(resolve(clientDir, from), { recursive: true });
      writeFileSync(resolve(clientDir, from, "index.html"), stub);
    }
    if ((config.pages?.redirects ?? []).length > 0) {
      viteConfig.logger.info(`[redirects] ${(config.pages?.redirects ?? []).length} meta-refresh stubs emitted`);
    }

    viteConfig.logger.info(
      `[seo] sitemap.xml (urls: ${urls.length}) + robots.txt + external-links-report.txt → build/client/`,
    );
  },
} satisfies Config;
