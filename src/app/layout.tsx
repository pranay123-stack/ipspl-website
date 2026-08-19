import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/footer/Footer";
import { Plausible } from "@/components/analytics/Plausible";
import { StickyQuoteBar } from "@/components/ui/StickyQuoteBar";
import { HashScroll } from "@/components/navigation/HashScroll";
import { company } from "@/data/company";
import { JsonLd } from "@/components/seo/JsonLd";
import { jsonLdGraph, organizationSchema, websiteSchema } from "@/lib/schema";
import { alternatesFor } from "@/lib/seo";
import "./globals.css";
import { PlaceholderOverlay } from "@/components/dev/PlaceholderOverlay";
import { ContactLinkTracking } from "@/components/analytics/ContactLinkTracking";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Monospace carries the technical labels, indices and specification values. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-mono-technical",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://www.ips-pl.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${company.shortName} | Engineered Fluoropolymer Solutions`,
    template: `%s | ${company.shortName}`,
  },
  description: company.summary,
  applicationName: company.legalName,
  // No `keywords`: ignored by every major engine since 2009, and it publishes
  // the whole targeting list to any competitor who views source.
  authors: [{ name: company.legalName }],
  alternates: alternatesFor("/"),
  openGraph: {
    type: "website",
    siteName: company.legalName,
    title: `${company.shortName} | Engineered Fluoropolymer Solutions`,
    description: company.summary,
    url: SITE_URL,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.shortName} | Engineered Fluoropolymer Solutions`,
    description: company.summary,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  width: "device-width",
  initialScale: 1,
};



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      // en-IN, not en: the audience reads Indian phone formats, an Indian
      // postal address and Indian spelling conventions, and the works is in
      // Gujarat. It also tells a screen reader which English to pronounce.
      lang="en-IN"
      className={`${inter.variable} ${plexMono.variable} antialiased`}
    >
      <head>
        {/* Scroll-revealed content must stay readable without JavaScript. */}
        <noscript>
          <style>{`.reveal{transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-screen flex-col">
        <JsonLd json={jsonLdGraph(organizationSchema(), websiteSchema())} />
        <Plausible />
        <ContactLinkTracking />
        <HashScroll />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyQuoteBar />
        {process.env.NODE_ENV !== "production" && <PlaceholderOverlay />}
      </body>
    </html>
  );
}
