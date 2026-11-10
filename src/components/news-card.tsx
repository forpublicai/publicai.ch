// Shared article card for the news feed and author profiles. Styling and
// localized labels stay identical wherever the card is displayed.
import { useLocation, Link } from "react-router";
import { localeFromPath, localizedLabel } from "~/lib/locale";
import { chromeStrings, LANGUAGE_NAMES, newsCategoryLabel } from "~/lib/chrome-strings";
import type { NewsFeedEntry } from "~/lib/news";
import { getConfig } from "~/lib/get-config";

// CH date convention: DD.MM.YYYY (old-site + mockup model); ISO from
// validated frontmatter (YYYY-MM-DD).
function formatDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}

// One feed card: hero image (standardised 16:10) on top, meta row, title,
// excerpt, byline. `featured` switches the heading level (h2 vs h3).
export function NewsCard({ entry, featured = false }: { entry: NewsFeedEntry; featured?: boolean }) {
  const location = useLocation();
  const locale = localeFromPath(location.pathname);
  const strings = chromeStrings.news;
  const HeadTag = featured ? "h2" : "h3";
  return (
    <Link
      to={entry.href}
      {...(entry.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={featured ? "news-card news-card--featured" : "news-card"}
    >
      {entry.heroImage ? (
        <img src={entry.heroImage} alt="" className="news-card__image" loading="lazy" />
      ) : null}
      <div className="news-card__body">
        <div className="news-card__meta">
          {entry.category ? <span className="news-card__category">{newsCategoryLabel(entry.category, locale)}</span> : null}
          <span className="news-card__date">{entry.date ? formatDate(entry.date) : ""}</span>
        </div>
        <HeadTag className="news-card__title">{entry.title}</HeadTag>
        <p className="news-card__excerpt">{entry.excerpt}</p>
        {entry.resolvedLocale && entry.resolvedLocale !== locale ? (
          <p className="news-card__language">
            {localizedLabel(strings.availableIn, locale).replaceAll("{language}", LANGUAGE_NAMES[locale][entry.resolvedLocale])}
          </p>
        ) : null}
        {getConfig().news?.authorsEnabled !== false && entry.author ? (
          <p className="news-card__byline">
            {entry.author.name}
            {entry.author.affiliation ? ` · ${entry.author.affiliation}` : ""}
          </p>
        ) : null}
        <span className="news-card__more">{localizedLabel(strings.readMore, locale)}</span>
      </div>
    </Link>
  );
}
