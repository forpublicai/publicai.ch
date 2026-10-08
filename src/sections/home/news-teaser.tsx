// Render the latest three published news articles on Home.
// Uses the same date-sorted collection as News, with localized copy and links.
import { Link } from "react-router";
import { contentManifest } from "virtual:content-manifest";
import { chromeStrings, LANGUAGE_NAMES, newsCategoryLabel } from "~/lib/chrome-strings";
import { localizedLabel } from "~/lib/locale";
import type { Locale } from "~/lib/config";
import { newsCollection, newsArticlePath, newsIndexPath } from "~/lib/news";
import { titleFor, descriptionFor } from "~/lib/mdx-page-model";
import { getConfig } from "~/lib/get-config";

// The teaser renders for one home locale.
export default function NewsTeaser({ locale }: { locale: Locale }) {
  const strings = chromeStrings.news;
  const latest = newsCollection(contentManifest, locale).slice(0, 3);
  if (latest.length === 0) return null; // empty collection → section renders nothing

  return (
    <section className="home-section" aria-label={localizedLabel(strings.ariaLabel, locale)}>
      <div className="home-panel home-panel--tinted">
        <div className="news-teaser__head">
          <div>
            <p className="block-heading">{localizedLabel(strings.kicker, locale)}</p>
            <h2 className="home-section-heading">{localizedLabel(strings.teaserTitle, locale)}</h2>
          </div>
          <Link to={newsIndexPath(locale)} className="pill pill--outline news-teaser__all">
            {localizedLabel(strings.allNews, locale)} →
          </Link>
        </div>
        <div className="news-grid">
          {latest.map((item) => {
            const fm = item.article.page.frontmatter;
            const external = fm.externalUrl;
            // Card href uses the RESOLVED section locale: routes exist
            // only for locales the article carries (no unrouted links).
            const href = external ?? newsArticlePath(item.article.slug, item.resolvedLocale);
            const author =
              getConfig().news?.authorsEnabled !== false && fm.author
                ? contentManifest.authors.find((a) => a.authorId === fm.author)
                : undefined;
            return (
              <Link
                key={item.article.slug}
                to={href}
                {...(external !== undefined
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="news-card"
              >
                {fm.heroImage ? (
                  <img src={fm.heroImage} alt="" className="news-card__image" loading="lazy" />
                ) : null}
                <div className="news-card__body">
                  <div className="news-card__meta">
                    <span className="news-card__category">
                      {newsCategoryLabel(fm.category ?? "", locale)}
                    </span>
                    <span className="news-card__date">{fm.date}</span>
                  </div>
                  <h3 className="news-card__title">{titleFor(fm, item.resolvedLocale)}</h3>
                  <p className="news-card__excerpt">{descriptionFor(fm, item.resolvedLocale)}</p>
                  {item.isFallback ? (
                    <p className="news-card__language">
                      {localizedLabel(strings.availableIn, locale).replaceAll(
                        "{language}",
                        LANGUAGE_NAMES[locale][item.resolvedLocale],
                      )}
                    </p>
                  ) : null}
                  {author ? (
                    <p className="news-card__byline">
                      {author.frontmatter.name}
                      {author.frontmatter.affiliation ? ` · ${author.frontmatter.affiliation}` : ""}
                    </p>
                  ) : null}
                  <span className="news-card__more">
                    {localizedLabel(strings.readMore, locale)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
