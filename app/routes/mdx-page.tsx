// Shared renderer for content pages: EVERY MDX page routes through this
// module (routes.ts points each content route here). It derives the page
// slug + requested locale from the URL, loads the page's compiled MDX via
// the generated module map, resolves the locale section ( fallback
// chain), and emits SEO meta from frontmatter.
//
// Implementation: the per-locale section split is compiled into named exports
// (one component per locale) by the locale-split MDX stage; this renderer
// consumes `<slug>.Mdx<Locale>` exports and falls back per.
import { useLocation } from "react-router";
import type { MetaFunction, MetaDescriptor } from "react-router";
import { contentManifest } from "virtual:content-manifest";
import { mdxPageModules } from "virtual:mdx-page-modules";
import { LOCALES, type Locale } from "~/lib/config";
import { chromeStrings, LANGUAGE_NAMES } from "~/lib/chrome-strings";
import { pageMetaTags } from "~/lib/seo";
import { titleFor } from "~/lib/mdx-page-model";
import { getConfig } from "~/lib/get-config";

type ManifestPage = (typeof contentManifest.pages)[number];
type MdxPageModule = {
  // Named per-locale exports produced by the locale-split compile stage;
  // a locale section with no content has no export.
  [exportName: string]: unknown;
};

// The compiled MDX module exposes `MdxEn`, `MdxDe`, … components (locale-
// split compile stage,).
type MdxSectionComponent = (props: { children?: never }) => React.ReactElement | null;

function sectionComponent(module: MdxPageModule, locale: Locale): MdxSectionComponent | null {
  const componentName = `Mdx${locale.toUpperCase()}`;
  const candidate = module[componentName];
  return typeof candidate === "function" ? (candidate as MdxSectionComponent) : null;
}

// Fallback resolver: requested locale → en → de → first available.
function resolveFallback(page: ManifestPage, requested: Locale): Locale {
  const has = (l: Locale): boolean => page.localesPresent.includes(l);
  if (has(requested)) return requested;
  if (has("en")) return "en";
  if (has("de")) return "de";
  return (LOCALES as readonly Locale[]).find((l) => has(l)) ?? requested;
}

function pageBySlug(slug: string): ManifestPage | undefined {
  return contentManifest.pages.find((p) => p.slug === slug);
}

// From a pathname, derive the manifest page + requested locale. Slugs are
// flat , so the FIRST path segment after the optional locale
// prefix is the slug.
function routeInfoFromPath(
  pathname: string,
): { page: ManifestPage; requested: Locale; resolved: Locale } | null {
  let requested: Locale = "en";
  for (const candidate of LOCALES) {
    if (candidate === "en") continue;
    if (pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`)) {
      requested = candidate;
      break;
    }
  }
  const stripped = pathname.replace(/^\/(de|fr|it|rm)(?=\/|$)/, "");
  const slug = stripped.split("/").filter(Boolean)[0] ?? "";
  const page = pageBySlug(slug);
  if (!page) return null;
  return { page, requested, resolved: resolveFallback(page, requested) };
}

export const meta: MetaFunction = ({ location }): MetaDescriptor[] => {
  const info = routeInfoFromPath(location.pathname);
  if (!info) return [{ title: "Public AI Switzerland" }];
  const { page, requested } = info;
  // Full per-locale SEO set: title/description, canonical, hreflang
  // alternates, OG (og:locale + alternates) — built from frontmatter +
  // config canonicalBase by the seo module.
  return pageMetaTags(page, requested, getConfig()) as never;
};

export default function MdxPage() {
  const location = useLocation();
  const info = routeInfoFromPath(location.pathname);
  if (!info) return null; // 404 catch-all owns unknown URLs (§ 12.7)
  return <MdxPageInner info={info} />;
}

function MdxPageInner({ info }: { info: NonNullable<ReturnType<typeof routeInfoFromPath>> }) {
  const { page, requested, resolved } = info;
  // Compiled MDX modules resolve synchronously (eager virtual map) so the
  // prerendered HTML carries the actual content (no client-only fetch flash).
  const mdxModule = mdxPageModules[page.slug] as MdxPageModule | undefined;
  const Section = mdxModule ? sectionComponent(mdxModule, resolved) : null;
  const isFallback = resolved !== requested;

  return (
    <div className="page-column page-section">
      <h1 className="page-heading">{titleFor(page.frontmatter, resolved)}</h1>
      {isFallback ? <FallbackNotice requested={requested} resolved={resolved} /> : null}
      <div className="mdx-body">
        {Section ? <Section /> : <p className="text-muted-foreground">…</p>}
      </div>
    </div>
  );
}

//: visible, unobtrusive notice when showing fallback content,
// naming the requested and source languages (interpolated chrome string).
function FallbackNotice({ requested, resolved }: { requested: Locale; resolved: Locale }) {
  const template = chromeStrings.fallbackNotice.body[requested];
  const requestedName = LANGUAGE_NAMES[requested][requested];
  const sourceName = LANGUAGE_NAMES[requested][resolved];
  const text = template
    .replaceAll("{requested}", requestedName)
    .replaceAll("{source}", sourceName);
  return <p className="mt-2 text-sm text-muted-foreground">{text}</p>;
}