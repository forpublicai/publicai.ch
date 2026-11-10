# Public AI Switzerland website

This repository contains the source code for the website of Public AI Switzerland. This site is built with React and Vite, with TypeScript as the main programming language and MDX as the markup language for pages.

The site was designed for easy maintenance and content updates. Pages are defined through MDX files, which are human-editable and human-addable. Contributing a new page only requires adding a new .mdx file, while changing menu items requires only changing a config.json. Each mdx file is also self contained, with all language versions for a post in a single file instead of relying on the i18n JS.

This way, members of the Public AI Switzerland community can collectively contribute to the upkeep of the cooperative's online presence, without spinning up an AI agent (and potentially increasing codebase complexity). In addition, the separation of app logic and content makes it possible to move the website content to another design also based on MDX files.


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
- The LaTeX source for the printable handbook lives in `docs/user-guide/`
  (build with `tectonic docs/user-guide/main.tex`); the rendered PDF guide is
  in `docs/pdf/`.

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
yarn test:e2e    # browser smoke + accessibility checks (Playwright)
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

Contribution guidance is in [CONTRIBUTING.md](CONTRIBUTING.md).
The repository is licensed under the [Apache License 2.0](LICENSE).

## AI Declaration

This site was architected by the Public AI Switzerland team, and implemented with the assistance of AI coding agents. The following open-weight models were used by the technical maintainers: Apertus 1.5 70B, DeepSeek V4.1 Flash, GLM 5.3 Flash, Mistral Medium 3.5, Mistral Large 4. These models were running on a mix of EU and Switzerland-based inference providers with Zero Data Retention (ZDR) policies using the Opencode harness.