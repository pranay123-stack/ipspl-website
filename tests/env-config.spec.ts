import { expect, test } from "@playwright/test";

/**
 * Deployment-configurable values.
 *
 * The guarantee under test is not "the value appears" — it is that a *missing
 * or malformed* value degrades to nothing rendering, rather than to a link
 * that goes nowhere. A typo in a hosting dashboard is the likely failure here,
 * and nobody would see it before a customer did.
 */
test.describe("environment configuration", () => {
  test("published contact details fall back rather than rendering blank", async ({ page }) => {
    // No NEXT_PUBLIC_* content vars are set in this run, so these come from
    // the built-in defaults. A blank here would be a gap where a phone number
    // belongs, on the page whose whole job is being contactable.
    await page.goto("/contact");
    await expect(page.getByRole("link", { name: /\+91 2668 263555/ }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /sales@ips-pl\.com/ }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /info@ips-pl\.com/ }).first()).toBeVisible();
  });

  test("an unset optional URL renders nothing at all", async ({ page }) => {
    await page.goto("/contact");

    // No maps URL is configured in this run, so there must be no iframe and
    // no "Show map" control — the panel falls back to the address alone.
    expect(await page.locator("iframe").count()).toBe(0);
    expect(await page.getByRole("button", { name: /show map/i }).count()).toBe(0);

    // No Google Business Profile either, so no Directions link.
    expect(await page.getByRole("link", { name: /directions/i }).count()).toBe(0);

    // And no LinkedIn, so the footer renders no social link rather than a
    // dead one — the same rule, on a different slot.
    expect(await page.locator('footer a[href*="linkedin"]').count()).toBe(0);
  });

  test("a configured URL renders, proving the fallback is not just always-off", async ({ page }) => {
    // NEXT_PUBLIC_BOOKING_URL is set for this run. Without this half, the
    // test above would pass just as well if the feature were broken outright.
    await page.goto("/quote");
    const link = page.getByRole("link", { name: /book a call/i }).first();
    await expect(link).toBeVisible();
    expect(await link.getAttribute("href")).toContain("calendly.com");
  });

  test("no href is ever empty, on any key page", async ({ page }) => {
    for (const path of ["/", "/contact", "/quote", "/products/ptfe-lined-pipes"]) {
      await page.goto(path);
      const dead = await page.evaluate(() =>
        [...document.querySelectorAll("a")]
          .filter((a) => {
            const href = a.getAttribute("href");
            return href === "" || href === "#" || href === "null" || href === "undefined";
          })
          .map((a) => a.textContent?.trim().slice(0, 30)),
      );
      expect(dead, path).toEqual([]);
    }
  });

  test("the CSP only widens for services that are configured", async ({ request }) => {
    const headers = (await request.get("/contact")).headers();
    const csp =
      headers["content-security-policy"] ?? headers["content-security-policy-report-only"];
    // Neither the map nor Turnstile is configured in this run, so neither
    // origin may appear — an origin allowed "in case" is an origin allowed.
    expect(csp).toContain("frame-src 'none'");
    expect(csp).not.toContain("google.com");
    expect(csp).not.toContain("challenges.cloudflare.com");
  });
});
