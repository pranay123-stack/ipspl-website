/**
 * Content model for the IPS-PL website.
 *
 * Every visible string on the site is described by one of these types and
 * lives in `src/data`. The UI reads these shapes and never hard-codes copy,
 * so final client content can replace the data files without touching JSX.
 *
 * `PLACEHOLDER` marks a value that IPS-PL must confirm before launch.
 * Grep for it to produce the outstanding-content checklist.
 */

/** A value awaiting client confirmation. Rendered, but flagged in code. */
export type Placeholder<T> = T;

export interface ImageAsset {
  /** Remote or local source. Swap in src/data/images.ts only. */
  src: string;
  /** Meaningful description for screen readers and SEO. */
  alt: string;
  /** Optional narrower crop used on small viewports. */
  mobileSrc?: string;
}

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface MegaMenuColumn {
  /** Group heading, e.g. "PIPING SYSTEMS". */
  title: string;
  items: NavLink[];
}

export interface NavItem {
  label: string;
  href: string;
  /** When present the item opens a mega menu instead of navigating directly. */
  megaMenu?: {
    columns: MegaMenuColumn[];
    feature?: {
      eyebrow: string;
      title: string;
      description: string;
      href: string;
      imageKey: string;
    };
  };
}

export interface SpecRow {
  label: string;
  value: string;
  /**
   * Where the figure comes from — an IPS-PL datasheet, a standard, a test
   * report. A row without a source is rendered as indicative rather than as a
   * published commitment, so the honest default is to omit it.
   */
  source?: string;
  /** Qualifying detail: tolerance, condition, exclusion. */
  note?: string;
}

export interface ProductCategory {
  slug: string;
  /** Two-digit editorial index, e.g. "01". */
  index: string;
  title: string;
  /** One line used on cards and in the mega menu. */
  shortDescription: string;
  /** Longer positioning paragraph for the category hero. */
  overview: string;
  imageKey: string;
  /** Individual products inside this category. */
  items: string[];
}

export interface Product {
  slug: string;
  title: string;
  /** Shorter label for navigation. Falls back to `title` when unset. */
  navLabel?: string;
  /** One-line description used in the mega menu. */
  navDescription?: string;
  /** Category slug this product belongs to. */
  category: string;
  eyebrow: string;
  shortDescription: string;
  /** 2–3 sentence editorial overview for the product hero. */
  overview: string;
  heroImageKey: string;
  galleryImageKeys: string[];
  /** Where the product is typically deployed. */
  applications: string[];
  /** Engineering capabilities relevant to this product. */
  capabilities: string[];
  /** Lining / body materials offered. */
  materials: string[];
  /** Design and manufacturing standards referenced. */
  standards: SpecRow[];
  /** Headline technical attributes shown in the editorial spec block. */
  specifications: SpecRow[];
  /** Ordered manufacturing sequence for this product. */
  manufacturing: { title: string; description: string }[];
  /** Testing and verification steps. */
  quality: string[];
  /** Downloadable technical documents. */
  documents: {
    title: string;
    type: string;
    note: string;
    /**
     * Download slot. Drop the file at `public/documents/<file>.pdf` and set
     * this; the page then serves it directly instead of routing through the
     * request form. Absent means the document is not yet published.
     */
    href?: string;
    /** Human-readable file size, shown beside a real download. */
    fileSize?: string;
  }[];
  /** Slugs of related products. */
  related: string[];
  seo: { title: string; description: string };
}

export interface Industry {
  slug: string;
  index: string;
  title: string;
  shortDescription: string;
  imageKey: string;
  heroImageKey: string;
  /** The process problem this industry brings to IPS-PL. */
  challenge: { title: string; body: string };
  /** How IPS-PL responds. */
  solution: { title: string; body: string };
  applications: string[];
  /** Product slugs commonly specified for this industry. */
  productSlugs: string[];
  /** Engineering factors that drive material and design selection. */
  considerations: { title: string; description: string }[];
  /** Case study slug shown on the industry page. */
  caseStudySlug?: string;
  seo: { title: string; description: string };
}

export interface CaseStudy {
  slug: string;
  sector: string;
  /** Duty conditions, so a reader can judge whether it maps to their plant. */
  duty?: {
    media?: string;
    temperature?: string;
    pressure?: string;
  };
  /** What IPS-PL actually supplied. */
  scopeSupplied?: string[];
  /** The measurable outcome, once IPS-PL confirms it. */
  outcome?: string;
  /** Placeholder client identity — replace with real named references. */
  client: Placeholder<string>;
  title: string;
  summary: string;
  imageKey: string;
  challenge: string;
  approach: string;
  solution: string;
  result: string;
  productSlugs: string[];
}

/**
 * Article body blocks.
 *
 * The previous model was a flat `string[]` of paragraphs, which is why all six
 * articles shipped with zero subheadings, zero lists and zero tables. A block
 * union makes structure expressible — and makes a structureless article
 * visible as one.
 */
export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; caption: string; head: string[]; rows: string[][] }
  | { type: "callout"; tone: "note" | "caution"; text: string }
  | { type: "figure"; imageKey: string; caption: string };

export interface Insight {
  slug: string;
  category: "Engineering" | "Materials" | "Industry" | "Applications" | "Company News";
  title: string;
  excerpt: string;
  /** ISO publication date. */
  date: string;
  /** ISO date of the last substantive revision, when one has happened. */
  updated?: string;
  /** Topic tags shown on the card and the article. */
  tags?: string[];
  imageKey: string;
  author: Placeholder<string>;
  /** Structured body. Replace with the client's editorial content. */
  blocks: ArticleBlock[];
  /**
   * True while the article is materially shorter than a published piece and
   * carries no subheadings. Surfaced in docs/content-gaps.md and shown as a
   * dev-only badge; never rendered in production.
   */
  isStub?: boolean;
  /** Products this article is genuinely about, for in-body cross-linking. */
  relatedProductSlugs?: string[];
}

export interface CapabilityStep {
  index: string;
  title: string;
  description: string;
  /** Concrete activities inside this phase. */
  detail: string[];
}

export interface GlobalLocation {
  country: string;
  role: string;
  city?: string;
  /** Street address line, where one is published. */
  addressLine?: string;
  /** Direct line for the region. */
  phone?: string;
  /** Regional enquiry address. */
  email?: string;
  /** Percentage coordinates on the map artwork (0–100). */
  x: number;
  y: number;
  /** Headquarters render larger and always show their label. */
  isHeadquarters?: boolean;
  contact?: { name?: string; phone?: string; email?: string };
}
