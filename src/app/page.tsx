import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { FeaturedProduct } from "@/components/home/FeaturedProduct";
import { Capabilities } from "@/components/home/Capabilities";
import { Industries } from "@/components/home/Industries";
import { Manufacturing } from "@/components/home/Manufacturing";
import { Quality } from "@/components/home/Quality";
import { AboutBand } from "@/components/home/AboutBand";
import { GlobalPresence } from "@/components/home/GlobalPresence";
import { CaseStudies } from "@/components/home/CaseStudies";
import { InsightsPreview } from "@/components/home/InsightsPreview";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = pageMetadata({
  title: "PTFE Lined Piping Systems Manufacturer | IPS-PL India",
  description:
    "Manufacturer of PTFE lined pipes, fittings, valves and fluoropolymer components for chemical, pharmaceutical and refinery process plant. ISO 9001:2015, ASTM F1545.",
  path: "/",
});

/**
 * Homepage.
 * The section order builds confidence progressively: what we make, how we
 * engineer it, who it is for, how it is made, how it is verified, who we are,
 * where we operate, proof, thinking, and finally the commercial ask.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProductShowcase />
      <FeaturedProduct />
      <Capabilities />
      <Industries />
      <Manufacturing />
      <Quality />
      <AboutBand />
      <GlobalPresence />
      <CaseStudies />
      <InsightsPreview />
      <CTASection />
    </>
  );
}
