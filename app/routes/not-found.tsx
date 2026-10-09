// Localized not-found page with site chrome and a link to the locale home.
// The build also emits a noindex 404.html for static hosting.
import { useLocation } from "react-router";
import type { MetaFunction } from "react-router";
import { chromeStrings } from "~/lib/chrome-strings";
import { localeFromPath, localeHref } from "~/lib/locale";
import type { Locale } from "~/lib/config";

// Meta for the client-rendered 404: locale title (a11y — axe document-title).
export const meta: MetaFunction = ({ location }) => {
  const locale: Locale = localeFromPath(location.pathname);
  return [
    { title: `${chromeStrings.notFound.title[locale]} — Public AI Switzerland` },
    { name: "robots", content: "noindex" },
  ];
};

export default function NotFound() {
  const location = useLocation();
  const locale: Locale = localeFromPath(location.pathname);
  const copy = chromeStrings.notFound;

  return (
    <div className="page-column page-section">
      <p className="block-heading">{copy.kicker[locale]}</p>
      <h1 className="page-heading">{copy.title[locale]}</h1>
      <p className="mt-4 text-muted-foreground">{copy.body[locale]}</p>
      <div className="mt-6">
        <a href={localeHref(location.pathname, locale)} className="pill pill--primary">
          {copy.home[locale]}
        </a>
      </div>
    </div>
  );
}