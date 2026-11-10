// Unit tests for link verification: every internal link
// (MDX markdown links, config page: refs incl. children) resolves against
// the slug set; broken internal links = named build error; externals
// collected into a report.
import { describe, expect, it } from "vitest";
import {
  collectConfigInternalRefs,
  collectConfigExternalLinks,
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
      { label: {} as never, url: "https://publicai.co" },
      {
        label: {} as never,
        children: [
          { label: {} as never, page: "apertus" },
          { label: {} as never, page: "ghost" }, // broken child (D17 in link checks)
        ],
      },
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
      { path: "menus.main[2].children[0].page", slug: "apertus" },
      { path: "menus.main[2].children[1].page", slug: "ghost" },
    ]);
  });

  it("collects external links separately", () => {
    const externals = collectConfigExternalLinks(CONFIG);
    expect(externals).toEqual([{ path: "menus.main[1].url", url: "https://publicai.co" }]);
  });
});

describe("verifyInternalLinks (§ 12.4)", () => {
  it("known slugs pass silently; menu links never 404 (§ 8.2 rule 3)", () => {
    expect(() =>
      verifyInternalLinks(CONFIG, new Set(["mission", "apertus", "ghost", "news"])),
    ).not.toThrow();
  });

  it("unknown slug fails naming the config path (news index is valid)", () => {
    expect(() => verifyInternalLinks(CONFIG, new Set(["mission", "news"]))).toThrow(
      /menus\.main\[2\]\.children\[1\][\s\S]*"ghost"/,
    );
  });
});