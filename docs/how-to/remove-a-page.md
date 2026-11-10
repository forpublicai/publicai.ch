# Remove a page

This guide explains how to take a page off the site, and how to keep old addresses working afterwards. Removing a page means removing its MDX file; nothing else needs to change, with one exception: if `config.json` or other pages still link to the removed slug, the build fails and names the references, which is exactly what you want to check first.

## Decide between deleting and hiding

| You want...                                             | Do this                                   | Guide                                            |
| ------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| The page gone permanently, URL retired                   | Delete the MDX file (this guide)          | Steps below                                      |
| The page hidden while you rework it                      | Set `draft: true` in its frontmatter      | [Add or edit a page](add-or-edit-a-page.md)      |
| The old address to lead somewhere new                    | Keep (or move) the content, add a redirect | [Hide or redirect pages](exclude-or-redirect-pages.md) |

Deleting is permanent in the sense that the URL stops existing and search engines will eventually drop it. If the page has history worth keeping, prefer `draft: true`, or move the content into a differently named file and redirect the old slug.

## Step 1: Find the references

Before deleting, search the repository for the slug. The two places that matter:

- `config.json`: menus, footer columns and the CTA button reference pages by slug (`"page": "mission"`).
- Other MDX files under `content/`: internal Markdown links like `[Mission](/mission)` and `<CTA to="mission">` props.

Both are build-checked. If you delete the page without cleaning up, you get one of these errors on the next `yarn build`, which names the exact location to fix:

```text
config.json references pages that do not exist (add the MDX file or fix the slug):
- menus.main[2].page: unknown page slug "mission"
```

```text
broken internal links in MDX:
- content/cooperative/about.mdx: internal link target "mission" does not resolve
```

## Step 2: Remove the links (if any)

Edit `config.json` to drop the menu or footer entries pointing at the slug, and remove or retarget the Markdown links in other pages. If the page is being replaced rather than retired, retarget the links to the new slug instead and skip ahead to the redirect step.

## Step 3: Delete the file

Remove the MDX file, for example `content/cooperative/mission.mdx`, and commit the deletion in your change. Images that only this page used can be removed from `public/assets/images/<slug>/` in the same change.

## Step 4: Decide what the old URL should do

A removed page address serves a localised 404 page by default. If visitors or search engines have bookmarked the address, add a redirect in `config.json`:

```json
"pages": {
  "redirects": [
    { "from": "/mission/", "to": "/about-us/" }
  ]
}
```

At build time each redirect is emitted as a small HTML page at the old address containing a meta-refresh and a plain link to the new address, marked `noindex`. This works on any static host without server configuration. The redirect list in the repository currently maps the old flat news addresses to their new news-pipeline addresses.

## Step 5: Verify

```bash
yarn build
```

Then check three things:

1. The build passes, which means no config entry or MDX link still references the removed slug.
2. The old URL now shows the localised 404 (or the redirect target, if you added one). With the build output served via `yarn preview` on `http://localhost:4173/`, open the old address and confirm.
3. `build/client/sitemap.xml` no longer contains the page in any language.

The full verification toolchain is described in [the build gates reference](../reference/build-gates.md).

## What the visitor sees

After removal, a visitor opening the old address gets the site's 404 page in the language implied by the URL prefix (English at the root), with a single "Home" button back to the locale home. The 404 copy and the redirect stub behaviour are specified in [the URL scheme reference](../reference/url-scheme.md).