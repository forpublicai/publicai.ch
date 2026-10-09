// Language switcher ROW (header utility row): one small pill per locale,
// active state highlighted. Navigates programmatically to the same
// page path in that locale. Styled as mockup's small pill set.
// Order: switcher order de/fr/it/rm, then EN LAST (user decision 2026-09-29:
// political framing — national languages first, English as the fallback).
import { useLocation, useNavigate } from "react-router";
import { LOCALES, type Locale } from "~/lib/config";
import { localeHref } from "~/lib/locale";
import { chromeStrings } from "~/lib/chrome-strings";

const SHORT: Record<Locale, string> = { en: "EN", de: "DE", fr: "FR", it: "IT", rm: "RM" };

export function LanguageSwitcherRow({
  locales,
  current,
}: {
  locales: readonly string[];
  current: Locale;
}) {
  const national = LOCALES.filter((l) => l !== "en" && locales.includes(l));
  const ordered = locales.includes("en") ? [...national, "en" as Locale] : national;
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav aria-label={chromeStrings.nav.languages[current]} className="lang-switcher-row">
      <ul>
        {ordered.map((locale) => (
          <li key={locale}>
            <button
              type="button"
              className={locale === current ? "pill-locale pill-locale--active" : "pill-locale"}
              aria-current={locale === current ? "true" : undefined}
              onClick={() => void navigate(localeHref(location.pathname, locale))}
              lang={locale}
            >
              {SHORT[locale]}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}