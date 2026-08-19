import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/data/projects";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionCTA } from "@/components/ui/SectionCTA";

/**
 * Case studies.
 * All entries are mock content — no real client is named. See data/projects.ts.
 */
export function CaseStudies() {
  return (
    <Section spacing="lg" id="case-studies" labelledBy="case-studies-heading">
      <Container>
        <SectionHeader
          headingId="case-studies-heading"
          eyebrow="Case Studies"
          title={<>Engineering, applied.</>}
          description="How process requirements become specified, manufactured and documented systems."
        />

        <RevealGroup className="mt-16 grid gap-px bg-white/10 md:grid-cols-2" stagger={0.08}>
          {caseStudies.map((study) => {
            const image = getImage(study.imageKey);
            return (
              <RevealItem key={study.slug} className="bg-surface-card">
                <Link
                  href={`/industries/${
                    study.slug === "chemical-acid-transfer"
                      ? "chemical"
                      : study.slug === "pharma-api-transfer"
                        ? "pharmaceutical"
                        : study.slug === "refinery-effluent"
                          ? "oil-gas"
                          : "power"
                  }`}
                  className="group flex h-full flex-col"
                >
                  <div className="photo-scrim relative aspect-16/9 overflow-hidden bg-ink-900">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR}
                    />
                    <div className="absolute inset-0 bg-ink-950/25 transition-opacity duration-500 group-hover:opacity-0" />
                    <span className="absolute left-6 top-6 bg-ink-950/80 px-3.5 py-2 tech-label-xs text-white backdrop-blur-sm">
                      {study.sector}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-8 lg:p-10">
                    <h3 className="max-w-lg text-heading-lg text-white transition-colors duration-300 group-hover:text-accent-bright">
                      {study.title}
                    </h3>
                    <p className="mt-4 max-w-lg flex-1 text-body-md text-steel-300">
                      {study.summary}
                    </p>

                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                      <span className="tech-label-xs text-steel-300">
                        {study.client}
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
        <SectionCTA href="/quote">Tell us about your application</SectionCTA>
      </Container>
    </Section>
  );
}
