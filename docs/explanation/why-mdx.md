# Why MDX?

Every page on this site is a text file in the repository, written in MDX, holding all five languages of that page in one file, and living in a folder that has no effect on its address. None of these choices is obvious; this page explains why each one was made and what it costs.

## Content as code

The site has no content management system, no database and no editing interface. A page exists because a text file exists in `content/`, and it changes because that file changes in a git commit. This decision follows from the nature of the project: a small cooperative website with a stream of content contributions and a limited maintenance budget. Content as code gives every change the same properties as any code change: it is reviewed in a pull request, it is versioned, it can be reverted, and a clean checkout plus `yarn build` always reproduces the whole site. There is no editing state to migrate, no database to back up, and no publishing pipeline to break.

The cost is that contributors need git and a text editor rather than a word-processor-like interface. The project considers that a fair trade for a volunteer-driven organisation: the people writing content are already working with repositories, and the safety properties (review before publish, reproducible builds) matter more than editing comfort.

## Why MDX specifically

MDX is Markdown with JSX components embedded. The Markdown part means prose looks exactly like it does everywhere else: paragraphs, lists, links, headings, no ceremony. The JSX part means the site's MDX components can be used inline, in the same file, without leaving the document. That combination avoids the two classic dead ends: pure Markdown, which cannot express structured blocks like a stat grid or a FAQ accordion, and full-blown page code, which would put content behind a programming barrier that content contributors should never face.

Two implementation details make MDX pleasant here. First, components need no import: the build injects the component registry into every page, so an author writes `<Callout>` and never thinks about module paths. Second, MDX files are trusted input: they arrive through git commits by known collaborators, so the build compiles them without a sanitisation layer, which keeps the pipeline simple and fast.

## One file, all languages

Each page's file contains every language of that page, separated by lightweight marker lines:

```mdx
<!-- locale: en -->
English content.

<!-- locale: de -->
German content.
```

The obvious alternative, one file per language, was considered and rejected by the project's founder early on, with a practical argument: five parallel files per page multiply the places a page lives by five, and parallel files drift. Content gets updated in German and the English file quietly goes stale, or a new page lands in one language and nobody notices the other four do not exist. With one file, a page has exactly one home, the five sections sit next to each other where the missing ones are conspicuous, and the build's untranslated report can point at the precise file and language to fill in.

The marker syntax was chosen over heavier alternatives (YAML multi-document blocks, JSON sections, per-locale directories) for one reason: a content contributor must be able to read and edit the file without learning a schema. `<!-- locale: de -->` is an HTML comment, visible, greppable, and impossible to confuse with prose.

The design leans on two safety nets so that partial translations are acceptable rather than embarrassing. The fallback chain (requested language, then English, then German, then whatever exists) guarantees every page renders in every routed language, with a polite notice and correct SEO handling. And the untranslated report turns remaining gaps into a work queue instead of a failure. The trade-off is real but manageable: a five-language file is long, and editors scroll. In exchange, nothing can ever be half-migrated to a new structure, because there is only one structure per page.

## Folders carry no routing semantics

The folder a page lives in (`content/cooperative/`, `content/dialogue/`, or one you invent) is purely for human organisation. The URL comes from the file name alone: `mission.mdx` is `/mission/` whether it sits in `content/cooperative/` or `content/thinkpieces/`. Menus and links reference the slug, never a path.

This is what makes reorganisation free. Moving a file into a different theme folder is a pure file move: no URL changes, no link breaks, no sitemap churn, no menu edit. That property matters for a site whose information architecture is still settling; it means restructuring is never blocked by fear of breaking the web.

The enforced consequence is that slugs are unique across the whole content tree, because two files named `team.mdx` in different folders would otherwise map to the same URL. The build turns that into a named error rather than a silent shadowing bug. In exchange, folder names cannot be used as URL namespaces (no `/cooperative/mission/`), which the project accepts: addresses stay short, flat and permanent, which is what links and menus want.

## What these choices buy together

The three decisions compose into the project's central promise: adding, editing or removing a page requires touching only MDX files, and changing menus, footer, exclusions or toggles requires touching only `config.json`. No other file changes are ever needed for those operations. The reasoning behind that promise, and its boundaries, is the subject of [config-only maintenance](config-only-maintenance.md); how the languages inside one file behave is the subject of [the localisation model](localisation-model.md).
