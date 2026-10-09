// Author directory routes: BOTH the listing (`/authors/`) and
// a single author page (`/authors/<id>/`) render from this module — the URL
// decides which. Author records live in content/authors/<id>.mdx (the
// filename IS the authorID); frontmatter carries name/affiliation/image,
// the body per-locale bio sections rendered through the same locale-split
// machinery as content pages ( fallback + notice).
import { useLocation, Link } from "react-router";
import type { MetaFunction, MetaDescriptor } from "react-router";
import { contentManifest } from "virtual:content-manifest";
import { mdxPageModules } from "virtual:mdx-page-modules";
import { LOCALES, type Locale } from "~/lib/config";
import { chromeStrings, LANGUAGE_NAMES } from "~/lib/chrome-strings";
import { localeFromPath, localizedLabel } from "~/lib/locale";
import { pageMetaTags } from "~/lib/seo";
import { getConfig } from "~/lib/get-config";
import { authorListPath, authorPagePath, buildNewsFeed } from "~/lib/news";
import { NewsCard } from "~/components/news-card";

type MdxPageModule = { [exportName: string]: unknown };
type MdxSectionComponent = (props: { children?: never }) => React.ReactElement | null;

function sectionComponent(module: MdxPageModule, locale: Locale): MdxSectionComponent | null {
  const candidate = module[`Mdx${locale.toUpperCase()}`];
  return typeof candidate === "function" ? (candidate as MdxSectionComponent) : null;
}

function resolveFallback(localesPresent: string[], requested: Locale): Locale {
  const has = (l: Locale): boolean => localesPresent.includes(l);
  if (has(requested)) return requested;
  if (has("en")) return "en";
  if (has("de")) return "de";
  return (LOCALES as readonly Locale[]).find((l) => has(l)) ?? requested;
}

// Parse `/authors/` vs `/authors/<id>/` (with optional locale prefix).
function routeInfoFromPath(pathname: string): { authorId: string | null; requested: Locale } | null {
  let requested: Locale = "en";
  for (const candidate of LOCALES) {
    if (candidate === "en") continue;
    if (pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`)) {
      requested = candidate;
      break;
    }
  }
  const stripped = pathname.replace(/^\/(de|fr|it|rm)(?=\/|$)/, "");
  const m = stripped.match(/^\/authors(?:\/([a-z0-9-]+))?\/?$/);
  if (!m) return null;
  return { authorId: m[1] ?? null, requested };
}

// Authors sorted by display name (stable directory order).
function sortedAuthors(): {
  authorId: string;
  name: string;
  affiliation?: string;
  image?: string;
  localesPresent: string[];
}[] {
  return contentManifest.authors
    .map((a) => ({
      authorId: a.authorId,
      name: a.frontmatter.name,
      affiliation: a.frontmatter.affiliation,
      image: a.frontmatter.image,
      localesPresent: a.localesPresent,
    }))
    .sort((x, y) => x.name.localeCompare(y.name, "de"));
}

// Lookup one author record from the serialized manifest array.
function authorById(authorId: string) {
  return contentManifest.authors.find((a) => a.authorId === authorId);
}
export const meta: MetaFunction = ({ location }): MetaDescriptor[] => {
  const location_ = { pathname: location.pathname };
  const info = routeInfoFromPath(location_.pathname);
  if (!info) return [{ title: "Public AI Switzerland" }];
  const locale = info.requested;
  const config = getConfig();
  if (info.authorId === null) {
    // Directory index meta: all-locale synthetic PageLike.
    const strings = chromeStrings.authors;
    const indexPage = {
      slug: "authors",
      theme: "",
      file: "(generated)/authors-index",
      type: "standard" as const,
      frontmatter: {
        title: localizedLabel(strings.indexTitle, locale),
        description: localizedLabel(strings.indexLead, locale),
        draft: false,
        noindex: false,
      },
      localesPresent: [...config.site.locales],
    };
    return pageMetaTags(indexPage, locale, config, (_p, l) => authorListPath(l)) as never;
  }
  const author = authorById(info.authorId);
  if (!author) return [{ title: "Public AI Switzerland" }];
  const authorPage = {
    slug: `authors/${author.authorId}`,
    theme: "authors",
    file: author.file,
    type: "standard" as const,
    frontmatter: {
      title: author.frontmatter.name,
      description:
        author.frontmatter.affiliation ?? localizedLabel(chromeStrings.authors.bylineDescription, locale),
      draft: false,
      noindex: false,
    },
    localesPresent: author.localesPresent,
  };
  return pageMetaTags(
    authorPage,
    locale,
    config,
    (p, l) => authorPagePath(p.slug.split("/")[1] ?? "", l),
  ) as never;
};

export default function AuthorRoute() {
  const location = useLocation();
  const info = routeInfoFromPath(location.pathname);
  if (!info) return null; // 404 catch-all owns unknown URLs (§ 12.7)
  if (info.authorId === null) return <AuthorIndex requested={info.requested} />;
  return <SingleAuthor authorId={info.authorId} requested={info.requested} />;
}

// Directory listing: one card per author (image, name, affiliation,
// bio-first-line excerpt via first locale section resolve), linking to the
// per-author page in the author's RESOLVED bio locale (no unrouted links).
function AuthorIndex({ requested }: { requested: Locale }) {
  const locale = localeFromPath(useLocation().pathname);
  const strings = chromeStrings.authors;
  const authors = sortedAuthors();
  return (
    <div className="page-column page-section">
      <p className="block-heading">{localizedLabel(strings.kicker, locale)}</p>
      <h1 className="page-heading">{localizedLabel(strings.indexTitle, locale)}</h1>
      <p className="mt-4 max-w-prose text-muted-foreground">
        {localizedLabel(strings.indexLead, locale)}
      </p>
      {authors.length === 0 ? (
        <p className="mt-12 max-w-prose text-muted-foreground">
          {localizedLabel(strings.empty, locale)}
        </p>
      ) : (
        <div className="author-grid mt-12">
          {authors.map((author) => {
            const resolved = resolveFallback(author.localesPresent, requested);
            return (
              <Link
                key={author.authorId}
                to={authorPagePath(author.authorId, resolved)}
                className="author-card"
              >
                {author.image ? (
                  <img
                    src={author.image}
                    alt=""
                    className="author-card__image"
                    loading="lazy"
                  />
                ) : null}
                <div className="author-card__body">
                  <h2 className="author-card__name">{author.name}</h2>
                  {author.affiliation ? (
                    <p className="author-card__affiliation">{author.affiliation}</p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Single author page: image + name + affiliation + localised bio (rendered
// MDX through the eager module map resolved by AUTHOR ID, not page slug).
function SingleAuthor({ authorId, requested }: { authorId: string; requested: Locale }) {
  const location = useLocation();
  const locale = localeFromPath(location.pathname);
  const author = authorById(authorId);
  if (!author) return null; // 404 catch-all owns unknown ids via slug absence
  const resolved = resolveFallback(author.localesPresent, requested);
  const mdxModule = mdxPageModules[`__author__${authorId}`] as MdxPageModule | undefined;
  const Section = mdxModule ? sectionComponent(mdxModule, resolved) : null;
  const isFallback = resolved !== requested;
  const strings = chromeStrings.authors;
  // The shared feed supplies published articles, locale-aware links, and
  // newest-first ordering; author records remain the only attribution source.
  const articles = buildNewsFeed(contentManifest, requested)
    .filter((entry) => entry.author?.authorId === authorId);
  return (
    <div className="page-column page-section">
      <p className="block-heading">{localizedLabel(strings.kicker, locale)}</p>
      <div className="author-header mt-2">
        {author.frontmatter.image ? (
          <img src={author.frontmatter.image} alt="" className="author-header__image" loading="lazy" />
        ) : null}
        <div>
          <h1 className="page-heading">{author.frontmatter.name}</h1>
          {author.frontmatter.affiliation ? (
            <p className="mt-2 text-muted-foreground">{author.frontmatter.affiliation}</p>
          ) : null}
        </div>
      </div>
      {isFallback ? <AuthorFallbackNotice requested={requested} resolved={resolved} /> : null}
      <div className="mdx-body mt-8">
        {Section ? <Section /> : <p className="text-muted-foreground">…</p>}
      </div>
      <section className="author-articles" aria-labelledby="author-articles-heading">
        <h2 id="author-articles-heading" className="author-articles__heading">
          {localizedLabel(strings.articlesHeading, locale).replaceAll("{name}", author.frontmatter.name)}
        </h2>
        {articles.length > 0 ? (
          <div className="news-grid">
            {articles.map((entry) => <NewsCard key={entry.slug} entry={entry} />)}
          </div>
        ) : (
          <p className="author-articles__empty">{localizedLabel(strings.noArticles, locale)}</p>
        )}
      </section>
    </div>
  );
}

function AuthorFallbackNotice({ requested, resolved }: { requested: Locale; resolved: Locale }) {
  const template = chromeStrings.fallbackNotice.body[requested];
  const text = template
    .replaceAll("{requested}", LANGUAGE_NAMES[requested][requested])
    .replaceAll("{source}", LANGUAGE_NAMES[requested][resolved]);
  return <p className="mt-2 text-sm text-muted-foreground">{text}</p>;
}
