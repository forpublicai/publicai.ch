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
<CTA title="Contact us" href="mailto:hello@publicai.ch?subject=Enquiry" />
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
| `ratio`  | string  | no                  | Aspect ratio (e.g. `"16/9"`) for a responsive frame instead of a fixed height; intended for videos |

The iframe is sandboxed, loads lazily, sends only the site origin as referrer (YouTube needs one to play), and allows fullscreen. Allowlisted hosts in the seed config: `www.youtube-nocookie.com`, `player.vimeo.com`, `www.openstreetmap.org`.

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

## FigureRow

Two to four images side by side, each with figure semantics, a required alt
text and an optional caption. Each image links to its full-size file (click
to enlarge, opens in a new tab). Equal columns from 40rem; stacked on small
screens. `figures` is a list of `{ src, alt, caption? }` with site-absolute
paths; the build verifies each image exists.

```mdx
<FigureRow figures={[
  { src: "/assets/images/news/app-start.jpg", alt: "Start page with a map of Switzerland", caption: "Pick a canton." },
  { src: "/assets/images/news/app-detail.jpg", alt: "Overview of one canton by topic", caption: "A week of notices." },
]} />
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

Portrait cards for people. `members` is a list of `{ name, image?, role?, linkedin? }`;
images are site-absolute paths; `linkedin` makes the name a link out.

```mdx
<TeamGrid members={[
  { name: "Dr. Anna Sotnikova", image: "/assets/team/anna-portrait.jpg", linkedin: "https://www.linkedin.com/in/anna-sotnikova-251bb719a/" },
  { name: "Oleg Lavrovsky", image: "/assets/team/oleg.jpg" },
]} />
```

## PosterGrid

Equal-size preview cards for printable posters with a PDF download link each.
`downloadLabel` is the link text; each poster is `{ language, image, pdf, alt }`
with site-absolute paths.

```mdx
<PosterGrid downloadLabel="PDF herunterladen" posters={[
  { language: "Deutsch", image: "/assets/ai-dialog/poster-de-preview.jpg", pdf: "/assets/ai-dialog/SNAD_German%20Version.pdf", alt: "Plakat zum nationalen KI-Dialog auf Deutsch" },
]} />
```

## Progress components

The `Progress*` components render the progress dashboard at `/progress` (`content/cooperative/progress.mdx`). They, their CSS and their data (`progress/data/progress.json`) come from the shared [forpublicai/progress](https://github.com/forpublicai/progress) repo, vendored as a git subtree at `progress/`; `src/components/mdx/progress.tsx` re-exports them. Don't edit files under `progress/` here: change them in that repo, then run `git subtree pull --prefix=progress https://github.com/forpublicai/progress main --squash`. All labels are props, so each locale section supplies its own wording.

| Component           | Props                                                                 | Renders                                                       |
| ------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------- |
| `ProgressFigure`    | `name`, `format?`                                                     | One number from `figures`, inline in a sentence               |
| `ProgressScorecard` | `columns`, `label`, `empty`, `pillar?`                                | The scorecard table, one row per metric; `pillar` keeps one pillar's rows |
| `ProgressTable`     | `table`, `columns`, `label`, `pillar?`                                | A precomputed table: `llm_windows`, `llm_family`, `llm_team`, `repos`, `countries`, `coverage` |
| `ProgressBars`      | `table`, `labelKey`, `valueKey`, `shareKey?`, `title`, `format?`      | Ranked horizontal bars from a table, e.g. `countries`         |
| `ProgressChart`     | `series`, `title`, `unit`, `format?`, `partialLabel`                  | Static monthly bar chart; the as-of month is drawn lighter    |
| `ProgressGrid`      | children                                                              | Responsive grid for charts                                    |
| `ProgressPillars`   | `d30Label`, `avgLabel`, `launchLabel`, `notConnected`, `coverageLabel`, `labels?` | The three pillars (products, movement, idea) with their topline stats |
| `ProgressTimeline`  | `label`                                                               | Dated milestones, newest first                                |

`columns` is a list of `{ key, label, format? }`. Formats: `int`, `big` (B/M), `kilo` (k/M), `dec`, `pct`, `usd`, `text`, `status` (pill).
