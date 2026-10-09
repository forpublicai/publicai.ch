// Home page: the ONLY hand-coded page, composed of independent
// sections in src/sections/home/ — mockup order: Hero → NationalDialog →
// ShareOffer → WhyCooperative → NewsTeaser → ApertusSection → Faq.
// Newsletter section removed until sign-up exists. Removing a section =
// removing its import + JSX line; nothing else changes.
// Locale derives from the URL.
import { useLocation } from "react-router";
import type { MetaFunction } from "react-router";
import { localeFromPath } from "~/lib/locale";
import Hero from "~/sections/home/hero";
import NationalDialog from "~/sections/home/national-dialog";
import ShareOffer from "~/sections/home/share-offer";
import WhyCooperative from "~/sections/home/why-cooperative";
import NewsTeaser from "~/sections/home/news-teaser";
import ApertusSection from "~/sections/home/apertus-section";
import Faq from "~/sections/home/faq";

export const meta: MetaFunction = () => [
  { title: "Public AI Switzerland" },
];

export default function Home() {
  const locale = localeFromPath(useLocation().pathname);
  return (
    <>
      <Hero locale={locale} />
      <NationalDialog locale={locale} />
      <ShareOffer locale={locale} />
      <WhyCooperative locale={locale} />
      <NewsTeaser locale={locale} />
      <ApertusSection locale={locale} />
      <Faq locale={locale} />
    </>
  );
}