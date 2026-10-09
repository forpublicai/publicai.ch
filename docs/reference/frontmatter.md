# Frontmatter reference

Every MDX page file starts with a YAML frontmatter block between two `---` lines. The block describes the page and can include translated title and description overrides. The site knows three frontmatter groups: standard pages, news articles, and author records. Which group applies is decided by the fields present, not by the folder.

```yaml
---
title: Mission
description: Why we are building a cooperative for public AI in Switzerland.
---
```

## Parsing rules (all groups)

- Flat `key: value` lines only. Values may be written bare or wrapped in single or double quotes.
- Booleans are the words `true` and `false`; dates are plain `YYYY-MM-DD` text.
- Unknown keys are ignored, a missing `--- ... ---` block is an error, and validation errors name the file and field, for example `content/cooperative/mission.mdx: invalid frontmatter: - title: ...`.
- `title` and `description` are required base values. Optional `title_en`, `title_de`, `title_fr`, `title_it`, `title_rm` and matching `description_<locale>` fields supply translated metadata. Resolution uses the requested override, then the English override, then the German override, then the base value.

## Standard page

Source of truth: the page model in `src/lib/mdx-page-model.ts` (specification § 6.3).

| Field        | Type               | Required | Purpose                                                                        |
| ------------ | ------------------ | -------- | -------------------------------------------------------------------------------- |
| `title`      | string, non-empty  | yes      | The page `<h1>` and the SEO title.                                               |
| `description`| string, non-empty  | yes      | SEO description and link preview text; 50 to 160 characters recommended.         |
| `draft`      | boolean            | no (default `false`) | `true`: no routes, no sitemap entry, no reachability requirement; has no route in `yarn dev` either. |
| `noindex`    | boolean            | no (default `false`) | `true`: page stays routable but carries a robots noindex and is left out of the sitemap. |
| `updatedAt`  | `YYYY-MM-DD`       | no       | Feeds the sitemap `lastmod`; recommended for legal pages.                        |

A page is a standard page when `date` and `category` are both absent.

## News article

Source of truth: § 6.4. An article is any page whose frontmatter has both `date` and `category`, regardless of which theme folder it lives in; the repository convention is `content/news/YYYY-MM-DD-<slug>.mdx`, with the filename date matching `date` in frontmatter.

| Field         | Type                  | Required | Purpose                                                                        |
| ------------- | --------------------- | -------- | -------------------------------------------------------------------------------- |
| `title`       | string, non-empty     | yes      | Article heading.                                                                  |
| `description` | string, non-empty     | yes      | Excerpt shown on the news index and the home teaser.                               |
| `date`        | `YYYY-MM-DD`          | yes      | Sort key; listings are newest-first with a slug tiebreak.                         |
| `category`    | string, non-empty     | yes      | Must be one of `config.json` `news.categories`; violations fail the build naming the file. |
| `author`      | string, non-empty     | no       | An author ID; the file `content/authors/<id>.mdx` must exist. Unknown IDs fail the build naming both files. |
| `heroImage`   | string, non-empty     | no       | Site-absolute image path, for example `/assets/images/<slug>/hero.jpg`.           |
| `externalUrl` | absolute `http(s)` URL| no       | Link-out mode: the article gets no route; index and teaser link directly to the external address; excluded from the sitemap. |
| `draft`       | boolean               | no (default `false`) | `true`: hidden entirely.                                             |

Notes:

- `authorId` appears in older drafts of the specification as an alias of `author`. It is deprecated and not read by the build; use `author`.
- Articles with `externalUrl` are identified as news like any other (they carry `date` and `category`), but produce no local page.
- The generated index and in-place category filters are described in [how to publish news](../how-to/news-and-authors.md).

## Author record

Source of truth: § 6.4a. Author records live in the reserved folder `content/authors/`; the file name without `.mdx` is the author ID referenced by articles' `author` field. The body is per-language bio sections in the usual `<!-- locale: xx -->` format.

| Field         | Type              | Required | Purpose                                                   |
| ------------- | ----------------- | -------- | ----------------------------------------------------------- |
| `name`        | string, non-empty | yes      | Display name (locale-neutral).                              |
| `affiliation` | string, non-empty | no       | Role or organisation shown under the byline.                |
| `image`       | string, non-empty | no       | Site-absolute portrait path, for example `/assets/team/joshua.jpg`. |

Notes:

- The author ID must be lowercase letters, digits and hyphens; duplicate IDs across files are a build error.
- Author pages route at `/authors/<id>/` (per language the bio carries) and the directory at `/authors/`.
- Author records are never news (no `date`/`category`), and files in `content/authors/` never become standard pages.

## What the build derives from frontmatter

| Derivation                | Depends on                                | Result                                                                     |
| ------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| Page type                 | `date` + `category` present together       | Standard page vs news article (news routing and listing pipelines)            |
| Sitemap entry             | `draft`, `noindex`, `pages.excluded`, `externalUrl` | Published pages only; see [the build gates reference](build-gates.md) |
| Sitemap `lastmod`         | `updatedAt` (news articles fall back to `date`) | `<lastmod>` per sitemap entry                                          |
| Route existence           | `draft` and `externalUrl`                  | Drafts and link-outs get no routes                                            |

## Templates

Blank starting points with all five locale markers live in `content/templates/`: `page-template.mdx` for standard pages and `news-template.mdx` for articles (both page and news templates contain explanatory text before the first locale marker; delete it from the copied file before building). The copy-paste workflow is in [add or edit a page](../how-to/add-or-edit-a-page.md).
