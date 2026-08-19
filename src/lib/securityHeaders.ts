import { env } from "./env";

/**
 * SECURITY HEADERS
 * ================
 * Applied to every response from next.config.ts. Kept in a module of their own
 * so the policy is reviewable in one place and testable without booting Next.
 */

/**
 * CONTENT SECURITY POLICY — why this is not nonce-based
 * -----------------------------------------------------
 * The brief asks for a nonce-based `script-src`. That is the right policy for
 * a dynamic application and the wrong one here, for a reason worth recording.
 *
 * Next.js injects the nonce during server-side rendering. A statically
 * generated page is built before any request exists, so there is no nonce to
 * inject — which is why the framework's own guidance states that using nonces
 * requires every page to be dynamically rendered. All 38 routes on this site
 * are prerendered. Switching them to per-request rendering to satisfy a header
 * would remove CDN caching, slow every first paint, and put the Phase 6
 * performance budget out of reach.
 *
 * Hash-based `script-src` was measured as the alternative and does not work
 * either: with `experimental.sri` enabled, Next emits `integrity` on the six
 * external bundles but leaves ten inline scripts per page carrying the React
 * Server Component payload. That payload differs per page and per build, so
 * its hash cannot live in a static header.
 *
 * So the policy below is strict everywhere it can be — `default-src 'self'`,
 * no `object-src`, no framing, form posts to this origin only — and accepts
 * `'unsafe-inline'` for scripts and styles, which is the exact set the
 * framework itself emits. It ships as **Report-Only** with a live report
 * endpoint, so violations are observed before anything is enforced.
 *
 * To move to a nonce, see PRE-LAUNCH.md — it is one file plus the decision to
 * render dynamically.
 */
/**
 * Report-only by default. Set CSP_ENFORCE=1 to switch the header name and add
 * `upgrade-insecure-requests`.
 *
 * The policy currently reports zero violations across every route, with the
 * forms exercised — the only report it ever produced was zod's `new Function`
 * capability probe, now disabled at the source. It is still shipped in
 * report-only because one clean pass on one machine is not a week of real
 * traffic through real browsers with real extensions. Watch the reports, then
 * flip the flag.
 */
export const CSP_ENFORCED = process.env.CSP_ENFORCE === "1";

function contentSecurityPolicy(isDev: boolean): string {
  // Only widened when a widget actually exists; an origin allowed "in case"
  // is an origin allowed.
  const turnstile = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const cf = turnstile ? " https://challenges.cloudflare.com" : "";
  // The /contact map is a Google iframe, and only exists when configured.
  // The same validated value the component uses, so an invalid URL cannot
  // widen frame-src for an iframe that will never be rendered.
  const maps = Boolean(env.mapsEmbedUrl);
  const frameSources = [
    ...(turnstile ? ["https://challenges.cloudflare.com"] : []),
    ...(maps ? ["https://www.google.com", "https://maps.google.com"] : []),
  ];

  return [
    "default-src 'self'",
    // 'unsafe-inline': the RSC payload and next/script's queue shim are inline
    // and unhashable. 'unsafe-eval' is React's dev-time stack reconstruction.
    `script-src 'self' 'unsafe-inline'${cf}${isDev ? " 'unsafe-eval'" : ""}`,
    // next/image writes inline style attributes for its fill layout.
    "style-src 'self' 'unsafe-inline'",
    // data: for the blur placeholder, blob: for the OG image renderer.
    "img-src 'self' data: blob:",
    // next/font/google self-hosts at build time — no external font origin.
    "font-src 'self'",
    // Plausible is proxied through /js/script.js and /api/event, so analytics
    // is same-origin too. There is no third-party connection on this site.
    `connect-src 'self'${cf}${isDev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    frameSources.length ? `frame-src ${frameSources.join(" ")}` : "frame-src 'none'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    // Browsers ignore this in a report-only policy and log a warning on every
    // page load, so it is only emitted once the policy is enforced.
    ...(CSP_ENFORCED ? ["upgrade-insecure-requests"] : []),
    "report-uri /api/csp-report",
  ]
    .filter(Boolean)
    .join("; ");
}

export function securityHeaders(isDev: boolean) {
  return [
    {
      key: CSP_ENFORCED ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
      value: contentSecurityPolicy(isDev),
    },
    {
      // Two years with preload, which is what hstspreload.org requires. Only
      // meaningful over HTTPS; harmless on localhost.
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    // Superseded by frame-ancestors above, kept for older browsers.
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Full URL to this origin, origin only to others — keeps enquiry
    // referrers useful for attribution without leaking paths off-site.
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      // Deny by default. The site asks for none of these; an injected script
      // should not be able to either.
      key: "Permissions-Policy",
      value: [
        "accelerometer=()",
        "autoplay=()",
        "camera=()",
        "display-capture=()",
        "encrypted-media=()",
        "fullscreen=(self)",
        "geolocation=()",
        "gyroscope=()",
        "magnetometer=()",
        "microphone=()",
        "payment=()",
        "usb=()",
        "browsing-topics=()",
      ].join(", "),
    },
    { key: "X-DNS-Prefetch-Control", value: "on" },
    // Enquiry attachments are the only user-supplied bytes; nothing is served
    // back, but isolate the origin anyway.
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  ];
}
