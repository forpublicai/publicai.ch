# Interface translation review

Status: reviewed during the PR #10 round (2 November 2026). The kicker
strings above the page titles on the news index, author pages, and 404 were
removed site-wide at that point, so those `kicker` entries are now unused by
the renderers; the remaining strings below are the live drafts to confirm.
Strings are taken from the mockup's i18n maps or the old-site HTML where they
exist; everything else was drafted by AI sessions and needs human review.

## 1. 404 page (`chromeStrings.notFound`) — no old-site or mockup authority

The 404 renders only the title, body, and a single "Home" button; the `kicker`
row was removed in the PR #10 chrome polish.

| Key | en | de | fr | it | rm |
|-----|----|----|----|----|----|
| kicker | 404 | 404 | 404 | 404 | 404 |
| title | Page not found | Seite nicht gefunden | Page introuvable | Pagina non trovata | Pagina betg chattada |
| body | The page you were looking for does not exist here. It may have been removed. | Die gesuchte Seite existiert hier nicht. Sie wurde möglicherweise entfernt. | La page que vous cherchez n'existe pas ici. Elle a peut-être été supprimée. | La pagina che cerchi non esiste qui. Potrebbe essere stata rimossa. | La pagina tschercada exista betg qua. Forsa ch'ella è vegnida allontanurada. |
| home (button) | Home | Startseite | Accueil | Home | Pagina iniziala |

Also: the 404 route is noindexed (meta robots) and the root 404.html carries
a noindex meta.

## 2. News chrome (`chromeStrings.news`)

- `kicker`: "News" untranslated in all locales (mockup authority). Currently unused — the news index no longer renders a kicker above its heading.
- `indexTitle`: en "News from the cooperative" (config menu label), de
  "Neuigkeiten aus der Genossenschaft" (mockup news-index h1), fr/it/rm
  mirror the config menu labels ("Actualités de la coopérative",
  "Novità dalla cooperativa", "Novitads da la cooperativa").
- `indexLead`: de is mockup-verbatim ("Was bei Public AI Switzerland
  ansteht, von der Gründung bis zum Alltag der Community."); en/fr/it/rm
  are TRANSLATIONS (no mockup authority). Styled like the `<Lead>` intro on
  content pages since the PR #10 typography pass.
- `readMore`: de "Weiterlesen" (mockup), others translated ("Read more",
  "Lire la suite", "Continua a leggere", "Legear dapli").
- `allNews`: de "Alle News" (mockup), others translated.
- `filterHeading` (the filter row's accessible name) / `filterAll`,
  `prevPage`/`nextPage`/`pageStatus`, `categoryLead`: fully drafted. The
  visible "Categories:" label was dropped in PR #10; the pills are now
  self-explanatory outlined buttons whose active state is filled.
- Empty-collection note (news-index route, `NOTHING_YET`): fully drafted.

## 3. Author directory chrome (`chromeStrings.authors`)

- `kicker`/`indexTitle`: "Authors/Autoren/Auteurs/Autori/Auturs" — drafted.
- `indexLead`, `bylineDescription`, `empty`: fully drafted.

## 4. Home-section strings (co-located, not chrome-strings)

Home copy lives in `src/sections/home/*.tsx` as per-locale objects (plus the
shared newsletter form strings in `src/components/newsletter-form.tsx`). DE is
mockup-verbatim; en/fr/it/rm translations by AI. The hero's primary button is
now "Become a member" pointing at the `/members` placeholder page; the
dialogue link is the secondary outline button.

## 5. Known deviations

- `fallbackNotice.body`: de/en/fr/it mockup-informed, rm drafted.
- `nav.global` ("Global"): drafted (old site has no utility row).

All strings are complete in all five locales and gate-checked (typed records
plus a coverage unit test), so nothing here blocks deploys.
