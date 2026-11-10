# Contributing

## Content changes

Use the [page guide](docs/how-to/add-or-edit-a-page.md) or
[news guide](docs/how-to/news-and-authors.md). Start from the templates in
`content/templates/`. Keep factual copy tied to supplied sources and preserve
approved release placeholders. Translate the title, description, and body for
each language you add; do not duplicate another language's text as a translation.

Routine content work requires MDX and, for navigation or categories,
`config.json`. Reuse the existing MDX components before introducing new styling.
Put supplied images in `public/assets/`, use meaningful alternative text, and
verify paths exist. News filenames start with their publication date.

## Code changes

Use the pinned Yarn version. Run lint, typecheck, unit tests, and a production
build before submitting. Browser smoke and accessibility checks are described
in the [build gates](docs/reference/build-gates.md). Update the relevant guide
when behavior or configuration changes. Keep comments focused on current
behavior rather than development-session history.

## Working with an assistant

Preserve existing work and follow the user's scope. Editing a file does not
authorize commits, pushes, branch changes, pull requests, or deployment.
Use Git in read-only mode unless the user explicitly requests a write operation.
Do not log conversations or read credentials. For Word imports, try available
archive tools first; ask before installing dependencies, and use `uv` or an
isolated virtual environment if Python is needed. See the optional
[authoring skill](tools/create-publicai-mdx/SKILL.md).

## Pull requests

Describe the changed pages or functionality, languages covered, validation
performed, and any remaining placeholders. Keep generated build output,
dependency caches, machine-specific settings, and secrets out of the PR.
Content publication on the hosted site requires a new build and deployment.
