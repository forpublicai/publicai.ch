# Config-only maintenance

The single most important structural promise of this project is the maintenance invariant: adding, editing or removing a page requires touching only MDX files; changing menus, footer, exclusions or toggles requires touching only `config.json`. No other file changes are ever required for these operations. This page explains why the invariant exists, how the build enforces it, where it stops, and what it costs.

## Why promise it at all

A small team with volunteer translators and occasional contributors cannot afford a site where a routine task requires archaeology. The failure mode being avoided is well known: a contributor adds a page, then discovers the routing table must be edited, then the navigation module, then the sitemap script, and each edit is a chance to break something only a developer can repair. The invariant removes that entire class of work: the contributor's task and the files it touches are the same list.

The invariant also disciplines the codebase itself. If pages can be wired up only by convention, then the build must derive routing, navigation resolution, the sitemap, hreflang alternates and the reachability crawl from the content tree automatically. There is no hand-maintained route list to forget, because hand-maintained lists are exactly what the invariant forbids.

## How the build enforces it

The build does the wiring, and the build does the policing. Both directions matter.

On the automatic side, content discovery walks `content/`, turns each MDX file into routes for the languages it carries, regenerates the sitemap and robots files, and recomputes hreflang alternates on every build. A page added as `content/press/press.mdx` is instantly linkable from any menu as `"page": "press"`, reachable, and in the sitemap, with no edit besides the file itself.

On the policing side, every config promise is verified: menu `page:` slugs must resolve to real files (including slugs nested inside dropdown `children`), every internal link in MDX must resolve, every published page must be reachable from the home pages unless excluded, and every label must carry all five languages. A violation fails the build with the offending path named, in messages written to be fixable by the person who just made the mistake. The gate list is in [the build gates reference](../reference/build-gates.md).

This division keeps `config.json` honest as the only structural file. If a menu item points at a page that does not exist, the site refuses to build rather than shipping a dead link; if a page exists that nothing links to, the crawl says so rather than letting it rot in isolation.

## Where the invariant stops

Three areas are deliberately outside the promise, and knowing them prevents frustration.

- **The home page is code.** The home page is the site's one hand-composed page, built from independent sections (hero, news teaser, share offer, and so on) in `src/sections/home/`. Its copy lives inside those section files, not in MDX, so that each section stays self-contained: removing a section is removing its import and one JSX line, and nothing else changes. This is the documented exception from the original specification, not a violation of it.
- **Site chrome strings are code-adjacent.** Strings owned by the whole site (404 copy, the fallback notice, aria-labels, the newsletter pill label) live in the typed module `src/lib/chrome-strings.ts`, maintained by developers with compile-time completeness checks. Everything contributors might localise (menus, footer, page content) is deliberately kept out of that module.
- **New components are code.** MDX components are developer work; their prop names are stable contracts with content files, and adding one requires a code change plus a template note, never a content-side workaround.

The full boundary map between contributors and developers is described alongside the language architecture in [the localisation model](localisation-model.md).

## The trade-offs

The invariant buys contributor safety and pays in centralisation pressure. `config.json` is one file that grows with the site: every menu label carries all five languages, and the file is the single point where navigation structure, exclusion rules and toggles live. For a site of this size that is a benefit (one place to look, one schema to validate), but the file deserves care in review, since a malformed label or a mistyped slug stops the build. The build's readable, path-naming errors are what keep that trade pleasant.

The other trade is that nothing edits at runtime. There is no admin interface and no staging database; publishing is a git commit that passes the gates. For this project that is not a limitation but the point: static output, no server, no tracking, and every published change reviewable after the fact. Contributors who want to preview before committing use `yarn dev`, which renders pages live as files are saved, and `yarn preview` to inspect the production artefact.
