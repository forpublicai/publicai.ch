# AGENTS.md

> **Purpose:** Guide AI agents on how to contribute to this repository by adding, modifying, and maintaining pages while respecting the project's architecture, documentation structure, and workflows.

## Quick Start: Page Contribution Workflow

When you need to add or edit a page:

1. **Read the docs first:** `README.md` (setup, layout, commands) and `CONTRIBUTING.md` (content vs. code rules, PR expectations).
2. **Find the recipe:** `docs/how-to/add-or-edit-a-page.md` for step-by-step page work.
3. **Check the rules:** `docs/reference/` for config schema, frontmatter, URL scheme, and component usage before making changes.
4. **Validate before finishing:** run the gate chain (below). Every gate failure names the file or config path.

## Documentation Structure

Human-facing documentation lives in `docs/` and follows the Diataxis quadrants:

| Quadrant | Purpose | Key files |
|-----------|---------|-----------|
| How-to | Practical recipes | `docs/how-to/add-or-edit-a-page.md`, `docs/how-to/translate-a-page.md`, `docs/how-to/menus-and-footer.md`, `docs/how-to/news-and-authors.md`, `docs/how-to/exclude-or-redirect-pages.md` |
| Reference | Technical specs & schemas | `docs/reference/config-json.md`, `docs/reference/frontmatter.md`, `docs/reference/url-scheme.md`, `docs/reference/components.md`, `docs/reference/build-gates.md` |
| Explanation | Architecture rationale | `docs/explanation/why-mdx.md`, `docs/explanation/localisation-model.md`, `docs/explanation/config-only-maintenance.md` |
| Tutorials | Learn by doing | `docs/tutorials/first-page-in-15-minutes.md` |
| Deploy | Deployment guidance | `docs/deploy/server-admin-guide.md` |
| Review | Quality gates & sign-offs | `docs/review/chrome-strings-review.md` |

Each quadrant folder has its own `README.md` index.

## Page Contribution Guidelines

### Adding a new page

1. Copy `content/templates/page-template.mdx` to `content/<theme>/<english-slug>.mdx` (theme folders: `cooperative/`, `dialogue/`, `legal/`, `network/`, `news/` — folders never affect URLs).
2. Fill in frontmatter (`title`, `description`, optional `title_<locale>`/`description_<locale>`, `draft`, `noindex`).
3. Write one `<!-- locale: xx -->` section per language (`en`, `de`, `fr`, `it`, `rm`); all body content must sit under a marker.
4. Link the page from `config.json` (menu/footer) or another page — the build's reachability gate fails on unlinked published pages unless the slug is in `pages.excluded`.
5. Restart `yarn dev` after adding/removing files or locale sections, then run the gate chain.

### Modifying an existing page

Edit the file (find it by slug under `content/`), keep one marker per language, and validate with the gate chain. Content edits hot-reload in `yarn dev`.

## Security & Boundaries

### Do NOT:

- Modify files in `build/` (generated output; the deploy artifact is produced by CI).
- Commit API keys or credentials.
- Run git write operations (commit, push, branch, PR) unless explicitly asked — the user controls version control.
- Log conversations or read credentials.

### Do:

- Follow the recipes in `docs/how-to/` and the references in `docs/reference/`.
- Keep all user-visible text localised (MDX sections, `config.json` labels, or `src/lib/chrome-strings.ts` — never hardcoded literals).
- Prefer the semantic CSS classes in `src/styles/global.css` over ad-hoc Tailwind utilities.

## Quick Reference Commands

```bash
corepack enable && yarn install --immutable   # install (Yarn 4 PnP)
yarn dev                                      # dev server, usually http://localhost:5173/
yarn lint && yarn typecheck && yarn test      # gates 1–3
yarn build                                    # gate 4: SSG + post-build gates → build/client/
yarn preview                                  # serve build/client/ on http://localhost:4173/
yarn test:e2e                                 # gate 5: Playwright smoke + axe-core a11y
```

## AI Declaration

This AGENTS.md was written with Apertus 1.5 70B, based on the codebase and internal documentation generated with Mistral Large 4, and checked and edited by Joshua Vargas (Public AI Switzerland).

This site was architected by the Public AI Switzerland team, and implemented with the assistance of AI coding agents. The following open-weight models were used by the technical maintainers: Apertus 1.5 70B, DeepSeek V4.1 Flash, GLM 5.3 Flash, Mistral Medium 3.5, Mistral Large 4. These models were running on a mix of EU and Switzerland-based inference providers with Zero Data Retention (ZDR) policies using the Opencode harness.
