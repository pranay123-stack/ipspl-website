import { expect, test } from "@playwright/test";

/**
 * 1.1 — deep links to section anchors must land.
 *
 * Regression guard: scroll-behavior: smooth turned these into a ~1.5s
 * animation, so scrollY was still 0 at load and any measurement — or any user
 * scroll — inside that window saw a dead link. These are the mega-menu
 * targets, so a large share of navigation depended on it.
 */
const ANCHORS = [
  "lined-piping-systems",
  "lined-valves",
  "engineered-components",
  "ptfe-products",
] as const;

for (const id of ANCHORS) {
  test(`/products#${id} lands within 200px of the top`, async ({ page }) => {
    await page.goto(`/products#${id}`, { waitUntil: "load" });
    // Allow the document to settle; the landing repeats as images resolve.
    await page.waitForTimeout(1200);

    const top = await page.evaluate(
      (anchor) => document.getElementById(anchor)!.getBoundingClientRect().top,
      id,
    );

    expect(top).toBeGreaterThanOrEqual(0);
    expect(top).toBeLessThan(200);
  });
}

test("the anchor clears the fixed header", async ({ page }) => {
  await page.goto("/products#lined-valves", { waitUntil: "load" });
  await page.waitForTimeout(1200);

  const { top, headerBottom } = await page.evaluate(() => ({
    top: document.getElementById("lined-valves")!.getBoundingClientRect().top,
    headerBottom: document.querySelector("header")!.getBoundingClientRect().bottom,
  }));

  // The heading must sit below the header, not tucked under it.
  expect(top).toBeGreaterThanOrEqual(headerBottom - 1);
});
