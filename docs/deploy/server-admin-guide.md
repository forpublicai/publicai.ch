# Build and deployment

## Production artifact

Use Node.js 20 or newer, Corepack, and the pinned Yarn version:

```bash
corepack enable
yarn install --immutable
yarn lint
yarn typecheck
yarn test
yarn build
```

The complete static site is `build/client/`. It contains directory-style
HTML pages, hashed assets, a sitemap, robots.txt, redirect stubs, `404.html`,
and `__spa-fallback.html`. Upload only that directory, never the source tree.

## GitHub Actions

`.github/workflows/ftp.yml` installs dependencies, runs validation, builds,
and retains the production artifact. Pull requests run validation only.
Deployment is limited to `forpublicai/publicai.ch` on `main` and uses the
existing `DEPLOY_REMOTE_HOST`, `DEPLOY_REMOTE_USER`, and
`DEPLOY_PRIVATE_KEY` repository secrets. The latter is the existing FTP
password secret name, not an SSH key for this workflow.

The FTP action receives `local-path: build/client` and `sync: full`.
Generated hashed files cannot be deployed using Git's source-file delta list.
The action's [full-sync behavior](https://github.com/milanmk/actions-file-deployer#notes)
uploads the complete local tree but does not delete remote files.

## First replacement deploy

Back up the current web root. Arrange an administrator-controlled switch to
an empty deployment directory, or remove obsolete old-site HTML and assets
before activating the replacement. Full sync alone leaves the old files behind.
Do not blindly mirror-delete a shared web root containing server configuration
or unrelated files. Configure subsequent cleanup of obsolete hashed assets.

Set the server's 404 handler to `/404.html`. Review incoming legacy `.html`
URLs and add server redirects to the replacement directory URLs where appropriate.
The article slug redirects in `config.json` cover news migrations; they do not
provide a complete old-site URL migration. The root deployment workflow is
prepared for review; no production upload is performed by local file copying.

## Static hosting settings

For a static host such as Vercel, use install command
`yarn install --immutable`, build command `yarn build`, and output directory
`build/client`. Configure directory indexes and the desired 404/legacy rewrite
behavior in that host. Do not deploy a server bundle; this project prerenders
its routes with `ssr: false`.

## Rollback and verification

Keep the previous complete artifact and server configuration. Rollback means
restoring that artifact and its redirect/404 configuration; there is no database.
After deployment, check all five home pages, News, article images, flyer PDFs,
`sitemap.xml`, legacy links, and an unknown URL. The unknown URL should return
HTTP 404. Use `yarn preview` to inspect the generated artifact locally.
