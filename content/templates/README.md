# Content templates

Copy these starting files to create pages, news articles, or author profiles. Files in this folder are never routed or published.

## Create a page or article

1. Copy the appropriate template:
   - Page: `page-template.mdx` to `content/<folder>/<english-slug>.mdx`.
   - News: `news-template.mdx` to `content/news/YYYY-MM-DD-<english-slug>.mdx`.
   - Author: `author-template.mdx` to `content/authors/<author-id>.mdx`.
2. For page and news templates, delete the explanatory paragraph between the frontmatter and the first language marker. All body content must follow a language marker.
3. Fill in the required frontmatter. Pages and articles require `title` and `description`; news also requires `date` and a category from `config.json`. Use `title_<locale>` and `description_<locale>` for translated metadata.
4. Replace the placeholder text below each `<!-- locale: xx -->` marker. Remove sections you cannot translate yet. A missing section has no page route in that language; it does not automatically create a translated page.
5. Restart `yarn dev` after adding a file or changing language sections. Check the result and run `yarn build`.
6. Link a new standard page from another page or from `config.json`. It is not added to the menu automatically. Published news appears in the News listing automatically.

## Naming and structure

- Use English page slugs, with lowercase letters, numbers, and hyphens. Proper names and author IDs retain their names.
- The filename determines the slug: `contact.mdx` produces `/contact/` and, when a German section exists, `/de/contact/`.
- News filenames start with the publication date, matching frontmatter: `2026-08-28-cooperative-founding.mdx` produces `/news/2026-08-28-cooperative-founding/`.
- Folders organise files; they do not affect URLs. Page slugs must be unique across the content tree. `news` and `authors` are reserved.
- Supported language codes are `en`, `de`, `fr`, `it`, and `rm`. Keep each marker on its own line and use each language at most once. At least one section is required. Section order is flexible.
- Drafts (`draft: true`) have no routes, including in the development preview.

See the [page guide](../../docs/how-to/add-or-edit-a-page.md), [news guide](../../docs/how-to/news-and-authors.md), and [frontmatter reference](../../docs/reference/frontmatter.md).
