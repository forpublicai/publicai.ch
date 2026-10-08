# Reference

Authoritative, terse descriptions of the project's interfaces, configuration, and components. This is material to _consult_, not to read end-to-end.

Each reference entry should:

- Be precise and complete.
- Avoid explanation or discussion: that belongs in `../explanation/`.
- Stay in sync with the actual code.

## Index

- [config.json reference](config-json.md): the full site configuration schema, covering sections, LocalizedString and MenuItem rules, and validation errors.
- [Frontmatter reference](frontmatter.md): the standard page, news article and author record frontmatter schemas, with parsing rules and build derivations.
- [MDX component reference](components.md): the eleven MDX-callable components with their props and usage examples.
- [URL scheme reference](url-scheme.md): every URL shape, slug rules, the fallback chain, hreflang truthfulness and generated addresses.
- [Build gates reference](build-gates.md): the full gate chain from lint to accessibility, the post-build checks and the report files.
