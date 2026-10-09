# Interface translation review

For translation review, strings
are taken from the mockup's i18n maps or the old-site HTML where they exist;
everything else is drafted by AI sessions and MUST be reviewed. The strings
below are those drafts. Sources marked.

## 1. 404 page (`chromeStrings.notFound`) — no old-site or mockup authority

| Key | en | de | fr | it | rm |
|-----|----|----|----|----|----|
| kicker | 404 | 404 | 404 | 404 | 404 |
| title | Page not found | Seite nicht gefunden | Page introuvable | Pagina non trovata | Pagina betg chattada |
| body | The page you were looking for does not exist here. It may have been removed. | Die gesuchte Seite existiert hier nicht. Sie wurde möglicherweise entfernt. | La page que vous cherchez n'existe pas ici. Elle a peut-être été supprimée. | La pagina che cerchi non esiste qui. Potrebbe essere stata rimossa. | La pagina tschercada exista betg qua. Forsa ch'ella è vegnida allontanurada. |
| home (button) | Home | Startseite | Accueil | Home | Pagina iniziala |

Also: the 404 route is noindexed (meta robots) and the root 404.html carries
a noindex meta.

## 2. News chrome (`chromeStrings.news`)

- `kicker`: "News" untranslated in all locales (mockup authority — the
  mockup uses "News" as the section kicker).
- `indexTitle`: en "News from the cooperative" (config menu label), de
  "Neuigkeiten aus der Genossenschaft" (mockup news-index h1), fr/it/rm
  mirror the config menu labels ("Actualités de la coopérative",
  "Novità dalla cooperativa", "Novitads da la cooperativa").
- `indexLead`: de is mockup-verbatim ("Was bei Public AI Switzerland
  ansteht, von der Gründung bis zum Alltag der Community."); en/fr/it/rm
  are TRANSLATIONS (no mockup authority).
- `readMore`: de "Weiterlesen" (mockup), others translated ("Read more",
  "Lire la suite", "Continua a leggere", "Legear dapli").
- `allNews`: de "Alle News" (mockup), others translated.
- `filterHeading`/`filterAll`, `prevPage`/`nextPage`/`pageStatus`,
  `categoryLead`: fully drafted (no mockup equivalent — the mockup has no
  static category pages or pagination).
- Empty-collection note (news-index route, `NOTHING_YET`): fully drafted.

## 3. Author directory chrome (`chromeStrings.authors`)

- `kicker`/`indexTitle`: "Authors/Autoren/Auteurs/Autori/Auturs" — drafted.
- `indexLead`, `bylineDescription`, `empty`: fully drafted.

## 4. Home-section strings (co-located, not chrome-strings)

Home copy lives in `src/sections/home/*.tsx` as per-locale objects. DE is
mockup-verbatim; en/fr/it/rm translations by AI. The mailto subjects
("Anteil zeichnen – Public AI Switzerland") are derived from the labels.

## 5. Known deviations

- `fallbackNotice.body`: de/en/fr/it mockup-informed, rm drafted.
- `nav.global` ("Global"): drafted (old site has no utility row).
- `newsletterSubject`: untranslated label + site name (old-site convention).

**Please confirm or correct any of the above.** Nothing here blocks deploys
— all strings are complete in all five locales and gate-checked.
