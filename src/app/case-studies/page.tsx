import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/data/projects";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { published, publishedList } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CTABand } from "@/components/ui/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, caseStudyListSchema, jsonLdGraph } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "PTFE Lined System Case Studies & References | IPS-PL",
  description:
    "Reference installations of PTFE lined piping, valves and engineered components in chemical, pharmaceutical, refinery and power plant, with duty and scope.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        json={jsonLdGraph(
          breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Case Studies" }]),
          caseStudyListSchema(caseStudies),
        )}
      />

      <PageHero
        eyebrow="Case Studies"
        title={<>Reference installations.</>}
        description="How process requirements became specified, manufactured and documented systems. In industrial procurement a reference installation is the primary trust mechanism — these describe the duty, the scope supplied and the outcome."
        imageKey="caseRefinery"
        crumbs={[{ label: "Home", href: "/" }, { label: "Case Studies" }]}
      />

      <Section spacing="lg">
        <Container>
          <SectionHeader
            eyebrow="References"
            headingId="cases-heading"
            title={<>Engineering, applied.</>}
          />

          <RevealGroup className="mt-14 grid gap-px bg-white/10 md:grid-cols-2" stagger={0.07}>
            {caseStudies.map((study) => {
              const image = getImage(study.imageKey);
              return (
                <RevealItem key={study.slug} className="bg-surface-base">
                  <article className="relative flex h-full flex-col">
                    <div className="photo-scrim relative aspect-16/9 overflow-hidden bg-surface-card">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR}
                      />
                      <span className="absolute left-6 top-6 z-2 bg-surface-base/85 px-3.5 py-2 tech-label-xs text-white backdrop-blur-sm">
                        {study.sector}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-8">
                      <h3 className="max-w-lg text-heading-lg text-white">
                        {/* Stretched link: the whole card is the target, but
                            the accessible name stays the heading text. */}
                        <Link
                          href={`/case-studies/${study.slug}`}
                          className="after:absolute after:inset-0 hover:text-accent-bright focus-visible:outline-none"
                        >
                          {study.title}
                        </Link>
                      </h3>
                      <p className="mt-4 max-w-lg text-body-md text-steel-300">{study.summary}</p>

                      {study.duty &&
                        [study.duty.media, study.duty.temperature, study.duty.pressure]
                          .some((v) => published(v)) && (
                        <dl className="mt-7 grid gap-2 border-t border-white/10 pt-6 sm:grid-cols-3">
                          {[
                            ["Media", published(study.duty.media)],
                            ["Temperature", published(study.duty.temperature)],
                            ["Pressure", published(study.duty.pressure)],
                          ]
                            .filter(([, v]) => v)
                            .map(([label, value]) => (
                              <div key={label}>
                                <dt className="tech-label-xs text-steel-300">{label}</dt>
                                <dd className="mt-1.5 text-caption text-steel-100">{value}</dd>
                              </div>
                            ))}
                        </dl>
                      )}

                      {publishedList(study.scopeSupplied).length > 0 && (
                        <div className="mt-6">
                          <p className="tech-label-xs text-steel-300">Scope supplied</p>
                          <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
                            {publishedList(study.scopeSupplied).map((item) => (
                              <li key={item} className="text-caption text-steel-200">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                        <span className="tech-label-xs text-steel-300">{study.client}</span>
                        <span className="group inline-flex min-h-[44px] items-center gap-2 py-2 tech-label text-white">
                          Read the case study
                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </div>
                  </article>
                </RevealItem>
              );
            })}
          </RevealGroup>

          <Reveal delay={0.1} className="mt-12">
            <p className="max-w-2xl text-caption text-steel-300">
              Client identities are withheld by agreement. Duty figures and
              outcomes are confirmed with the customer before publication.
            </p>
          </Reveal>
        </Container>
      </Section>

      <CTABand
        title="Have a comparable duty?"
        description="Send your process data and we will tell you what we have supplied into a similar application."
      />
    </>
  );
}
