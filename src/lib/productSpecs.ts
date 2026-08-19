import type { Product, SpecRow } from "@/lib/types";
import { published } from "@/lib/content";

/**
 * Spec lookup shared by the product cards, the comparison table and (in
 * Phase 3) the Product schema. Reading from the same `specifications` array
 * the detail pages render means the three can never drift apart.
 *
 * Returns null rather than a guess when a product does not publish a figure —
 * no spec is ever invented to fill a column.
 */
export function findSpec(rows: SpecRow[], ...labels: string[]): string | null {
  for (const label of labels) {
    const hit = rows.find((r) => r.label.toLowerCase() === label.toLowerCase());
    // A row awaiting engineering input is treated as unpublished, not as a
    // value — otherwise "TODO(content): confirm" reaches the comparison
    // table and Product.additionalProperty.
    if (hit && published(hit.value)) return hit.value;
  }
  return null;
}

/** Rows safe to render — filter before slicing, never after. */
export function publishedSpecs(rows: SpecRow[]): SpecRow[] {
  return rows.filter((row) => published(row.value));
}

export interface HeadlineSpec {
  bore: string | null;
  temperature: string | null;
  pressure: string | null;
  standard: string | null;
}

export function headlineSpec(product: Product): HeadlineSpec {
  return {
    // ptfe-products publishes stock dimensions rather than a bore.
    bore: findSpec(product.specifications, "Nominal bore", "Sheet thickness"),
    temperature: findSpec(product.specifications, "Service temperature"),
    pressure: findSpec(product.specifications, "Design pressure", "Pressure class"),
    standard: findSpec(product.standards, "Lining specification", "Material specification"),
  };
}

/** Liner/material options, trimmed to the grade name before the em dash. */
export function linerOptions(product: Product): string[] {
  return product.materials
    .map((m) => m.split("—")[0]!.trim())
    .filter((m) => /PTFE|PFA|FEP|PVDF/i.test(m));
}
