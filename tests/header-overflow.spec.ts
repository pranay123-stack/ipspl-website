import { expect, test } from "@playwright/test";

/**
 * 1.3 — the Request Quote CTA must never be clipped.
 *
 * It was pushed off-screen across 901–959px and again across 1024–1439px,
 * because the logo subtitle and the nav both grew at the lg breakpoint —
 * a 303px jump in required width at one step. 1024x768, 1280x800 and
 * 1366x768 were all affected.
 *
 * 984px is deliberately included: it sits inside the one narrow band that
 * used to pass, which is why sampling a single width missed this.
 */
/**
 * Phone widths are included since Phase 5: the CTA used to be `hidden` below
 * 640px, so on a phone the primary conversion action existed only inside the
 * drawer. 320px is the narrowest viewport worth supporting, 390 and 430 are
 * the current iPhone widths, 360 the commonest Android.
 */
const WIDTHS = [
  320, 360, 390, 430, 639, 640,
  899, 901, 960, 984, 1023, 1024, 1280, 1366, 1440, 1920,
];

for (const width of WIDTHS) {
  test(`header fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await page.waitForTimeout(400);

    const quote = page.locator('header a[href="/quote"]');
    await expect(quote).toBeVisible();

    const box = (await quote.boundingBox())!;
    expect(box.x + box.width).toBeLessThanOrEqual(width);

    // The row itself must not overflow its container either.
    const overflow = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Primary"]');
      const row = (nav ?? document.querySelector("header"))!.parentElement!;
      return row.scrollWidth - row.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("no horizontal document overflow at any tested width", async ({ page }) => {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `viewport ${width}px`).toBeLessThanOrEqual(1);
  }
});

test.describe("mobile conversion path", () => {
  /** Below 640px the CTA shortens to "Quote"; it must never disappear. */
  for (const width of [320, 360, 390, 430]) {
    test(`the quote CTA is reachable without opening the menu at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 780 });
      await page.goto("/");

      const cta = page.locator('header a[href="/quote"]');
      await expect(cta).toBeVisible();
      await expect(cta).toHaveText(/quote/i);

      // Tap target, not just presence.
      const box = (await cta.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);

      // And the menu trigger still fits beside it.
      const menu = page.locator("header button[aria-controls='mobile-nav-drawer']");
      const menuBox = (await menu.boundingBox())!;
      expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(width);
    });
  }
});
