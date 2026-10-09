# Translate a page

This guide explains how to add a missing language to an existing page. Every page on this site carries all of its languages inside one MDX file, one section per language, so translating means adding or completing a section in that file. Nothing else changes.

If you are unsure how the fallback behaviour and the language switching work in principle, read [the localisation model](../explanation/localisation-model.md) after this guide.

## Find out what is missing

Run the production build:

```bash
yarn build
```

When any page lacks a language section, the build writes `build/client/untranslated-sections-report.txt`, one line per incomplete page, listing the missing locales with English first:

```text
# Untranslated sections report
# Locales a page does NOT carry (fallback chain § 7.2 applies in the
# requested locale). EN-first ordering; complete pages are omitted.

- content/news/2026-08-28-cooperative-founding.mdx: missing fr, it, rm
```

The report is written only when gaps exist, so a build without it means every page is complete. You can also see gaps directly in the files: open a page under `content/` and compare the `<!-- locale: xx -->` markers against the five languages.

## Add the missing section

1. Open the page's MDX file.
2. Add a marker line for the missing language, for example `<!-- locale: fr -->`, on its own line. Marker position within the file does not matter, but keeping the canonical order (`en`, `de`, `fr`, `it`, `rm`) makes files easier to compare.
3. Under the marker, translate the content. Keep the same structure as the reference section (usually the English or German one): same headings, same paragraphs, and the same MDX components such as `<Callout>` or `<CTA>`, with their visible text translated.
4. Save the file.

For news articles, also translate the `description` if you are creating a new article; for existing articles the frontmatter is locale-neutral and shared by all languages, so a translation usually touches only the section body. Author bios under `content/authors/` follow the same section format as any other page.

## What visitors see in the meantime

A page section that does not exist yet does not produce a broken page. When a visitor requests the page in a language it lacks, the site shows the English version, falling back further to German and then to whatever section exists. Three things accompany fallback content:

- A short notice in the visitor's language: "This page is not yet available in French. Showing the English version." (wording from the site's chrome strings).
- The page is marked `noindex` and canonicalised to the source-language URL, so search engines are never shown duplicate or misleading versions.
- The page is excluded from the sitemap and hreflang sets in that language.

This is why partial translations are safe to merge: each language lights up as soon as its section exists.

## Rules to keep in mind

- English should be present on every page. It is the root locale and the first fallback for every other language.
- One marker per language, markers on their own lines. A duplicated or misspelled marker is a build error naming the file and line.
- Translate component text as content. An `<Accordion>` exists only in the sections you write it in.
- Do not change frontmatter when translating an existing page; `title` and `description` apply to all languages by design.

## Verify

Run `yarn build` again: the untranslated report should list one page fewer, or disappear entirely. On `yarn dev`, open the page and click through the language pills (`de`, `fr`, `it`, `rm`, `en`) to confirm your section renders under each language's chrome. The build gate chain behind this is documented in [the build gates reference](../reference/build-gates.md).