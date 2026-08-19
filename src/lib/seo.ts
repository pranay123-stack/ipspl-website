import type { Metadata } from "next";

/**
 * SEO helpers.
 *
 * Hub titles were 14–21 characters ("About | IPS-PL") and ranked for nothing a
 * buyer types. These build 50–60 character titles carrying the primary
 * commercial keyword plus the brand, matching the pattern the product and
 * industry pages already use.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ips-pl.com";

/**
 * Self-referencing alternates. Structured so locales can be added later
 * without touching call sites — nothing is machine-translated.
 */
export function alternatesFor(path: string): Metadata["alternates"] {
  const canonical = path === "/" ? "/" : path;
  return {
    canonical,
    languages: {
      en: canonical,
      "x-default": canonical,
    },
  };
}

interface PageSeoInput {
  /** 50–60 chars including the brand. */
  title: string;
  description: string;
  path: string;
  /** Defaults to "website"; articles pass "article". */
  ogType?: "website" | "article";
}

export function pageMetadata({
  title,
  description,
  path,
  ogType = "website",
}: PageSeoInput): Metadata {
  return {
    // The layout template appends "| IPS-PL"; these titles carry the brand
    // themselves, so absolute stops it being appended twice.
    title: { absolute: title },
    description,
    alternates: alternatesFor(path),
    openGraph: {
      type: ogType,
      title,
      description,
      url: path,
      siteName: "Innovative Process Solutions Pvt. Ltd.",
      locale: "en_GB",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
