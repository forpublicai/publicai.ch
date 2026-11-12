// Unit tests for link verification: every internal link
// (MDX markdown links, config page: refs incl. children) resolves against
// the slug set; broken internal links = named build error; externals
// collected into a report.
import { describe, expect, it } from "vitest";
import {
  collectConfigInternalRefs,
  verifyInternalLinks,
} from "~/lib/link-verification";
import type { Config } from "~/lib/config";

const CONFIG: Config = {
  site: {
    name: {} as never,
    canonicalBase: "https://publicai.ch",
    defaultLocale: "en",
    locales: ["en", "de", "fr", "it", "rm"],
  },
  menus: {
    main: [
      { label: {} as never, page: "mission" },
    ],
    utility: [],
  },
  footer: { columns: [], copyright: {} as never },
  pages: { excluded: [], redirects: [] },
  home: { sections: { apertusPrompt: false } },
  embeds: { allowlist: [] },
  contact: { email: "x@y.ch" },
  news: { categories: [] },
} as unknown as Config;

describe("collectConfigInternalRefs (§ 8.2 rule 1, § 12.4)", () => {
  it("walks main/utility/cta/footer incl. nested children, with config paths", () => {
    const refs = collectConfigInternalRefs(CONFIG);
    expect(refs).toEqual([
      { path: "menus.main[0].page", slug: "mission" },
    ]);
  });

});

describe("verifyInternalLinks (§ 12.4)", () => {
  it("known slugs pass silently; menu links never 404 (§ 8.2 rule 3)", () => {
    expect(() =>
      verifyInternalLinks(CONFIG, new Set(["mission", "apertus", "ghost", "news"])),
    ).not.toThrow();
  });
});
