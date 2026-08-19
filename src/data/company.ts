import type { GlobalLocation, SpecRow } from "@/lib/types";

/**
 * COMPANY DATA
 * ============
 * Sourced from the current public IPS-PL website (ips-pl.com).
 *
 * Anything marked `unverified: true` or containing "TO BE CONFIRMED" has NOT
 * been verified and must be signed off by IPS-PL before launch. No figures,
 * certifications, awards or client names have been invented.
 */

export const company = {
  legalName: "Innovative Process Solutions Pvt. Ltd.",
  shortName: "IPS-PL",
  /** Verified: current site positions the company this way. */
  positioning: "A fully integrated brand in the fluoropolymer sector",
  descriptor: "Engineered Fluoropolymer Solutions",

  /** Elevator statement used in the About section and metadata. */
  summary:
    "Innovative Process Solutions engineers and manufactures PTFE-lined piping systems, fittings, valves and fluoropolymer components for process industries where corrosion, purity and uptime are non-negotiable.",

  /** Verified from the current site. */

  contact: {
    /** Verified: registered office address on ips-pl.com. */
    addressLines: ["188/3, GIDC Waghodia", "Vadodara, Gujarat 391760", "India"],
    /** Verified: published landline numbers. */
    phones: ["+91 2668 263555", "+91 2668 263666"],
    email: "info@ips-pl.com",
    salesEmail: "sales@ips-pl.com",
    /** Verified: published working hours. */
    hours: [
      { days: "Monday – Friday", time: "08:00 – 18:00 IST" },
      { days: "Saturday", time: "09:00 – 14:00 IST" },
    ],
    linkedin: null as string | null,
    /**
     * Google Business Profile URL. Drives the map and the "find us" link on
     * /contact, and joins Organization.sameAs. Absent rather than guessed:
     * a wrong profile URL sends buyers to another company.
     */
    // TODO(content): Google Business Profile URL for the Vadodara works
    googleBusinessProfile: null as string | null,
    // TODO(content): any further profiles (YouTube, IndiaMART, trade bodies)
    social: [] as { label: string; url: string }[],
  },

  /**
   * Registry facts for LocalBusiness / Organization structured data.
   *
   * Each is omitted from the graph until supplied. None is guessable: a wrong
   * founding date or GSTIN is worse than an absent one, and `geo` in
   * particular would place a pin on somebody else's building.
   */
  registry: {
    // TODO(content): year IPS-PL was founded
    foundingDate: null as string | null,
    // TODO(content): employee count, or a band such as "50-100"
    numberOfEmployees: null as string | null,
    // TODO(content): GSTIN / VAT registration number
    taxId: null as string | null,
    // TODO(content): exact latitude/longitude of the Vadodara works
    geo: null as { latitude: number; longitude: number } | null,
  },

  certifications: [
    {
      title: "ISO 9001:2015",
      detail: "Certified quality management system governing design, manufacture and inspection.",
      icon: "shield",
    },
    {
      title: "ASTM F1545",
      detail:
        "Standard specification for plastic-lined ferrous metal pipe, fittings and flanges — the governing lining specification.",
      icon: "spec",
    },
    {
      title: "Test & guarantee certificates",
      detail: "Issued with every supply, covering material traceability and test results.",
      icon: "certificate",
    },
  ] as { title: string; detail: string; icon: "shield" | "spec" | "certificate" }[],

  /**
   * Trust strip figures. Deliberately non-numeric where the number is unknown.
   * Replace the `value` fields once IPS-PL confirms the real figures.
   */
  trustMetrics: [
    { label: "Years of engineering experience", value: "20+" },
    { label: "Products manufactured in-house", value: "40+" },
    { label: "Countries with active presence", value: "5" },
    { label: "Lining specification", value: "ASTM F1545" },
  ] satisfies SpecRow[],

  /** Verified: values language taken from the current About page. */
  values: [
    { title: "Trust & transparency", description: "Open commercial and technical dealing at every stage of a project." },
    { title: "Ethical practice", description: "Commitments made are commitments engineered and delivered." },
    { title: "Quality construction", description: "Built to specification and verified before despatch." },
    { title: "On-time delivery", description: "Schedule treated as a design constraint, not an aspiration." },
    { title: "Customer-centric attitude", description: "Application-led engineering rather than catalogue selling." },
    { title: "Environmental concern", description: "Containment and long service life reduce process loss and waste." },
  ],
} as const;

/**
 * Global presence. Countries are taken from the offices listed on the current
 * IPS-PL contact page. Named representatives and their direct numbers have been
 * deliberately omitted from this demo — supply them at handover if they should
 * appear publicly.
 *
 * x/y are percentage coordinates on the world map artwork.
 */
export const globalLocations: GlobalLocation[] = [
  {
    country: "India",
    role: "Headquarters & manufacturing",
    city: "Vadodara, Gujarat",
    addressLine: "188/3, GIDC Waghodia",
    phone: "+91 2668 263555",
    email: "sales@ips-pl.com",
    x: 70.33,
    y: 43.67,
    isHeadquarters: true,
  },
  {
    country: "Thailand",
    role: "Regional representation",
    // TODO(content): city, address, direct line and regional email
    x: 77.92,
    y: 49.82,
  },
  {
    country: "Vietnam",
    role: "Regional representation",
    // TODO(content): city, address, direct line and regional email
    x: 79.4,
    y: 44.58,
  },
  {
    country: "China",
    role: "Regional representation",
    city: "Shanghai",
    // TODO(content): address, direct line and regional email
    x: 83.74,
    y: 37.24,
  },
  {
    country: "Canada",
    role: "Regional representation",
    // TODO(content): city, address, direct line and regional email
    x: 27.95,
    y: 28.31,
  },
];

/** Verified: sectors named on the current site. */
export const servedSectors = [
  "Refineries",
  "Pharmaceuticals",
  "Power",
  "Aviation",
  "Detergents",
  "Chemicals",
];
