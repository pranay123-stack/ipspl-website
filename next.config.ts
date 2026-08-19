import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All imagery is self-hosted under /public/images — no remote loader,
    // so there is no third-party image host to preconnect to.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920, 2560],
  },
  poweredByHeader: false,

  // First-party proxy for Plausible, so ad blockers do not remove the tag.
  async rewrites() {
    return [
      { source: "/js/script.js", destination: "https://plausible.io/js/script.js" },
      { source: "/api/event", destination: "https://plausible.io/api/event" },
    ];
  },
};

export default nextConfig;
