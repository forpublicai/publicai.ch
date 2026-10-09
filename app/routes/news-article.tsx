// News article renderer: a news MDX page routed at
// `/news/<slug>/` (+ locale prefixes) instead of the flat standard-page
// scheme. Reuses the mdx-page renderer machinery (eager module map,
// fallback, notice) with the news URL shape for meta/canonical. The
// "back to news" link and an article header (category + date) frame the
// MDX body. `externalUrl` articles never reach this route (no route is
// generated; index/teaser link out directly).
import { useLocation, Link } from "react-router";
import type { MetaFunction, MetaDescriptor } from "react-router";
import { contentManifest } from "virtual:content-manifest";
import { mdxPageModules } from "virtual:mdx-page-modules";
import { LOCALES, type Locale } from "~/lib/config";
import { chromeStrings, LANGUAGE_NAMES, newsCategoryLabel } from "~/lib/chrome-strings";
import { localeFromPath, localizedLabel } from "~/lib/locale";
import { pageMetaTags } from "~/lib/seo";
import { titleFor } from "~/lib/mdx-page-model";
import { getConfig } from "~/lib/get-config";
import { newsIndexPath, newsArticlePath, authorPagePath } from "~/lib/news";

type MdxPageModule = {
  [exportName: string]: unknown;
};

type MdxSectionComponent = (props: { children?: never }) => React.ReactElement | null;

function sectionComponent(module: MdxPageModule, locale: Locale): MdxSectionComponent | null {
  const componentName = `Mdx${locale.toUpperCase()}`;
  const candidate = module[componentName];
  return typeof candidate === "function" ? (candidate as MdxSectionComponent) : null;
}

// Fallback resolver: requested locale → en → de → first available.
function resolveFallback(localesPresent: string[], requested: Locale): Locale {
  const has = (l: Locale): boolean => localesPresent.includes(l);
  if (has(requested)) return requested;
  if (has("en")) return "en";
  if (has("de")) return "de";
  return (LOCALES as readonly Locale[]).find((l) => has(l)) ?? requested;
}

// From a pathname `[/xx]/news/<slug>/`, derive the news page + locale.
function routeInfoFromPath(
  pathname: string,
): { page: (typeof contentManifest.pages)[number]; requested: Locale; resolved: Locale } | null {
  let requested: Locale = "en";
  for (const candidate of LOCALES) {
    if (candidate === "en") continue;
    if (pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`)) {
      requested = candidate;
      break;
    }
  }
  const stripped = pathname.replace(/^\/(de|fr|it|rm)(?=\/|$)/, "");
  const m = stripped.match(/^\/news\/([a-z0-9-]+)\/?$/);
  if (!m) return null;
  const slug = m[1];
  const page = contentManifest.pages.find((p) => p.slug === slug && p.type === "news");
  if (!page) return null;
  return { page, requested, resolved: resolveFallback(page.localesPresent, requested) };
}

export const meta: MetaFunction = ({ location }): MetaDescriptor[] => {
  const info = routeInfoFromPath(location.pathname);
  if (!info) return [{ title: "Public AI Switzerland" }];
  const { page, requested } = info;
  // News URL shape override: canonical/hreflang point at /news/<slug>/.
  return pageMetaTags(
    page,
    requested,
    getConfig(),
    (p, l) => newsArticlePath(p.slug, l),
  ) as never;
};

export default function NewsArticle() {
  const location = useLocation();
  const info = routeInfoFromPath(location.pathname);
  if (!info) return null; // 404 catch-all owns unknown URLs (§ 12.7)
  const { page, requested, resolved } = info;
  const mdxModule = mdxPageModules[page.slug] as MdxPageModule | undefined;
  const Section = mdxModule ? sectionComponent(mdxModule, resolved) : null;
  const isFallback = resolved !== requested;
  const locale = localeFromPath(location.pathname);
  const strings = chromeStrings.news;
  const fm = page.frontmatter;
  const authorsEnabled = getConfig().news?.authorsEnabled !== false;

  return (
    <div className="page-column page-section">
      <Link to={newsIndexPath(locale)} className="news-back">
        ← {localizedLabel(strings.allNews, locale)}
      </Link>
      {fm.heroImage ? (
        <img src={fm.heroImage} alt="" className="news-article__hero" fetchPriority="high" />
      ) : null}
      <div className="news-card__meta mt-8">
        {fm.category ? <span className="news-card__category">{newsCategoryLabel(fm.category, locale)}</span> : null}
        {fm.date ? <span className="news-card__date">{formatDate(fm.date)}</span> : null}
        {authorsEnabled && fm.author ? <AuthorByline authorId={fm.author} locale={locale} /> : null}
      </div>
      <h1 className="page-heading mt-2">{titleFor(fm, resolved)}</h1>
      {isFallback ? <FallbackNotice requested={requested} resolved={resolved} /> : null}
      <div className="mdx-body mt-8">
        {Section ? <Section /> : <p className="text-muted-foreground">…</p>}
      </div>
      {authorsEnabled && fm.author ? <AuthorBio authorId={fm.author} locale={locale} /> : null}
    </div>
  );
}

// Byline: author display name (from the author record,) linking to
// the author page in the bio's resolved locale.
function AuthorByline({ authorId, locale }: { authorId: string; locale: Locale }) {
  const author = contentManifest.authors.find((a) => a.authorId === authorId);
  if (!author) return null;
  const resolved = resolveFallback(author.localesPresent, locale);
  return (
    <Link to={authorPagePath(author.authorId, resolved)} className="news-card__byline">
      {author.frontmatter.name}
      {author.frontmatter.affiliation ? ` · ${author.frontmatter.affiliation}` : ""}
    </Link>
  );
}

// Article-end biography reuses the author's MDX record, portrait, and locale
// fallback. Editors update the profile once; every linked article follows.
function AuthorBio({ authorId, locale }: { authorId: string; locale: Locale }) {
  const author = contentManifest.authors.find((a) => a.authorId === authorId);
  if (!author) return null;
  const resolved = resolveFallback(author.localesPresent, locale);
  const mdxModule = mdxPageModules[`__author__${authorId}`] as MdxPageModule | undefined;
  const Bio = mdxModule ? sectionComponent(mdxModule, resolved) : null;
  const profilePath = authorPagePath(authorId, resolved);

  return (
    <aside className="news-author-bio" aria-labelledby="news-author-bio-name" lang={resolved}>
      {author.frontmatter.image ? (
        <img src={author.frontmatter.image} alt="" className="news-author-bio__portrait" loading="lazy" />
      ) : null}
      <div className="news-author-bio__content">
        <h2 id="news-author-bio-name" className="news-author-bio__name">
          <Link to={profilePath}>{author.frontmatter.name}</Link>
        </h2>
        {author.frontmatter.affiliation ? (
          <p className="news-author-bio__affiliation">{author.frontmatter.affiliation}</p>
        ) : null}
        {resolved !== locale ? (
          <div lang={locale}><FallbackNotice requested={locale} resolved={resolved} /></div>
        ) : null}
        {Bio ? <div className="mdx-body news-author-bio__text"><Bio /></div> : null}
        <Link to={profilePath} className="news-author-bio__profile" lang={locale}>
          {localizedLabel(chromeStrings.authors.viewProfile, locale)} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </aside>
  );
}

// CH date convention (DD.MM.YYYY).
function formatDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}

//: visible, unobtrusive notice when showing fallback content
// (same string the mdx-page renderer uses).
function FallbackNotice({ requested, resolved }: { requested: Locale; resolved: Locale }) {
  const template = chromeStrings.fallbackNotice.body[requested];
  const requestedName = LANGUAGE_NAMES[requested][requested];
  const sourceName = LANGUAGE_NAMES[requested][resolved];
  const text = template
    .replaceAll("{requested}", requestedName)
    .replaceAll("{source}", sourceName);
  return <p className="mt-2 text-sm text-muted-foreground">{text}</p>;
}
