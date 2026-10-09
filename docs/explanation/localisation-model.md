# The localisation model

This site exists in five languages: English, German, French, Italian and Romansh. Making that work touches three different layers of the system, each with its own mechanism, plus a set of rules about what happens when a language is missing. This page explains the whole model and the reasoning behind it.

## Three paths for three kinds of text

Every piece of user-visible text on the site reaches the visitor through exactly one of three mechanisms. Mixing them up is treated as a defect, which is why the division is worth memorising.

| Text kind                                                    | Lives in                          | Maintained by      | Completeness rule                     |
| ------------------------------------------------------------- | ---------------------------------- | -------------------- | --------------------------------------- |
| Page content (articles, legal text, bios)                      | MDX locale sections per page       | Content contributors  | At least one section; English expected; fallback applies |
| Maintainer labels (menus, footer, call-to-action button)       | `config.json` LocalizedStrings     | Content contributors  | All five languages required, no fallback |
| Site chrome (404 copy, fallback notice, aria-labels, newsletter pill) | `src/lib/chrome-strings.ts` | Developers            | All five languages required, enforced by the type system and a unit test |

The reasoning behind the split is a question of ownership. Page content changes constantly and is owned by contributors, so it lives in the files contributors own, one page per file. Menu and footer labels configure site structure, so they live next to the structure they configure, in `config.json`. Chrome strings are small, structural and easy to break silently, so they are typed records in TypeScript where a missing language is a compile error, not a production bug. The project explicitly rejected a general i18n framework for this: a lookup-table architecture would either pull page content out of its MDX files (contradicting the content model) or add a translation-key bureaucracy that a five-locale site does not need. The implementation lives in `src/lib/chrome-strings.ts`.

One consequence is worth stating plainly: chrome strings never fall back. If a chrome string lacked French, French visitors would see German buttons with no notice, which is worse than a missing page section. Contributor-facing labels in `config.json` are equally strict for the same reason. Only page content falls back, because translation gaps there are normal and expected during volunteer work.

## The fallback chain

When a visitor opens a page in a language whose section the file does not contain, the site resolves the text through a fixed chain: the requested language, then English, then German, then the first section the file has. The page still renders, with three adjustments:

- A short notice appears in the visitor's language, of the shape "This page is not yet available in French. Showing the English version."
- The page is marked `noindex` and its canonical URL points at the source-language version, so search engines never treat fallback output as the French page.
- The page is excluded from the sitemap and from hreflang sets in that language.

An alternative design was considered and rejected: redirecting the visitor to the source-language URL. Redirects were rejected because they break URL uniformity. The visitor's address would change language underneath them, the language switcher would land somewhere unexpected, and the address bar would contradict the site's promise that `/fr/mission/` is the French address of the Mission page. Rendering with a notice keeps every address meaningful and the switcher predictable.

For contributors this design has a pleasant property: a partially translated page is a working page. Each language lights up as its section is written, and the untranslated report (written at build time) turns what is still missing into a concrete list. The translation workflow is in [translate a page](../how-to/translate-a-page.md).

## Truthful addresses: no unrouted URLs

The fallback chain answers "what text does this page show", but a subtler question is "does this page exist in this language at all". The site's answer is strict: a route is generated only for the languages a page actually carries. A German-only news article has `/de/news/<slug>/` and no English route; opening the English address directly returns a harmless 404 rather than an English-labelled page of German text.

This is the hreflang truthfulness rule. Search engines are told, through hreflang alternates and the sitemap, only about addresses whose content is genuinely that language, with `x-default` pointing at the English URL. The alternative, manufacturing addresses for every language of every page and letting the fallback chain fill them, was rejected because it would systematically tell search engines "this is the Italian version" about pages that render English text. Machines are not lied to, even helpfully.

In practice a visitor rarely meets the edge: internal links always target a page's carried locales, menus resolve per language, and the news index and author directory exist in all five locales by design because listings can always render through the fallback chain.

## The language switcher

The switcher in the header offers the five languages as pills, ordered `de`, `fr`, `it`, `rm`, `en`: the four national languages first, English last, which is a deliberate framing choice rather than a technical one. Clicking a pill navigates to the same page in that language, so a visitor reading the German Mission page lands on the French Mission page, not on some home page. The visitor's language is carried by the URL (English at the root, others prefixed) and by nothing else: no cookies and no browser storage, which keeps the site's privacy posture absolute.

## Why the model looks like this, summarised

Three owned layers (MDX sections, config labels, typed chrome) keep every text next to the thing that owns it, with completeness enforced where incompleteness would be silent and invisible. One fallback chain keeps partial translations functional without pretending they are complete. Truthful routing keeps every address meaningful in exactly one language. The costs are a strictly complete config file and a typed chrome module, both policed by the build, which is described from the contributor's point of view in [config-only maintenance](config-only-maintenance.md) and from the content side in [why MDX](why-mdx.md).