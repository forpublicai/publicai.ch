// Shared interface strings in all five languages. Page copy belongs in MDX;
// navigation labels belong in config.json. Typed locale records and coverage
// tests ensure interface translations are complete, with no runtime fallback.
import type { Locale } from "~/lib/config";

// The localised name of each language, used inside the fallback notice
// ("This page is not yet available in Français …") and anywhere a language
// is named in prose. Endonyms follow common Swiss usage.
export const LANGUAGE_NAMES: Record<Locale, Record<Locale, string>> = {
  en: { en: "English", de: "German", fr: "French", it: "Italian", rm: "Romansh" },
  de: { en: "Englisch", de: "Deutsch", fr: "Französisch", it: "Italienisch", rm: "Rätoromanisch" },
  fr: { en: "anglais", de: "allemand", fr: "français", it: "italien", rm: "romanche" },
  it: { en: "inglese", de: "tedesco", fr: "francese", it: "italiano", rm: "romancio" },
  rm: { en: "englais", de: "tudestg", fr: "franzos", it: "talian", rm: "rumantsch" },
};

// Chrome strings proper, grouped by area.
export const chromeStrings = {
  // Navigation landmarks + controls (header, footer, switcher).
  nav: {
    // Old-site authority: "Main" nav aria-label is untranslated in all
    // five old-site locales (verified in publicai.ch_old/*/index.html).
    main: { en: "Main", de: "Main", fr: "Main", it: "Main", rm: "Main" },
    // Old-site authority per locale (verified aria-labels):
    // de "Navigationsmenü umschalten", fr "Ouvrir le menu de navigation",
    // it "Apri menu di navigazione", rm "Alternar il menu da navigaziun",
    // en "Toggle navigation menu".
    toggleNavigation: {
      en: "Toggle navigation menu",
      de: "Navigationsmenü umschalten",
      fr: "Ouvrir le menu de navigation",
      it: "Apri menu di navigazione",
      rm: "Alternar il menu da navigaziun",
    },
    // Drafted (old site has no utility-row equivalent).
    global: { en: "Global", de: "Global", fr: "Global", it: "Global", rm: "Global" },
    languages: { en: "Languages", de: "Sprachen", fr: "Langues", it: "Lingue", rm: "Linguas" },
  },

  // 404 page (notFound): NEW DRAFTS — old site + mockup have no 404 page;
  // flag for user review in. Copy intent: friendly, short, one action
  // (single Home button per).
  notFound: {
    kicker: { en: "404", de: "404", fr: "404", it: "404", rm: "404" },
    title: {
      en: "Page not found",
      de: "Seite nicht gefunden",
      fr: "Page introuvable",
      it: "Pagina non trovata",
      rm: "Pagina betg chattada",
    },
    body: {
      en: "The page you were looking for does not exist here. It may have been removed.",
      de: "Die gesuchte Seite existiert hier nicht. Sie wurde möglicherweise entfernt.",
      fr: "La page que vous cherchez n'existe pas ici. Elle a peut-être été supprimée.",
      it: "La pagina che cerchi non esiste qui. Potrebbe essere stata rimossa.",
      rm: "La pagina tschercada exista betg qua. Forsa ch'ella è vegnida allontanurada.",
    },
    home: { en: "Home", de: "Startseite", fr: "Accueil", it: "Home", rm: "Pagina iniziala" },
  },
  //: visible notice when a missing-locale section falls back.
  // "{source}" interpolates the source-language name (LANGUAGE_NAMES[locale]).
  fallbackNotice: {
    body: {
      en: "This page is not yet available in {requested}. Showing the {source} version.",
      de: "Diese Seite ist noch nicht auf {requested} verfügbar. Die {source} Version wird angezeigt.",
      fr: "Cette page n'est pas encore disponible en {requested}. La version {source} est affichée.",
      it: "Questa pagina non è ancora disponibile in {requested}. Viene mostrata la versione {source}.",
      rm: "Questa pagina n'è anc betg disponibla en {requested}. La versiun {source} vegn mussada.",
    },
  },

  // News chrome: the generated news index + teaser/article labels.
  // "News" is used untranslated in the mockup in every locale (verified) and
  // de/fr/it/rm labels come from the config.json menu seed ("Aktuelles",
  // "Actualités", "Novità", "Novitads"). Index headline/lead are NEW DRAFTS
  // (the mockup's news-index copy is DE-only) — flagged for review.
  news: {
    availableIn: {
      en: "Available in {language}",
      de: "Verfügbar auf {language}",
      fr: "Disponible en {language}",
      it: "Disponibile in {language}",
      rm: "Disponibel en {language}",
    },
    categoryLabels: {
      Dialog: { de: "Dialog", en: "Dialogue", fr: "Dialogue", it: "Dialogo", rm: "Dialog" },
      Genossenschaft: { de: "Genossenschaft", en: "Cooperative", fr: "Coopérative", it: "Cooperativa", rm: "Cooperativa" },
      Community: { de: "Community", en: "Community", fr: "Communauté", it: "Community", rm: "Communitad" },
      Medien: { de: "Medien", en: "Media", fr: "Médias", it: "Media", rm: "Medias" },
    },
    teaserTitle: {
      de: "Aktuelles aus der Genossenschaft",
      en: "News from the cooperative",
      fr: "Actualités de la coopérative",
      it: "Novità dalla cooperativa",
      rm: "Novitads da la cooperativa",
    },
    // Index page: block kicker + page heading + lead.
    kicker: { en: "News", de: "News", fr: "News", it: "News", rm: "News" },
    indexTitle: {
      en: "News from the Cooperative",
      de: "Neuigkeiten aus der Genossenschaft",
      fr: "Actualités de la coopérative",
      it: "Novità dalla cooperativa",
      rm: "Novitads da la cooperativa",
    },
    indexLead: {
      en: "What is coming up at Public AI Switzerland, from the founding to everyday community life.",
      de: "Was bei Public AI Switzerland ansteht, von der Gründung bis zum Alltag der Community.",
      fr: "Ce qui se prépare chez Public AI Switzerland, de la fondation au quotidien de la communauté.",
      it: "Cosa accade presso Public AI Switzerland, dalla fondazione alla quotidianità della community.",
      rm: "Tge vegn tar Public AI Switzerland, da la fundaziun fin all' quotidiad dalla communitad.",
    },
    // Card read-more label: mockup authority "Weiterlesen" (DE); other
    // locales drafted in the same register.
    readMore: {
      en: "Read more",
      de: "Weiterlesen",
      fr: "Lire la suite",
      it: "Continua a leggere",
      rm: "Legear dapli",
    },
    // "All news" pill on the teaser section; mockup "Alle News →".
    allNews: {
      en: "All news",
      de: "Alle News",
      fr: "Toutes les actualités",
      it: "Tutte le novità",
      rm: "Tutas las novitads",
    },
    // Teaser section + index aria-label.
    ariaLabel: {
      en: "News",
      de: "News",
      fr: "News",
      it: "News",
      rm: "News",
    },
    // Category filter row heading + "all" option.
    filterHeading: {
      en: "Categories",
      de: "Kategorien",
      fr: "Catégories",
      it: "Categorie",
      rm: "Categorias",
    },
    filterAll: {
      en: "All",
      de: "Alle",
      fr: "Toutes",
      it: "Tutte",
      rm: "Tutas",
    },
    // Pagination controls. "{page}" interpolates the number.
    prevPage: {
      en: "Previous page",
      de: "Vorherige Seite",
      fr: "Page précédente",
      it: "Pagina precedente",
      rm: "Pagina precedenta",
    },
    nextPage: {
      en: "Next page",
      de: "Nächste Seite",
      fr: "Page suivante",
      it: "Pagina successiva",
      rm: "Proxima pagina",
    },
    pageStatus: {
      en: "Page {page} of {total}",
      de: "Seite {page} von {total}",
      fr: "Page {page} sur {total}",
      it: "Pagina {page} di {total}",
      rm: "Pagina {page} da {total}",
    },
    // Category listing lead: "{category}" interpolates the category name.
    categoryLead: {
      en: "News in the category “{category}”.",
      de: "News in der Kategorie „{category}“.",
      fr: "Actualités dans la catégorie « {category} ».",
      it: "Novità nella categoria «{category}».",
      rm: "Novitads en la categoria «{category}».",
    },
  },

  // Author directory labels (the design has
  // no author directory; kicker follows the news "News" untranslated model).
  authors: {
    articlesHeading: {
      en: "Articles by {name}",
      de: "Beiträge von {name}",
      fr: "Articles de {name}",
      it: "Articoli di {name}",
      rm: "Artitgels da {name}",
    },
    noArticles: {
      en: "No published articles yet.",
      de: "Noch keine veröffentlichten Beiträge.",
      fr: "Aucun article publié pour le moment.",
      it: "Nessun articolo pubblicato al momento.",
      rm: "Anc nagins artitgels publitgads.",
    },
    viewProfile: {
      en: "View author profile",
      de: "Autorenprofil ansehen",
      fr: "Voir le profil",
      it: "Vedi il profilo",
      rm: "Vesair il profil",
    },
    kicker: { en: "Authors", de: "Autoren", fr: "Auteurs", it: "Autori", rm: "Auturs" },
    indexTitle: {
      en: "Authors",
      de: "Autoren",
      fr: "Auteurs",
      it: "Autori",
      rm: "Auturs",
    },
    indexLead: {
      en: "The people writing for Public AI Switzerland — short bios and contact paths live with each author.",
      de: "Die Menschen, die für Public AI Switzerland schreiben — Kurzbios und Kontaktwege finden sich je Autor.",
      fr: "Les personnes qui écrivent pour Public AI Switzerland — courtes bios et contacts sur chaque page d'auteur.",
      it: "Le persone che scrivono per Public AI Switzerland — brevi bio e contatti su ogni pagina autore.",
      rm: "La glieud che scriva per Public AI Switzerland — curts bios e vias da contact tar mintga autur.",
    },
    bylineDescription: {
      en: "Author at Public AI Switzerland",
      de: "Autor bei Public AI Switzerland",
      fr: "Auteur chez Public AI Switzerland",
      it: "Autore presso Public AI Switzerland",
      rm: "Autur tar Public AI Switzerland",
    },
    empty: {
      en: "No author profiles yet.",
      de: "Noch keine Autorenprofile.",
      fr: "Pas encore de profils d'auteur.",
      it: "Ancora nessun profilo d'autore.",
      rm: "Anc nagins profils d'autur.",
    },
  },
} as const;

// Translate category labels without changing the human-authored category IDs
// used for filtering. New categories continue to display their original name.
export function newsCategoryLabel(category: string, locale: Locale): string {
  const labels = chromeStrings.news.categoryLabels[category as keyof typeof chromeStrings.news.categoryLabels];
  return labels?.[locale] ?? category;
}
