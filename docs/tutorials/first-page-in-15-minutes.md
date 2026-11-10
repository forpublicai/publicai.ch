# Your first page in 15 minutes

This tutorial takes you from an empty terminal to a finished, five-language page on the Public AI Switzerland website. You will clone the repository, start the development server, create a new page from the provided template, and check the result in the browser and in the production build. Along the way you will meet the three ideas the whole site rests on: every page is an MDX file, one file holds all languages of that page, and the build wires everything up automatically.

No knowledge of the codebase is needed for this tutorial. You only write text files.

## What you need

- Node.js 20 or newer. Check with `node --version`.
- git, to clone the repository.
- A terminal. You do not install Yarn by hand: the repository pins its exact version, and Corepack provides it; install Corepack separately if your Node distribution does not include it.

## 1. Clone the repository and install

```bash
git clone https://github.com/forpublicai/publicai.ch.git
cd publicai.ch
corepack enable
yarn install
```

`corepack enable` sets up the Yarn command once per machine. If your terminal reports a permissions error, run the command again with administrator rights (`sudo corepack enable` on macOS and Linux). `yarn install` then fetches the dependencies into Yarn's Plug'n'Play cache. This project has no `node_modules` folder, and you should never run `npm install`; Yarn creates its local `.yarn/` cache and Plug'n'Play files during installation.

## 2. Start the development server

```bash
yarn dev
```

The terminal prints a local address, typically `http://localhost:5173/`. Open it in a browser. You should see the home page with its white header and red logo, the hero section, and the full-bleed red footer. The header carries the language pills (`de`, `fr`, `it`, `rm`, `en`); clicking one keeps you on the same page in that language.

Leave the dev server running for edits. Restart it after adding a new file to register its route.

## 3. Create the page file

Every page on the site is a single MDX file under `content/`. The folder is only for tidiness, and the file name becomes the page's URL slug. Copy the provided template into a new theme folder:

macOS and Linux:

```bash
mkdir -p content/demos
cp content/templates/page-template.mdx content/demos/my-page.mdx
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force content\demos
Copy-Item content\templates\page-template.mdx content\demos\my-page.mdx
```

The `content/templates/` folder itself is never routed or published; it only holds blank shapes for new pages. See its [README](../../content/templates/README.md) for the copy-paste rules in short form.

Remove the instruction paragraph between the copied template's frontmatter and its first locale marker. Both page and news templates currently contain pre-marker instructions that are not valid page body content.

## 4. Fill in the five language sections

Open `content/demos/my-page.mdx`. The file has two parts: a small frontmatter block (title and description, used for the page heading, search engines and link previews) and five language sections, each introduced by a marker line. Replace the placeholder text so the file looks like this:

```mdx
---
title: My first page
description: A short summary of the page for search results and link previews (50 to 160 characters).
---

<!-- locale: en -->

Hello from my first page on publicai.ch.

<!-- locale: de -->

Hallo von meiner ersten Seite auf publicai.ch.

<!-- locale: fr -->

Bonjour depuis ma première page sur publicai.ch.

<!-- locale: it -->

Ciao dalla mia prima pagina su publicai.ch.

<!-- locale: rm -->

Bun ventürig da mia prüma pagina sin publicai.ch.
```

Three rules matter here. Each language gets exactly one marker, each marker sits on its own line, and the file needs at least one section. If you leave a language out, that language has no page route; opening its address or switching to it may show a 404. News listings can use fallback metadata, but do not create missing article translations. The exact behaviour is explained in [the localisation model](../explanation/localisation-model.md).

Save the file and restart `yarn dev` to register its route.

## 5. Look at your page

Open these addresses in the browser:

- `http://localhost:5173/my-page/` (English)
- `http://localhost:5173/de/my-page/` (German), and `/fr/`, `/it/`, `/rm/` likewise

What the visitor sees is the standard site chrome wrapped around your text: the per-language logo, menu and language pills in the header, your content with the frontmatter title as the page heading, and the footer with its link columns. The language switcher round-trips between the five addresses of the same page, so you can check each of your five sections by clicking through.

The file name decides the URL: `my-page.mdx` gives `/my-page/` in English and `/de/my-page/` in German. Slugs must be lowercase letters, digits and hyphens, and they must be unique across the whole content tree. The slug `news` is reserved for the generated news index.

## 6. Build the site

```bash
yarn build
```

This runs the production build. Every page, yours included, is rendered to static HTML in `build/client/`, and the post-build checks run: `sitemap.xml` and `robots.txt` are regenerated, every internal link is verified, a reachability crawl confirms that every published page can be reached from the home pages, and the hygiene guard makes sure no internal project documentation leaked into the output. If a check fails, the build names the offending file or config path, which is almost always enough to fix the problem.

To browse the finished build instead of the dev server:

```bash
yarn preview
```

This serves `build/client/` on `http://localhost:4173/`, the same shape of output a static host will deploy.

## If something goes wrong

The build refuses to publish broken content and tells you why. The messages below are the ones beginners hit most often.

| Error (shortened)                      | Cause                                              | Fix                                                                 |
| -------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| `unknown locale "xx" on line N`        | A marker line is misspelled                        | Use only `en`, `de`, `fr`, `it`, `rm` in `<!-- locale: xx -->`      |
| `content before the first "locale:" marker` | Text sits above the first marker              | Keep only blank lines above the first marker (the news template ships with an instruction paragraph that must be deleted) |
| `duplicate locale marker for "en"`     | Two markers for the same language                  | One marker per language                                             |
| `duplicate slug "my-page"`             | Another folder has a file with the same name       | Rename your file; slugs are unique repo-wide                        |
| `invalid frontmatter`                  | `title` or `description` missing                   | Fill both fields                                                    |

## Where to go next

You have produced a page the same way every page on this site is produced. From here:

- [Add or edit a page](../how-to/add-or-edit-a-page.md), the everyday recipe including drafts, images and linking.
- [Edit the menus and the footer](../how-to/menus-and-footer.md) to put your page into the navigation.
- [Publish news and author pages](../how-to/news-and-authors.md) for articles with categories and bylines.
- [Translate a page](../how-to/translate-a-page.md) to fill in missing languages on existing pages.
- The [frontmatter reference](../reference/frontmatter.md) and [URL scheme reference](../reference/url-scheme.md) hold the exact rules you skimmed past.
- [Why MDX?](../explanation/why-mdx.md) explains why one file holds all languages and why folders carry no routing meaning.