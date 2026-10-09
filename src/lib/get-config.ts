// Load and validate config.json once, with readable errors naming invalid paths.
import { ConfigSchema, type Config } from "~/lib/config";
import rawConfig from "../../config.json";

let cachedConfig: Config | null = null;

export function getConfig(): Config {
  if (cachedConfig) return cachedConfig;
  const result = ConfigSchema.safeParse(rawConfig);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`config.json is invalid. Fix the following and try again:\n${issues}`);
  }
  cachedConfig = result.data;
  return cachedConfig;
}

// Resolve a menu item's target URL for a locale (used by Header/Footer).
// External URLs are returned as-is; page slugs resolve to the locale-prefixed
// route (EN at root, others `/<locale>/<page>/`). The
// locale must be supplied by the caller so navigation never drops the
// visitor's language (user report 2026-09-30). Full route-manifest resolution
// Unknown-slug validation runs during the production build.
import type { Locale } from "~/lib/config";

export function menuItemTarget(item: { page?: string; url?: string }, locale?: Locale): string {
  if (item.url !== undefined) return item.url;
  if (item.page !== undefined) {
    return locale && locale !== "en" ? `/${locale}/${item.page}/` : `/${item.page}/`;
  }
  throw new Error("MenuItem has neither page nor url target");
}
