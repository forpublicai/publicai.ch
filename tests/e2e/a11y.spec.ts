// Accessibility suite: axe-core on every public page — WCAG 2.1
// AA; zero critical violations gate the suite. Samples the key page
// TYPES (home, news index/article, author, legal, 404) in DE + EN + a
// sampled FR/IT/RM pass over the chrome.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const SAMPLED: string[] = [
  "/",
  "/de/",
  "/fr/",
  "/it/",
  "/rm/",
  "/news/",
  "/de/news/",
  "/de/news/2026-08-28-cooperative-founding/",
  "/mission/",
  "/de/mission/",
  "/de/team/",
  "/authors/",
  "/de/authors/",
  "/de/statutes/",
  "/de/privacy-policy/",
  "/de/legal-notice/",
  "/de/contact/",
  "/de/apertus/",
  "/de/ai-dialogue/",
  "/de/worldwide/",
  "/does-not-exist/",
];

for (const path of SAMPLED) {
  test(`axe: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    // Let the client router finish hydrating before auditing.
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    if (critical.length > 0) {
      const summary = critical
        .map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nodes — ${v.help}`)
        .join("\n");
      throw new Error(`axe violations on ${path}:\n${summary}`);
    }
    expect(results.violations.filter((v) => v.impact === "moderate")).toHaveLength(0);
  });
}

test.describe("keyboard operability", () => {
  test("mobile menu toggle is keyboard operable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const toggle = page.locator(".site-header__toggle");
    await toggle.focus();
    await page.keyboard.press("Enter");
    const menu = page.locator(".site-header__mobile");
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("skip-free focus order: first tab hits a header control or the main landmark", async ({ page }) => {
    await page.goto("/de/mission/");
    await page.keyboard.press("Tab");
    const focused = page.evaluate(() => document.activeElement?.tagName);
    expect(["A", "BUTTON"]).toContain(await focused);
  });
});