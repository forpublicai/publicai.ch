// Home newsletter section: intro copy + the shared Infomaniak sign-up form.
import type { Locale } from "~/lib/config";
import { NEWSLETTER_STRINGS, NewsletterForm } from "~/components/newsletter-form";

export default function Newsletter({ locale }: { locale: Locale }) {
  const t = NEWSLETTER_STRINGS[locale];
  return (
    <section className="home-section">
      <div className="home-panel home-panel--tinted home-newsletter">
        <div className="home-newsletter__intro">
          <p className="block-heading">{t.kicker}</p>
          <h2 className="home-section-heading">{t.heading}</h2>
          <p className="home-newsletter__lead">{t.lead}</p>
        </div>
        <NewsletterForm locale={locale} />
      </div>
    </section>
  );
}
