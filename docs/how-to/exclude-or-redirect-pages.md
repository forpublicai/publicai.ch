# Hide a page from the sitemap, or redirect an old address

Some pages should exist without being advertised, and some addresses should lead somewhere new. This guide covers both mechanisms, which live in `config.json` under `pages`, plus the per-page frontmatter flags that solve similar problems from inside an MDX file.

## The mechanisms at a glance

| Mechanism                     | Where                     | Effect                                                                      |
| ----------------------------- | ------------------------- | ---------------------------------------------------------------------------- |
| `pages.excluded` (config)     | `config.json`             | Page stays routable, but is left out of the sitemap and exempt from the reachability crawl |
| `draft: true` (frontmatter)   | the page's MDX file       | Page gets no routes at all: invisible everywhere, still renders on `yarn dev` |
| `noindex: true` (frontmatter) | the page's MDX file       | Page stays routable, carries a robots noindex, and is left out of the sitemap |
| `pages.redirects` (config)    | `config.json`             | Old address emits a small HTML page that forwards visitors to the new one     |

## Excluding a page from the sitemap

Add the slug to `pages.excluded`:

```json
"pages": {
  "excluded": ["sandbox"]
}
```

Effects, precise:

- The page keeps its routes and stays reachable in the browser (`/sandbox/`, `/de/sandbox/`, and so on).
- The page is left out of `sitemap.xml` in every language.
- The build's reachability crawl, which otherwise fails the build when a published page cannot be reached from the home pages, no longer demands this page.

The repository's live example is the `sandbox` slug: the component demonstration page `content/cooperative/sandbox.mdx` is routed for editors to inspect, but excluded because it is not part of the public information architecture. Exclusions accept slugs only, not URLs, since slugs are flat and folder-independent.

## Hiding versus excluding

An excluded page is still a public page; it simply does not advertise itself to search engines through the sitemap and is not required to be menu-reachable. If the intent is "nobody should see this yet", use `draft: true` instead, which removes routing entirely. If the intent is "linkable, but keep it out of search indexes", use `noindex: true` in the frontmatter. The frontmatter fields are tabulated in [the frontmatter reference](../reference/frontmatter.md).

As a rule of thumb: exclusion is for pages that exist for editors or special links (sandboxes, campaign landing pages entered only from external sources); drafts are for work in progress; noindex is for public-but-unlistable content.

## Redirecting an old address

Map old or moved URLs to new routes in `config.json`:

```json
"pages": {
  "redirects": [
    { "from": "/gruendung/", "to": "/news/2026-08-28-cooperative-founding/" },
    { "from": "/gruendung", "to": "/news/2026-08-28-cooperative-founding/" }
  ]
}
```

At build time, each entry produces a small HTML page at the `from` address containing a meta-refresh to the `to` address, plus a plain link for browsers and crawlers that ignore meta-refresh. The stub is marked `noindex` and carries a canonical link pointing at the target, so search engines converge on the new address. This mechanism works on any static host because it needs no server configuration; the repository currently uses it to forward the news article's pre-pipeline addresses.

Practical notes:

- `from` is normalised: leading and trailing slashes are stripped, and the stub is emitted as `<from>/index.html`, so both `/gruendung/` and `/gruendung` produce the same stub.
- `to` should be a site-absolute path such as `/news/2026-08-28-cooperative-founding/`, matching the site's trailing-slash URL style described in [the URL scheme reference](../reference/url-scheme.md).
- Redirects and removed pages are companions: when you delete a page, add a redirect so old links keep working. The full sequence is in [remove a page](remove-a-page.md).

## Verify

```bash
yarn build
```

Then confirm the effects in the build output under `build/client/`:

- The excluded slug's URLs are absent from `sitemap.xml`.
- The build log reports the crawl result (`[gates] reachability crawl: N pages reachable`) without failing on your excluded page.
- Each redirect exists as `build/client/<from>/index.html`; with `yarn preview` running on `http://localhost:4173/`, open the old address and watch it forward.

The gates themselves are listed in [the build gates reference](../reference/build-gates.md).