// Smoke suite: every public page renders (200), chrome present,
// language switcher keeps the visitor on the same page in the new locale.
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("../../config.json", import.meta.url), "utf8"));

const HOMES: string[] = ["/", "/de/", "/fr/", "/it/", "/rm/"];

test.describe("smoke: locale homes", () => {
  for (const path of HOMES) {
    test(`home renders with chrome: ${path}`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      // H1 = the hero heading (mockup copy), site name lives in the header.
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("header")).toContainText(/Public AI/);
      await expect(page.locator("footer")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
    });
  }
});

test.describe("smoke: key pages", () => {
  test("news index lists articles with cards", async ({ page }) => {
    await page.goto("/news/");
    const cards = page.locator(".news-card");
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("news article renders title + content", async ({ page }) => {
    await page.goto("/de/news/2026-08-28-cooperative-founding/");
    await expect(page.locator("h1")).toContainText("Public AI Switzerland ist gegründet");
    await expect(page.locator(".mdx-body")).not.toBeEmpty();
  });

  test("team page shows the nine founding-team members", async ({ page }) => {
    await page.goto("/de/team/");
    const cards = page.locator(".mdx-body .team-card");
    expect(await cards.count()).toBe(9);
  });

  test("author routes respect the release switch", async ({ page }) => {
    if (config.news.authorsEnabled === false) {
      await page.goto("/news/");
      await expect(page.locator('a[href*="/authors/"]')).toHaveCount(0);
      await page.goto("/authors/");
      await expect(page.locator("h1")).toContainText("Page not found");
      return;
    }
    await page.goto("/authors/");
    const cards = page.locator(".author-card");
    expect(await cards.count()).toBeGreaterThan(0);
    await cards.first().click();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".mdx-body")).toBeVisible();
  });

  test("statutes page renders chapters", async ({ page }) => {
    await page.goto("/de/statutes/");
    await expect(page.locator(".mdx-body")).not.toBeEmpty();
  });

  test("404 catch-all renders the localized 404 chrome", async ({ page }) => {
    await page.goto("/does-not-exist/");
    await expect(page.locator("h1")).toContainText(/Page not found|Seite nicht gefunden/);
  });
});

test.describe("language switcher", () => {
  test("switching from a content page keeps the visitor on the page in the new locale", async ({ page }) => {
    await page.goto("/de/mission/");
    // Switcher pills are BUTTONS with lang attrs (de, fr, it, rm — EN last).
    const fr = page.locator('.lang-switcher-row button[lang="fr"]');
    await fr.click();
    await expect(page).toHaveURL(/\/fr\/mission\//);
    await expect(page.locator(".site-header")).toBeVisible();
  });

  test("current locale is marked aria-current in the switcher", async ({ page }) => {
    await page.goto("/de/mission/");
    const current = page.locator('.lang-switcher-row button[aria-current="true"]');
    expect(await current.count()).toBe(1);
    await expect(current).toContainText("DE");
  });
});

test.describe("news interactions", () => {
  test("category filter narrows the listing IN PLACE (no navigation)", async ({ page }) => {
    await page.goto("/news/");
    const pills = page.locator(".news-filter button");
    expect(await pills.count()).toBeGreaterThan(1);
    const before = await page.locator(".news-card").count();
    // Click a category pill; the URL must stay on /news/ (in-place filter).
    await pills.nth(1).click();
    expect(page.url()).toMatch(/\/news\/$/);
    const after = await page.locator(".news-card").count();
    expect(after).toBeLessThanOrEqual(before);
    // Back to all.
    await pills.first().click();
    expect(await page.locator(".news-card").count()).toBe(before);
  });

  test("pagination controls are client-side and hidden on a single page", async ({ page }) => {
    await page.goto("/news/");
    // With the current seed content the feed fits one page: no controls.
    expect(await page.locator(".news-pagination").count()).toBe(0);
  });
});

test.describe("legacy English-slug migration", () => {
  for (const locale of ["en", "de", "fr", "it", "rm"]) {
    const prefix = locale === "en" ? "/" : `/${locale}/`;
    test(`old Contact URL redirects in ${locale}`, async ({ page }) => {
      await page.goto(`${prefix}kontakt/`);
      await expect(page).toHaveURL(new RegExp(`${prefix}contact/$`));
      await expect(page.locator(".mdx-body")).not.toBeEmpty();
    });
  }
});
