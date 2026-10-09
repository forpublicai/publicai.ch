---
name: create-publicai-mdx
description: Create a polished, repository-valid Public AI Switzerland MDX page or news article, optionally prepare a Git branch and GitHub pull request. Use when someone wants new website content, asks for specific page styling or MDX components, or wants help publishing a content change from a local checkout, fork, Cowork session, or other Git environment.
---

# Create a Public AI Switzerland MDX page

Create the requested content in this repository's MDX conventions. The user
may want only a finished file, help pushing with Git, or a pull request. Treat
these as distinct outcomes and find out which one they want before any remote
write. A request to draft or create an MDX file alone does not authorize a
commit, push, branch creation, or PR.

## 1. Check the environment and preserve the user's work

1. Confirm that this repository is accessible and inspect its current content
   conventions. Read the relevant template and, as needed:
   - `content/templates/README.md`
   - `content/templates/page-template.mdx` or `content/templates/news-template.mdx`
   - `docs/how-to/add-or-edit-a-page.md`
   - `docs/how-to/news-and-authors.md`
   - `docs/reference/frontmatter.md`
   - `docs/reference/components.md`
   - `config.json` for valid news categories and page links.
2. Inspect `git status --short`, the current branch, and remotes before
   editing or running Git commands. Preserve all pre-existing user changes.
   Never overwrite a conflicting file, discard changes, reset, clean, stash,
   force-push, or rebase as a shortcut. If an unrelated dirty worktree makes
   a safe PR workflow unclear, finish a separate file/draft or ask how they
   want to proceed.
3. Identify what the session can actually access. Do not assume that a Claude
   account, GitHub account, GitHub connector, local checkout, `gh` CLI, or
   credentials are configured merely because the user mentioned Git.

## 2. Clarify the content brief without making the process burdensome

Use information the user already supplied. Ask only for details needed to
write accurate content. At minimum establish:

- **Page type:** standard page or news article.
- **Subject and source material:** intended audience, key facts, desired
  message, and any supplied links or documents. Do not invent factual claims,
  quotes, dates, affiliations, statistics, or promises. Mark unresolved
  information with a concise placeholder and tell the user.
- **Slug and destination:** choose a short lowercase hyphenated slug, and a
  sensible theme folder. Folders are organizational only; the filename
  determines the URL. Check the slug is unique across all of `content/` and
  that it is not the reserved `news` slug.
  For news, use `content/news/` and prefix the slug with its publication date.
- **Languages:** English is expected. The supported locale markers are `en`,
  `de`, `fr`, `it`, and `rm`. Ask whether the user wants all five languages or
  only supplied/approved translations. Never claim a machine translation was
  reviewed by a human. It is acceptable to create fewer sections; the site
  falls back to another available language.
- **Visual structure:** ask what the user means by “specific styling” if it
  could mean several things. Page styling is composed from the existing MDX
  components and Markdown structure. Do not change CSS, fonts, colours,
  templates, React components, or site code for a content request.
- **Images:** determine whether the user supplied an image, wants an existing
  repository asset, or wants a path placeholder. Never fabricate an asset or
  refer to a nonexistent image as if it were present. For a news article,
  `heroImage` is optional and the same site-absolute image path is used in the
  news card and above the article. For an in-body image, use `<Figure>` with
  `src`, meaningful `alt`, and optional `caption`; check that the asset exists.
- **Delivery mode:** ask whether they want (a) the MDX only for manual addition,
  (b) a local Git branch/commit, or (c) a pushed branch and PR. If ambiguous,
  create the file locally and leave remote Git operations untouched until
  clarified.

## 3. Draft the right file

### Standard page

- Create `content/<theme>/<slug>.mdx` using the conventions in
  `content/templates/page-template.mdx`.
- Frontmatter must include non-empty `title` and `description`. Keep fields
  flat. `description` should usually be 50–160 characters. Optional fields
  include `draft: true`, `noindex: true`, and `updatedAt: YYYY-MM-DD` when
  appropriate.
- Put the body only beneath locale marker lines. Include each requested
  language exactly once using `<!-- locale: en -->`, `de`, `fr`, `it`, or `rm`.
  Do not leave template instructions, commentary, or prose before the first
  marker. At least one locale section is required.

### News article

- Create `content/news/YYYY-MM-DD-<slug>.mdx` following
  `content/templates/news-template.mdx`, but remove all instructional prose
  from the template.
- Include non-empty `title`, `description`, `date` (`YYYY-MM-DD`), and
  `category`. `category` must exactly match an item in `config.json` at
  `news.categories`. Do not invent a publication date; ask if it is unknown.
  Prefix the filename/slug with that same date: `YYYY-MM-DD-<slug>.mdx`.
- Add `author` only when its ID exists as `content/authors/<id>.mdx`. Add
  `heroImage` only when the site-absolute asset path exists or the user
  explicitly wants a clearly reported placeholder. Use `externalUrl` only
  when the story itself is published elsewhere and the user wants a link-out.
  Use `draft: true` if the user wants an unpublished draft.
- Article titles and descriptions are locale-neutral frontmatter. Write the
  article body beneath the requested locale markers.

### Structure and MDX components

Use clear page hierarchy, short sections, descriptive headings, and concise
paragraphs. Use existing components only when they improve the content:

- `<Lead>` once for a short opening summary.
- `<Callout variant="info|warning|highlight">…</Callout>` for a genuinely
  distinct note.
- `<CTA title="…" to="page-slug" />` for an internal action, or `href` for an
  absolute URL / `mailto:` action. Do not invent target slugs; confirm internal
  targets exist.
- `<Accordion items={[{ question: "…", answer: "…" }]} />` for FAQs.
- `<Figure src="/assets/..." alt="…" caption="…" />` for an existing image.
- `<StatGrid>`, `<LinkRow>`, `<Embed>`, `<Divider>`, `<Box>`, and `<TeamGrid>`
  only with the exact props documented in `docs/reference/components.md`.

Do not use raw HTML/JSX as a styling escape hatch, invent component names or
props, add CSS classes, or change brand fonts or colours. For any requested
appearance the component set cannot express, explain the limitation and offer
the closest content-only structure.

## 4. Validate the file and site references

Before handing over the file:

1. Check frontmatter syntax, required fields, valid date/category/author,
   unique slug, existing image paths, and locale marker spelling/uniqueness.
2. Ensure no body text precedes the first locale marker; ensure MDX component
   tags and props match `docs/reference/components.md`.
3. Verify internal Markdown links, `<CTA to="...">`, and `LinkRow` `to`
   values resolve to known page slugs. Existing page folders do not form part
   of the target URL.
4. Run `yarn build` only when dependencies are available and the user expects
   verification. Do not install dependencies, alter lockfiles, or change
   unrelated files without authorization. If the build is not available or
   fails for pre-existing/environmental reasons, say exactly what was and was
   not verified.
5. A new page is automatically routed and listed in the sitemap, but the
   reachability gate may require it to be linked. Do not edit `config.json`
   for this MDX-only task unless the user asks to add navigation/footer links;
   flag that requirement and get approval for the extra change.

## 5. Choose the Git path the user asked for

### A. MDX file only / manual addition

- Leave the change as a local file or provide the complete MDX contents in a
  copyable form, depending on what the environment can access.
- Do not stage, commit, push, or create a PR.
- If the user is in Cowork or another environment without repository write
  access, return the file contents and its intended path, plus concise
  instructions for adding it to the repository.

### B. Local Git help, no push/PR

- Work only in the current repository and branch if that matches the user's
  request. A local branch or commit is a meaningful Git change; create it only
  when the user asked for that outcome.
- Stage only the new/edited MDX file(s) for this task. Inspect the staged diff
  before committing. Never include pre-existing user changes.
- If the user wants instructions rather than execution, provide the exact
  commands without running them.

### C. Push a branch and open a pull request

First confirm that the user asked for the push/PR. Then inspect the actual
repository and available authentication; never guess the account or target:

1. Identify the checkout with `git remote -v`, `git branch -vv`, and, if
   available, `gh repo view`. Determine the canonical upstream repository,
   default branch, current branch, and whether `origin` is a fork. Do not
   assume the repository's canonical remote is `origin` or that `main` is the
   right base. This project's known canonical GitHub repository is
   `forpublicai/publicai.ch`, but verify the live checkout and ask if its
   remotes or requested destination differ.
2. Check available auth without exposing secrets: for GitHub CLI use
   `gh auth status`; for a host integration, check whether it can see the repo
   and create a branch/PR. Never read, print, request, or place tokens, SSH
   private keys, passwords, or credential-helper contents in chat or files.
3. **If the user's Git/GitHub account is not configured in this environment:**
   do not attempt to log in as them, install/configure an integration, or ask
   them to paste credentials. Finish or preserve the MDX file, explain that
   no authenticated GitHub path is available, and offer:
   - the file for manual addition;
   - steps to connect their own GitHub account in the current product; or
   - for a local terminal, using their own `gh auth login` / configured Git
     credential or SSH setup, then resuming the PR workflow.
   Do not imply that Claude's account is the user's GitHub account.
4. **If the checkout is a fork:** create/push a topic branch to the user's
   fork, then target a PR from that fork/branch into the verified canonical
   upstream and default branch. If upstream is not configured or the user
   wants a different base, ask rather than adding/remapping remotes silently.
5. **If the current branch is not the requested base:** do not rewrite it or
   rebase it. Create a descriptive topic branch from the correct base after
   fetching only when safe and authorized, or use an isolated worktree if
   available. If the current branch contains user changes or is ahead/behind
   in a way that makes the base unclear, stop before staging and ask. Never
   put an unrelated branch's commits into the PR.
6. Stage only the requested MDX file(s); inspect `git diff --cached`; commit
   with a factual message. Push only the task branch, without force. Open the
   PR against the verified base and include the content summary and build
   status. Do not merge it.
7. If branch push succeeds but PR creation is unavailable, report the branch
   name and remote and provide a direct compare/PR link if the host supplies
   one. If push fails due to auth, leave the local file/branch intact and give
   the user the next setup step. Never delete branches or discard the work.

## 6. Report the outcome clearly

State the file path and page slug/URL, page type, languages included, image
status, any remaining placeholder or navigation requirement, and verification
performed. For Git work, state whether you created a branch, commit, pushed it,
and opened a PR; include links/IDs only when confirmed by the host. Distinguish
clearly between a local file, a pushed branch, and an opened pull request.
