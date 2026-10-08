// Faq home section: the four mockup questions via the shared MDX
// Accordion component (the component, not MDX-registered here — direct
// import). Answers verbatim from the mockup (DE), co-located translations;
// self-contained.
import { Accordion } from "~/components/mdx";
import type { Locale } from "~/lib/config";

const KICKER: Record<Locale, string> = {
  de: "Häufige Fragen",
  en: "Frequently asked questions",
  fr: "Questions fréquentes",
  it: "Domande frequenti",
  rm: "Dumondas frequentas",
};

const HEADING: Record<Locale, string> = {
  de: "Gut zu wissen",
  en: "Good to know",
  fr: "Bon à savoir",
  it: "Buono a sapersi",
  rm: "Bun da savair",
};

const ITEMS: Record<Locale, { question: string; answer: string }[]> = {
  de: [
    {
      question: "Was ist der nationale KI-Dialog?",
      answer:
        "Ein offener Prozess, in dem Menschen in der ganzen Schweiz einbringen, was sie von künstlicher Intelligenz erwarten. Public AI Switzerland trägt den Dialog in alle Sprachregionen und bringt die Ergebnisse dorthin, wo über KI entschieden wird. Mitmachen kann jede und jeder, auch ohne Mitgliedschaft.",
    },
    {
      question: "Was ist eine Genossenschaft?",
      answer:
        "Ein Unternehmen im Besitz seiner Mitglieder, das demokratisch kontrolliert wird. Public AI Switzerland gehört seiner Mitgliederbasis aus Entwickler:innen, Institutionen und Unterstützer:innen — das bewährte Modell von Migros, Coop, Raiffeisen oder Mobility.",
    },
    {
      question: "Was ist der Unterschied zwischen Anteil und Nutzung?",
      answer: "Der Genossenschaftsanteil (CHF 100) macht dich zum Miteigentümer mit Stimmrecht; er ist kein Abonnement.",
    },
    {
      question: "Erhalte ich meine Anteile beim Austritt zurück?",
      answer:
        "Nein. Gemäss Statuten haben ausgeschiedene Genossenschafter:innen keinen Anspruch auf Rückzahlung ihrer einbezahlten Anteilscheine. Ein Austritt ist mit einer Kündigungsfrist von drei Monaten auf das Ende eines Geschäftsjahres möglich.",
    },
  ],
  en: [
    {
      question: "What is the national AI dialogue?",
      answer:
        "An open process in which people across Switzerland share what they expect from artificial intelligence. Public AI Switzerland carries the dialogue into every language region and brings the results to where decisions on AI are made. Anyone can take part, no membership required.",
    },
    {
      question: "What is a cooperative?",
      answer:
        "A company owned by its members and democratically controlled. Public AI Switzerland belongs to its member base of developers, institutions and supporters, the proven model of Migros, Coop, Raiffeisen or Mobility.",
    },
    {
      question: "What is the difference between a share and usage?",
      answer: "The cooperative share (CHF 100) makes you a co-owner with voting rights; it is not a subscription.",
    },
    {
      question: "Do I get my shares back when I leave?",
      answer:
        "No. Under the articles of association, departing members have no claim to repayment of their paid-in share certificates. Members may leave with three months' notice at the end of a financial year.",
    },
  ],
  fr: [
    {
      question: "Qu'est-ce que le dialogue national sur l'IA ?",
      answer:
        "Un processus ouvert dans lequel des personnes de toute la Suisse expriment ce qu'elles attendent de l'intelligence artificielle. Public AI Switzerland porte le dialogue dans toutes les régions linguistiques et transmet les résultats là où se prennent les décisions sur l'IA. Tout le monde peut participer, même sans être membre.",
    },
    {
      question: "Qu'est-ce qu'une coopérative ?",
      answer:
        "Une entreprise détenue par ses membres et contrôlée démocratiquement. Public AI Switzerland appartient à sa base de membres composée de développeur·euses, d'institutions et de soutiens, le modèle éprouvé de Migros, Coop, Raiffeisen ou Mobility.",
    },
    {
      question: "Quelle est la différence entre une part et l'utilisation ?",
      answer: "La part coopérative (CHF 100) fait de vous une copropriétaire ou un copropriétaire avec droit de vote ; ce n'est pas un abonnement.",
    },
    {
      question: "Mes parts me sont-elles remboursées si je quitte la coopérative ?",
      answer:
        "Non. Selon les statuts, les coopérateur·rices sortant·es n'ont aucun droit au remboursement de leurs parts sociales libérées. La sortie est possible pour la fin d'un exercice, moyennant un préavis de trois mois.",
    },
  ],
  it: [
    {
      question: "Che cos'è il dialogo nazionale sull'IA?",
      answer:
        "Un processo aperto in cui persone di tutta la Svizzera esprimono che cosa si aspettano dall'intelligenza artificiale. Public AI Switzerland porta il dialogo in tutte le regioni linguistiche e trasmette i risultati dove si decide sull'IA. Tutti possono partecipare, anche senza essere soci.",
    },
    {
      question: "Che cos'è una cooperativa?",
      answer:
        "Un'impresa di proprietà dei suoi soci e controllata democraticamente. Public AI Switzerland appartiene alla sua base di soci fatta di sviluppatori, istituzioni e sostenitori, il modello collaudato di Migros, Coop, Raiffeisen o Mobility.",
    },
    {
      question: "Qual è la differenza tra quota e utilizzo?",
      answer: "La quota cooperativa (CHF 100) ti rende comproprietario con diritto di voto; non è un abbonamento.",
    },
    {
      question: "Le mie quote mi vengono rimborsate se esco?",
      answer:
        "No. Secondo lo statuto, i soci uscenti non hanno diritto al rimborso delle quote sociali versate. L'uscita è possibile per la fine di un esercizio, con un preavviso di tre mesi.",
    },
  ],
  rm: [
    {
      question: "Tge è il dialog naziunal davart l'IA?",
      answer:
        "In process avert, en il qual persunas da tut la Svizra expriman tge ch'ellas spetgan da l'intelligenza artifiziala. Public AI Switzerland porta il dialog en tut las regiuns linguisticas e transmetta ils resultats là, nua ch'i vegn decidì davart l'IA. Tuts pon participar, er senza commembranza.",
    },
    {
      question: "Tge è ina cooperativa?",
      answer:
        "In'interpresa en possess da ses commembers, controllada democraticamain. Public AI Switzerland appartegna a sia basa da commembers da svilupaders, instituziuns e sustegnaders, il model cumprovà da Migros, Coop, Raiffeisen u Mobility.",
    },
    {
      question: "Tge è la differenza tranter quota ed utilisaziun?",
      answer: "La part cooperativa (CHF 100) fa da tai in coproprietari cun dretg da votar; ella n'è betg in abunament.",
    },
    {
      question: "Survegn jau enavos mias parts, sch'jau sort?",
      answer:
        "Na. Tenor ils statuts n'han cooperaturas e cooperaturs che sortan nagin dretg sin il rembursament da lur certificats da part pajads. La sortida è pussaivla sin la fin d'in onn da gestiun, cun in termin da disditga da trais mais.",
    },
  ],
};

export default function Faq({ locale }: { locale: Locale }) {
  return (
    <section className="home-section home-faq">
      <div className="home-panel home-panel--tinted">
        <p className="block-heading">{KICKER[locale].trimStart()}</p>
        <h2 className="home-section-heading">{HEADING[locale]}</h2>
        <Accordion items={ITEMS[locale]} />
      </div>
    </section>
  );
}
