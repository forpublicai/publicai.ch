// Locale helpers shared across chrome components: parse the locale from a
// URL path, build same-path locale URLs , and pick a LocalizedString
// entry for a locale. No runtime dependencies (SSR/prerender-safe).
import type { Locale } from "~/lib/config";

// Parse the locale from a URL path: /de/... → de; root paths → en.
export function localeFromPath(pathname: string): Locale {
  const m = pathname.match(/^\/(de|fr|it|rm)(?=\/|$)/);
  return (m?.[1] as Locale) ?? "en";
}

// Same-path locale URL: strip any existing locale prefix, then prepend the
// target locale (root for EN, `/<locale>/` for others). Guarantees the
// switcher keeps the visitor on the same page.
//
// The path is normalized through its segments (empty segments dropped,
// exactly one slash rejoined), so malformed input — user-typed URLs, or URLs
// mangled before the 2026-09-30 fix compounded slashes on every navigation —
// can never stack: `/it//////mission/` heals to `/mission/` (EN) or
// `/it/mission/` (IT) in one hop.
export function localeHref(pathname: string, locale: Locale): string {
  const stripped = pathname.replace(/^\/(de|fr|it|rm)(?=\/|$)/, "");
  const segments = stripped.split("/").filter(Boolean);
  const tail = segments.length > 0 ? `/${segments.join("/")}/` : "/";
  return locale === "en" ? (segments.length > 0 ? tail : "/") : `/${locale}${tail}`;
}

// Home URL for a locale: root for EN, `/<locale>/` for others. Used by
// brand links — the logo is a fixed "go home" target, NOT same-path (a 404
// page's same-path home would be the unknown URL itself).
export function localeHome(locale: Locale): string {
  return locale === "en" ? "/" : `/${locale}/`;
}

// Internal link target for a slug, preserving the CURRENT page's locale
//: a markdown/CTA link `[Mission](/mission)` inside an IT page
// renders `/it/mission/`. EN bare-root. Unknown slugs are the link
// checker's business , not this function's.
export function localePath(pathname: string, slugPath: string): string {
  const locale = localeFromPath(pathname);
  const clean = slugPath.replace(/^\/+|\/+$/g, "");
  return locale === "en" ? `/${clean}/` : `/${locale}/${clean}/`;
}

// Pick the label entry for a locale, falling back per (requested →
// en → de → first available). Chrome strings are complete in practice, but
// content-driven labels may lag.
export function localizedLabel(
  map: Record<Locale, string>,
  locale: Locale
): string {
  return map[locale] ?? map.en ?? map.de ?? Object.values(map)[0] ?? "";
}