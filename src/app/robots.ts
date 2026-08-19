import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /quote/thank-you is a conversion page: reachable and trackable, but
        // it must never compete with /quote in search.
        disallow: ["/quote/thank-you"],
      },
    ],
    sitemap: "https://www.ips-pl.com/sitemap.xml",
    host: "https://www.ips-pl.com",
  };
}
