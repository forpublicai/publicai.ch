// Unit tests for the MDX content engine:
// locale-section parsing (the <!-- locale: xx --> marker split,) and
// frontmatter validation (/6.4). The parser is the riskiest piece of the
// content engine; these tests pin its contract before any rendering lands.
import { describe, expect, it } from "vitest";
import {
  splitLocaleSections,
  parseFrontmatter,
  validatePageFile,
  stripFrontmatter,
} from "~/lib/mdx-page-model";

const FIVE_LOCALE_EXAMPLE = `---
title: Mission
description: Why we are building a cooperative for public AI in Switzerland.
---

<!-- locale: en -->

Public AI Switzerland is a cooperative.

<!-- locale: de -->

Public AI Switzerland ist eine Genossenschaft.

<!-- locale: fr -->

Public AI Switzerland est une coopérative.
`;

describe("splitLocaleSections (§ 6.2)", () => {
  it("five-marker file: splits after frontmatter is stripped by the caller", () => {
    // splitLocaleSections expects the BODY (frontmatter already stripped —
    // validatePageFile strips it first). A leading `---` block is stray here.
    const body = stripFrontmatter(FIVE_LOCALE_EXAMPLE);
    const sections = splitLocaleSections(body, "example.mdx");
    expect(sections.get("en")).toContain("cooperative.");
    expect(sections.get("de")).toContain("Genossenschaft.");
    expect(sections.get("fr")).toContain("coopérative.");
  });

  it("keeps MDX components inside a section intact", () => {
    const src = `<!-- locale: en -->\n\n<Callout variant="info">Hi</Callout>\n`;
    const sections = splitLocaleSections(src, "x.mdx");
    expect(sections.get("en")).toContain('<Callout variant="info">Hi</Callout>');
  });

  it("rejects an unknown locale marker naming file and line (§ 6.2 rule 1)", () => {
    const src = `<!-- locale: en -->\n\nHi\n\n<!-- locale: xx -->\n\nBad\n`;
    expect(() => splitLocaleSections(src, "bad.mdx")).toThrow(
      /bad\.mdx[\s\S]*"xx"[\s\S]*line 5/,
    );
  });

  it("rejects a file with no locale section (§ 6.2 rule 2)", () => {
    expect(() => splitLocaleSections("---\ntitle: X\n---\n\nNo sections.", "empty.mdx")).toThrow(
      /empty\.mdx/,
    );
  });

  it("rejects a nested/duplicate marker for the same locale naming line", () => {
    const src = `<!-- locale: en -->\n\nA\n\n<!-- locale: en -->\n\nB\n`;
    expect(() => splitLocaleSections(src, "dup.mdx")).toThrow(/dup\.mdx[\s\S]*duplicate/);
  });

  it("rejects content before the first marker as stray (naming the line)", () => {
    // Content ahead of any marker has no locale; the spec requires the
    // marker format, so stray pre-marker content (besides frontmatter, which
    // the caller strips) is an error naming the line.
    const src = `Stray intro.\n\n<!-- locale: en -->\n\nHi\n`;
    expect(() => splitLocaleSections(src, "stray.mdx")).toThrow(
      /stray\.mdx[\s\S]*line 1/,
    );
  });
});

describe("parseFrontmatter (§ 6.3/6.4)", () => {
  it("parses required title/description", () => {
    const fm = parseFrontmatter("---\ntitle: Mission\ndescription: Why.\n---\n\nx", "a.mdx");
    expect(fm.title).toBe("Mission");
    expect(fm.description).toBe("Why.");
  });

  it("rejects missing title with a readable path", () => {
    expect(() => parseFrontmatter("---\ndescription: Only.\n---\n", "a.mdx")).toThrow(
      /a\.mdx[\s\S]*title/,
    );
  });

  it("rejects a non-date updatedAt", () => {
    expect(() =>
      parseFrontmatter("---\ntitle: A\ndescription: B\nupdatedAt: not-a-date\n---\n", "a.mdx"),
    ).toThrow(/a\.mdx[\s\S]*updatedAt/);
  });

  it("accepts news frontmatter and flags it (§ 6.4)", () => {
    const fm = parseFrontmatter(
      '---\ntitle: N\ndescription: D\ndate: 2026-09-30\ncategory: Dialog\n---\n',
      "news.mdx",
    );
    expect(fm.date).toBe("2026-09-30");
    expect(fm.category).toBe("Dialog");
  });

  it("rejects a news date of the wrong shape", () => {
    expect(() =>
      parseFrontmatter(
        "---\ntitle: N\ndescription: D\ndate: September\ncategory: Dialog\n---\n",
        "n.mdx",
      ),
    ).toThrow(/n\.mdx[\s\S]*date/);
  });
});

describe("validatePageFile (end-to-end file validation)", () => {
  it("valid frontmatter + sections return structured result", () => {
    const result = validatePageFile(FIVE_LOCALE_EXAMPLE, "cooperative/mission.mdx");
    expect(result.frontmatter.title).toBe("Mission");
    expect([...result.localesPresent]).toEqual(["en", "de", "fr"]);
    expect(result.slug).toBe("mission");
    expect(result.type).toBe("standard");
  });

  it("a file with news frontmatter is typed news regardless of folder (§ 6.1)", () => {
    const src =
      "---\ntitle: N\ndescription: D\ndate: 2026-08-28\ncategory: Dialog\n---\n\n<!-- locale: de -->\n\nArtikel.\n";
    const result = validatePageFile(src, "dialog/irgendwas.mdx");
    expect(result.type).toBe("news");
  });

  it("news externalUrl must be absolute (§ 6.4)", () => {
    const src =
      '---\ntitle: N\ndescription: D\ndate: 2026-08-28\ncategory: Dialog\nexternalUrl: not-absolute\n---\n\n<!-- locale: de -->\n\nA.\n';
    expect(() => validatePageFile(src, "x.mdx")).toThrow(/x\.mdx[\s\S]*externalUrl/);
  });
});