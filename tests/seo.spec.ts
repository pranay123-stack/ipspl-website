import { expect, test } from "@playwright/test";

/**
 * Phase 4 — SEO guarantees that a length lint cannot express.
 *
 * Lengths and uniqueness are enforced by `npm run check:seo`, which runs in
 * the build. These cover structure: schema types, feed discovery, outbound
 * links, and the rule that decides whether a legal page is indexable.
 */
function graphs(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]))
    .flatMap((g) => g["@graph"] ?? [g]);
}

test.describe("structured data", () => {
  test("the organisation is a LocalBusiness with published opening hours", async ({ request }) => {
    const nodes = graphs(await (await request.get("/")).text());
    const org = nodes.find((n) => String(n["@type"]).includes("Organization"))!;
    expect(org["@type"]).toEqual(["Organization", "LocalBusiness"]);

    const hours = org.openingHoursSpecification;
    expect(hours).toHaveLength(2);
    expect(hours[0].dayOfWeek).toEqual([
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    ]);
    expect(hours[0].opens).toBe("08:00");
    expect(hours[0].closes).toBe("18:00");
    expect(hours[1].dayOfWeek).toEqual(["Saturday"]);

    // Facts IPS-PL has not supplied stay absent rather than approximated.
    for (const field of ["geo", "foundingDate", "numberOfEmployees", "taxID", "sameAs"]) {
      expect(org[field], field).toBeUndefined();
    }
  });

  test("every industry page carries Service schema naming its products", async ({ request }) => {
    for (const slug of ["chemical", "pharmaceutical", "power"]) {
      const nodes = graphs(await (await request.get(`/industries/${slug}`)).text());
      const service = nodes.find((n) => n["@type"] === "Service");
      expect(service, slug).toBeDefined();
      expect(service!.provider).toBeDefined();
      expect(service!.hasOfferCatalog.itemListElement.length).toBeGreaterThan(0);
    }
  });

  test("the listing pages carry ItemList", async ({ request }) => {
    for (const path of ["/insights", "/case-studies", "/products", "/industries"]) {
      const nodes = graphs(await (await request.get(path)).text());
      expect(nodes.some((n) => n["@type"] === "ItemList"), path).toBe(true);
    }
  });

  test("Product.offers deliberately publishes no price", async ({ request }) => {
    const nodes = graphs(await (await request.get("/products/ptfe-lined-pipes")).text());
    const product = nodes.find((n) => n["@type"] === "Product")!;
    expect(product.offers.price).toBeUndefined();
    expect(product.offers.priceCurrency).toBeUndefined();
    // The position is still stated, rather than simply omitted.
    expect(product.offers.priceSpecification.description).toContain("Quoted on application");
  });

  test("articles attribute to the organisation until a person is named", async ({ request }) => {
    const nodes = graphs(await (await request.get("/insights/vacuum-service-lined-pipe")).text());
    const article = nodes.find((n) => n["@type"] === "Article")!;
    expect(article.author["@type"]).toBe("Organization");
  });
});

test.describe("metadata hygiene", () => {
  test("no page publishes a keywords meta tag", async ({ request }) => {
    for (const path of ["/", "/products", "/quote", "/insights"]) {
      expect((await (await request.get(path)).text()).includes('name="keywords"'), path).toBe(false);
    }
  });

  test("a pending legal page is noindex; an approved one is not", async ({ request }) => {
    // Indexing follows the content: the cookie policy states verifiable fact,
    // the other two are still scaffolding.
    for (const slug of ["privacy", "terms"]) {
      const html = await (await request.get(`/legal/${slug}`)).text();
      expect(html, slug).toContain('content="noindex, follow"');
    }
    const cookies = await (await request.get("/legal/cookies")).text();
    expect(cookies).not.toContain("noindex");
  });

  test("only approved legal pages appear in the sitemap", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("/legal/cookies");
    expect(xml).not.toContain("/legal/privacy");
    expect(xml).not.toContain("/legal/terms");
  });
});

test.describe("feed", () => {
  test("/rss.xml is a valid feed with every article", async ({ request }) => {
    const response = await request.get("/rss.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/rss+xml");

    const xml = await response.text();
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('rel="self"');
    expect((xml.match(/<item>/g) ?? []).length).toBe(6);
    // Feed entries must be absolute, or readers cannot resolve them.
    expect(xml).not.toMatch(/<link>\/(?!\/)/);
  });

  test("/feed.xml and /atom.xml redirect rather than 404", async ({ request }) => {
    for (const path of ["/feed.xml", "/atom.xml"]) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(308);
      expect(response.headers()["location"], path).toContain("/rss.xml");
    }
  });

  test("the feed is discoverable from the page head", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toMatch(/rel="alternate"[^>]*application\/rss\+xml|application\/rss\+xml[^>]*rel="alternate"/);
  });
});

test.describe("outbound authority links", () => {
  test("cited standards link to their publishing bodies", async ({ page }) => {
    await page.goto("/products/ptfe-lined-pipes");
    const external = page.locator('a[href^="https://"]:not([href*="ips-pl.com"])');
    expect(await external.count()).toBeGreaterThan(0);

    for (const link of await external.all()) {
      // Opening a new tab without noopener hands the opener to a third party.
      expect(await link.getAttribute("rel")).toContain("noopener");
      expect(await link.getAttribute("target")).toBe("_blank");
      // Where it goes must be announced, not just implied by an icon.
      expect(await link.locator(".sr-only").count()).toBeGreaterThan(0);
    }
  });
});
