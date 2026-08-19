import type { NavItem, NavLink, MegaMenuColumn } from "@/lib/types";
import { productCategories, products, getProductsByCategory } from "./products";
import { industries } from "./industries";

/**
 * NAVIGATION
 * ==========
 * Product and industry links are DERIVED from products.ts and industries.ts
 * rather than duplicated here. Adding a product gives it a mega-menu entry and
 * a footer link automatically, and there is only one place a name can be
 * changed — which stops the header, footer and product pages drifting apart.
 *
 * Short nav labels come from each product's `navLabel`, falling back to its
 * full `title`.
 */

function toNavLink(slug: string): NavLink | null {
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  return {
    label: product.navLabel ?? product.title,
    href: `/products/${product.slug}`,
    description: product.navDescription,
  };
}

/** Mega-menu columns mirror the four product families. */
const productColumns: MegaMenuColumn[] = productCategories.map((category) => ({
  title: category.title,
  items: category.items
    .map(toNavLink)
    .filter((link): link is NavLink => link !== null),
}));

export const mainNav: NavItem[] = [
  {
    label: "Products",
    href: "/products",
    megaMenu: {
      columns: productColumns,
      feature: {
        eyebrow: "Featured System",
        title: "PTFE Lined Piping",
        description:
          "Complete lined systems engineered as matched sets — pipe, fittings and valves to one specification.",
        href: "/products/ptfe-lined-pipes",
        imageKey: "productPiping",
      },
    },
  },
  {
    label: "Industries",
    href: "/industries",
    megaMenu: {
      columns: [
        {
          title: "Process industries",
          items: industries.slice(0, 4).map((industry) => ({
            label: industry.title,
            href: `/industries/${industry.slug}`,
            description: industry.shortDescription,
          })),
        },
        {
          title: "Energy & utilities",
          items: industries.slice(4).map((industry) => ({
            label: industry.title,
            href: `/industries/${industry.slug}`,
            description: industry.shortDescription,
          })),
        },
      ],
      feature: {
        eyebrow: "Most specified",
        title: "Chemical Processing",
        description:
          "Corrosion-resistant containment for acids, solvents and halogenated media.",
        href: "/industries/chemical",
        imageKey: "industryChemical",
      },
    },
  },
  { label: "Engineering", href: "/engineering" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Products",
    links: productCategories
      .flatMap((category) => getProductsByCategory(category.slug))
      .map((product) => ({
        label: product.navLabel ?? product.title,
        href: `/products/${product.slug}`,
      })),
  },
  {
    title: "Industries",
    links: [
      ...industries.slice(0, 5).map((industry) => ({
        label: industry.title,
        href: `/industries/${industry.slug}`,
      })),
      { label: "All Industries", href: "/industries" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About IPS-PL", href: "/about" },
      { label: "Engineering Process", href: "/engineering" },
      { label: "Manufacturing Capabilities", href: "/capabilities" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookies" },
];

/**
 * Mobile drawer sections.
 *
 * The drawer needs expandable groups for anything with children so the chevron
 * affordance is honest: a chevron means "expands", an arrow means "navigates".
 * Products and Industries both have sub-pages; the rest are single pages.
 */
export interface DrawerSection {
  label: string;
  href: string;
  /** Present only when the section genuinely expands. */
  groups?: { title: string; items: NavLink[] }[];
}

export const drawerNav: DrawerSection[] = [
  { label: "Products", href: "/products", groups: productColumns },
  {
    label: "Industries",
    href: "/industries",
    groups: [
      {
        title: "Sectors",
        items: industries.map((industry) => ({
          label: industry.title,
          href: `/industries/${industry.slug}`,
        })),
      },
    ],
  },
  { label: "Engineering", href: "/engineering" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
];
