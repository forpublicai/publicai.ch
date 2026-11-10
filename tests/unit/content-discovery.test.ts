// Unit tests for content discovery: scanning content/, template
// exclusion, slug collisions, reserved slugs, draft exclusion, and route-path
// generation per locale.
import { describe, expect, it, afterEach } from "vitest";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { discoverContent, allRoutePaths, pagePath } from "~/lib/content-discovery";

const TMP = "/tmp/content-tests";

function seedFiles(files: Record<string, string>): string {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  for (const [rel, content] of Object.entries(files)) {
    const full = `${TMP}/${rel}`;
    mkdirSync(full.split("/").slice(0, -1).join("/"), { recursive: true });
    writeFileSync(full, content);
  }
  return TMP;
}

afterEach(() => rmSync(TMP, { recursive: true, force: true }));

const PAGE = (title: string, locales: string[]) =>
  `---\ntitle: ${title}\ndescription: D.\n---\n\n${locales.map((l) => `<!-- locale: ${l} -->\n\n${l} text.`).join("\n\n")}\n`;

describe("discoverContent", () => {
  it("discovers pages, records theme + locales, excludes templates/", () => {
    const dir = seedFiles({
      "cooperative/mission.mdx": PAGE("Mission", ["en", "de"]),
      "templates/page-template.mdx": PAGE("Template", ["en"]),
      "dialogue/news/kickoff.mdx": `---\ntitle: N\ndescription: D\ndate: 2026-08-28\ncategory: Dialog\n---\n\n<!-- locale: de -->\n\nDE.\n`,
    });
    const manifest = discoverContent(dir);
    expect(manifest.pages.map((p) => `${p.theme}/${p.slug}`).sort()).toEqual([
      "cooperative/mission",
      "dialogue/news/kickoff",
    ]);
    const mission = manifest.bySlug.get("mission")!;
    expect(mission.localesPresent).toEqual(["en", "de"]);
    expect(mission.file).toBe("cooperative/mission.mdx");
  });

  it("duplicate slugs across folders fail naming both files (D16)", () => {
    const dir = seedFiles({
      "a/mission.mdx": PAGE("A", ["en"]),
      "b/mission.mdx": PAGE("B", ["de"]),
    });
    expect(() => discoverContent(dir)).toThrow(/duplicate slug "mission"[\s\S]*a\/mission\.mdx[\s\S]*b\/mission\.mdx|b\/mission\.mdx[\s\S]*a\/mission\.mdx/);
  });

  it("a standard page named news.mdx is a reserved-slug error (§ 5 rule 4)", () => {
    const dir = seedFiles({ "x/news.mdx": PAGE("N", ["en"]) });
    expect(() => discoverContent(dir)).toThrow(/reserved/);
  });

  it("invalid frontmatter names the file", () => {
    const dir = seedFiles({ "x/bad.mdx": "---\ndescription: no title\n---\n\n<!-- locale: en -->\n\nhi\n" });
    expect(() => discoverContent(dir)).toThrow(/x\/bad\.mdx[\s\S]*title/);
  });
});

describe("allRoutePaths", () => {
  it("EN bare-root, others prefixed; drafts excluded; only carried locales", () => {
    const dir = seedFiles({
      "a/mission.mdx": PAGE("M", ["en", "de"]),
      "a/draft.mdx": `---\ntitle: D\ndescription: D\ndraft: true\n---\n\n<!-- locale: en -->\n\nx\n`,
      "a/de-only.mdx": PAGE("D", ["de"]),
    });
    const manifest = discoverContent(dir);
    const paths = allRoutePaths(manifest);
    // Sorted by path; slug determines the URL (folders carry no semantics,).
    expect(paths).toEqual(["/de/de-only/", "/de/mission/", "/mission/"]);
    expect(paths.some((p) => p.includes("draft"))).toBe(false);
  });

  it("pagePath honors EN-root and prefixed others", () => {
    const dir = seedFiles({ "a/mission.mdx": PAGE("M", ["en"]) });
    const entry = discoverContent(dir).bySlug.get("mission")!;
    expect(pagePath(entry, "en")).toBe("/mission/");
    expect(pagePath(entry, "it")).toBe("/it/mission/");
    expect(pagePath(entry, undefined)).toBe("/mission/");
  });
});