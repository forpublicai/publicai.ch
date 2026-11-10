# Build gates reference

Every change to this repository must pass the build gates: a fixed sequence of checks that refuses to publish broken content, broken links or broken configuration, each failure naming the file or config path responsible. Contributors mostly meet the gates through `yarn build`; this reference lists every gate, what it checks, and the reports the build writes.

## The gate chain

The release chain runs in this order. Each command is a separate Yarn script; every one must pass.

| Order | Gate                | Command          | What it does                                                                              | Fails when                                                            |
| ----- | --------------------- | ---------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1     | Lint                  | `yarn lint`      | ESLint (typescript-eslint) over the source; `scripts/` QA tooling is ignored                | Lint rule violations                                                    |
| 2     | Typecheck             | `yarn typecheck` | TypeScript strict compilation (`tsc`)                                                       | Type errors; also catches missing chrome-string locales (typed records) |
| 3     | Unit tests            | `yarn test`      | Vitest over `tests/unit/` (config schema, page model, discovery, links, SEO, news pipeline) | Any test failure                                                        |
| 4     | SSG build + post-build gates | `yarn build` | Renders every page to static HTML in `build/client/` and runs the post-build gates below | Any gate failure; all failures name files or config paths               |
| 5     | E2E + accessibility   | `yarn test:e2e`  | Playwright (Chromium) against the built output; smoke tests plus axe-core accessibility     | Smoke failures; any critical, serious or moderate axe violation         |

For quick iteration, `yarn dev` renders pages live without the gates; the gates run when you build. `yarn preview` serves the finished `build/client/` output on `http://localhost:4173/` for checking the production artefact.

## Post-build gates (inside `yarn build`)

After the static pages are rendered, the build's end hook runs the following checks in order. A failure anywhere stops the build with a readable error.

| Order | Gate                          | What it checks                                                                                                                                          | Failure message names                     |
| ----- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1     | News references                 | Every article's `category` is in `config.json` `news.categories`; every `author` ID has a record in `content/authors/`                                    | The article file and the fix (record path or category list) |
| 2     | Config page references          | Every menu/footer `page:` slug (nested `children` included) resolves to a discovered page or the reserved `news` slug                                      | The config path, for example `menus.main[4].page` |
| 3     | MDX internal links              | Every internal Markdown link and `CTA to=`/`LinkRow` target across all locale sections resolves to a page                                                  | The MDX file and the unresolvable target    |
| 4     | Sitemap and robots emission     | Regenerates `sitemap.xml` (published pages only, hreflang alternates per entry) and `robots.txt`                                                          | Not a gate: always succeeds, output only    |
| 5     | Untranslated sections report    | Lists pages and the locales they lack (English first); written only when gaps exist                                                                       | Not a gate: report only, see [translate a page](../how-to/translate-a-page.md) |
| 6     | Reachability crawl              | Crawls rendered links from the five locale homes; every published page must be reachable unless listed in `pages.excluded` (dropdown children count as links) | Each unreachable page's URL                 |
| 7     | Hygiene guard                   | The build output must contain none of `docs/`, contributor instructions, internal notes, or any `.tmp` file                        | Each forbidden path found                   |
| 8     | 404 and redirects emission      | Writes the root `404.html` (noindex) and one meta-refresh stub per `pages.redirects` entry                                                                | Not a gate: emission step                   |

## Reports and output files

Everything the build produces for inspection lands in `build/client/` (the deploy artefact). `sitemap.xml` and `robots.txt` are also mirrored into `public/` for dev parity.

| File                                    | When written               | Contents                                                      |
| ---------------------------------------- | ---------------------------- | ----------------------------------------------------------------- |
| `build/client/sitemap.xml`               | every build                 | Published page URLs, all carried locales, hreflang + `x-default`  |
| `build/client/robots.txt`                | every build                 | Crawler rules with the sitemap reference                          |
| `build/client/external-links-report.txt` | every build                 | Every external URL configured in menus and footer (compiled, not network-checked) |
| `build/client/untranslated-sections-report.txt` | only when gaps exist  | Per page: the missing locales, English first                      |
| `build/client/404.html`                  | every build                 | Root 404 document (noindex)                                       |
| `build/client/<from>/index.html`         | per redirect entry          | Meta-refresh stub to the `to` address                             |

## The E2E suite in detail

`yarn test:e2e` starts the preview server (port 4173, or `E2E_BASE_URL` if you point it at a running server) and runs two Playwright suites in `tests/e2e/`:

- **Smoke (`smoke.spec.ts`):** every locale home renders with header, main and footer; the news index lists article cards; a sampled article, the author directory, the team page and the legal pages render their content; the language switcher keeps the visitor on the same page in the new locale; unknown addresses render the localised 404.
- **Accessibility (`a11y.spec.ts`):** axe-core runs on a sampled set of page types (homes in several locales, news index and article, author pages, legal pages, 404) plus keyboard operability checks (mobile menu, dropdowns). The gate is zero critical, serious and moderate violations.

## What contributors need to remember

- Any content or config mistake fails `yarn build` with the file or config path named; fix and rerun. There is no warning-only mode for broken links or references.
- The untranslated report is the one output that is not a failure: partial translations are welcome and tracked, not blocked.
- `yarn format` (Prettier) is available for formatting, and the lint gate expects formatted code.