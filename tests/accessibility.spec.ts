import { expect, test } from "@playwright/test";

/**
 * Phase 5 — accessibility guarantees.
 *
 * These cover the claims that are easy to make and easy to break: that the
 * drawer really traps focus, that the active nav item is announced and not
 * merely underlined, and that no decorative icon reaches the accessibility
 * tree unlabelled.
 */
test.describe("mobile navigation drawer", () => {
  test.use({ viewport: { width: 390, height: 780 } });

  test("the trigger names the drawer it controls", async ({ page }) => {
    await page.goto("/");
    const trigger = page.locator("header button[aria-haspopup='dialog']");

    const controls = await trigger.getAttribute("aria-controls");
    expect(controls).toBe("mobile-nav-drawer");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // aria-controls must name an element that exists, or it is worse than absent.
    await expect(page.locator(`#${controls}`)).toBeVisible();
  });

  test("focus is trapped inside the drawer", async ({ page }) => {
    await page.goto("/");
    await page.locator("header button[aria-haspopup='dialog']").click();
    await page.waitForTimeout(300);

    // Tab well past the number of stops in the drawer and record every one.
    //
    // The assertion is deliberately not "activeElement is always inside the
    // dialog": Chromium inserts a single stop on <body> at the end of a modal
    // dialog's tab cycle before wrapping back to the top. That is the
    // browser's own behaviour, not a leak — what would be a leak is focus
    // reaching a real element behind the dialog.
    const escapes: string[] = [];
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const escaped = await page.evaluate(() => {
        const dialog = document.getElementById("mobile-nav-drawer");
        const active = document.activeElement;
        if (!active || active === document.body) return null;
        if (dialog?.contains(active)) return null;
        return `${active.tagName}:${(active.textContent ?? "").trim().slice(0, 30)}`;
      });
      if (escaped) escapes.push(`tab ${i + 1} → ${escaped}`);
    }
    expect(escapes, "focus reached an element behind the dialog").toEqual([]);

    // And the cycle must come back, rather than stranding the user on <body>.
    const returned = await page.evaluate(() => {
      const dialog = document.getElementById("mobile-nav-drawer");
      return Boolean(dialog?.contains(document.activeElement));
    });
    expect(returned, "focus did not return into the dialog").toBe(true);
  });

  test("the page behind the drawer is inert", async ({ page }) => {
    await page.goto("/");
    await page.locator("header button[aria-haspopup='dialog']").click();
    await page.waitForTimeout(300);

    // showModal() makes the rest of the document inert; this proves it rather
    // than trusting it — a hand-rolled overlay would fail here.
    const refused = await page.evaluate(() => {
      const link = document.querySelector<HTMLElement>("main a[href]");
      if (!link) return "no link to test";
      link.focus();
      return document.activeElement !== link;
    });
    expect(refused).toBe(true);
  });

  test("Escape closes it and returns focus to the trigger", async ({ page }) => {
    await page.goto("/");
    const trigger = page.locator("header button[aria-haspopup='dialog']");
    await trigger.click();
    await page.waitForTimeout(300);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    const focused = await page.evaluate(
      () => document.activeElement?.getAttribute("aria-haspopup") === "dialog",
    );
    expect(focused, "focus did not return to the trigger").toBe(true);
  });
});

test.describe("current page marking", () => {
  test("the primary nav announces the current page", async ({ page }) => {
    await page.goto("/products");
    const current = page.locator('nav[aria-label="Primary"] [aria-current="page"]');
    expect(await current.count()).toBe(1);
    await expect(current).toHaveText(/products/i);
  });

  test("a section containing the current page is marked, but not as 'page'", async ({ page }) => {
    // Exactness matters: on a product detail page the Products nav item is an
    // ancestor, not the page itself.
    await page.goto("/products/ptfe-lined-pipes");
    const marked = page.locator('nav[aria-label="Primary"] [aria-current]');
    expect(await marked.count()).toBeGreaterThan(0);
    expect(await marked.first().getAttribute("aria-current")).toBe("true");
    expect(await page.locator('nav[aria-label="Primary"] [aria-current="page"]').count()).toBe(0);
  });

  test("exactly one element per page is aria-current='page'", async ({ page }) => {
    for (const path of ["/products", "/industries", "/contact", "/quote"]) {
      await page.goto(path);
      const count = await page.locator('header [aria-current="page"]').count();
      expect(count, path).toBe(1);
    }
  });

  test("the footer marks the current page too", async ({ page }) => {
    await page.goto("/capabilities");
    expect(await page.locator('footer [aria-current="page"]').count()).toBeGreaterThan(0);
  });
});

test.describe("icons and language", () => {
  test("no svg reaches the accessibility tree unlabelled", async ({ page }) => {
    for (const path of ["/", "/products", "/contact", "/quote"]) {
      await page.goto(path);
      const unlabelled = await page.evaluate(() =>
        [...document.querySelectorAll("svg")].filter((svg) => {
          if (svg.getAttribute("aria-hidden") === "true") return false;
          if (svg.getAttribute("aria-label")) return false;
          if (svg.querySelector("title")) return false;
          // An svg inside a labelled control is announced by the control.
          const control = svg.closest("button, a");
          return !(control?.getAttribute("aria-label") || control?.textContent?.trim());
        }).length,
      );
      expect(unlabelled, path).toBe(0);
    }
  });

  test("the document declares the Indian English locale", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator("html").getAttribute("lang")).toBe("en-IN");
  });

  test("articles carry in-body headings a screen reader can navigate", async ({ page }) => {
    // 2.2 landed this; 5.6 asks for it to be verified rather than assumed.
    for (const slug of [
      "why-lined-systems-fail-at-the-joint",
      "selecting-a-fluoropolymer-liner",
      "vacuum-service-lined-pipe",
    ]) {
      await page.goto(`/insights/${slug}`);
      const headings = await page.locator("main article h2").count();
      expect(headings, slug).toBeGreaterThan(0);
    }
  });
});

test.describe("skip link", () => {
  test("moves focus into main, not just the scroll position", async ({ page }) => {
    // A bare <main id="main"> is not focusable, so activating the skip link
    // scrolled the page but left focus in the header — the next Tab then walked
    // back through the navigation the user had just asked to skip.
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveText(/skip to content/i);

    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("main");
  });

  test("the next tab after skipping lands inside main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    await page.keyboard.press("Tab");

    const insideMain = await page.evaluate(() =>
      Boolean(document.getElementById("main")?.contains(document.activeElement)),
    );
    expect(insideMain, "focus went back into the header").toBe(true);
  });
});
