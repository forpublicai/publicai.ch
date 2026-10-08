# Add or edit a page

This guide covers the two everyday content tasks on this site: publishing a new page and changing an existing one. In both cases you touch exactly one kind of file, an MDX file under `content/`, and the build takes care of routing, navigation wiring and the sitemap. If you have not yet run the project locally, start with [your first page in 15 minutes](../tutorials/first-page-in-15-minutes.md).

Prerequisites: a cloned repository with `yarn install` done, and either `yarn dev` running or the willingness to run `yarn build` for verification.

## The short version

1. Copy `content/templates/page-template.mdx` to `content/<your-theme>/<slug>.mdx` and remove the instruction paragraph before the first locale marker.
2. Fill in the frontmatter (`title`, `description`).
3. Write the content under the `<!-- locale: xx -->` markers.
4. Save. The page exists at `/<slug>/` in English and `/<locale>/<slug>/` in every language you wrote.

## Step 1: Choose the file name

The file name becomes the URL slug, so choose it deliberately:

- Lowercase letters, digits and hyphens only (`participate.mdx`, `ai-dialogue.mdx`).
- Unique across the whole content tree, not just within your folder. Two files named `team.mdx` in different folders are a build error that names both files.
- `news` is reserved for the generated news index; a page file with that name fails the build.
- The slug is permanent in practice. Prefer short, stable names for standard pages; news filenames start with their publication date.

Theme folders (`content/cooperative/`, `content/dialogue/`, and any folder you create) have no effect on the URL. They exist purely to keep the content tree readable for humans. See [why folders carry no routing semantics](../explanation/why-mdx.md) for the reasoning.

## Step 2: Copy the template

```bash
cp content/templates/page-template.mdx content/<your-theme>/<slug>.mdx
```

The template contains frontmatter and all five locale markers, beginning with German. Remove its explanatory paragraph between frontmatter and the first marker. It is a plain starting point, not a straitjacket: you may delete sections for languages you do not have yet.

## Step 3: Fill in the frontmatter

Frontmatter is the small block between the two `---` lines at the top of the file. Two fields are required:

```yaml
---
title: Mission
description: Why we are building a cooperative for public AI in Switzerland.
---
```

| Field        | Required | Purpose                                                                    |
| ------------ | -------- | -------------------------------------------------------------------------- |
| `title`      | yes      | The page heading and the SEO title. Base title; `title_<locale>` supplies translated overrides. |
| `description`| yes      | SEO description and link preview text, 50 to 160 characters recommended.   |
| `draft`      | no       | `true` keeps the page out of routing and the sitemap entirely.             |
| `noindex`    | no       | `true` keeps the page routable but out of the sitemap and search indexes.  |
| `updatedAt`  | no       | `YYYY-MM-DD`; recommended for legal pages; feeds the sitemap `lastmod`.    |

The full field reference, including the news and author variants, lives in [the frontmatter reference](../reference/frontmatter.md).

## Step 4: Write the locale sections

Under each `<!-- locale: xx -->` marker you write that language's content as Markdown. Keep one marker per language, keep markers on their own lines, and make sure the file has at least one section. English should be present on every page; the build tracks gaps for the other languages in the untranslated report (see [translate a page](translate-a-page.md)).

Inside a section you can use ordinary Markdown plus the site's MDX components, which need no import. They are documented with examples in [the component reference](../reference/components.md). Keep components in mind per language: a callout written only in German will only appear in the German section, so repeat the block in every language you want it in.

## Step 5: Link the page from somewhere

The production build requires every published page to be reachable from the home pages unless explicitly excluded. Two natural ways to link it:

- Put it in a menu or footer column. That is a `config.json` edit, described in [menus and footer](menus-and-footer.md).
- Link it from another page's text with an internal Markdown link: `[our mission](/mission)`. Links beginning with `/` are site-internal slugs and get the current language prefix automatically; writing `[unsere Mission](/mission)` inside a `de` section produces `/de/mission/`. Unresolvable internal links fail the build.

## Step 6: Check the result

Restart `yarn dev` after adding a new file or adding/removing language sections so React Router discovers its route. Edits to existing content update live. Before you call the work done, run the production build once:

```bash
yarn build
```

The build runs the full quality gate chain: discovery and validation of the new file, internal link verification, sitemap regeneration, the reachability crawl and the hygiene guard. A failure names the file or config path involved. The complete gate list is in [the build gates reference](../reference/build-gates.md).

## Editing an existing page

Find the file by its slug: the page at `/mission/` lives in the file named `mission.mdx` somewhere under `content/` (any theme folder). Open it, edit the section of the language you want to change, and save. The dev server reflects the change immediately; `yarn build` verifies the whole site before you publish.

Two cautions when editing:

- Keep one marker per language you include. Reordering sections is allowed; adding or removing a language requires restarting the dev server.
- The base `title` and `description` are defaults. Set `title_de`, `description_de`, and the equivalent locale keys for translated headings and summaries.

## Working with drafts

Set `draft: true` in the frontmatter to keep unfinished work out of the site: the page gets no routes, no sitemap entry and no reachability requirement, but the file stays in place. Draft pages are not routed in development either. Flip the flag to `false` (or remove it) to publish. For a page that should be reachable but invisible to search engines, use `noindex: true` instead; the difference is tabulated in [hide or redirect pages](exclude-or-redirect-pages.md).
