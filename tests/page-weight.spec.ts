import { expect, test } from "@playwright/test";

/**
 * Phase 6 — structural page weight.
 *
 * These are counts, not timings, so unlike Lighthouse they are stable on a
 * busy machine and can live in the fast suite. Lighthouse CI covers the timed
 * metrics; this covers the things that caused them.
 */
test.describe("page weight", () => {
  test("the homepage DOM stays under 1,500 elements", async ({ page }) => {
    // It was 3,202 — for 1,558 words. 2,237 of those were one decorative SVG
    // drawn as ~2,200 <circle> elements, now a single <path>.
    await page.goto("/");
    const count = await page.evaluate(() => document.querySelectorAll("*").length);
    expect(count).toBeLessThan(1500);
  });

  test("the world map is one path, not thousands of circles", async ({ page }) => {
    await page.goto("/");
    const map = page.locator("#global svg").first();
    await expect(map).toBeVisible();

    const shape = await page.evaluate(() => ({
      circles: document.querySelectorAll("#global svg circle").length,
      nodes: document.querySelector("#global")?.querySelectorAll("*").length ?? 0,
    }));
    expect(shape.circles).toBe(0);
    expect(shape.nodes).toBeLessThan(150);
  });

  test("the map still renders its land mass and every marker", async ({ page }) => {
    // Collapsing the dots must not have collapsed the map.
    await page.goto("/");
    const path = page.locator("#global svg path").first();
    const box = (await path.boundingBox())!;
    expect(box.width).toBeGreaterThan(400);
    expect(box.height).toBeGreaterThan(150);

    // One interactive control per country, as before.
    const countries = ["India", "Thailand", "Vietnam", "China", "Canada"];
    for (const country of countries) {
      await expect(page.locator("#global").getByText(country, { exact: true }).first()).toBeVisible();
    }
  });

  test("every route stays under its DOM budget", async ({ page }) => {
    const budgets: Record<string, number> = {
      "/products": 900,
      "/products/ptfe-lined-pipes": 1100,
      "/industries/chemical": 700,
      "/quote": 600,
    };
    for (const [path, budget] of Object.entries(budgets)) {
      await page.goto(path);
      const count = await page.evaluate(() => document.querySelectorAll("*").length);
      expect(count, path).toBeLessThan(budget);
    }
  });

  test("the hero requests no candidate wider than it paints", async ({ page }) => {
    await page.goto("/");
    const sizes = await page.locator("section img").first().getAttribute("sizes");
    // 110vw asked for 10% more pixels than are ever drawn at desktop widths.
    expect(sizes).not.toMatch(/\b1[1-9]\dvw\s*$/);
    expect(sizes).toMatch(/100vw$/);
  });

  test("nothing is loaded cross-origin", async ({ page }) => {
    // Worth protecting deliberately: analytics is proxied through this domain
    // and fonts are self-hosted, so a third-party request means something new
    // slipped in.
    const external: string[] = [];
    page.on("request", (r) => {
      const url = new URL(r.url());
      if (url.hostname !== "localhost") external.push(url.origin);
    });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.goto("/quote", { waitUntil: "networkidle" });
    expect([...new Set(external)]).toEqual([]);
  });
});
