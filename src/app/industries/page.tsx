import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/data/industries";
import { servedSectors } from "@/data/company";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CTABand } from "@/components/ui/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, industryListSchema, jsonLdGraph } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Fluoropolymer Systems for Process Industries | IPS-PL",
  description:
    "PTFE lined systems for chemical, pharmaceutical, oil & gas, petrochemical, power, food and water processing plant.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        json={jsonLdGraph(
          industryListSchema(industries),
          breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Industries" }]),
        )}
      />
      <PageHero
        eyebrow="Industries"
        title={<>Built for critical industries.</>}
        description="Where corrosion, purity or availability determines whether a plant runs. Each sector brings a different failure mode — and a different specification."
        imageKey="industryChemical"
        crumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        meta={[
          { label: "Sectors served", value: String(industries.length) },
          { label: "Regions", value: "Asia · North America" },
          { label: "Lining specification", value: "ASTM F1545" },
        ]}
      />

      <Section spacing="lg">
        <Container>
          <Reveal>
            <Eyebrow>Sectors</Eyebrow>
            <h2 className="mt-6 max-w-[20ch] text-heading-xl text-white">
              One material family. Very different problems to solve.
            </h2>
            <p className="mt-6 max-w-2xl text-body-lg text-steel-300">
              IPS-PL supplies refineries, pharmaceutical manufacturers, power
              generation, aviation, detergent and chemical producers. What changes
              between them is not the polymer — it is the duty cycle, the
              documentation and the consequence of failure.
            </p>
          </Reveal>

          <RevealGroup className="mt-16 grid gap-px bg-white/10 md:grid-cols-2" stagger={0.07}>
            {industries.map((industry) => {
              const image = getImage(industry.imageKey);
              return (
                <RevealItem key={industry.slug} className="bg-surface-card">
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="group flex h-full flex-col sm:flex-row"
                  >
                    <div className="photo-scrim relative aspect-16/10 shrink-0 overflow-hidden bg-ink-900 sm:aspect-auto sm:w-[42%]">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 30vw"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-7 lg:p-9">
                      <span className="tech-label-xs text-steel-300">
                        {industry.index}
                      </span>
                      <h3 className="mt-3 text-heading-md text-white transition-colors duration-300 group-hover:text-accent-bright">
                        {industry.title}
                      </h3>
                      <p className="mt-3 flex-1 text-body-sm text-steel-300">
                        {industry.shortDescription}
                      </p>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="mt-6 h-5 w-5 text-steel-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-bright"
                      />
                    </div>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </Section>

      <Section spacing="md" tone="muted">
        <Container>
          <Reveal>
            <Eyebrow>Also Supplied</Eyebrow>
            <h2 className="mt-6 max-w-[22ch] text-heading-lg text-white">
              Sectors named on the current IPS-PL supply record.
            </h2>
            <ul className="mt-10 flex flex-wrap gap-3">
              {servedSectors.map((sector) => (
                <li
                  key={sector}
                  className="border border-white/14 px-5 py-3 text-body-sm text-steel-200"
                >
                  {sector}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
