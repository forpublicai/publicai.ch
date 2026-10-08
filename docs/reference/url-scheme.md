# URL scheme reference

This reference lists every URL shape the site produces, the rules behind them, and what happens for missing languages and unknown addresses. The scheme is static and predictable: English at the root, other locales behind a prefix, directory-style addresses with trailing slashes.

## Address table

| Content                        | English address                  | Other locales                          |
| ------------------------------ | --------------------------------- | ---------------------------------------- |
| Home page                      | `/`                               | `/de/`, `/fr/`, `/it/`, `/rm/`          |
| Standard page `<slug>`         | `/<slug>/`                        | `/<locale>/<slug>/`                     |
| News index                     | `/news/`                          | `/<locale>/news/`                       |
| News article `<slug>`          | `/news/<slug>/`                   | `/<locale>/news/<slug>/`                |
| Author directory               | `/authors/`                       | `/<locale>/authors/`                    |
| Author page `<id>`             | `/authors/<id>/`                  | `/<locale>/authors/<id>/`               |
| Unknown address                | `/404.html` (host fallback) plus the client-side localised 404 | localised by URL prefix |

## Rules

### Slugs and addresses

1. The slug is the MDX file name without `.mdx`: `mission.mdx` produces `/mission/`. Slugs use English words (retaining proper names), lowercase letters, digits and hyphens.
2. Slugs are unique across the whole content tree. A duplicate is a build error naming both files, because theme folders carry no routing semantics (moving a file between folders never changes its URL).
3. The slug `news` is reserved for the generated news index; a page file with that name fails the build.
4. Canonical addresses carry a trailing slash; the build emits `<path>/index.html` for each address, which any static host serves as the directory index.
5. Author IDs are file names under `content/authors/` and follow the same slug rules.

News filenames include the publication date: `content/news/2026-08-28-cooperative-founding.mdx`
routes at `/news/2026-08-28-cooperative-founding/`. The prefix matches the frontmatter
`date`. News shares a top-level folder with `dialogue`; folder names do not enter
the slug. Old published news URLs redirect to their dated replacements.

### Locale prefixes

English is the root locale: its addresses carry no prefix. Every other locale prefixes the full address path (`/de/news/2026-08-28-cooperative-founding/`). Internal links, menu items and CTA targets carry the visitor's current locale automatically, so navigation never switches language unless the visitor uses the language switcher, which navigates to the same page in the chosen locale.

## Missing languages: routes and fallback

Two mechanisms work together; they are subtle and worth separating.

### Routes exist only for carried languages

A page gets routes only for the locales its file actually contains. A German-only article has `/de/news/<slug>/` and nothing else; opening `/news/<slug>/` directly is a harmless 404. This is deliberate hreflang truthfulness (§ 7.3): the site never advertises, to browsers or search engines, an address whose content would not really be that language. It also means the sitemap and hreflang sets list only real, non-fallback addresses, with `x-default` pointing at the English URL.

### The fallback chain fills the visible gaps

Within a page's carried routes, a missing language section resolves through a fixed chain:

```text
requested locale  →  en  →  de  →  first section the file has
```

The page renders with the requested locale's chrome (header, footer, notices), shows a short notice in the visitor's language ("This page is not yet available in French. Showing the English version."), and is marked `noindex` with a canonical link to the source-language URL. Fallback pages are excluded from the sitemap and hreflang sets. The design reasoning is in [the localisation model](../explanation/localisation-model.md); the practical translation workflow is in [translate a page](../how-to/translate-a-page.md).

Exception worth knowing: the news index exists in all five locales by design, because a listing can always render through the fallback chain; the same is true of the author directory.

## Generated addresses

| Address                    | Produced by        | Content                                                                                     |
| -------------------------- | ------------------ | --------------------------------------------------------------------------------------------- |
| `/404.html`                | build              | Copy of the SPA fallback with a noindex; static hosts use it as the 404 document               |
| `__spa-fallback.html`      | React Router       | The client-side router shell; unknown URLs hydrate the localised 404 from it                   |
| `/<from>/index.html`       | `pages.redirects`  | Meta-refresh stub (noindex, canonical to target) forwarding an old address; see [hide or redirect pages](../how-to/exclude-or-redirect-pages.md) |
| `/sitemap.xml`             | build              | All published pages in their carried locales, with hreflang alternates                         |
| `/robots.txt`              | build              | Crawler rules referencing the sitemap                                                          |

Categories are filters within the News index and do not have separate URLs. News listings currently appear on a single page without pagination routes.
