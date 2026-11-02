// Hero home section: kicker, H1, lead lines and the two primary
// CTAs — copy verbatim from the mockup hero (DE) with per-locale
// translations co-located. Fully self-contained: removing the file +
// its import + JSX line in HomePage removes the section.
import type { Locale } from "~/lib/config";
import { localeHref } from "~/lib/locale";

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
  de: "Public AI Switzerland ist eine Genossenschaft. Wir tragen den nationalen Dialog über künstliche Intelligenz in alle Landesteile und setzen uns für eine Welt ein, in der künstliche Intelligenz den Menschen gehört, deren Wissen sie möglich gemacht hat, und in ihrem Sinne handelt.",
  en: "Public AI Switzerland is a cooperative. We carry the national dialogue on artificial intelligence into every part of the country, and we envision a world in which artificial intelligence belongs to and is aligned with the people whose knowledge made it possible.",
  fr: "Public AI Switzerland est une coopérative. Nous portons le dialogue national sur l'intelligence artificielle dans toutes les régions du pays et nous imaginons un monde où l'intelligence artificielle appartient aux personnes dont le savoir l'a rendue possible, et sert leurs intérêts.",
  it: "Public AI Switzerland è una cooperativa. Portiamo il dialogo nazionale sull'intelligenza artificiale in tutte le regioni del Paese e immaginiamo un mondo in cui l'intelligenza artificiale appartiene alle persone il cui sapere l'ha resa possibile, ed è al loro servizio.",
  rm: "Public AI Switzerland è ina cooperativa. Nus purtain il dialog naziunal davart l'intelligenza artifiziala en tut las regiuns dal pajais e mirain sin in mund, en il qual l'intelligenza artifiziala appartegna a las persunas che han rendì ella pussaivla cun lur savida, e serva a lur interess.",
};

const CTA_DIALOG: Record<Locale, string> = {
  de: "Am KI-Dialog teilnehmen",
  en: "Join the AI dialogue",
  fr: "Participer au dialogue sur l'IA",
  it: "Partecipa al dialogo sull'IA",
  rm: "Participar al dialog davart l'IA",
};

const CTA_MEMBER: Record<Locale, string> = {
  de: "Mitglied werden",
  en: "Become a member",
  fr: "Devenir membre",
  it: "Diventa socio",
  rm: "Daventar commember",
};

export default function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="home-hero">
      <div className="home-hero__text">
        <p className="block-heading">{KICKER[locale]}</p>
        <h1 className="page-heading">{HEADING[locale]}</h1>
        <p className="home-hero__lead">{LEAD[locale]}</p>
        <div className="home-hero__actions">
          <a className="pill pill--primary" href={localeHref("/members", locale)}>
            {CTA_MEMBER[locale]} →
          </a>
          <a className="pill pill--outline" href="https://dialogue.publicai.ch" target="_blank" rel="noopener noreferrer">
            {CTA_DIALOG[locale]} →
          </a>
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
