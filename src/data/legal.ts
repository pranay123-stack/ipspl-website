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
  /**
   * Search metadata. Held to 50-60 / 140-158 by `npm run check:seo`.
   */
  seo: { title: string; description: string };
  /**
   * True while the text is scaffolding rather than approved policy.
   *
   * This drives indexing rather than a hand-maintained noindex: an indexable
   * privacy policy is a genuine trust signal and several ad platforms require
   * one, but indexing a page that says "describe the personal data collected"
   * is worse than not having it indexed at all. Set false when counsel
   * approves the text and the page indexes itself — it also joins the sitemap
   * at the same moment, with no second edit to forget.
   */
  pending: boolean;
}

const PENDING_NOTICE =
  "This policy is being finalised. For any question about how we handle your information in the meantime, please contact us directly.";

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    pending: true,
    seo: {
      title: "Privacy Policy | Innovative Process Solutions IPS-PL",
      description:
        "How Innovative Process Solutions handles personal data submitted through enquiry and contact forms, including international transfer to regional offices.",
    },
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
    pending: true,
    seo: {
      title: "Terms of Use | Innovative Process Solutions IPS-PL",
      description:
        "Terms governing use of the IPS-PL website, including the status of published specifications and the binding data issued with a formal quotation.",
    },
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
    // Approved: this page states verifiable fact about a site that sets no
    // cookies, rather than scaffolding awaiting legal input.
    pending: false,
    seo: {
      title: "Cookie Policy | This Site Sets No Cookies | IPS-PL",
      description:
        "This website sets no cookies of any kind. What that means, how visits are measured without them, and the one thing stored locally in your own browser.",
    },
    intro:
      "This site sets no cookies. The detail below explains what that means, what is measured instead, and the single item stored locally in your browser.",
    sections: [
      {
        heading: "What cookies we use",
        body: [
          "This website sets no cookies. Not for analytics, not for advertising, not for session management — the site issues no Set-Cookie header of any kind, so there is nothing here to consent to and no consent banner to dismiss.",
          "That is a deliberate design choice rather than an omission, and the statement is worth checking rather than taking on trust: open your browser's developer tools, look under Application or Storage, and the cookie list for this domain will be empty.",
        ],
      },
      {
        heading: "How we measure visits",
        body: [
          "We use Plausible Analytics, which is cookieless. It records the page visited, the referring site, and the country, browser, operating system and device type derived from your request — all in aggregate. It does not set a cookie, does not store your IP address, and does not create an identifier that would let us recognise you on a later visit or follow you to another website.",
          "Because no personal data is stored and no identifier is created, there is no profile to request, correct or delete. Analytics is loaded from this domain rather than a third-party host, so no request about your visit leaves our origin to an advertising network.",
        ],
      },
      {
        heading: "What is stored in your browser",
        body: [
          "One thing is stored locally, and it never reaches our servers: if you begin a quotation enquiry and do not finish it, the details you have typed are kept in your browser's session storage so that moving between the two steps, or returning to the tab, does not lose your work. It is cleared when the enquiry is sent and when you close the tab.",
          "It is not a cookie, it is not transmitted with any request, and clearing your browser data removes it.",
        ],
      },
      {
        heading: "Managing cookies",
        body: [
          "There is nothing to manage while the position above holds. If IPS-PL later introduces anything that sets a cookie — a tag manager, a chat widget, an advertising pixel — this page must be updated to list each cookie, its purpose and its lifetime, and a consent mechanism must be in place before it loads, covering India, the EU and the UK.",
          "TODO(content): counsel to confirm this page against the export markets IPS-PL sells into.",
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string): LegalPage | undefined {
  return legalPages.find((page) => page.slug === slug);
}
