// ShareOffer home section: price and benefits with a disabled availability
// placeholder until the share purchase flow is ready.
import type { Locale } from "~/lib/config";

const KICKER: Record<Locale, string> = {
  de: "Mitbesitzen",
  en: "Co-ownership",
  fr: "Copropriété",
  it: "Comproprietà",
  rm: "Cumproprietad",
};

const HEADING: Record<Locale, string> = {
  de: "Anteil zeichnen",
  en: "Buy a share",
  fr: "Souscrire une part",
  it: "Sottoscrivi una quota",
  rm: "Suttascriver ina quota",
};

const LEAD: Record<Locale, string> = {
  de: "Wer beitritt, übernimmt mindestens zwei Anteilscheine à CHF 50.–, zusammen CHF 100.–, und wird damit Mitbesitzer:in der Genossenschaft. Der Anteil ist kein Abo, sondern Mitbesitz auf Dauer.",
  en: "Joining means taking at least two shares of CHF 50.– each, CHF 100.– in total, and becoming a co-owner of the cooperative. A share is not a subscription, it is lasting co-ownership.",
  fr: "Qui adhère souscrit au moins deux parts de CHF 50.– chacune, soit CHF 100.– au total, et devient copropriétaire de la coopérative. Une part n'est pas un abonnement, mais une copropriété durable.",
  it: "Chi aderisce sottoscrive almeno due quote da CHF 50.– ciascuna, CHF 100.– in totale, e diventa comproprietario della cooperativa. La quota non è un abbonamento, ma comproprietà duratura.",
  rm: "Tgi che aderescha suttascriva almain duas quotas da CHF 50.– mintgina, ensemen CHF 100.–, e daventa cumproprietari da la cooperativa. La quota n'è betg in abunament, mabain cumproprietad permanenta.",
};



const PRICE: Record<Locale, string> = {
  de: "CHF 100.–",
  en: "CHF 100.–",
  fr: "CHF 100.–",
  it: "CHF 100.–",
  rm: "CHF 100.–",
};

const PRICE_NOTE: Record<Locale, string> = {
  de: "2 Anteilscheine à CHF 50.– für Privatpersonen, einmalig",
  en: "2 shares of CHF 50.– for individuals, one-time",
  fr: "2 parts de CHF 50.– pour les particuliers, une seule fois",
  it: "2 quote da CHF 50.– per i privati, una tantum",
  rm: "2 quotas da CHF 50.– per persunas privatas, ina giada",
};

const CTA: Record<Locale, string> = {
  de: "Bald verfügbar",
  en: "Available soon",
  fr: "Bientôt disponible",
  it: "Disponibile a breve",
  rm: "Prest disponibel",
};

const TWINT_NOTE: Record<Locale, string> = {
  de: "Die Zeichnung wird hier freigeschaltet, sobald sie bereit ist.",
  en: "Share sign-up will be available here when it is ready.",
  fr: "La souscription sera disponible ici lorsqu'elle sera prête.",
  it: "La sottoscrizione sarà disponibile qui quando sarà pronta.",
  rm: "La suttascripziun è disponibla qua cura ch'ella è pronta.",
};

const BENEFITS_FULL: Record<Locale, { strong?: string; strongAfter?: string; body: string }[]> = {
  de: [
    { strong: "Mitbestimmung", body: ", eine Person, eine Stimme" },
    { body: "Überschüsse werden ", strong: "reinvestiert", strongAfter: ", nicht ausgeschüttet" },
    { body: "Mitgliedschaftszertifikat" },
  ],
  en: [
    { strong: "Co-determination", body: ", one person, one vote" },
    { body: "Surpluses are ", strong: "reinvested", strongAfter: ", not paid out" },
    { body: "Membership certificate" },
  ],
  fr: [
    { strong: "Codécision", body: ", une personne, une voix" },
    { body: "Les excédents sont ", strong: "réinvestis", strongAfter: ", non distribués" },
    { body: "Certificat de membre" },
  ],
  it: [
    { strong: "Codecisione", body: ", una persona, un voto" },
    { body: "Le eccedenze vengono ", strong: "reinvestite", strongAfter: ", non distribuite" },
    { body: "Certificato di socio" },
  ],
  rm: [
    { strong: "Cumdecisiun", body: ", ina persuna, ina vusch" },
    { body: "Ils surplis vegnan ", strong: "reinvestids", strongAfter: ", betg distribuids" },
    { body: "Certificat da commember" },
  ],
};

export default function ShareOffer({ locale }: { locale: Locale }) {
  return (
    <section className="home-section">
      <div className="home-offer">
        <div className="home-offer__copy">
          <p className="block-heading">{KICKER[locale]}</p>
          <h2 className="home-section-heading">{HEADING[locale]}</h2>
          <p className="home-offer__lead">{LEAD[locale]}</p>
          <ul className="home-offer__benefits">
            {BENEFITS_FULL[locale].map((benefit) => (
              <li key={benefit.body}>
                <span aria-hidden="true">✓</span>
                <span>
                  {benefit.body && benefit.strong && benefit.body.endsWith(" ") ? (
                    <>
                      {benefit.body}
                      <strong>{benefit.strong}</strong>
                      {benefit.strongAfter}
                    </>
                  ) : benefit.strong && benefit.body.startsWith(",") ? (
                    <>
                      <strong>{benefit.strong}</strong>
                      {benefit.body}
                    </>
                  ) : (
                    benefit.body
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="home-offer__card card">
          <div className="home-offer__price">{PRICE[locale]}</div>
          <p className="home-offer__price-note">{PRICE_NOTE[locale]}</p>
          <span className="pill pill--primary" aria-disabled="true">{CTA[locale]}</span>
          <p className="home-offer__twint">{TWINT_NOTE[locale]}</p>
        </div>
      </div>
    </section>
  );
}