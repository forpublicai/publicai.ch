// Hero home section: kicker, H1, lead lines and the two primary
// CTAs — copy verbatim from the mockup hero (DE) with per-locale
// translations co-located. Fully self-contained: removing the file +
// its import + JSX line in HomePage removes the section.
import type { Locale } from "~/lib/config";

const KICKER: Record<Locale, string> = {
  de: "Die weltweit erste Genossenschaft für KI",
  en: "The world's first cooperative for AI",
  fr: "La première coopérative d'IA au monde",
  it: "La prima cooperativa al mondo per l'IA",
  rm: "L'emprima cooperativa dal mund per l'IA",
};

const HEADING: Record<Locale, string> = {
  de: "Die Schweiz redet mit, wenn es um KI geht",
  en: "Switzerland has a say when it comes to AI",
  fr: "La Suisse a son mot à dire sur l'IA",
  it: "La Svizzera dice la sua sull'IA",
  rm: "La Svizra discurra cun davart l'IA",
};

const LEAD: Record<Locale, string> = {
  de: "Public AI Switzerland ist eine Genossenschaft. Wir tragen den nationalen Dialog über künstliche Intelligenz in alle Landesteile und sorgen dafür, dass KI in der Schweiz den Menschen gehört, die sie nutzen.",
  en: "Public AI Switzerland is a cooperative. We carry the national dialogue on artificial intelligence into every part of the country and make sure that AI in Switzerland belongs to the people who use it.",
  fr: "Public AI Switzerland est une coopérative. Nous portons le dialogue national sur l'intelligence artificielle dans toutes les régions du pays et veillons à ce que l'IA en Suisse appartienne aux personnes qui l'utilisent.",
  it: "Public AI Switzerland è una cooperativa. Portiamo il dialogo nazionale sull'intelligenza artificiale in tutte le regioni del Paese e facciamo in modo che l'IA in Svizzera appartenga alle persone che la usano.",
  rm: "Public AI Switzerland è ina cooperativa. Nus purtain il dialog naziunal davart l'intelligenza artifiziala en tut las regiuns dal pajais e procurain che l'IA en Svizra appartegnia a las persunas che la dovran.",
};

const CTA_DIALOG: Record<Locale, string> = {
  de: "Am KI-Dialog teilnehmen",
  en: "Join the AI dialogue",
  fr: "Participer au dialogue sur l'IA",
  it: "Partecipa al dialogo sull'IA",
  rm: "Participar al dialog davart l'IA",
};

const CTA_SHARE: Record<Locale, string> = {
  de: "Community-Bereich folgt bald",
  en: "Community area coming soon",
  fr: "Espace communautaire bientôt disponible",
  it: "Area community in arrivo",
  rm: "Secziun da la communitad vegn prest",
};

export default function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="home-hero">
      <div className="home-hero__text">
        <p className="block-heading">{KICKER[locale]}</p>
        <h1 className="page-heading">{HEADING[locale]}</h1>
        <p className="home-hero__lead">{LEAD[locale]}</p>
        <div className="home-hero__actions">
          <a className="pill pill--primary" href="https://dialogue.publicai.ch" target="_blank" rel="noopener noreferrer">
            {CTA_DIALOG[locale]} →
          </a>
          <span className="pill pill--outline" aria-disabled="true">
            {CTA_SHARE[locale]}
          </span>
        </div>
      </div>
      <img
        src="/assets/images/hero.jpg"
        alt={KICKER[locale]}
        className="home-hero__image"
        loading="eager"
      />
    </section>
  );
}
