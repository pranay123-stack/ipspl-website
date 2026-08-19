import { industries } from "@/data/industries";
import { insights } from "@/data/insights";
import { getProduct, products } from "@/data/products";
import { caseStudies } from "@/data/projects";
import type { CaseStudy, Industry, Insight, Product } from "@/lib/types";

/**
 * CONTEXTUAL CROSS-LINKS
 * ======================
 * Generated from the data model rather than hand-written, so they cannot go
 * stale when a product or industry changes. 20 of 31 routes previously carried
 * exactly the header + footer link set and nothing of their own.
 */

/** Industries whose productSlugs name this product. */
export function industriesForProduct(slug: string): Industry[] {
  return industries.filter((industry) => industry.productSlugs.includes(slug));
}

/** Articles that name this product. */
export function insightsForProduct(slug: string): Insight[] {
  return insights.filter((insight) => insight.relatedProductSlugs?.includes(slug));
}

/** Products an industry actually specifies. */
export function productsForIndustry(industry: Industry): Product[] {
  return industry.productSlugs
    .map(getProduct)
    .filter((p): p is Product => p !== undefined);
}

/** Products an article is about. */
export function productsForInsight(insight: Insight): Product[] {
  return (insight.relatedProductSlugs ?? [])
    .map(getProduct)
    .filter((p): p is Product => p !== undefined);
}

/** Articles relevant to an industry, via the products it specifies. */
export function insightsForIndustry(industry: Industry): Insight[] {
  const seen = new Set<string>();
  const out: Insight[] = [];
  for (const slug of industry.productSlugs) {
    for (const insight of insightsForProduct(slug)) {
      if (!seen.has(insight.slug)) {
        seen.add(insight.slug);
        out.push(insight);
      }
    }
  }
  return out.slice(0, 3);
}

/** Reference installations that supplied this product. */
export function caseStudiesForProduct(slug: string): CaseStudy[] {
  return caseStudies.filter((study) => study.productSlugs.includes(slug));
}

/**
 * Reference installations relevant to an industry.
 *
 * Matched through the products the industry specifies rather than by comparing
 * `sector` strings — an industry page and a case study can word the same sector
 * differently, and a shared product is the harder evidence of relevance.
 */
export function caseStudiesForIndustry(industry: Industry): CaseStudy[] {
  return caseStudies.filter((study) =>
    study.productSlugs.some((slug) => industry.productSlugs.includes(slug)),
  );
}

export { products };
