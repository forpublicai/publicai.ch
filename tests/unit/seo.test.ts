// Unit tests for the SEO module:
// canonical URLs, hreflang alternates + x-default, OG tags, sitemap URL
// generation, robots.txt.
import { describe, expect, it } from "vitest";
import {
  pageCanonical,
  pageAlternates,
  pageMetaTags,
  sitemapUrls,
  robotsTxt,
} from "~/lib/seo";
import type { Config } from "~/lib/config";
import type { PageEntry } from "~/lib/content-discovery";

function page(overrides: Partial<PageEntry> & { slug: string }): PageEntry {
  return {
    theme: "x",
    file: `x/${overrides.slug}.mdx`,
    type: "standard",
    frontmatter: {
      title: "T",
      description: "D",
      draft: false,
      noindex: false,
    },
    localesPresent: ["en", "de", "fr", "it", "rm"],
    ...overrides,
  } as PageEntry;
}

const BASE_CONFIG: Config = {
  site: {
    name: {} as never,
    canonicalBase: "https://publicai.ch",
    defaultLocale: "en",
    locales: ["en", "de", "fr", "it", "rm"],
  },
} as unknown as Config;

describe("pageCanonical", () => {
  it("EN at root, others prefixed, trailing slash", () => {
    const mission = page({ slug: "mission" });
    expect(pageCanonical(mission, "en", BASE_CONFIG)).toBe("https://publicai.ch/mission/");
    expect(pageCanonical(mission, "de", BASE_CONFIG)).toBe("https://publicai.ch/de/mission/");
  });
});

describe("pageAlternates (§ 7.3)", () => {
  it("emits hreflang only for locales the page actually carries + x-default to EN", () => {
    const partial = page({ slug: "founding", localesPresent: ["de", "en"] });
    const alts = pageAlternates(partial, BASE_CONFIG);
    expect(alts).toEqual([
      { lang: "en", href: "https://publicai.ch/founding/" },
      { lang: "de", href: "https://publicai.ch/de/founding/" },
      { lang: "x-default", href: "https://publicai.ch/founding/" },
    ]);
  });
});

describe("pageMetaTags", () => {
  it("canonical + hreflang + og:*, noindex honored", () => {
    const mission = page({ slug: "mission", frontmatter: { title: "Mission", description: "D", draft: false, noindex: false } });
    const tags = pageMetaTags(mission, "de", BASE_CONFIG);
    const flat = tags.map((t) => t.name ?? t.property ?? t.rel ?? "").join(",");
    expect(flat).toContain("canonical");
    expect(flat).toContain("alternate");
    expect(flat).toContain("og:title");
    const noindexPage = page({ slug: "x", frontmatter: { title: "X", description: "D", draft: false, noindex: true } });
    expect(pageMetaTags(noindexPage, "en", BASE_CONFIG).map((t) => t.name)).toContain("robots");
  });
});

describe("sitemapUrls (§ 12.3)", () => {
  it("includes only published, non-excluded pages in locales they exist; hreflang entries", () => {
    const config = {
      ...BASE_CONFIG,
      pages: { excluded: ["secret"], redirects: [] },
    } as unknown as Config;
    const pages = [
      page({ slug: "mission" }),
      page({ slug: "secret" }),
      page({ slug: "founding", localesPresent: ["de", "en"] }),
      page({ slug: "drafted", frontmatter: { title: "X", description: "D", draft: true, noindex: false } }),
      page({ slug: "hidden", frontmatter: { title: "X", description: "D", draft: false, noindex: true } }),
    ];
    const urls = sitemapUrls(pages, config);
    const locs = urls.map((u) => u.loc);
    expect(locs).toContain("https://publicai.ch/mission/");
    expect(locs).toEqual(
      expect.arrayContaining(["https://publicai.ch/de/founding/", "https://publicai.ch/founding/"]),
    );
    expect(locs.some((l) => l.includes("secret"))).toBe(false);
    expect(locs.some((l) => l.includes("drafted"))).toBe(false);
    expect(locs.some((l) => l.includes("hidden"))).toBe(false);
    const missionUrl = urls.find((u) => u.loc === "https://publicai.ch/mission/");
    // mission carries all five locales → all hreflang entries + x-default.
    expect(missionUrl!.alternates.map((a) => a.lang).sort()).toEqual([
      "de", "en", "fr", "it", "rm", "x-default",
    ].sort());
  });
});

describe("robotsTxt", () => {
  it("references the sitemap", () => {
    const txt = robotsTxt(BASE_CONFIG);
    expect(txt).toContain("Sitemap: https://publicai.ch/sitemap.xml");
    expect(txt).toContain("User-agent: *");
  });
});