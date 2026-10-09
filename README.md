# Public AI Switzerland website

The new multilingual website for Public AI Switzerland,
built with React Router, React, TypeScript, Vite, and MDX.

Designed for easy maintenance and content updates, so that members of the Public AI Switzerland community can collectively contribute to the upkeep of the cooperative's online presence.

## Quickstart

### Requirements

- Node.js 20 or newer.
- Git, if you are cloning the repository.
- Corepack, which provides the Yarn version pinned in `package.json`.
  Some Node distributions require installing Corepack separately.
- A terminal and a text editor for updating content.

### Install

Clone the repository and open its folder. If you already have a local copy,
open a terminal in that folder instead.

```bash
git clone https://github.com/forpublicai/publicai.ch.git
cd publicai.ch
```

Enable Yarn through Corepack and install the project dependencies:

```bash
corepack enable
yarn install --immutable
```

### Start the development server

```bash
yarn dev
```

Open the URL printed in the terminal, usually `http://localhost:5173/`.
Keep the server running while you edit; press Ctrl+C to stop it.

**Restart the dev server after adding, deleting,
or changing the language sections of a page.** Existing content edits refresh
live, but the separately cached route configuration currently needs a restart
for new routes. Production builds always rediscover the full content tree.

## Edit content

For illustrated instructions on updating pages, publishing news, and editing
menus in `config.json`, read the
[Quick Guide for Content Contributors (PDF)](docs/pdf/quick-guide-for-content-contributors.pdf).

- Pages live in `content/`. One MDX file contains all language sections.
  Filenames and URL slugs use English; proper names and author IDs are retained.
  Content folders are `cooperative/`, `dialogue/`, `legal/`, `network/`, and `news/`.
- News lives in `content/news/YYYY-MM-DD-<slug>.mdx`. Set `date` and a configured
  `category`; both News and Home sort by the frontmatter date, newest first.
  Home shows the latest three published articles. Drafts are excluded.
- English URLs have no language prefix; German, French, Italian, and Romansh
  use `/de/`, `/fr/`, `/it/`, and `/rm/`.
- Menus, footer links, news categories, redirects, and release switches are
  configured in `config.json`.
- Images and download files belong in `public/assets/`.

Start with [adding a page](docs/how-to/add-or-edit-a-page.md),
[news articles](docs/how-to/news-and-authors.md), or the
[MDX component reference](docs/reference/components.md).
The optional [authoring skill](tools/README.md) helps draft MDX and prepare
content pull requests when explicitly requested.

## Check and build

```bash
yarn lint
yarn typecheck
yarn test
yarn build
yarn preview
```

## Deploy

Upload **only `build/client/`**. A deployed site does not read MDX files at
runtime: content changes require a new build and deployment.

The GitHub workflow checks pull requests. Upstream `main` builds and deploys
that artifact using the existing FTP secrets. Forks and pull requests do not
run the deployment job. See the [hosting guide](docs/deploy/server-admin-guide.md)
for the first replacement deploy, legacy URLs, and rollback.

## Repository layout

| Path | Purpose |
| --- | --- |
| `app/` | Route configuration, page renderers, and application entry points |
| `src/` | Content pipeline, components, shared styles, and home sections |
| `content/` | Multilingual pages, news, preserved author records, and templates |
| `public/` | Public images, logos, and downloads |
| `tests/` | Unit tests and browser smoke/accessibility checks |
| `docs/` | Contributor and deployment documentation |
| `tools/` | Reusable MDX authoring skill |

Release placeholders and restoration steps are recorded in [AI_NOTES.md](AI_NOTES.md).
Contribution guidance is in [CONTRIBUTING.md](CONTRIBUTING.md).
The existing repository licence is retained in [LICENSE](LICENSE); the MIT
notice for the replacement implementation is retained in [LICENSE-MIT](LICENSE-MIT).
