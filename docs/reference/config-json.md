# config.json reference

`config.json` at the repository root is the single human-editable site configuration. It owns menus, footer, page exclusions, redirects, embed permissions, contact addresses, news categories and home toggles. The file is validated by a zod schema (`src/lib/config.ts`) on every dev and build run; validation errors name the offending path, for example `menus.main[2].label.de`, and are phrased to be fixable without reading code.

The repository's own `config.json` is the live example of everything in this reference.

## Building blocks

| Building block  | Rule                                                                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LocalizedString` | An object with exactly the five locale keys `en`, `de`, `fr`, `it`, `rm`. All keys required, all values non-empty strings. A missing key fails with the config path. Chrome labels never fall back; they must be complete. |
| `MenuItem`      | A link model with a required `label` (LocalizedString) and **exactly one** of `page`, `url` or `children`. Two or more of the three fail the build, as does an empty `children` array. |
| Email address   | Must match a basic address pattern; the build message is `Must be a valid email address`.                                                                                       |

### MenuItem semantics

| Target      | Value                            | Behaviour                                                                                                                                       |
| ----------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`      | A page slug (or the reserved slug `news`) | Resolved against the content tree at build and dev time. Unknown slugs fail the build naming the config path. Links carry the visitor's locale automatically. Theme folders never appear in slugs. |
| `url`       | Any absolute URL, including `mailto:` | `http(s)` links open in a new tab with `rel="noopener noreferrer"`; `mailto:` links open the mail client.                                       |
| `children`  | An array of MenuItems            | Renders as an accessible dropdown in the header and an indented sub-list in the footer. Must be non-empty; children should carry `page` or `url` targets. |

## Top-level shape

```jsonc
{
  "site":    { "name": LocalizedString, "canonicalBase": "https://publicai.ch",
               "defaultLocale": "en", "locales": ["en", "de", "fr", "it", "rm"] },
  "menus":   { "main": MenuItem[], "utility": MenuItem[], "cta": MenuItem? },
  "footer":  { "tagline": LocalizedString?, "columns": [{ "title": LocalizedString, "items": MenuItem[] }],
               "copyright": LocalizedString },
  "pages":   { "excluded": string[], "redirects": [{ "from": string, "to": string }] },
  "home":    { "sections": { "apertusPrompt": boolean } },
  "embeds":  { "allowlist": string[] },
  "contact": { "email": email },
  "news":    { "categories": string[], "authorsEnabled": boolean }
}
```

## Sections in detail

### `site`

| Key             | Type             | Notes                                                                                                                          |
| --------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | LocalizedString  | The site name per language, shown in the header.                                                                                |
| `canonicalBase` | URL string       | Origin used for canonical URLs, sitemap entries, hreflang and redirect stubs.                                                    |
| `defaultLocale` | `"en"` (literal) | The only accepted value; English is the root locale and the URL scheme is built on it. Any other value fails the build.         |
| `locales`       | string array     | The active locales, values limited to `en`, `de`, `fr`, `it`, `rm`. Keep all five. The switcher's display order (`de, fr, it, rm, en`) is built into the app, not config-driven. |

### `menus`

| Key       | Type             | Notes                                                                                     |
| --------- | ---------------- | ------------------------------------------------------------------------------------------- |
| `main`    | MenuItem array   | The main header menu.                                                                        |
| `utility` | MenuItem array   | The smaller utility row above the main menu.                                                 |
| `cta`     | MenuItem, optional | The single red pill button on the header's right; typically a `page` target.              |

### `footer`

| Key          | Type                       | Notes                                                                       |
| ------------ | -------------------------- | ----------------------------------------------------------------------------- |
| `tagline`    | LocalizedString, optional  | One-line strapline above the columns.                                         |
| `columns`    | Array                      | Each column: `title` (LocalizedString) and `items` (MenuItem array).          |
| `copyright`  | LocalizedString            | Bottom line of the footer.                                                    |

### `pages`

| Key         | Type                | Notes                                                                                                                                                    |
| ----------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `excluded`  | Array of slugs      | Pages hidden from the sitemap and exempt from the reachability crawl. They keep their routes. Seed example: `["sandbox"]`. See [hide or redirect pages](../how-to/exclude-or-redirect-pages.md). |
| `redirects` | Array of `from`/`to` | Old URL to new route; each emits a meta-refresh HTML stub (noindex, canonical to the target) at the old address. Seed example: `/gruendung/` to `/news/2026-08-28-cooperative-founding/`. |

### `home`

| Key                            | Type             | Notes                                                                                                        |
| ------------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| `sections.apertusPrompt`       | boolean, default `false` | Reserved toggle for the optional Apertus prompt box on the home page (a planned milestone). Currently has no effect. |

### `embeds`

| Key         | Type            | Notes                                                                                              |
| ----------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| `allowlist` | Array of hosts   | The only hosts the `Embed` component may embed (seeded: `www.youtube-nocookie.com`, `player.vimeo.com`, `www.openstreetmap.org`). An unlisted host fails the build naming the URL. |

### `contact`

| Key     | Type   | Notes                                                        |
| ------- | ------ | -------------------------------------------------------------- |
| `email` | email  | The address used by all mailto calls to action site-wide.      |

### `news`

`authorsEnabled` defaults to `true`. Setting it to `false` hides author bylines,
article-end bios, profile/directory routes, sitemap entries, and compiled author
bio modules. Author records and article attribution remain for later restoration.
Remove navigation links to authors while disabled; restart/rebuild after changing
this release switch.

| Key          | Type            | Notes                                                                                                                                            |
| ------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `categories` | Array of strings | The allowed article categories. An article with a category outside this list fails the build. Listing pages are generated only for categories in use. |

## Validation error catalogue

All errors are thrown as one readable block, prefixed with `config.json is invalid. Fix the following and try again:`, followed by one bullet per issue with the dotted config path. The messages you may encounter:

| Message                                                | Trigger                                                     |
| ------------------------------------------------------- | ------------------------------------------------------------- |
| `Missing locale key(s); every locale in site.locales is required` | A label object lacks one of the five language keys  |
| `MenuItem must have exactly one of: page, url, children` | Zero or multiple target keys set on one item                  |
| `children must be a non-empty array`                    | A dropdown item with an empty `children` array                 |
| `Must be a valid email address`                         | `contact.email` malformed        |
| `config.json references pages that do not exist (add the MDX file or fix the slug):` with `unknown page slug "..."` per path | A `page` slug no MDX file provides (checked against menus including nested children and footer columns) |

Content-side validation (frontmatter, locale markers, slug rules) is covered in [the frontmatter reference](frontmatter.md); the gates that run the checks are in [the build gates reference](build-gates.md).