// Newsletter placeholder. Keep the section position and localized copy until
// a signup provider is configured; there is intentionally no collection UI.
import type { Locale } from "~/lib/config";

const KICKER: Record<Locale, string> = {
  de: "Newsletter",
  en: "Newsletter",
  fr: "Newsletter",
  it: "Newsletter",
  rm: "Newsletter",
};

const HEADING: Record<Locale, string> = {
  de: "Newsletter kommt bald",
  en: "Newsletter coming soon",
  fr: "Newsletter bientôt disponible",
  it: "Newsletter in arrivo",
  rm: "Newsletter vegn prest",
};

const LEAD: Record<Locale, string> = {
  de: "Wir informieren hier, sobald die Anmeldung verfügbar ist.",
  en: "We’ll share details here when sign-up is ready.",
  fr: "Nous publierons les informations ici dès que l'inscription sera prête.",
  it: "Pubblicheremo qui le informazioni non appena sarà possibile iscriversi.",
  rm: "Nus publitgain qua ils detagls cura che l'annunzia è pronta.",
};

export default function Newsletter({ locale }: { locale: Locale }) {
  return (
    <section className="home-section">
      <div className="home-newsletter card">
        <div>
          <p className="block-heading">{KICKER[locale]}</p>
          <h2 className="home-section-heading">{HEADING[locale]}</h2>
          <p className="home-newsletter__lead">{LEAD[locale]}</p>
        </div>
      </div>
    </section>
  );
}
