// News feed page: ONE dynamically-rendered
// feed at /news/ (all locales). Category filtering and pagination happen IN
// PLACE via component state — no subpage navigation. The feed data comes
// from buildNewsFeed (news.ts), the seam where future expansions (live
// sources, search, tags) plug in. Featured card = overall newest, page 1 of
// the unfiltered view; 10 entries per page with prev/next controls.
import { useState } from "react";
import { useLocation } from "react-router";
import type { MetaFunction, MetaDescriptor } from "react-router";
import { contentManifest } from "virtual:content-manifest";
import { localeFromPath, localizedLabel } from "~/lib/locale";
import { getConfig } from "~/lib/get-config";
import { chromeStrings, newsCategoryLabel } from "~/lib/chrome-strings";
import type { Locale } from "~/lib/config";
import {
  buildNewsFeed,
  newsIndexPath,
  usedCategories,
  pageCount,
  pageSlice,
  NEWS_INDEX_SLUG,
} from "~/lib/news";
import { pageMetaTags } from "~/lib/seo";
import { NewsCard } from "~/components/news-card";

export const meta: MetaFunction = ({ location }): MetaDescriptor[] => {
  const locale = localeFromPath(location.pathname);
  const config = getConfig();
  const strings = chromeStrings.news;
  const indexPage = {
    slug: NEWS_INDEX_SLUG,
    theme: "",
    file: "(generated)/news-feed",
    type: "news" as const,
    frontmatter: {
      title: localizedLabel(strings.indexTitle, locale),
      description: localizedLabel(strings.indexLead, locale),
      draft: false,
      noindex: false,
    },
    localesPresent: [...config.site.locales],
  };
  return pageMetaTags(indexPage, locale, config, (_p, l) => newsIndexPath(l)) as never;
};

export default function NewsFeed() {
  const location = useLocation();
  const pathname = location.pathname;
  const locale = localeFromPath(pathname);
  const config = getConfig();
  const strings = chromeStrings.news;

  // Feed state: active category (null = all) + 1-based page. In-place
  // filtering — the URL never changes (user decision 2026-10-01).
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const feed = buildNewsFeed(contentManifest, locale);
  const filtered =
    activeCategory === null ? feed : feed.filter((e) => e.category === activeCategory);
  const total = pageCount(filtered.length);
  const safePage = Math.min(page, total);
  const slice = pageSlice(filtered, safePage);
  const [featured, ...rest] = slice;
  const categories = usedCategories(contentManifest, config);
  const hasPrev = safePage > 1;
  const hasNext = safePage < total;
  const showFeatured = activeCategory === null && safePage === 1;

  const selectCategory = (category: string | null) => {
    setActiveCategory(category);
    setPage(1);
  };

  return (
    <div className="page-column page-section">
      <header className="news-index-head">
        <p className="block-heading">{localizedLabel(strings.kicker, locale)}</p>
        <h1 className="page-heading">{localizedLabel(strings.indexTitle, locale)}</h1>
        <p className="news-index-head__lead">
          {localizedLabel(strings.indexLead, locale)}
        </p>
      </header>

      {/* Category filter: in-place pills (aria-pressed, no navigation). */}
      {categories.length > 0 ? (
        <nav className="news-filter mt-8" aria-label={localizedLabel(strings.filterHeading, locale)}>
          <button
            type="button"
            className="pill-locale"
            aria-pressed={activeCategory === null}
            onClick={() => selectCategory(null)}
          >
            {localizedLabel(strings.filterAll, locale)}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className="pill-locale"
              aria-pressed={activeCategory === category}
              onClick={() => selectCategory(category)}
            >
              {newsCategoryLabel(category, locale)}
            </button>
          ))}
        </nav>
      ) : null}

      {featured && showFeatured ? (
        <div className="news-featured mt-12">
          <NewsCard entry={featured} featured />
        </div>
      ) : null}

      {(() => {
        // On the featured view the rest grid follows; otherwise the whole
        // slice is the grid. Empty feed → the drafted empty note.
        if (filtered.length === 0) {
          return (
            <p className="mt-12 max-w-prose text-muted-foreground">
              {localizedLabel(NOTHING_YET, locale)}
            </p>
          );
        }
        const gridEntries = showFeatured ? rest : slice;
        if (gridEntries.length === 0) return null;
        return (
          <div className="news-grid mt-10">
            {gridEntries.map((entry) => (
              <NewsCard key={entry.slug} entry={entry} featured={false} />
            ))}
          </div>
        );
      })()}

      {/* Pagination controls (in-place): prev / status / next. */}
      {total > 1 ? (
        <nav
          className="news-pagination mt-12"
          aria-label={localizedLabel(strings.pageStatus, locale)
            .replaceAll("{page}", String(safePage))
            .replaceAll("{total}", String(total))}
        >
          {hasPrev ? (
            <button
              type="button"
              rel="prev"
              className="pill pill--outline news-pagination__prev"
              onClick={() => setPage(safePage - 1)}
            >
              ← {localizedLabel(strings.prevPage, locale)}
            </button>
          ) : (
            <span />
          )}
          <span className="news-pagination__status text-sm text-muted-foreground">
            {localizedLabel(strings.pageStatus, locale)
              .replaceAll("{page}", String(safePage))
              .replaceAll("{total}", String(total))}
          </span>
          {hasNext ? (
            <button
              type="button"
              rel="next"
              className="pill pill--outline news-pagination__next"
              onClick={() => setPage(safePage + 1)}
            >
              {localizedLabel(strings.nextPage, locale)} →
            </button>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}

// Chrome string for the empty collection (one string, five locales; drafted
// here to keep chrome-strings.ts focused on shared labels).
const NOTHING_YET: Record<Locale, string> = {
  en: "No news yet — check back soon.",
  de: "Noch keine News — schau bald wieder vorbei.",
  fr: "Pas encore d'actualités — revenez bientôt.",
  it: "Ancora nessuna novità — torna presto.",
  rm: "Anc naginas novitads — turna prest.",
};
