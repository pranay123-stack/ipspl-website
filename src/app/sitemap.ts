import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { industries } from "@/data/industries";
import { insights } from "@/data/insights";
import { caseStudies } from "@/data/projects";
import { legalPages } from "@/data/legal";

const BASE = "https://www.ips-pl.com";

/** Generated from the data files, so new content is indexed automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/products`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/industries`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/engineering`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/capabilities`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/case-studies`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/insights`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/quote`, changeFrequency: "yearly", priority: 0.9 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.8 },
  ] satisfies MetadataRoute.Sitemap).map((route) => ({ ...route, lastModified: now }));

  return [
    ...staticRoutes,
    ...products.map((product) => ({
      url: `${BASE}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...industries.map((industry) => ({
      url: `${BASE}/industries/${industry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...insights.map((insight) => ({
      url: `${BASE}/insights/${insight.slug}`,
      lastModified: new Date(insight.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...caseStudies.map((study) => ({
      url: `${BASE}/case-studies/${study.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...legalPages.map((page) => ({
      url: `${BASE}/legal/${page.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
