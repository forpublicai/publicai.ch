# Documentation

This folder contains documentation for **human contributors** and external readers of the Public AI Switzerland website. It is written in natural language and prioritises comprehensiveness and navigability for someone new to the codebase.

The root README covers setup. These guides describe publishing, configuration, components, and deployment.

## Structure

This documentation follows the [Diataxis framework](https://diataxis.fr/), which organises content into four quadrants based on the reader's needs:

| Quadrant          | Purpose                                                                                         | Audience                                                         | Location                       |
| ----------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------ |
| **Tutorials**     | Learn by doing — guided lessons that take a beginner from zero to a working result.             | Newcomers who want to learn the project.                         | [`tutorials/`](tutorials/)     |
| **How-to guides** | Achieve a specific goal — practical, step-by-step directions for common tasks.                  | Users who already know the basics and have a concrete objective. | [`how-to/`](how-to/)           |
| **Reference**     | Consult while working — terse, complete descriptions of the API, configuration, and interfaces. | Anyone who needs authoritative technical detail.                 | [`reference/`](reference/)     |
| **Explanation**   | Understand the big picture — discussion of design decisions, trade-offs, and context.           | Readers who want deeper understanding, not a task.               | [`explanation/`](explanation/) |

## Illustrated handbook

- [Quick Guide for Content Contributors (PDF)](pdf/quick-guide-for-content-contributors.pdf) - plain-language editing, news, navigation and publishing instructions with local-site screenshots.
- [Editable guide source](pdf/quick-guide-for-content-contributors.md).

## Where to Start

- **New to the project?** Start with [`tutorials/`](tutorials/) to get something running, then read the [Explanation](explanation/) entries to understand _why_ the system looks the way it does.
- **Need to do a specific task?** Jump to [`how-to/`](how-to/).
- **Looking up an API or config value?** Use [`reference/`](reference/).
- **Want to understand a design decision?** Browse [`explanation/`](explanation/).

## Contributing to the Docs

1. Place new content in the appropriate quadrant. If unsure, ask: is this teaching, guiding, describing, or discussing?
2. Keep language natural and accessible. Avoid jargon without definition.
3. Cross-link between quadrants where helpful (e.g., a how-to may link to reference entries and an explanation of the underlying choice).
4. Update the index files within each quadrant folder when adding a new document.

## Deploy

- [`deploy/server-admin-guide.md`](deploy/server-admin-guide.md) — hosting layout, build artifact, deploy requirements, open sysadmin questions, rollback.
