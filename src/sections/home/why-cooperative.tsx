// WhyCooperative home section: "Warum eine Genossenschaft" mission
// teaser — two paragraphs from the mockup plus a CTA to the mission page.
// Copy verbatim (DE), co-located translations; self-contained.
import type { Locale } from "~/lib/config";
import { localeHref } from "~/lib/locale";

const KICKER: Record<Locale, string> = {
  de: "Das Modell",
  en: "The model",
  fr: "Le modèle",
  it: "Il modello",
  rm: "Il model",
};

const HEADING: Record<Locale, string> = {
  de: "Warum eine Genossenschaft",
  en: "Why a cooperative",
  fr: "Pourquoi une coopérative",
  it: "Perché una cooperativa",
  rm: "Pertge ina cooperativa",
};

const P1: Record<Locale, string> = {
  de: "Unser Ziel ist einfach: KI, die den Bürger:innen gehört und die unsere Kultur in den Trainingsdaten enthält und unsere Landessprachen versteht. Dafür braucht es eine Form, die Besitz und Mitsprache dauerhaft in die Hände der Nutzenden legt.",
  en: "Our goal is simple: AI that belongs to its citizens, that carries our culture in its training data and understands our national languages. That requires a structure that puts ownership and a say permanently in the hands of the people who use it.",
  fr: "Notre objectif est simple : une IA qui appartient à ses citoyen·nes, qui porte notre culture dans ses données d'entraînement et comprend nos langues nationales. Cela requiert une forme qui place durablement la propriété et la participation entre les mains des utilisateur·rices.",
  it: "Il nostro obiettivo è semplice: un'IA che appartiene ai cittadini, che porta la nostra cultura nei dati di addestramento e comprende le nostre lingue nazionali. Serve una forma che metta stabilmente proprietà e partecipazione nelle mani di chi la usa.",
  rm: "Nossa finamira è simpla: in'IA che appartegna als burgais, che cuntegna nossa cultura en las datas d'instrucziun e che chapescha nossas linguas naziunalas. Per quai dovri ina furma che metta permanentamain proprietad e cumdecisiun en las mauns dals utilisaders.",
};

const P2: Record<Locale, string> = {
  de: "Die Genossenschaft ist genau das: eine Person, eine Stimme, Überschüsse zurück an die Gemeinschaft. Die Schweiz vertraut diesem Modell seit über hundert Jahren, bei jedem grossen Wandel.",
  en: "The cooperative is exactly that: one person, one vote, surpluses back to the community. Switzerland has trusted this model for over a hundred years, through every major change.",
  fr: "La coopérative, c'est exactement cela : une personne, une voix, les excédents rendus à la communauté. La Suisse fait confiance à ce modèle depuis plus de cent ans, à chaque grand tournant.",
  it: "La cooperativa è proprio questo: una persona, un voto, le eccedenze restituite alla comunità. La Svizzera si fida di questo modello da oltre cento anni, a ogni grande cambiamento.",
  rm: "La cooperativa è exactamain quai: ina persuna, ina vusch, ils surplis enavos a la communitad. La Svizra sa fida dad quest model dapi passa tschient onns, tar mintga grond midament.",
};

const CTA: Record<Locale, string> = {
  de: "Mehr zur Mission",
  en: "More about our mission",
  fr: "En savoir plus sur la mission",
  it: "Di più sulla missione",
  rm: "Dapli davart la missiun",
};

export default function WhyCooperative({ locale }: { locale: Locale }) {
  return (
    <section className="home-section home-why">
      <div className="home-panel home-panel--outline card">
        <p className="block-heading">{KICKER[locale]}</p>
        <h2 className="home-section-heading">{HEADING[locale]}</h2>
        <p className="home-why__lead">{P1[locale]}</p>
        <p className="home-why__body">{P2[locale]}</p>
        <a className="pill pill--outline" href={localeHref("/mission", locale)}>
          {CTA[locale]} →
        </a>
      </div>
    </section>
  );
}