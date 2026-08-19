import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { manufacturingStages, qualityPillars } from "@/data/capabilities";
import { company } from "@/data/company";
import { getImage, images, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CTABand } from "@/components/ui/CTABand";
import { CrossLinks } from "@/components/seo/CrossLinks";
import { products } from "@/data/products";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "PTFE Lining & Precision Machining Capabilities | IPS-PL",
  description:
    "In-house fabrication, fluoropolymer lining, CNC machining, inspection and testing under an ISO 9001:2015 quality system.",
  path: "/capabilities",
});

export default function CapabilitiesPage() {
  return (
    <>
      <JsonLd json={jsonLdGraph(breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Capabilities" }]))} />

      <PageHero
        eyebrow="Capabilities"
        title={<>Precision manufacturing, controlled at every stage.</>}
        description="Housing preparation, lining, forming, thermal conditioning, machining, inspection and testing carried out in-house."
        imageKey="manufacturingFloor"
        crumbs={[{ label: "Home", href: "/" }, { label: "Capabilities" }]}
        meta={[
          { label: "Production stages", value: "05" },
          { label: "Quality system", value: "ISO 9001:2015" },
          { label: "Lining specification", value: "ASTM F1545" },
        ]}
      />

      {/* Manufacturing stages */}
      <Section spacing="lg">
        <Container>
          <SectionHeader
            eyebrow="Manufacturing"
            title={<>The full sequence, in-house.</>}
            description="Controlling every stage is what makes liner integrity repeatable. Where lining is subcontracted, the variable that matters most sits outside the manufacturer's control."
          />

          <RevealGroup className="mt-16 space-y-px bg-white/10" stagger={0.08}>
            {manufacturingStages.map((stage, i) => {
              const image = getImage(stage.imageKey);
              const flip = i % 2 === 1;
              return (
                <RevealItem key={stage.index} className="bg-surface-card">
                  <div
                    className={`grid gap-8 py-10 md:grid-cols-2 lg:gap-16 ${
                      flip ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="photo-scrim relative aspect-16/9 overflow-hidden bg-ink-900">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="tech-label text-accent-bright">
                        {stage.index}
                      </span>
                      <h3 className="mt-4 text-heading-xl text-white">{stage.title}</h3>
                      <p className="mt-5 max-w-lg text-body-lg text-steel-300">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </Section>

      {/* Quality */}
      <Section spacing="lg" tone="dark">
        <Container>
          <SectionHeader
            eyebrow="Quality"
            tone="light"
            title={<>Engineered to specification. Verified at every stage.</>}
            description="Inspection is built into production rather than applied as a final gate, and the evidence is issued with the goods."
          />

          <RevealGroup
            className="mt-16 grid gap-px bg-white/12 sm:grid-cols-2 md:grid-cols-3"
            stagger={0.06}
          >
            {qualityPillars.map((pillar) => (
              <RevealItem key={pillar.index} className="bg-ink-950 p-8 lg:p-10">
                <span className="tech-label text-accent-bright">
                  {pillar.index}
                </span>
                <h3 className="mt-4 text-heading-md text-white">{pillar.title}</h3>
                <p className="mt-3 text-body-sm text-steel-300">{pillar.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Certifications */}
          <Reveal delay={0.12} className="mt-16">
            <Eyebrow tone="light">Certification</Eyebrow>
            <div className="mt-8 grid gap-px bg-white/12 md:grid-cols-3">
              {company.certifications.map((cert) => (
                <div key={cert.title} className="bg-ink-950 p-8">
                  <p className="text-heading-md text-white">{cert.title}</p>
                  <p className="mt-3 text-body-sm text-steel-300">{cert.detail}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Testing imagery */}
      <Section spacing="md" tone="muted">
        <Container>
          <RevealGroup className="grid gap-px bg-white/10 sm:grid-cols-3" stagger={0.08}>
            {[images.qualityInspection, images.qualityLab, images.qualityTesting].map((image) => (
              <RevealItem key={image.src}>
                <div className="photo-scrim relative aspect-4/3 overflow-hidden bg-ink-900">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR}
                  />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <CrossLinks
            title="Manufactured here"
            links={products.slice(0, 5).map((p) => ({
              label: p.title,
              href: `/products/${p.slug}`,
            }))}
          />
          <CrossLinks
            title="How we specify"
            links={[
              { label: "Engineering process", href: "/engineering" },
              { label: "Request a quote", href: "/quote" },
            ]}
          />
        </Container>
      </Section>

      <CTABand
        title="Manufacturing to your specification"
        description="Components made to drawing, with test and guarantee certificates issued as part of the supply."
      />
    </>
  );
}
