// Unit tests for MDX internal-link extraction ( +/10.3):
// markdown links + CTA `to=` targets are collected from section bodies and
// verified against the slug set.
import { describe, expect, it } from "vitest";
import { extractMdxInternalLinks } from "~/lib/link-verification";

const BODY = `
Read [Mission](/mission) or [the news](/news).

<Callout variant="info">See [apertus](/apertus)</Callout>

<CTA title="M" to="ai-dialogue" />

<LinkRow links={[{ title: "X", to: "ghost-slug" }, { title: "Y", href: "https://a.ch" }]} />

External [link](https://elsewhere.ch) and [mailto](mailto:a@b.ch) stay untouched.
`;

describe("extractMdxInternalLinks", () => {
  it("collects markdown internal links + CTA to= (incl. nested JSX props)", () => {
    const links = extractMdxInternalLinks(BODY, "x.mdx");
    const slugs = links.map((l) => l.target);
    expect(slugs).toContain("mission");
    expect(slugs).toContain("news");
    expect(slugs).toContain("apertus");
    expect(slugs).toContain("ai-dialogue");
    expect(slugs).toContain("ghost-slug");
    expect(links.every((l) => !l.target.startsWith("http"))).toBe(true);
  });

  it("excludes http/mailto/# targets", () => {
    const links = extractMdxInternalLinks(BODY, "x.mdx");
    expect(links.map((l) => l.target)).not.toContain("https://elsewhere.ch");
    expect(links.map((l) => l.target)).not.toContain("mailto:a@b.ch");
  });
});