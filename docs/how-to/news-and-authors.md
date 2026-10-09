# Publish news and author pages

This guide explains the news pipeline: how articles are published, how authors and categories work, and what the generated news pages look like. News is content, so everything happens in MDX files under `content/`; the news index is generated for you at build time.

## How the site recognises news

A page is a news article when its frontmatter contains both a `date` and a `category`. News articles live alongside the other content folders:

- Article: `content/news/YYYY-MM-DD-<slug>.mdx`, for example `content/news/2026-08-28-cooperative-founding.mdx`
- Author record: `content/authors/<author-id>.mdx` (a reserved top-level folder)

Articles route at `/news/<slug>/` in English and `/<locale>/news/<slug>/` in other languages; the generated index routes at `/news/` and `/<locale>/news/`. The complete address scheme is in [the URL scheme reference](../reference/url-scheme.md).

The filename starts with the publication date from frontmatter, followed by a
descriptive slug: `YYYY-MM-DD-<slug>.mdx`. The entire filename becomes the URL
slug, for example `/news/2026-08-28-cooperative-founding/`. Moving folders alone does not
change routes; renaming the file does. Older published addresses are retained
as redirects in `config.json`.

## Publish an article

1. Copy the news template:

   ```bash
   cp content/templates/news-template.mdx content/news/2026-01-01-example.mdx
   ```

2. Delete the instruction paragraph that sits between the frontmatter and the first locale marker. The template ships with a short German explanation of its own fields; as ordinary text before the first marker it would fail the build with a "content before the first locale marker" error. The templates folder's README explains this rule.
3. Fill in the frontmatter:

   ```yaml
   ---
   title: Genossenschaft gegründet
   description: Kurzer Teaser des Artikels für die News-Übersicht.
   date: 2026-01-01
   category: Dialog
   ---
   ```

   | Field         | Required | Purpose                                                                 |
   | ------------- | -------- | ------------------------------------------------------------------------ |
   | `title`       | yes      | Base article heading; use `title_<locale>` overrides                       |
   | `description` | yes      | Used as the excerpt on the news index and the home teaser |
   | `date`        | yes      | `YYYY-MM-DD`; the sort key, newest first, with a slug tiebreak           |
   | `category`    | yes      | Must be one of `config.json` `news.categories` (see below)               |
   | `author`      | no       | An author ID from `content/authors/`; renders the linked byline          |
   | `heroImage`   | no       | Site-absolute image path, for example `/assets/images/<slug>/hero.jpg`   |
   | `externalUrl` | no       | Absolute URL; makes the article a link-out (see below)                   |
   | `draft`       | no       | `true` hides the article entirely                                        |

4. Write the article under the locale markers, as with any page. At least one language section is required; missing languages fall back and are tracked in the untranslated report.
5. Verify with `yarn build`, then check `yarn dev`: the article appears on `/news/`, in the home page teaser (which lists the three newest articles), and at `/news/<slug>/`.

## Link-out articles

Set `externalUrl` to an absolute URL when the article is really a pointer to something published elsewhere, for example a press release on another site. Such an article gets no route on this site: the news index and the home teaser link directly to the external address (opened safely in a new tab), and the article is left out of the sitemap. Its `description` still serves as the excerpt text on the listings.

## Categories

The allowed categories are defined in `config.json`:

```json
"news": {
  "categories": ["Dialog", "Genossenschaft", "Community", "Medien", "Technik"]
}
```

An article whose `category` is not in this list fails the build, naming the file:

```text
news frontmatter references failed validation:
- content/news/2026-01-01-example.mdx: category "Podcast" is not in config.json news.categories ([Dialog, Genossenschaft, Community, Medien, Technik])
```

Categories appear as in-place filters on `/news/`; selecting one filters the current listing without changing the URL. The filter row only shows categories used by published articles.

## Authors

Author UI is hidden for release 1.0 by `news.authorsEnabled: false` in
`config.json`. Attribution files/fields are retained. Re-enable the switch and
restore the Authors navigation item when the feature is ready.

An author record is one MDX file in `content/authors/`, and the file name (without `.mdx`) is the author ID used in articles' `author` fields. Daria’s profile is `content/authors/daria-hoehener.mdx`, referenced as `author: daria-hoehener` in existing articles.

```yaml
---
name: Dr. Daria Höhener
image: /assets/team/daria-hoehener.jpg
---

<!-- locale: en -->

Dr. Daria Höhener is part of the founding team of Public AI Switzerland.

<!-- locale: de -->

Dr. Daria Höhener gehört zum Gründungsteam von Public AI Switzerland.
```

- Frontmatter: `name` (required, the display name), `affiliation` (optional, shown under the byline), `image` (optional, site-absolute portrait path).
- Body: per-language short bios in the usual locale-section format, fallback chain included.
- Article footer: setting `author` automatically adds a bio box below the article, with the profile’s portrait, name, optional affiliation, localized MDX bio, and profile link. Articles without an author have no bio box. The box uses the same locale fallback and shows a notice when a translation is missing; edit the author record to update every linked article.
- Routes: the author's page at `/authors/<id>/` per language the bio carries, and the directory listing at `/authors/`.
- Profile articles: below the bio, the profile automatically lists published news attributed to the author, newest first, using the same cards as the News index. Drafts are excluded. The heading and empty-state text are localized; no manual article list is needed.
- An article referencing an unknown author ID fails the build, naming both the article and the missing record path:

```text
news frontmatter references failed validation:
- content/news/2026-01-01-example.mdx: author id "jane-doe" has no record — create content/authors/jane-doe.mdx (§ 6.4a)
```

When authors are enabled, author records are routed pages (in the sitemap unless excluded) but are never treated as news, because they carry no `date`/`category`.

## Listing controls

The news index shows up to ten articles at a time. On the first listing page,
the newest article occupies the featured slot and the remaining entries appear
in the grid. Category filters and pagination update the listing in place;
the current news page does not generate category or pagination URLs.

## Verify

```bash
yarn build
```

The build's news gates check every category and author reference before anything else, so a mistyped ID fails early with the messages quoted above. After a passing build, check on `yarn dev` or `yarn preview`:

1. `/news/` lists the article with its category pill, date and excerpt.
2. The category filter row includes the category you used and filters the listing in place.
3. The home page teaser shows the three newest articles.
4. An `externalUrl` article links out directly and has no local page.

The schemas behind this guide are in [the frontmatter reference](../reference/frontmatter.md); the gate chain is in [the build gates reference](../reference/build-gates.md).
