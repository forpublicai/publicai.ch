// ApertusSection home section: the slim "Universal basic access to AI"
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
  de: "Universeller Grundzugang zu KI",
  en: "Universal basic access to AI",
  fr: "Un accès universel de base à l'IA",
  it: "Un accesso universale di base all'IA",
  rm: "Access universel e basic a l'IA",
};

const LEAD: Record<Locale, string> = {
  de: "Wir haben im September 2025 massgeblich zum Start des Apertus-Projekts beigetragen und schnell eine grosse Community von Early Adoptern dieses bahnbrechenden Modells aufgebaut. Wir setzen uns dafür ein, dass unsere Mitglieder bevorzugte Bedingungen und die Möglichkeit haben, an der weiteren Entwicklung mitzuwirken. Probiere den Chat und die Tools unseres internationalen Netzwerks aus und besuche die offizielle Apertus-Website für weitere Informationen.",
  en: "We helped to launch the Apertus project in September 2025, quickly building a large community of early adopters of this groundbreaking model. We are committed to ensuring our members have preferential conditions, and opportunities to participate in further development. Please try the chat and tools hosted by our international network, and visit the official Apertus home page for more information.",
  fr: "Nous avons contribué au lancement du projet Apertus en septembre 2025, en construisant rapidement une vaste communauté d'early adopters de ce modèle révolutionnaire. Nous nous engageons à garantir à nos membres des conditions préférentielles et la possibilité de participer au développement ultérieur. Essayez le chat et les outils hébergés par notre réseau international, et consultez la page officielle d'Apertus pour plus d'informations.",
  it: "Abbiamo contribuito al lancio del progetto Apertus nel settembre 2025, costruendo rapidamente una vasta comunità di early adopter di questo modello rivoluzionario. Ci impegniamo a garantire ai nostri membri condizioni preferenziali e la possibilità di partecipare all'ulteriore sviluppo. Prova la chat e gli strumenti ospitati dalla nostra rete internazionale, e visita la pagina ufficiale di Apertus per maggiori informazioni.",
  rm: "Nus avain gidà a lanciar il project Apertus il settember 2025, furmond spert ina gronda communitad d'early adopters da quest model revoluziunari. Nus essan impegnads a garantir che noss commembers godian condiziuns preferenzialas e chancas da participar al svilup ulteriur. Prova il chat e ils utensils dal noss ret internaziunal, e visita la pagina uffiziala d'Apertus per ulteriuras infuormaziuns.",
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
          <a className="pill pill--primary" href="https://publicai.co/" target="_blank" rel="noopener noreferrer">
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
