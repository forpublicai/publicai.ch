# Explanation

Discussions that help the reader understand the project at a deeper level: design decisions, trade-offs, historical context, and how parts of the system relate.

Each explanation should:

- Clarify _why_, not _how_.
- Assume the reader is familiar with the basics.
- Be discursive rather than step-by-step.

## Index

- [Why MDX?](why-mdx.md): content as code, one file holding all languages, and folders without routing meaning.
- [Config-only maintenance](config-only-maintenance.md): the maintenance invariant, what it promises, how the build enforces it, where it stops.
- [The localisation model](localisation-model.md): the three text paths, the fallback chain, hreflang truthfulness and the language switcher.