import type { CaseStudy, Insight, Industry, Product } from "@/lib/types";
import { company, globalLocations } from "@/data/company";
import { getImage } from "@/data/images";
import { headlineSpec } from "@/lib/productSpecs";
import { SITE_URL } from "@/lib/seo";
import { published } from "@/lib/content";

/**
 * STRUCTURED DATA
 * ===============
 * One module builds every JSON-LD graph on the site, so a change to the
 * organisation (a new certification, a LinkedIn URL) propagates everywhere
 * rather than being duplicated per page.
 *
 * Every value is sourced from existing repo content. Nothing is invented —
 * where IPS-PL has not published a fact, the property is omitted rather than
 * guessed, because wrong structured data is worse than absent structured data.
 */

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const LOGO_URL = `${SITE_URL}/icon.svg`;

type Json = Record<string, unknown>;

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

/** Social profiles, for Organization.sameAs. Only real URLs are emitted. */
function sameAs(): string[] {
  return [
    company.contact.linkedin,
    company.contact.googleBusinessProfile,
    ...company.contact.social.map((s) => s.url),
  ].filter((url): url is string => typeof url === "string" && url.startsWith("http"));
}

/**
 * Published opening hours as schema.org expects them.
 *
 * The hours were displayed on /contact and nowhere in the markup, so a search
 * engine had no way to know the business is open. Parsed from the same strings
 * the page renders, which is the only way the two can stay in step.
 */
const DAY_NAMES: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};
const DAY_ORDER = Object.values(DAY_NAMES);

function openingHours(): Json[] {
  return company.contact.hours
    .map(({ days, time }): Json | null => {
      // "Monday – Friday" or "Saturday"; en dash and hyphen both appear.
      const parts = days.split(/\s*[–-]\s*/).map((d) => DAY_NAMES[d.trim().toLowerCase()]);
      if (parts.some((d) => !d)) return null;
      const from = DAY_ORDER.indexOf(parts[0]!);
      const to = DAY_ORDER.indexOf(parts[parts.length - 1]!);
      const dayOfWeek = DAY_ORDER.slice(from, to + 1);

      // "08:00 – 18:00 IST"
      const clock = time.match(/(\d{2}:\d{2})\s*[–-]\s*(\d{2}:\d{2})/);
      if (!clock) return null;

      const spec: Json = {
        "@type": "OpeningHoursSpecification",
        dayOfWeek,
        opens: clock[1],
        closes: clock[2],
      };
      return spec;
    })
    .filter((entry): entry is Json => entry !== null);
}

export function organizationSchema(): Json {
  const links = sameAs();
  const { registry } = company;
  const hours = openingHours();

  return {
    // LocalBusiness as well as Organization: there is one physical works in
    // Vadodara with published hours and a phone number, which is exactly what
    // the narrower type describes. Every property it adds is a fact IPS-PL has
    // published; the ones it has not — founding date, headcount, GSTIN, the
    // coordinates of the plant — are omitted rather than approximated.
    "@type": ["Organization", "LocalBusiness"],
    "@id": ORG_ID,
    name: company.legalName,
    alternateName: company.shortName,
    url: SITE_URL,
    description: company.summary,
    logo: { "@type": "ImageObject", url: LOGO_URL },
    ...(links.length ? { sameAs: links } : {}),
    email: company.contact.email,
    telephone: company.contact.phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: company.contact.addressLines[0],
      addressLocality: "Vadodara",
      addressRegion: "Gujarat",
      postalCode: "391760",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: company.contact.phones[0],
        email: company.contact.salesEmail,
        availableLanguage: ["en-IN"],
        areaServed: globalLocations.map((l) => l.country),
      },
    ],
    areaServed: globalLocations.map((l) => l.country),
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    ...(registry.geo
      ? { geo: { "@type": "GeoCoordinates", ...registry.geo } }
      : {}),
    ...(registry.foundingDate ? { foundingDate: registry.foundingDate } : {}),
    ...(registry.numberOfEmployees
      ? {
          numberOfEmployees: {
            "@type": "QuantitativeValue",
            value: registry.numberOfEmployees,
          },
        }
      : {}),
    ...(registry.taxId ? { taxID: registry.taxId, vatID: registry.taxId } : {}),
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "ISO 9001:2015",
        description: "Certified quality management system",
      },
    ],
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: company.legalName,
    alternateName: company.shortName,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

/** Mirrors the visible breadcrumb trail exactly. */
export function breadcrumbSchema(trail: { label: string; href?: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: abs(crumb.href) } : {}),
    })),
  };
}

export function productSchema(product: Product): Json {
  const spec = headlineSpec(product);

  // additionalProperty is built from the same specification rows the page
  // renders, so the two can never disagree.
  const additionalProperty = [...product.specifications, ...product.standards]
    .filter((row) => published(row.value))
    .map((row) => ({
      "@type": "PropertyValue",
      name: row.label,
      value: row.value,
    }));

  return {
    "@type": "Product",
    "@id": `${SITE_URL}/products/${product.slug}#product`,
    name: product.title,
    sku: product.slug,
    description: product.shortDescription,
    category: product.eyebrow,
    image: abs(getImage(product.heroImageKey).src),
    url: `${SITE_URL}/products/${product.slug}`,
    brand: { "@type": "Brand", name: company.shortName },
    manufacturer: { "@id": ORG_ID },
    material: product.materials,
    additionalProperty,
    // DELIBERATE: no `price` or `priceCurrency`.
    //
    // Every item on this site is quoted against process data — bore, duty,
    // liner grade and geometry all move the number, and there is no list
    // price to publish. Search Console will report "Missing field price" as a
    // non-critical warning on these pages; that is the correct trade. Naming a
    // figure to silence the warning would be a price IPS-PL has not agreed to
    // honour, and `priceSpecification` below states the position in the terms
    // schema.org provides for it.
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      businessFunction: "http://purl.org/goodrelations/v1#Sell",
      priceSpecification: {
        "@type": "PriceSpecification",
        valueAddedTaxIncluded: false,
        description: "Quoted on application against process data.",
      },
      seller: { "@id": ORG_ID },
      url: `${SITE_URL}/quote`,
    },
    ...(spec.standard ? { isRelatedTo: spec.standard } : {}),
  };
}

export function articleSchema(insight: Insight): Json {
  return {
    "@type": "Article",
    "@id": `${SITE_URL}/insights/${insight.slug}#article`,
    headline: insight.title,
    description: insight.excerpt,
    image: abs(getImage(insight.imageKey).src),
    datePublished: insight.date,
    // Falls back to publication rather than asserting an edit that never
    // happened; set `updated` on the article to emit a real revision date.
    dateModified: insight.updated ?? insight.date,
    articleSection: insight.category,
    inLanguage: "en-IN",
    // A named person outranks an organisation byline for technical content,
    // but only once that person has agreed to be named — until then the
    // organisation is the honest author.
    author: insight.authorPerson
      ? {
          "@type": "Person",
          name: insight.authorPerson.name,
          jobTitle: insight.authorPerson.jobTitle,
          ...(insight.authorPerson.credentials
            ? { description: insight.authorPerson.credentials }
            : {}),
          worksFor: { "@id": ORG_ID },
        }
      : { "@type": "Organization", name: insight.author, url: SITE_URL },
    publisher: {
      "@id": ORG_ID,
      "@type": "Organization",
      name: company.legalName,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/insights/${insight.slug}`,
    },
  };
}

/**
 * A reference installation is an engineering account, not a news article —
 * CreativeWork with `about` pointing at the products supplied describes it
 * accurately. Duty figures still carrying TODO(content) are omitted, so the
 * graph never asserts a temperature or pressure nobody has confirmed.
 */
export function caseStudySchema(study: CaseStudy, products: Product[]): Json {
  const duty = [
    ["Media", published(study.duty?.media)],
    ["Temperature", published(study.duty?.temperature)],
    ["Pressure", published(study.duty?.pressure)],
  ].filter(([, value]) => value);

  return {
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/case-studies/${study.slug}#case-study`,
    name: study.title,
    headline: study.title,
    description: study.summary,
    image: abs(getImage(study.imageKey).src),
    url: `${SITE_URL}/case-studies/${study.slug}`,
    inLanguage: "en-IN",
    genre: study.sector,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(products.length
      ? {
          about: products.map((product) => ({
            "@id": `${SITE_URL}/products/${product.slug}#product`,
            "@type": "Product",
            name: product.title,
          })),
        }
      : {}),
    ...(duty.length
      ? {
          additionalProperty: duty.map(([name, value]) => ({
            "@type": "PropertyValue",
            name,
            value,
          })),
        }
      : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/case-studies/${study.slug}`,
    },
  };
}

export function caseStudyListSchema(studies: CaseStudy[]): Json {
  return {
    "@type": "ItemList",
    name: "IPS-PL reference installations",
    numberOfItems: studies.length,
    itemListElement: studies.map((study, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: study.title,
      url: `${SITE_URL}/case-studies/${study.slug}`,
    })),
  };
}

/**
 * Service schema for an industry page.
 *
 * The eight industry pages carried BreadcrumbList and nothing else, which
 * described their position in the site and not what they are about. Every
 * field here is drawn from the page's own content — the products it names and
 * the sector it serves — so the markup cannot claim a service the page does
 * not describe.
 */
export function industryServiceSchema(industry: Industry, products: Product[]): Json {
  return {
    "@type": "Service",
    "@id": `${SITE_URL}/industries/${industry.slug}#service`,
    name: `PTFE lined systems for ${industry.title.toLowerCase()}`,
    description: industry.shortDescription,
    serviceType: "Fluoropolymer lined piping and equipment supply",
    provider: { "@id": ORG_ID },
    areaServed: globalLocations.map((l) => l.country),
    audience: { "@type": "BusinessAudience", name: industry.title },
    url: `${SITE_URL}/industries/${industry.slug}`,
    ...(products.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${industry.title} product range`,
            itemListElement: products.map((product) => ({
              "@type": "Offer",
              itemOffered: {
                "@id": `${SITE_URL}/products/${product.slug}#product`,
                "@type": "Product",
                name: product.title,
              },
              url: `${SITE_URL}/products/${product.slug}`,
            })),
          },
        }
      : {}),
  };
}

export function insightListSchema(insights: Insight[]): Json {
  return {
    "@type": "ItemList",
    name: "IPS-PL engineering notes",
    numberOfItems: insights.length,
    itemListElement: insights.map((insight, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: insight.title,
      url: `${SITE_URL}/insights/${insight.slug}`,
    })),
  };
}

export function productListSchema(products: Product[]): Json {
  return {
    "@type": "ItemList",
    name: "IPS-PL product range",
    numberOfItems: products.length,
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: product.title,
      url: `${SITE_URL}/products/${product.slug}`,
    })),
  };
}

export function industryListSchema(industries: Industry[]): Json {
  return {
    "@type": "ItemList",
    name: "Industries served by IPS-PL",
    numberOfItems: industries.length,
    itemListElement: industries.map((industry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: industry.title,
      url: `${SITE_URL}/industries/${industry.slug}`,
    })),
  };
}

/** Wired in Phase 4, once product FAQs exist. */
export function faqSchema(entries: { question: string; answer: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

/**
 * Emits one @graph per page rather than several sibling script tags — Google
 * resolves the @id cross-references, and it keeps duplicate Organization
 * definitions off the page.
 */
export function jsonLdGraph(...nodes: Json[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
