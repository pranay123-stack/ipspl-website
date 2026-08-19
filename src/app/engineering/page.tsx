import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { engineeringProcess } from "@/data/capabilities";
import { images, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CTABand } from "@/components/ui/CTABand";
import { CrossLinks } from "@/components/seo/CrossLinks";
import { products } from "@/data/products";
import { industries } from "@/data/industries";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Lined Piping Engineering & Specification | IPS-PL",
  description:
    "How IPS-PL moves from process data to a specified, manufactured, tested and documented fluoropolymer system.",
  path: "/engineering",
});

/** Questions asked at enquiry stage — makes the process concrete. */
const ENQUIRY_INPUTS = [
  { label: "Media", detail: "Full chemical inventory including cleaning agents and trace contaminants" },
  { label: "Concentration", detail: "Operating range rather than nominal figure" },
  { label: "Temperature", detail: "Normal, maximum and upset conditions" },
  { label: "Pressure", detail: "Including vacuum, if the line can be pump-emptied" },
  { label: "Duty cycle", detail: "Continuous, batch or campaign operation" },
  { label: "Failure history", detail: "What failed previously, and where" },
];

export default function EngineeringPage() {
  return (
    <>
      <JsonLd json={jsonLdGraph(breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Engineering" }]))} />

      <PageHero
        eyebrow="Engineering"
        title={<>From requirement to engineered solution.</>}
        description="Enquiries begin with process data, not a part number. What follows is a five-stage sequence from specification to documented delivery."
        imageKey="engineeringDesign"
        crumbs={[{ label: "Home", href: "/" }, { label: "Engineering" }]}
        meta={[
          { label: "Process stages", value: "05" },
          { label: "Manufacturing", value: "In-house" },
          { label: "Documentation", value: "Issued with supply" },
        ]}
      />

      {/* Enquiry inputs */}
      <Section spacing="lg">
        <Container>
          <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <Eyebrow>Starting Point</Eyebrow>
              <h2 className="mt-6 max-w-[16ch] text-heading-xl text-white">
                We ask for the process, not the part number.
              </h2>
              <p className="mt-7 text-body-lg text-steel-300">
                A part number tells us what someone specified last time. Process
                data tells us what the system actually has to survive — which is
                usually a different question, and occasionally the reason the
                previous installation failed.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="divide-y divide-white/10 border-t border-white/10">
                {ENQUIRY_INPUTS.map((input) => (
                  <div key={input.label} className="grid gap-2 py-5 sm:grid-cols-[160px_1fr] sm:gap-8">
                    <dt className="tech-label pt-1 text-accent-bright">{input.label}</dt>
                    <dd className="text-body-md text-steel-300">{input.detail}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Process stages */}
      <Section spacing="lg" tone="dark">
        <Container>
          <SectionHeader
            eyebrow="The Process"
            tone="light"
            title={<>Five stages, each with an output.</>}
            description="Every stage produces something the next one depends on — a specification, a manufactured item, a test record, a delivered document set."
          />

          <RevealGroup className="mt-16 space-y-px bg-white/12" stagger={0.08}>
            {engineeringProcess.map((step) => (
              <RevealItem key={step.index} className="bg-ink-950">
                <div className="grid gap-7 py-10 md:grid-cols-[100px_1fr_1fr] lg:gap-14">
                  <span className="font-mono text-heading-lg text-steel-300">
                    {step.index}
                  </span>
                  <div>
                    <h3 className="text-heading-lg text-white">{step.title}</h3>
                    <p className="mt-4 max-w-md text-body-md text-steel-300">
                      {step.description}
                    </p>
                  </div>
                  <ul className="space-y-3 self-center">
                    {step.detail.map((detail) => (
                      <li key={detail} className="flex gap-3 text-body-sm text-steel-300">
                        <span
                          aria-hidden="true"
                          className="mt-2.5 h-px w-3 shrink-0 bg-accent-bright"
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Imagery */}
      <Section spacing="md" tone="muted">
        <Container>
          <RevealGroup className="grid gap-px bg-white/10 sm:grid-cols-3" stagger={0.08}>
            {[images.engineeringDesign, images.engineeringTeam, images.engineeringWorkshop].map(
              (image) => (
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
              ),
            )}
          </RevealGroup>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <CrossLinks
            title="What we engineer"
            links={products.slice(0, 4).map((p) => ({
              label: p.title,
              href: `/products/${p.slug}`,
            }))}
          />
          <CrossLinks
            title="Sectors we specify for"
            links={industries.slice(0, 4).map((i) => ({
              label: i.title,
              href: `/industries/${i.slug}`,
            }))}
          />
        </Container>
      </Section>

      <CTABand
        title="Start with your process data"
        description="Media, concentration, temperature, pressure and duty cycle. Send what you have and we will tell you what else we need."
      />
    </>
  );
}
