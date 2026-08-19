import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/securityHeaders";

const nextConfig: NextConfig = {
  images: {
    // All imagery is self-hosted under /public/images — no remote loader,
    // so there is no third-party image host to preconnect to.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920, 2560],
    /*
     * One year. Optimised images were returning max-age=14400 — four hours —
     * so every returning visitor refetched every photograph on the fifth hour
     * of a site whose imagery changes a few times a year.
     *
     * Safe because replacing a photograph changes its URL: stock lives under
     * /images/placeholder/<key>.jpg and real photography goes to
     * /images/<key>.jpg, so the handover step that swaps an image also busts
     * its cache. If that convention is ever abandoned, this must come down.
     */
    minimumCacheTTL: 31_536_000,
  },
  poweredByHeader: false,

  // Applied to every response, including static assets and API routes.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders(process.env.NODE_ENV === "development"),
      },
    ];
  },

  // /feed.xml is the other convention readers try; both 404'd before.
  async redirects() {
    return [
      { source: "/feed.xml", destination: "/rss.xml", permanent: true },
      { source: "/atom.xml", destination: "/rss.xml", permanent: true },
    ];
  },

  // First-party proxy for Plausible, so ad blockers do not remove the tag.
  async rewrites() {
    return [
      { source: "/js/script.js", destination: "https://plausible.io/js/script.js" },
      { source: "/api/event", destination: "https://plausible.io/api/event" },
    ];
  },
};

export default nextConfig;
