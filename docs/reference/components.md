# MDX component reference

The components below are callable from MDX as JSX tags. They need no import: the build prepends the component registry (`src/components/mdx/index.ts`) to every page file at compile time, so the tags below work inside any `<!-- locale: xx -->` section. All components are styled by the global stylesheet and built to WCAG 2.1 AA (keyboard operable, labelled, reduced-motion aware).

Components are developer-maintained: their prop names must not change, because content files depend on them. Adding a new component is a code change, not a content change.

## Markdown notation

All locale sections support GitHub Flavored Markdown through `remark-gfm`:
pipe tables, double-tilde strikethrough, task lists, footnotes, and bare URL/email
links, alongside ordinary headings, lists, quotes, links, images, and code.
Existing JSX components and locale markers keep their syntax.

### Tables

Leave a blank line before and after a table. Include a header and delimiter row:

```md
| Chapter | Summary | Amount |
| :--- | :---: | ---: |
| I | **Purpose** | CHF 100 |
| II | A literal pipe: \| | — |
```

Colons align a column left, center, or right. Cells can contain inline Markdown,
including links and code; keep each row on one source line. Tables get a subtle
header surface, alternating rows, generous cell spacing, and a rounded border.
Wide tables scroll inside a keyboard-focusable region rather than widening the
page. Native table/header semantics are retained; the region label is localized.

### Other extensions

```md
~~Removed wording~~

- [x] Completed item
- [ ] Pending item

A statement with a note[^source].

[^source]: Supporting detail or a source link.

https://publicai.ch
```

Task checkboxes display content status and are disabled; they are not forms.
Footnote headings and return-link labels follow the section's locale. A single
`~` remains literal; strikethrough requires `~~`.

## Accordion

Frequently-asked-questions accordion. Items can be opened independently of each other; questions toggle with a rotating chevron.

| Prop    | Type                                | Required | Notes                                    |
| ------- | ----------------------------------- | -------- | ------------------------------------------ |
| `items` | Array of `{ question, answer }`     | yes      | Both fields are plain strings              |

```mdx
<Accordion
  items={[
    { question: "Was ist eine Genossenschaft?", answer: "Ein Verband von Mitgliedern ..." },
    { question: "Wer kann beitreten?", answer: "Alle natürlichen Personen ..." },
  ]}
/>
```

## Callout

Highlighted note block.

| Prop      | Type                                      | Required          | Notes                                              |
| --------- | ----------------------------------------- | ------------------- | ---------------------------------------------------- |
| `variant` | `"info"`, `"warning"`, `"highlight"` or `"legal"`    | no (default `info`) | `warning` renders in an amber tone, `highlight` in the brand tint, `legal` with a § marker and horizontal rules |
| children  | MDX content                               | yes                 | Any text or inline Markdown                          |

```mdx
<Callout variant="warning">Die Statistiken sind noch unverifiziert.</Callout>
```

The `legal` variant uses a decorative section sign hidden from screen readers.
The notice text should express its full meaning without relying on the symbol.

```mdx
<Callout variant="legal">Only the German version is legally binding.</Callout>
```

## CTA

Primary action row: a title, an optional description and an arrow, rendered as a large link.

| Prop         | Type                              | Required                       | Notes                                                                                       |
| ------------ | --------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| `title`      | string                            | yes                              | The action's label                                                                            |
| `to`         | internal page slug                | one of `to`/`href`               | Locale-prefixed automatically: `to="mission"` inside a `de` section links to `/de/mission/`   |
| `href`       | absolute URL or `mailto:`         | one of `to`/`href`               | Passed through untouched; `http(s)` opens in a new tab with `rel="noopener noreferrer"`       |
| `description`| string                            | no                               | Secondary line under the title                                                                |
| `variant`    | `"primary"` or `"outline"`        | no (default `primary`)           | Solid versus hairline-outline styling                                                         |

```mdx
<CTA title="Mission" to="mission" description="Read our mission" />
<CTA title="Anteil zeichnen" href="mailto:info@example.org?subject=Anteil zeichnen" />
```

## Divider

A section divider rule. Takes no props.

```mdx
<Divider />
```

## Embed

The single embed component: a sandboxed, lazy-loaded iframe.

| Prop     | Type    | Required          | Notes                                                        |
| -------- | ------- | ------------------- | -------------------------------------------------------------- |
| `url`    | string  | yes                 | The embed URL; its host must be in `config.json` `embeds.allowlist` or the build fails naming the URL |
| `title`  | string  | yes                 | Accessible name of the iframe                                  |
| `height` | number  | no (default `400`)  | Pixel height of the iframe                                     |

The iframe is sandboxed, loads lazily and sends no referrer. Allowlisted hosts in the seed config: `www.youtube-nocookie.com`, `player.vimeo.com`, `www.openstreetmap.org`.

```mdx
<Embed url="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Erklärvideo" />
```

## Figure

Image with figure semantics: a `<figure>` element, an optional caption, lazy loading and a required alt text.

| Prop      | Type   | Required | Notes                                                   |
| --------- | ------ | -------- | --------------------------------------------------------- |
| `src`     | string | yes      | Site-absolute path, for example `/assets/images/hero.jpg` |
| `alt`     | string | yes      | Alternative text; the build verifies the image exists     |
| `caption` | string | no       | Rendered as `<figcaption>`                                |

```mdx
<Figure src="/assets/images/swiss-map.png" alt="Karte der Schweiz" caption="Der Dialog in allen Kantonen" />
```

## LinkRow

A horizontal row of compact action links. Items use CTA-style props (without `variant`; rows render in the outline style).

| Prop    | Type                                                        | Required | Notes                             |
| ------- | ------------------------------------------------------------ | -------- | ----------------------------------- |
| `links` | Array of `{ title, to?, href?, description? }`              | yes      | Same `to`/`href` semantics as CTA  |

```mdx
<LinkRow
  links={[
    { title: "Apertus", href: "https://publicai.co" },
    { title: "Mission", to: "mission" },
  ]}
/>
```

## StatGrid

Number tiles for key figures, rendered as a description list.

| Prop    | Type                                      | Required | Notes                    |
| ------- | ------------------------------------------- | -------- | -------------------------- |
| `items` | Array of `{ value, label }`                 | yes      | Both fields plain strings |

```mdx
<StatGrid
  items={[
    { value: "45%", label: "Fonds" },
    { value: "30%", label: "Kern" },
  ]}
/>
```

## Internal links inside MDX

Markdown links beginning with `/` are site-internal slugs and receive the current section's language prefix automatically: `[unsere Mission](/mission)` inside a `de` section renders `/de/mission/`. Writing the prefix explicitly (`/de/mission/`) is also valid. Links with `http(s)`, `mailto:` or `#` schemes are left untouched. An internal target that does not resolve to a page fails the build naming the file; the same gate also checks `CTA to=` and `LinkRow` targets.

## See also

- [Add or edit a page](../how-to/add-or-edit-a-page.md) places components in the editing workflow.
- [The frontmatter reference](frontmatter.md) covers everything above the body.
- The live demonstration of every component is the sandbox page at `content/cooperative/sandbox.mdx` (excluded from the sitemap by design).

## Lead

Page-intro paragraph (larger, grey). Use once at the top of a section.

```mdx
<Lead>The opening sentence of the page.</Lead>
```

## Box

Custom-styling container (the escape hatch for content plain markdown cannot
express). Variants: `card` (default), `info`, `warning`, `highlight`,
`quote`. Optional `title` renders a small block heading inside.

```mdx
<Box variant="quote" title="From our statutes · Art. 2.1">

> The quoted text.

</Box>
```

## TeamGrid

Portrait cards for people. `members` is a list of `{ name, image?, role? }`;
images are site-absolute paths.

```mdx
<TeamGrid members={[
  { name: "Dr. Joshua Tan", image: "/assets/team/joshua.jpg", role: "Board president" },
  { name: "Oleg Lavrovsky", image: "/assets/team/oleg.jpg" },
]} />
```
