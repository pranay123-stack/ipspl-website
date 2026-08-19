/**
 * STANDARDS REGISTRY
 * ==================
 * The site cited ASTM F1545, ISO 9001:2015, ASME B16.5 and EN 1092-1 in prose
 * and linked to none of them — zero outbound links existed site-wide. Linking
 * the standards you claim to work to is a real credibility signal for
 * technical content, and it is what a specifying engineer wants anyway.
 *
 * Each entry maps a designation, exactly as it is written in the product data,
 * to the publishing body and a URL.
 *
 * A note on the URLs. ASTM and ISO both sit behind bot protection that answers
 * automated requests with 403, so those two could not be confirmed from the
 * build environment — `npm run check:links` reports what it can reach and says
 * so. The ASME and CEN links were confirmed 200 in a real browser. Every URL
 * still needs one human click before launch; that is recorded in
 * docs/content-gaps.md rather than assumed away.
 */
export interface Standard {
  /** Designation as written in the product data, for exact matching. */
  designation: string;
  body: string;
  url: string;
  /** True where an automated check confirmed the page loads. */
  verified: boolean;
}

export const standards: Standard[] = [
  {
    designation: "ASTM F1545",
    body: "ASTM International",
    // TODO(content): confirm this resolves — astm.org blocks automated checks
    url: "https://www.astm.org/f1545-21.html",
    verified: false,
  },
  {
    designation: "ISO 9001:2015",
    body: "International Organization for Standardization",
    // TODO(content): confirm this resolves — iso.org blocks automated checks
    url: "https://www.iso.org/standard/62085.html",
    verified: false,
  },
  {
    designation: "ASME B16.5",
    body: "ASME",
    url: "https://www.asme.org/codes-standards/find-codes-standards",
    verified: true,
  },
  {
    designation: "EN 1092-1",
    body: "CEN-CENELEC",
    url: "https://standards.cencenelec.eu/",
    verified: true,
  },
];

const INDEX = new Map(standards.map((s) => [s.designation.toLowerCase(), s]));

/**
 * Finds every standard referenced inside a free-text value.
 *
 * Spec values read like "ASME B16.5 / EN 1092-1", so one row can cite two
 * standards. Matching on the designation rather than splitting the string
 * means punctuation and ordering do not matter.
 */
export function standardsIn(value: string): Standard[] {
  const found: Standard[] = [];
  for (const standard of INDEX.values()) {
    if (value.toLowerCase().includes(standard.designation.toLowerCase())) {
      found.push(standard);
    }
  }
  return found;
}
