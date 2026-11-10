# MDX authoring skill

This folder contains a reusable Claude skill for drafting a page or news
article for this repository and, when requested and available, preparing a
GitHub pull request.

## Use the skill

- **Claude Code:** copy `create-publicai-mdx/` to the repository's
  `.claude/skills/` directory to make it a project skill, or to
  `~/.claude/skills/` for your local Claude Code sessions.
- **Claude Cowork / claude.ai:** add the skill to your Claude account's Skills
  settings. Cowork does not load files from this repository's `tools/` folder
  automatically. Follow the import/upload flow offered by your Claude account;
  if it requires a ZIP, zip the `create-publicai-mdx/` folder so `SKILL.md` is
  at the skill folder's root.
- **Other assistants:** the `SKILL.md` uses the open Agent Skills layout. If
  the assistant supports that format, install or attach the skill folder using
  that product's instructions. Git operations still require repository access
  and GitHub authentication in that environment.

The skill can also be followed manually by opening
[`create-publicai-mdx/SKILL.md`](create-publicai-mdx/SKILL.md).
