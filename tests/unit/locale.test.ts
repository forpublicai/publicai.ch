// Unit tests for the locale helpers (src/lib/locale.ts). Regression suite
// for the 2026-09-30 slash-stacking bug: localeHref used to double the
// leading slash (/it/mission/ → //mission/ in EN), which broke EN switching
// and compounded on every 404-page navigation up to /it//////mission/.
import { describe, expect, it } from "vitest";
import { localeFromPath, localeHref } from "~/lib/locale";

describe("localeFromPath", () => {
  it("parses locale prefixes; root paths are EN", () => {
    expect(localeFromPath("/de/mission/")).toBe("de");
    expect(localeFromPath("/fr/")).toBe("fr");
    expect(localeFromPath("/")).toBe("en");
    expect(localeFromPath("/mission/")).toBe("en");
    expect(localeFromPath("/it//////mission/")).toBe("it");
  });
});

describe("localeHref (same-path switching)", () => {
  it("switches between locales keeping the same path", () => {
    expect(localeHref("/it/mission/", "en")).toBe("/mission/");
    expect(localeHref("/it/mission/", "de")).toBe("/de/mission/");
    expect(localeHref("/mission/", "it")).toBe("/it/mission/");
    expect(localeHref("/", "rm")).toBe("/rm/");
    expect(localeHref("/de/", "en")).toBe("/");
  });

  it("never produces doubled or stacked slashes (2026-09-30 regression)", () => {
    // The exact shapes observed in the bug report and its intermediates.
    expect(localeHref("/it//////mission/", "en")).toBe("/mission/");
    expect(localeHref("/it//////mission/", "it")).toBe("/it/mission/");
    expect(localeHref("//mission/", "en")).toBe("/mission/");
    expect(localeHref("/it//mission/", "it")).toBe("/it/mission/");
    // Idempotence: switching to the CURRENT locale must return an
    // equivalent, canonical URL (switcher highlights it as active).
    expect(localeHref(localeHref("/it/mission/", "en"), "en")).toBe("/mission/");
    expect(localeHref(localeHref("/it/mission/", "it"), "it")).toBe("/it/mission/");
  });
});