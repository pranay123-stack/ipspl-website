import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { insights } from "@/data/insights";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { InsightCard } from "@/components/insights/InsightCard";
import { CTABand } from "@/components/ui/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "PTFE Lining & Material Selection Insights | IPS-PL",
  description:
    "Technical notes on fluoropolymer material selection, lined system failure modes, expansion provision and specification practice.",
  path: "/insights",
});

export default function InsightsPage() {
  const [lead, ...rest] = insights;

  return (
    <>
      <JsonLd json={jsonLdGraph(breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Insights" }]))} />

      <PageHero
        eyebrow="Insights"
        title={<>Engineering notes.</>}
        description="Material selection, failure modes and specification practice — written for the people who specify and maintain lined systems."
        imageKey="insightPiping"
        crumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
      />

      {/* Lead article */}
      <Section spacing="lg">
        <Container>
          <Reveal>
            <Eyebrow>Latest</Eyebrow>
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <InsightCard insight={lead} featured headingLevel={2} />
          </Reveal>
        </Container>
      </Section>

      {/* Archive */}
      <Section spacing="lg" tone="muted">
        <Container>
          <Reveal>
            <Eyebrow>Archive</Eyebrow>
            <h2 className="mt-6 text-heading-xl text-white">All articles</h2>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-12 sm:grid-cols-2 md:grid-cols-3" stagger={0.07}>
            {rest.map((insight) => (
              <RevealItem key={insight.slug}>
                <InsightCard insight={insight} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
