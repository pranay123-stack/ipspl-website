/**
 * LEGAL PAGES — PLACEHOLDER CONTENT
 * =================================
 * These are structural placeholders only. They are NOT legal advice and are
 * NOT fit to publish as-is.
 *
 * HANDOVER: IPS-PL must supply policies reviewed by its own legal counsel,
 * covering the jurisdictions it trades in (India plus the export markets).
 */

export interface LegalPage {
  slug: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

const PENDING_NOTICE =
  "This policy is being finalised. For any question about how we handle your information in the meantime, please contact us directly.";

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    intro: PENDING_NOTICE,
    sections: [
      {
        heading: "Information we collect",
        body: [
          "Describe the personal data collected through the request-a-quote and contact forms — name, company, email, telephone, country — and any files attached to an enquiry.",
          "Describe any analytics or cookie-based collection once those tools are selected.",
        ],
      },
      {
        heading: "How information is used",
        body: [
          "State that enquiry data is used to respond to the enquiry, prepare quotations and maintain the commercial relationship.",
          "State whether data is shared with regional representatives in Thailand, Vietnam, China or Canada, since that constitutes an international transfer.",
        ],
      },
      {
        heading: "Retention",
        body: ["State how long enquiry records and attached drawings are retained, and how they are disposed of."],
      },
      {
        heading: "Your rights",
        body: ["Set out access, correction and erasure rights under the applicable regimes, and the contact route for exercising them."],
      },
      {
        heading: "Contact",
        body: ["Provide the named contact or role responsible for data protection enquiries."],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Use",
    intro: PENDING_NOTICE,
    sections: [
      {
        heading: "Use of this website",
        body: ["Set out permitted use of the site and its content."],
      },
      {
        heading: "Technical information",
        body: [
          "State that specifications, dimensions and performance figures published here are indicative, and that binding data is issued with a quotation or order acknowledgement.",
          "This matters: the specification blocks on product pages carry indicative values pending technical sign-off.",
        ],
      },
      {
        heading: "Intellectual property",
        body: ["State ownership of site content, drawings, trade marks and photography."],
      },
      {
        heading: "Limitation of liability",
        body: ["To be drafted by counsel."],
      },
      {
        heading: "Governing law",
        body: ["State the governing law and jurisdiction."],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    intro: PENDING_NOTICE,
    sections: [
      {
        heading: "What cookies we use",
        body: [
          "This site currently sets no analytics or marketing cookies. If analytics, tag management or chat tools are introduced, each cookie, its purpose and its lifetime will be listed here.",
        ],
      },
      {
        heading: "Managing cookies",
        body: ["Explain how visitors can control cookies, and provide a consent mechanism if one is required in the target markets."],
      },
    ],
  },
];

export function getLegalPage(slug: string): LegalPage | undefined {
  return legalPages.find((page) => page.slug === slug);
}
