// ApertusSection home section: the slim "Apertus im Chat und per API"
// card with the two external link buttons (chat + API docs). Copy verbatim
// (DE), co-located translations; external links carry noopener noreferrer
//. Self-contained.
import type { Locale } from "~/lib/config";

const KICKER: Record<Locale, string> = {
  de: "Apertus",
  en: "Apertus",
  fr: "Apertus",
  it: "Apertus",
  rm: "Apertus",
};

const HEADING: Record<Locale, string> = {
  de: "Apertus im Chat und per API",
  en: "Apertus in chat and via API",
  fr: "Apertus en chat et via API",
  it: "Apertus in chat e via API",
  rm: "Apertus en il chat e via API",
};

const LEAD: Record<Locale, string> = {
  de: "Wir betreiben Apertus, das offene Sprachmodell aus der Schweizer Forschung, in der Schweiz. Den Chat nutzt du kostenlos.",
  en: "We run Apertus, the open language model from Swiss research, in Switzerland. The chat is free to use.",
  fr: "Nous exploitons en Suisse Apertus, le modèle de langage ouvert issu de la recherche suisse. Le chat est gratuit.",
  it: "Gestiamo in Svizzera Apertus, il modello linguistico aperto nato dalla ricerca svizzera. La chat è gratuita.",
  rm: "Nus manain en Svizra Apertus, il model linguistic avert da la perscrutaziun svizra. Il chat è gratuit.",
};

const CHAT: Record<Locale, string> = {
  de: "Chat öffnen",
  en: "Open chat",
  fr: "Ouvrir le chat",
  it: "Apri la chat",
  rm: "Avrir il chat",
};

const DOCS: Record<Locale, string> = {
  de: "Zur Dokumentation",
  en: "Read the docs",
  fr: "Voir la documentation",
  it: "Alla documentazione",
  rm: "Tar la documentaziun",
};

export default function ApertusSection({ locale }: { locale: Locale }) {
  return (
    <section className="home-section">
      <div className="home-apertus card">
        <div>
          <p className="block-heading">{KICKER[locale]}</p>
          <h2 className="home-section-heading">{HEADING[locale]}</h2>
          <p className="home-apertus__lead">{LEAD[locale]}</p>
        </div>
        <div className="home-apertus__actions">
          <a className="pill pill--primary" href="https://chat.publicai.co/" target="_blank" rel="noopener noreferrer">
            {CHAT[locale]} →
          </a>
          <a className="pill pill--outline" href="https://platform.publicai.co/docs" target="_blank" rel="noopener noreferrer">
            {DOCS[locale]} →
          </a>
        </div>
      </div>
    </section>
  );
}