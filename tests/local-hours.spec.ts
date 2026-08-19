import { expect, test } from "@playwright/test";

/**
 * Opening hours in the visitor's own time zone.
 *
 * The site claims to support enquiries "in local time zones" while printing
 * its hours only in IST. These check the arithmetic against real zones —
 * a wrong conversion here tells a buyer the works is open when it is asleep,
 * which is worse than not converting at all.
 */
async function hoursText(page: import("@playwright/test").Page) {
  await page.goto("/contact");
  await page.waitForTimeout(900); // conversion is applied after mount
  return page.evaluate(() =>
    [...document.querySelectorAll("p")]
      .filter((n) => /IST/.test(n.textContent ?? ""))
      .map((n) => (n as HTMLElement).innerText.replace(/\s+/g, " ").trim()),
  );
}

test.describe("opening hours", () => {
  test.describe("a visitor in India", () => {
    test.use({ timezoneId: "Asia/Kolkata" });
    test("sees no conversion, because it would say the same thing twice", async ({ page }) => {
      const lines = await hoursText(page);
      expect(lines[0]).toContain("08:00 – 18:00 IST");
      expect(lines.join(" ")).not.toContain("your time");
    });
  });

  test.describe("a visitor in Canada", () => {
    test.use({ timezoneId: "America/Edmonton" });
    test("is told the works is open through their night", async ({ page }) => {
      const lines = await hoursText(page);
      // 08:00 IST = 02:30 UTC = 20:30 the previous day in Edmonton (UTC-6).
      expect(lines[0]).toContain("20:30 – 06:30 your time");
      expect(lines[0]).toContain("previous day");
    });
  });

  test.describe("a visitor in Vietnam", () => {
    test.use({ timezoneId: "Asia/Ho_Chi_Minh" });
    test("sees a same-day window with no day shift", async ({ page }) => {
      const lines = await hoursText(page);
      // UTC+7, so 1h30 ahead of IST.
      expect(lines[0]).toContain("09:30 – 19:30 your time");
      expect(lines[0]).not.toContain("previous day");
      expect(lines[0]).not.toContain("next day");
    });
  });

  test.describe("a visitor in China", () => {
    test.use({ timezoneId: "Asia/Shanghai" });
    test("sees the correct 2h30 offset", async ({ page }) => {
      const lines = await hoursText(page);
      expect(lines[0]).toContain("10:30 – 20:30 your time");
    });
  });

  test("the IST times are in the HTML before any JavaScript runs", async ({ browser }) => {
    // Progressive: the published hours must survive with JS disabled, since
    // they are the fact and the conversion is only a convenience.
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/contact");
    const body = await page.locator("body").innerText();
    expect(body).toContain("08:00 – 18:00 IST");
    expect(body).toContain("09:00 – 14:00 IST");
    await ctx.close();
  });
});
