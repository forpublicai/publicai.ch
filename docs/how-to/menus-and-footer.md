# Edit the menus and the footer

This guide explains how to change the header navigation, the header call-to-action button and the footer, all of which live in one file: `config.json` at the repository root. Menus and footer are configuration, not content, because they are site structure rather than page text. The file is validated at build and dev time; every validation error names the exact config path so non-developers can fix it.

For the complete schema see [the config.json reference](../reference/config-json.md). This guide walks the parts you will actually edit.

## The pieces you can edit

| Config path          | What it renders                                                        |
| -------------------- | ---------------------------------------------------------------------- |
| `menus.main`         | The main menu in the header row with the logo                          |
| `menus.utility`      | The smaller utility row above the main menu                            |
| `menus.cta`          | The single red pill button on the right of the header (optional)       |
| `footer.tagline`     | The one-line strapline above the footer columns (optional)             |
| `footer.columns`     | The footer link columns, each with a title and a list of items         |
| `footer.copyright`   | The copyright line at the bottom of the footer                         |

Every label in all of these is a five-language object, for example the main menu's Mission entry:

```json
{
  "label": {
    "de": "Mission",
    "en": "Mission",
    "fr": "Mission",
    "it": "Missione",
    "rm": "Missiun"
  },
  "page": "mission"
}
```

All five keys (`en`, `de`, `fr`, `it`, `rm`) are required in every label. A missing key fails the build with the path named:

```text
- menus.main[2].label.de: Missing locale key(s); every locale in site.locales is required
```

## The three kinds of menu items

Every menu item is one of exactly three things, set by the `page`, `url` or `children` key. Setting two of them on the same item is a build error.

### 1. Link to a page by slug

```json
{ "label": { "...five languages..." }, "page": "mission" }
```

The slug is resolved against the content tree at build and dev time. A page added as `content/press/press.mdx` becomes linkable as `"page": "press"` with no other edits, and the link automatically carries the visitor's language (`/de/press/` in the German chrome). An unknown slug fails the build:

```text
config.json references pages that do not exist (add the MDX file or fix the slug):
- menus.main[4].page: unknown page slug "kontat"
```

The reserved slug `news` links to the generated news index. Theme folders never appear in slugs.

### 2. Link to an external address

```json
{ "label": { "...five languages..." }, "url": "https://community.publicai.ch" }
```

Any absolute URL works, including `mailto:` addresses. Web addresses open in a new tab with `rel="noopener noreferrer"`; `mailto:` links open the visitor's mail program.

### 3. A dropdown menu

```json
{
  "label": { "de": "Mehr", "en": "More", "fr": "Plus", "it": "Più", "rm": "Pli" },
  "children": [
    { "label": { "...five languages..." }, "page": "apertus" },
    { "label": { "...five languages..." }, "page": "team" }
  ]
}
```

A `children` item renders as an accessible dropdown in the header (keyboard and screen-reader friendly: `aria-haspopup`, `aria-expanded`, Escape closes and refocuses). The current `config.json` has no dropdown; the example above shows the supported structure. Rules:

- The `children` array must not be empty.
- Children are themselves menu items; give them `page` or `url` targets. The header dropdown renders one level of entries, so keep it flat.
- In the footer, a `children` item renders as an indented sub-list under its label.
- Dropdown entries are crawled by the build's reachability check, so pages only reachable through a dropdown still count as reachable.

## Adding a menu item, step by step

1. Note the slug of the target page (or the external URL).
2. Open `config.json` and find the menu you want to change (`menus.main`, `menus.utility`, `menus.cta` or a `footer.columns` entry).
3. Add or edit a menu item with a complete five-language label and exactly one of `page`, `url`, `children`.
4. Save. With `yarn dev` running the header or footer updates immediately; you do not restart anything for content-driven config changes.
5. Run `yarn build` before publishing: it verifies every menu reference resolves and every label is complete.

Reordering is the same operation: menu entries render in array order, so moving an object in the array moves the link on screen. Removing an item is just deleting its object; if that item was the only link to a page, remember the reachability crawl may then flag the page as unreachable.

## Newsletter

The current footer schema and renderer do not support `footer.newsletter`. The home-page newsletter section is implemented in `src/sections/home/newsletter.tsx`; changing that section requires a code edit.

## Where errors surface

All menu and footer validation happens when the config is loaded, that is on `yarn dev` and inside `yarn build`. Errors are phrased for non-developers and always name the config path, for instance `menus.utility[1].label.fr`. The error catalogue and the full schema are in [the config.json reference](../reference/config-json.md); the design reasoning behind config-only maintenance is in [its explanation](../explanation/config-only-maintenance.md).