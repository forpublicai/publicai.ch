// Unit tests for the chrome-strings module: every exported
// string collection must carry an entry for EVERY locale in site.locales —
// a gap here means untranslated UI text, so the build must fail.
import { describe, expect, it } from "vitest";
import { chromeStrings, LANGUAGE_NAMES } from "~/lib/chrome-strings";
import { LOCALES } from "~/lib/config";

// Recursively walk a value; every string-record leaf must cover all locales.
function assertFullLocaleCoverage(value: unknown, path: string): void {
  if (typeof value === "string") return; // plain string (non-record) OK
  if (typeof value !== "object" || value === null) {
    throw new Error(`${path}: unexpected non-object leaf`);
  }
  const entries = Object.entries(value as Record<string, unknown>);
  for (const [key, child] of entries) {
    if (typeof child === "string") {
      // A string leaf inside a record whose keys are NOT locales must still
      // have been keyed by locale one level up; enforce here by structure:
      // only locale-keyed records may contain string leaves.
      if (!(LOCALES as readonly string[]).includes(key)) {
        throw new Error(`${path}.${key}: string value under non-locale key`);
      }
    } else if (typeof child === "object" && child !== null) {
      assertFullLocaleCoverage(child, `${path}.${key}`);
    }
  }
  // Records AT the string-record level must have all five locales.
  const keys = entries.map(([k]) => k);
  const allLocalesPresent = LOCALES.every((l) => keys.includes(l));
  const isLocaleRecord = keys.some((k) => (LOCALES as readonly string[]).includes(k));
  if (isLocaleRecord && !allLocalesPresent) {
    throw new Error(`${path}: missing locale keys (has: ${keys.join(", ")})`);
  }
}

describe("chrome-strings coverage (§ 8.4)", () => {
  it("chromeStrings covers every locale for every string", () => {
    expect(() => assertFullLocaleCoverage(chromeStrings, "chromeStrings")).not.toThrow();
  });

  it("LANGUAGE_NAMES covers every locale for every string", () => {
    expect(() => assertFullLocaleCoverage(LANGUAGE_NAMES, "LANGUAGE_NAMES")).not.toThrow();
  });

  it("every leaf record has exactly the canonical locales", () => {
    const check = (value: unknown, path: string): void => {
      if (typeof value !== "object" || value === null) return;
      const obj = value as Record<string, unknown>;
      if (typeof obj.en === "string") {
        expect(Object.keys(obj).sort(), path).toEqual([...LOCALES].sort());
      }
      for (const [k, child] of Object.entries(obj)) check(child, `${path}.${k}`);
    };
    check(chromeStrings, "chromeStrings");
    check(LANGUAGE_NAMES, "LANGUAGE_NAMES");
  });
});