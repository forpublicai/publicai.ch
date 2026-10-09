// Unit tests for the news pipeline: news
// identification by frontmatter, date-sorted collection, fallback
// resolution, externalUrl link-out exclusion, index/article URL shapes, and
// the news-index sitemap entry.
import { describe, expect, it } from "vitest";
import {
  newsPages,
  newsCollection,
  newsIndexPath,
  newsArticlePath,
  isNewsLinkOut,
  resolveSectionLocale,
  newsIndexSitemapUrls,
} from "~/lib/news";
import type { PageEntry } from "~/lib/content-discovery";
import type { Config } from "~/lib/config";

function newsPage(overrides: Partial<PageEntry> & { slug: string; date?: string }): PageEntry {
  const { date, frontmatter, ...rest } = overrides;
  return {
    theme: "dialog/news",
    file: `dialog/news/${overrides.slug}.mdx`,
    type: "news",
    frontmatter: {
      title: `T-${overrides.slug}`,
      description: "D",
      draft: false,
      noindex: false,
      ...(date !== undefined ? { date } : {}),
      category: "Dialog",
      ...(frontmatter ?? {}),
    },
    localesPresent: ["en", "de", "fr", "it", "rm"],
    ...rest,
  } as PageEntry;
}

function standardPage(slug: string): PageEntry {
  return newsPage({
    slug,
    type: "standard",
    frontmatter: { title: `T-${slug}`, description: "D", draft: false, noindex: false },
  }) as PageEntry;
}

const MANIFEST = {
  pages: [
    standardPage("mission"),
    newsPage({ slug: "founding", date: "2026-08-28" }),
    newsPage({ slug: "hackathon", date: "2026-09-10", localesPresent: ["de"], frontmatter: {
      title: "T-hackathon", description: "D", draft: false, noindex: false,
    } }),
    newsPage({ slug: "linkout", date: "2026-09-20", frontmatter: {
      title: "T-linkout", description: "D", draft: false, noindex: false,
      externalUrl: "https://example.org/post",
    } }),
    newsPage({ slug: "drafted", date: "2026-01-02", frontmatter: {
      title: "T-drafted", description: "D", noindex: false, draft: true,
    } }),
  ],
} as unknown as { pages: PageEntry[] };

describe("newsPages (§ 6.1 frontmatter identification)", () => {
  it("keeps only published routed news; drafts + link-outs + standard pages excluded", () => {
    const slugs = newsPages(MANIFEST).map((p) => p.slug);
    expect(slugs).toEqual(["founding", "hackathon"]);
  });
});

describe("newsCollection (§ 6.4 sort + § 7.2 fallback)", () => {
  it("sorts newest-first regardless of manifest order", () => {
    const items = newsCollection(MANIFEST, "en");
    // 2026-09-10 (hackathon) is newer than 2026-08-28 (founding).
    expect(items.map((i) => i.article.slug)).toEqual(["hackathon", "founding"]);
  });
  it("DE-only article resolves to de in every requested locale with isFallback", () => {
    for (const requested of ["en", "fr", "it", "rm"] as const) {
      const items = newsCollection(MANIFEST, requested);
      const hackathon = items.find((i) => i.article.slug === "hackathon")!;
      expect(hackathon.resolvedLocale).toBe("de");
      expect(hackathon.isFallback).toBe(true);
    }
  });
  it("carried locale renders natively (no fallback flag)", () => {
    const de = newsCollection(MANIFEST, "de").find((i) => i.article.slug === "hackathon")!;
    expect(de.isFallback).toBe(false);
    expect(de.resolvedLocale).toBe("de");
  });
});

describe("resolveSectionLocale (§ 7.2 chain)", () => {
  it("requested → en → de → first available", () => {
    const page = { localesPresent: ["it", "rm"] } as PageEntry;
    expect(resolveSectionLocale(page, "fr")).toBe("it");
    const en = { localesPresent: ["en", "it"] } as PageEntry;
    expect(resolveSectionLocale(en, "de")).toBe("en");
    const direct = { localesPresent: ["fr", "en"] } as PageEntry;
    expect(resolveSectionLocale(direct, "fr")).toBe("fr");
  });
});

describe("URL shapes (§ 5 rule 2)", () => {
  it("index: EN bare-root, others prefixed", () => {
    expect(newsIndexPath("en")).toBe("/news/");
    expect(newsIndexPath("de")).toBe("/de/news/");
  });
  it("article: /news/<slug>/ EN bare-root, others prefixed", () => {
    expect(newsArticlePath("founding", "en")).toBe("/news/founding/");
    expect(newsArticlePath("founding", "rm")).toBe("/rm/news/founding/");
  });
});

describe("isNewsLinkOut (§ 6.4)", () => {
  it("true only for published news with externalUrl", () => {
    const linkOut = MANIFEST.pages.find((p) => p.slug === "linkout")!;
    const drafted = MANIFEST.pages.find((p) => p.slug === "drafted")!;
    expect(isNewsLinkOut(linkOut)).toBe(true);
    expect(isNewsLinkOut(drafted)).toBe(false);
    expect(isNewsLinkOut(MANIFEST.pages[0]!)).toBe(false);
  });
});

describe("newsIndexSitemapUrls (§ 12.3)", () => {
  it("every locale listed + x-default → EN, each entry carries all alternates", () => {
    const config = {
      site: { canonicalBase: "https://publicai.ch" },
    } as unknown as Config;
    const urls = newsIndexSitemapUrls(config);
    expect(urls.map((u) => u.loc)).toEqual([
      "https://publicai.ch/news/",
      "https://publicai.ch/de/news/",
      "https://publicai.ch/fr/news/",
      "https://publicai.ch/it/news/",
      "https://publicai.ch/rm/news/",
    ]);
    expect(urls[0]!.alternates.map((a) => a.lang)).toContain("x-default");
  });
});
// ---------------------------------------------------------------------------
// Implementation: categories, pagination, author refs 
// ---------------------------------------------------------------------------
import {
  categorySlug,
  newsCategoryPath,
  newsListPagePath,
  usedCategories,
  pageCount,
  pageSlice,
  verifyNewsRefs,
  authorPagePath,
  authorListPath,
  NEWS_PAGE_SIZE,
} from "~/lib/news";
import { PageModelError } from "~/lib/mdx-page-model";
import { validateAuthorFile } from "~/lib/mdx-page-model";

describe("categorySlug (§ 6.4b)", () => {
  it("ascii-slugs categories incl. umlaut expansion", () => {
    expect(categorySlug("Dialog")).toBe("dialog");
    expect(categorySlug("Genossenschaft")).toBe("genossenschaft");
    expect(categorySlug("Für Grüne")).toBe("fuer-gruene");
  });
  it("category paths: EN bare-root, others prefixed", () => {
    expect(newsCategoryPath("Dialog", "en")).toBe("/news/category/dialog/");
    expect(newsCategoryPath("Dialog", "fr")).toBe("/fr/news/category/dialog/");
  });
});

describe("pagination (§ 6.4b)", () => {
  it("10 entries per page; pageCount rounds up, min 1", () => {
    expect(NEWS_PAGE_SIZE).toBe(10);
    expect(pageCount(0)).toBe(1);
    expect(pageCount(10)).toBe(1);
    expect(pageCount(11)).toBe(2);
    expect(pageCount(25)).toBe(3);
  });
  it("page 1 = base URL; later pages nest under /page/N/", () => {
    expect(newsListPagePath("/news/", 1)).toBe("/news/");
    expect(newsListPagePath("/news/", 2)).toBe("/news/page/2/");
    expect(newsListPagePath("/news/category/dialog/", 2)).toBe("/news/category/dialog/page/2/");
  });
  it("pageSlice returns the right 10-entry window", () => {
    const items = Array.from({ length: 23 }, (_, i) => i);
    expect(pageSlice(items, 1)).toHaveLength(10);
    expect(pageSlice(items, 1)[0]).toBe(0);
    expect(pageSlice(items, 2)[0]).toBe(10);
    expect(pageSlice(items, 3)).toHaveLength(3);
    expect(pageSlice(items, 4)).toHaveLength(0);
  });
});

describe("usedCategories (§ 6.4b)", () => {
  it("config order, only categories with published articles", () => {
    const config = { news: { categories: ["Dialog", "Technik", "Medien"] } } as never as Parameters<
      typeof usedCategories
    >[1];
    expect(usedCategories(MANIFEST, config)).toEqual(["Dialog"]);
  });
});

describe("verifyNewsRefs (§ 6.4/§ 6.4a)", () => {
  const REFS_CONFIG_3CAT = { news: { categories: ["Dialog", "Technik", "Medien"] } } as never as Parameters<
    typeof verifyNewsRefs
  >[1];
  const REFS_CONFIG_NODIALOG = { news: { categories: ["Technik", "Medien"] } } as never as Parameters<
    typeof verifyNewsRefs
  >[1];
  const MANIFEST_AS_REFS = { ...MANIFEST, authors: new Map() } as never as Parameters<
    typeof verifyNewsRefs
  >[0];
  it("unknown category fails naming the file", () => {
    expect(() => verifyNewsRefs(MANIFEST_AS_REFS, REFS_CONFIG_NODIALOG)).toThrow(/category "Dialog" is not/);
  });
  it("unknown author id fails proposing the authors/ file", () => {
    const manifest = {
      pages: [newsPage({ slug: "x", date: "2026-01-01", frontmatter: { author: "ghost", title: "T-x", description: "D", draft: false, noindex: false } })],
      authors: new Map(),
    } as never as Parameters<typeof verifyNewsRefs>[0];
    expect(() => verifyNewsRefs(manifest, REFS_CONFIG_3CAT)).toThrow(/content\/authors\/ghost\.mdx/);
  });
  it("valid refs pass", () => {
    const manifest = {
      pages: [newsPage({ slug: "x", date: "2026-01-01", frontmatter: { author: "joshua-tan", title: "T-x", description: "D", draft: false, noindex: false } })],
      authors: new Map([["joshua-tan", { authorId: "joshua-tan" }]]),
    } as never as Parameters<typeof verifyNewsRefs>[0];
    expect(() => verifyNewsRefs(manifest, REFS_CONFIG_3CAT)).not.toThrow();
  });
});

describe("author records (§ 6.4a)", () => {
  it("URL shapes", () => {
    expect(authorListPath("en")).toBe("/authors/");
    expect(authorListPath("it")).toBe("/it/authors/");
    expect(authorPagePath("joshua-tan", "en")).toBe("/authors/joshua-tan/");
    expect(authorPagePath("joshua-tan", "de")).toBe("/de/authors/joshua-tan/");
  });
  it("validateAuthorFile: filename is the authorID; frontmatter name/affiliation/image", () => {
    const source = `---\nname: Jane Doe\naffiliation: X\nimage: /assets/team/jane.jpg\n---\n\n<!-- locale: de -->\n\nBio.\n`;
    const model = validateAuthorFile(source, "authors/jane-doe.mdx");
    expect(model.authorId).toBe("jane-doe");
    expect(model.frontmatter.name).toBe("Jane Doe");
    expect(model.localesPresent).toEqual(["de"]);
  });
  it("missing name fails", () => {
    expect(() =>
      validateAuthorFile("---\naffiliation: X\n---\n\n<!-- locale: en -->\n\nBio.\n", "authors/x.mdx"),
    ).toThrow(PageModelError);
  });
});
