import type { Product } from "@/lib/types";
import { findSpec } from "@/lib/productSpecs";

/**
 * PRODUCT FAQs
 * ============
 * Derived from the specification, standards, materials and quality content
 * already published on each product page — never authored separately.
 *
 * That constraint is deliberate: an FAQ block wired to FAQPage schema is
 * making machine-readable claims, so every answer has to be traceable to a
 * figure IPS-PL has already stated. A question is skipped entirely when the
 * underlying data is absent, rather than answered with a generality.
 */

export interface FaqEntry {
  question: string;
  answer: string;
}

function sentence(list: string[]): string {
  if (list.length === 0) return "";
  if (list.length === 1) return list[0]!;
  return `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]!}`;
}

export function productFaq(product: Product): FaqEntry[] {
  const entries: FaqEntry[] = [];
  const spec = product.specifications;

  const bore = findSpec(spec, "Nominal bore", "Sheet thickness");
  if (bore) {
    entries.push({
      question: `What sizes are ${product.title} available in?`,
      answer: `${bore}. Sizes outside this range are engineered to drawing — send your process data and we will confirm.`,
    });
  }

  const temperature = findSpec(spec, "Service temperature");
  if (temperature) {
    entries.push({
      question: `What is the service temperature range for ${product.title}?`,
      answer: `${temperature}. Both normal operating and upset conditions are reviewed before a liner grade is fixed.`,
    });
  }

  const pressure = findSpec(spec, "Design pressure", "Pressure class");
  if (pressure) {
    const vacuum = /vacuum/i.test(pressure)
      ? " Vacuum service is covered by this rating; declare it at enquiry stage because it governs liner thickness."
      : "";
    entries.push({
      question: `What pressure rating do ${product.title} carry?`,
      answer: `${pressure}.${vacuum}`,
    });
  }

  if (product.materials.length > 0) {
    entries.push({
      question: `Which lining materials are offered for ${product.title}?`,
      answer: `${sentence(product.materials.map((m) => m.split("—")[0]!.trim()))}. Grade selection is made against the full chemical inventory, including cleaning agents.`,
    });
  }

  const lining = findSpec(product.standards, "Lining specification", "Material specification");
  if (lining) {
    entries.push({
      question: `What standard governs ${product.title}?`,
      answer: `${lining}. A full list of the design and dimensional standards referenced is published on this page.`,
    });
  }

  if (product.quality.length > 0) {
    entries.push({
      question: `How are ${product.title} verified before despatch?`,
      answer: `${sentence(product.quality.slice(0, 3).map((q) => q.toLowerCase()))}. Test and guarantee certificates are issued with supply.`,
    });
  }

  if (product.applications.length > 0) {
    entries.push({
      question: `Where are ${product.title} typically used?`,
      answer: `${sentence(product.applications.slice(0, 4).map((a) => a.toLowerCase()))}.`,
    });
  }

  if (product.documents.length > 0) {
    entries.push({
      question: `Can I get a datasheet for ${product.title}?`,
      answer: `Yes. ${sentence(product.documents.map((d) => d.title.toLowerCase()))} are available on request from this page.`,
    });
  }

  return entries;
}
