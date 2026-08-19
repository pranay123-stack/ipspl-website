import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

/**
 * The scheduling link must stay a link.
 *
 * Embedding a scheduler would run a third party's script inside our pages,
 * which makes their cookies ours — and /legal/cookies states plainly that this
 * site sets none, a claim EU/UK visitors would otherwise need a consent banner
 * to make lawful. These tests exist because "we'll just embed it, it's easier"
 * is a one-line change somebody could make in a year without knowing what it
 * costs.
 */
const COMPANY = "src/data/company.ts";

test.describe("booking link", () => {
  test("opens the scheduler in a new tab, safely", async ({ page }) => {
    for (const path of ["/quote", "/contact"]) {
      await page.goto(path);
      const link = page.getByRole("link", { name: /book a call/i }).first();
      await expect(link).toBeVisible();
      // target=_blank without noopener hands the opener to a third party.
      await expect(link).toHaveAttribute("target", "_blank");
      expect(await link.getAttribute("rel")).toContain("noopener");
      expect(await link.getAttribute("href")).toMatch(/^https:\/\//);
      // Tap target.
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("no scheduler is embedded anywhere", async ({ page }) => {
    for (const path of ["/quote", "/contact", "/"]) {
      await page.goto(path, { waitUntil: "networkidle" });
      const frames = await page.locator("iframe").evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute("src") ?? ""),
      );
      for (const src of frames) {
        expect(src, `${path} embeds a scheduler`).not.toMatch(
          /calendly|cal\.com|savvycal|hubspot\.com\/meetings|zcal/i,
        );
      }
    }
  });

  test("the CSP would still block a scheduler iframe", async ({ request }) => {
    // Defence in depth: even if a widget were added, frame-src has to be
    // widened deliberately for it to load. That is the moment someone has to
    // think about the cookie policy.
    const headers = (await request.get("/quote")).headers();
    const csp =
      headers["content-security-policy"] ?? headers["content-security-policy-report-only"];
    expect(csp).toMatch(/frame-src (?:'none'|https:\/\/challenges\.cloudflare\.com|https:\/\/www\.google\.com)/);
    expect(csp).not.toMatch(/calendly|cal\.com/i);
  });

  test("the field is documented as a link, not an embed", () => {
    // The comment is the guard rail for whoever fills the field in.
    const source = readFileSync(COMPANY, "utf8");
    expect(source).toContain("bookingUrl");
    expect(source).toMatch(/never an embed/i);
  });
});
