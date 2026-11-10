// Unit tests for the config loader: valid seed config passes; malformed
// configs fail with a readable error naming the offending path.
import { describe, expect, it } from "vitest";
import { ConfigSchema } from "~/lib/config";

const validConfig = {
  site: {
    name: { en: "Site", de: "Site", fr: "Site", it: "Site", rm: "Site" },
    canonicalBase: "https://publicai.ch",
    defaultLocale: "en",
    locales: ["en", "de", "fr", "it", "rm"],
  },
  menus: {
    main: [{ label: { en: "A", de: "A", fr: "A", it: "A", rm: "A" }, page: "a" }],
    utility: [],
  },
  footer: {
    columns: [
      {
        title: { en: "C", de: "C", fr: "C", it: "C", rm: "C" },
        items: [
          { label: { en: "B", de: "B", fr: "B", it: "B", rm: "B" }, url: "https://x.example" },
        ],
      },
    ],
    copyright: { en: "©", de: "©", fr: "©", it: "©", rm: "©" },
  },
  pages: { excluded: [], redirects: [] },
  home: { sections: { apertusPrompt: false } },
  embeds: { allowlist: ["example.com"] },
  contact: { email: "info@example.org" },
  news: { categories: ["Dialog"] },
};

describe("config schema", () => {
  it("accepts a valid config", () => {
    expect(ConfigSchema.safeParse(validConfig).success).toBe(true);
  });

  it("rejects a LocalizedString missing a locale, naming the path", () => {
    const broken = structuredClone(validConfig) as typeof validConfig & {
      menus: { main: Array<{ label: Record<string, string>; page: string }> };
    };
    delete (broken.menus.main[0].label as Record<string, string>).rm;
    const result = ConfigSchema.safeParse(broken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path.join(".")).toContain("menus.main");
    }
  });

  it("rejects a MenuItem with page AND url (mutually exclusive)", () => {
    const broken = {
      ...validConfig,
      menus: {
        ...validConfig.menus,
        main: [
          {
            label: { en: "A", de: "A", fr: "A", it: "A", rm: "A" },
            page: "a",
            url: "https://x.example",
          },
        ],
      },
    };
    expect(ConfigSchema.safeParse(broken).success).toBe(false);
  });

  it("accepts a MenuItem with nested children (dropdown, D17)", () => {
    const config = {
      ...validConfig,
      menus: {
        ...validConfig.menus,
        main: [
          {
            label: { en: "M", de: "M", fr: "M", it: "M", rm: "M" },
            children: [{ label: { en: "A", de: "A", fr: "A", it: "A", rm: "A" }, page: "a" }],
          },
        ],
      },
    };
    expect(ConfigSchema.safeParse(config).success).toBe(true);
  });

  it("rejects an empty children array", () => {
    const config = {
      ...validConfig,
      menus: {
        ...validConfig.menus,
        main: [
          {
            label: { en: "M", de: "M", fr: "M", it: "M", rm: "M" },
            children: [],
          },
        ],
      },
    };
    expect(ConfigSchema.safeParse(config).success).toBe(false);
  });

  it("rejects a non-en defaultLocale (EN-root is hard-coded, § 5 rule 3)", () => {
    const broken = {
      ...validConfig,
      site: { ...validConfig.site, defaultLocale: "de" },
    };
    expect(ConfigSchema.safeParse(broken).success).toBe(false);
  });
});
