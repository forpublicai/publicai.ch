// ApertusSection home section: the slim "An open language model from Switzerland"
// card with the two external link buttons (demo chat + learn more). Copy
// verbatim (EN), co-located translations; external links carry
// noopener noreferrer. Self-contained.
import type { Locale } from "~/lib/config";

const KICKER: Record<Locale, string> = {
  de: "Apertus",
  en: "Apertus",
  fr: "Apertus",
  it: "Apertus",
  rm: "Apertus",
};

const HEADING: Record<Locale, string> = {
  de: "Ein offenes Sprachmodell aus der Schweiz",
  en: "An open language model from Switzerland",
  fr: "Un modèle de langage ouvert issu de Suisse",
  it: "Un modello linguistico aperto dalla Svizzera",
  rm: "In model linguistic avert da la Svizra",
};

const LEAD: Record<Locale, string> = {
  de: "Wir haben im September 2025 zum Start des Apertus-Projekts beigetragen und schnell eine Community von Early Adoptern dieses Modells aufgebaut. Wir setzen uns dafür ein, dass unsere Mitglieder die Möglichkeit haben, an der weiteren Entwicklung mitzuwirken. Probiere den Chat und die Tools unseres internationalen Netzwerks aus und besuche die offizielle Apertus-Website für weitere Informationen.",
  en: "We helped to launch the Apertus project in September 2025, quickly building a community of early adopters of this model. We are committed to giving our members the opportunity to take part in its further development. Please try the chat and tools hosted by our international network, and visit the official Apertus home page for more information.",
  fr: "Nous avons contribué au lancement du projet Apertus en septembre 2025, en construisant rapidement une communauté d'early adopters de ce modèle. Nous nous engageons à offrir à nos membres la possibilité de participer à son développement. Essayez le chat et les outils hébergés par notre réseau international, et consultez la page officielle d'Apertus pour plus d'informations.",
  it: "Abbiamo contribuito al lancio del progetto Apertus nel settembre 2025, costruendo rapidamente una comunità di early adopter di questo modello. Ci impegniamo a offrire ai nostri membri la possibilità di partecipare al suo ulteriore sviluppo. Prova la chat e gli strumenti ospitati dalla nostra rete internazionale, e visita la pagina ufficiale di Apertus per maggiori informazioni.",
  rm: "Nus avain gidà a lanciar il project Apertus il settember 2025, furmond spert ina communitad d'early adopters da quest model. Nus essan impegnads a garantir che noss commembers hajan la chaschun da participar al svilup ulteriur. Prova il chat e ils utensils dal noss ret internaziunal, e visita la pagina uffiziala d'Apertus per ulteriuras infuormaziuns.",
};

const CHAT: Record<Locale, string> = {
  de: "Demo-Chat",
  en: "Demo chat",
  fr: "Chat de démonstration",
  it: "Chat demo",
  rm: "Chat da demo",
};

const DOCS: Record<Locale, string> = {
  de: "Mehr erfahren",
  en: "Learn more",
  fr: "En savoir plus",
  it: "Scopri di più",
  rm: "Dapli infuormaziuns",
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
          <a className="pill pill--primary" href="https://ask.publicai.ch/" target="_blank" rel="noopener noreferrer">
            {CHAT[locale]} →
          </a>
          <a className="pill pill--outline" href="https://apertus-ai.org/" target="_blank" rel="noopener noreferrer">
            {DOCS[locale]} →
          </a>
        </div>
      </div>
    </section>
  );
}
