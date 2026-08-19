import { expect, test } from "@playwright/test";

/**
 * 3.2 — every response carries the security headers, and the rate limiter
 * reports itself so a client can back off.
 */
test.describe("security headers", () => {
  const REQUIRED = {
    "strict-transport-security": /max-age=\d{7,}/,
    "x-frame-options": /DENY/i,
    "x-content-type-options": /nosniff/,
    "referrer-policy": /strict-origin-when-cross-origin/,
    "permissions-policy": /camera=\(\)/,
  };

  /** Follows CSP_ENFORCE so the suite passes in either mode. */
  const CSP_HEADER =
    process.env.CSP_ENFORCE === "1"
      ? "content-security-policy"
      : "content-security-policy-report-only";

  for (const path of ["/", "/products/ptfe-lined-pipes", "/quote"]) {
    test(`present on ${path}`, async ({ request }) => {
      const headers = (await request.get(path)).headers();
      for (const [key, pattern] of Object.entries(REQUIRED)) {
        expect(headers[key], key).toMatch(pattern);
      }
      expect(headers[CSP_HEADER], CSP_HEADER).toMatch(/default-src 'self'/);
    });
  }

  test("the policy forbids framing, plugins and off-origin form posts", async ({ request }) => {
    const csp = (await request.get("/")).headers()[CSP_HEADER];
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("base-uri 'self'");
    // Report-only until the reports are clean — enforcing blind breaks pages.
    expect(csp).toContain("report-uri /api/csp-report");
  });

  test("no framework version is advertised", async ({ request }) => {
    expect((await request.get("/")).headers()["x-powered-by"]).toBeUndefined();
  });

  test("the CSP report endpoint accepts a report", async ({ request }) => {
    const response = await request.post("/api/csp-report", {
      headers: { "Content-Type": "application/csp-report" },
      data: JSON.stringify({
        "csp-report": {
          "document-uri": "https://www.ips-pl.com/",
          "violated-directive": "script-src",
          "blocked-uri": "inline",
        },
      }),
    });
    expect(response.status()).toBe(204);
  });
});

test.describe("rate limiting", () => {
  test("every enquiry response reports the limit", async ({ request }) => {
    const response = await request.post("/api/enquiry", {
      form: { kind: "contact", name: "", company: "", email: "x", message: "" },
    });
    const headers = response.headers();
    expect(headers["x-ratelimit-limit"]).toBeDefined();
    expect(headers["x-ratelimit-remaining"]).toBeDefined();
    expect(headers["x-ratelimit-reset"]).toBeDefined();
  });

  test("exceeding the limit returns 429 with Retry-After", async ({ request }) => {
    // A fresh IP per test run, so this cannot be tripped by other specs.
    const ip = `203.0.113.${Math.floor(Date.now() % 200) + 1}`;
    const post = () =>
      request.post("/api/enquiry", {
        headers: { "x-forwarded-for": ip },
        form: { kind: "contact", name: "", company: "", email: "x", message: "" },
      });

    let limited: Awaited<ReturnType<typeof post>> | null = null;
    // The window allows 5; the sixth must be refused.
    for (let i = 0; i < 8 && !limited; i++) {
      const response = await post();
      if (response.status() === 429) limited = response;
    }

    expect(limited, "no request was rate limited within 8 attempts").not.toBeNull();
    const retryAfter = Number(limited!.headers()["retry-after"]);
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(600);
    expect(limited!.headers()["x-ratelimit-remaining"]).toBe("0");

    const body = await limited!.json();
    expect(body.kind).toBe("rate_limited");
  });
});
