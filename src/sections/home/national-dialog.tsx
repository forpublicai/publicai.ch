// NationalDialog home section: the KI-Dialog highlight with the
// Swiss-map quote image and the three-step process (Mitreden /
// Zusammentragen / Einbringen). Copy verbatim from the mockup (DE),
// co-located per-locale translations; self-contained.
import type { Locale } from "~/lib/config";
import { localeHref } from "~/lib/locale";

const KICKER: Record<Locale, string> = {
  de: "Im Zentrum",
  en: "At the centre",
  fr: "Au cœur",
  it: "Al centro",
  rm: "En il center",
};

const HEADING: Record<Locale, string> = {
  de: "Der nationale KI-Dialog",
  en: "The national AI dialogue",
  fr: "Le dialogue national sur l'IA",
  it: "Il dialogo nazionale sull'IA",
  rm: "Il dialog naziunal davart l'IA",
};

const LEAD: Record<Locale, string> = {
  de: "Was erwartet die Schweiz von künstlicher Intelligenz, und wo zieht sie Grenzen? Im nationalen KI-Dialog sammeln wir Stimmen aus allen Sprachregionen und bringen sie dorthin, wo über die Rahmenbedingungen für KI entschieden wird.",
  en: "What does Switzerland expect from artificial intelligence, and where does it draw the line? In the national AI dialogue we gather voices from every language region and bring them to where the framework for AI is decided.",
  fr: "Qu'attend la Suisse de l'intelligence artificielle, et où fixe-t-elle des limites ? Dans le dialogue national sur l'IA, nous recueillons des voix de toutes les régions linguistiques et les portons là où se décide le cadre de l'IA.",
  it: "Che cosa si aspetta la Svizzera dall'intelligenza artificiale, e dove pone dei limiti? Nel dialogo nazionale sull'IA raccogliamo voci da tutte le regioni linguistiche e le portiamo dove si decidono le condizioni quadro per l'IA.",
  rm: "Tge spetga la Svizra da l'intelligenza artifiziala, e nua tira ella cunfins? En il dialog naziunal davart l'IA rimnain nus vuschs da tut las regiuns linguisticas e las purtain là, nua ch'i vegn decidì davart las cundiziuns generalas per l'IA.",
};

const CTA: Record<Locale, string> = {
  de: "Mehr zum KI-Dialog",
  en: "More on the AI dialogue",
  fr: "En savoir plus sur le dialogue",
  it: "Di più sul dialogo sull'IA",
  rm: "Dapli davart il dialog davart l'IA",
};

const MAP_ALT: Record<Locale, string> = {
  de: "Schweizerkarte mit Stimmen aus dem KI-Dialog in allen Landessprachen",
  en: "Map of Switzerland with voices from the AI dialogue in all national languages",
  fr: "Carte de la Suisse avec les voix du dialogue sur l'IA dans toutes les langues nationales",
  it: "Carta della Svizzera con le voci del dialogo sull'IA in tutte le lingue nazionali",
  rm: "Charta da la Svizra cun las vuschs dal dialog davart l'IA en tut las linguas naziunalas",
};

const STEPS: Record<Locale, { title: string; body: string }[]> = {
  de: [
    { title: "Mitreden", body: "Teile online, was du von KI erwartest. Mitmachen kann jede und jeder, auch ohne Mitgliedschaft." },
    { title: "Zusammentragen", body: "Wir bündeln die Beiträge aus allen Landesteilen und Sprachregionen." },
    { title: "Einbringen", body: "Die Ergebnisse tragen wir in Politik, Verwaltung und Forschung." },
  ],
  en: [
    { title: "Speak up", body: "Share online what you expect from AI. Anyone can take part, no membership required." },
    { title: "Bring together", body: "We pool the contributions from all parts of the country and every language region." },
    { title: "Carry forward", body: "We bring the results into politics, public administration and research." },
  ],
  fr: [
    { title: "S'exprimer", body: "Partage en ligne ce que tu attends de l'IA. Tout le monde peut participer, même sans être membre." },
    { title: "Rassembler", body: "Nous réunissons les contributions de toutes les régions du pays et de toutes les régions linguistiques." },
    { title: "Faire entendre", body: "Nous portons les résultats auprès de la politique, de l'administration et de la recherche." },
  ],
  it: [
    { title: "Dire la tua", body: "Condividi online che cosa ti aspetti dall'IA. Tutti possono partecipare, anche senza essere soci." },
    { title: "Raccogliere", body: "Riuniamo i contributi da tutte le regioni del Paese e da tutte le regioni linguistiche." },
    { title: "Portare avanti", body: "Portiamo i risultati nella politica, nell'amministrazione e nella ricerca." },
  ],
  rm: [
    { title: "Discurrer cun", body: "Parta online tge che ti spetgas da l'IA. Tuts pon participar, er senza commembranza." },
    { title: "Rimnar", body: "Nus unin las contribuziuns da tut las parts dal pajais e da tut las regiuns linguisticas." },
    { title: "Purtar vinavant", body: "Nus purtain ils resultats en la politica, l'administraziun e la perscrutaziun." },
  ],
};

export default function NationalDialog({ locale }: { locale: Locale }) {
  return (
    <section className="home-section">
      <div className="home-dialog card">
        <div className="home-dialog__body">
          <p className="block-heading">{KICKER[locale]}</p>
          <h2 className="home-section-heading">{HEADING[locale]}</h2>
          <p className="home-dialog__lead">{LEAD[locale]}</p>
          <a className="pill pill--primary" href={localeHref("/ai-dialogue", locale)}>
            {CTA[locale]} →
          </a>
        </div>
        <img
          src="/assets/images/swiss-map.png"
          alt={MAP_ALT[locale]}
          className="home-dialog__image"
          loading="lazy"
        />
      </div>
      <div className="home-steps">
        {STEPS[locale].map((step, index) => (
          <div key={step.title} className="home-steps__item">
            <div className="home-steps__number">{String(index + 1).padStart(2, "0")}</div>
            <h3 className="home-steps__title">{step.title}</h3>
            <p className="home-steps__body">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}