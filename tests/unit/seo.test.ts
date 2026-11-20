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

describe("pageMetaTags social card", () => {
  const content = (tags: ReturnType<typeof pageMetaTags>, key: string) =>
    tags.find((t) => t.property === key || t.name === key)?.content;

  it("absolute og:image and a large Twitter card from ogImage", () => {
    const p = page({
      slug: "progress",
      frontmatter: { title: "P", description: "D", draft: false, noindex: true, ogImage: "/assets/progress/card.png", ogImageAlt: "Alt" },
    });
    const tags = pageMetaTags(p, "en", BASE_CONFIG);
    expect(content(tags, "og:image")).toBe("https://publicai.ch/assets/progress/card.png");
    expect(content(tags, "og:image:alt")).toBe("Alt");
    expect(content(tags, "twitter:card")).toBe("summary_large_image");
    expect(content(tags, "twitter:image")).toBe("https://publicai.ch/assets/progress/card.png");
  });

  it("falls back to heroImage, and to a small card without any image", () => {
    const hero = page({ slug: "n", frontmatter: { title: "N", description: "D", draft: false, noindex: false, heroImage: "https://cdn.example/h.jpg" } });
    expect(content(pageMetaTags(hero, "en", BASE_CONFIG), "og:image")).toBe("https://cdn.example/h.jpg");
    const bare = pageMetaTags(page({ slug: "b" }), "en", BASE_CONFIG);
    expect(content(bare, "og:image")).toBeUndefined();
    expect(content(bare, "twitter:card")).toBe("summary");
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