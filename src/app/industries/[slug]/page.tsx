import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries, getIndustry } from "@/data/industries";
import { getProduct } from "@/data/products";
import { getCaseStudy } from "@/data/projects";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CTABand } from "@/components/ui/CTABand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/schema";
import { CrossLinks } from "@/components/seo/CrossLinks";
import { caseStudiesForIndustry, insightsForIndustry } from "@/lib/crossLinks";
import { alternatesFor } from "@/lib/seo";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return { title: "Industry not found" };

  return {
    title: industry.seo.title,
    description: industry.seo.description,
    alternates: alternatesFor(`/industries/${industry.slug}`),
    openGraph: {
      title: industry.seo.title,
      description: industry.seo.description,
      images: [{ url: getImage(industry.heroImageKey).src }],
    },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const relatedProducts = industry.productSlugs
    .map(getProduct)
    .filter((p) => p !== undefined);
  const caseStudy = industry.caseStudySlug
    ? getCaseStudy(industry.caseStudySlug)
    : undefined;

  return (
    <>
      <JsonLd
        json={jsonLdGraph(
          breadcrumbSchema([
            { label: "Home", href: "/" },
            { label: "Industries", href: "/industries" },
            { label: industry.title },
          ]),
        )}
      />
      <PageHero
        eyebrow="Industry"
        index={industry.index}
        title={industry.title}
        description={industry.shortDescription}
        imageKey={industry.heroImageKey}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: industry.title },
        ]}
      />

      {/* Challenge / solution */}
      <Section spacing="lg">
        <Container>
          <div className="grid gap-14 md:grid-cols-2 lg:gap-20">
            <Reveal>
              <Eyebrow>The Challenge</Eyebrow>
              <h2 className="mt-6 max-w-[18ch] text-heading-xl text-white">
                {industry.challenge.title}
              </h2>
              <p className="mt-7 text-body-lg text-steel-300">{industry.challenge.body}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="border-l-2 border-accent pl-8 lg:pl-12">
                <Eyebrow tone="accent">
                  The IPS-PL Response
                </Eyebrow>
                <h2 className="mt-6 max-w-[18ch] text-heading-xl text-white">
                  {industry.solution.title}
                </h2>
                <p className="mt-7 text-body-lg text-steel-300">
                  {industry.solution.body}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Applications */}
      <Section spacing="lg" tone="dark">
        <Container>
          <SectionHeader
            eyebrow="Applications"
            tone="light"
            title={<>Typical duty in this sector.</>}
          />
          <RevealGroup
            className="mt-14 grid gap-px bg-white/12 sm:grid-cols-2 nav:grid-cols-5"
            stagger={0.06}
          >
            {industry.applications.map((application, i) => (
              <RevealItem key={application} className="bg-ink-950 p-7">
                <span className="tech-label-xs text-accent-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-body-sm text-steel-200">{application}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Engineering considerations */}
      <Section spacing="lg" tone="muted">
        <Container>
          <SectionHeader
            eyebrow="Engineering Considerations"
            title={<>What drives the specification.</>}
            description="The factors reviewed before a liner grade, wall thickness or geometry is fixed for this sector."
          />
          <RevealGroup className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2" stagger={0.07}>
            {industry.considerations.map((item, i) => (
              <RevealItem key={item.title} className="bg-surface-card p-8 lg:p-10">
                <span className="tech-label text-accent-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-heading-md text-white">{item.title}</h3>
                <p className="mt-3 text-body-sm text-steel-300">{item.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Products used */}
      <Section spacing="lg">
        <Container>
          <SectionHeader
            eyebrow="Products Used"
            title={<>Commonly specified here.</>}
          />
          <RevealGroup
            className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 nav:grid-cols-4"
            stagger={0.06}
          >
            {relatedProducts.map((product) => {
              const image = getImage(product.heroImageKey);
              return (
                <RevealItem key={product.slug} className="bg-surface-card">
                  <Link href={`/products/${product.slug}`} className="group flex h-full flex-col">
                    <div className="photo-scrim relative aspect-4/3 overflow-hidden bg-ink-900">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-heading-sm text-white transition-colors duration-300 group-hover:text-accent-bright">
                        {product.title}
                      </h3>
                      <p className="mt-2.5 flex-1 text-caption text-steel-300">
                        {product.shortDescription}
                      </p>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="mt-5 h-4 w-4 text-steel-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-bright"
                      />
                    </div>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </Section>

      {/* Case study */}
      {caseStudy && (
        <Section spacing="lg" tone="dark">
          <Container>
            <SectionHeader
              eyebrow="Case Study"
              tone="light"
              title={caseStudy.title}
            />

            <div className="mt-14 grid gap-14 md:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <Reveal>
                <div className="photo-scrim relative aspect-4/3 overflow-hidden bg-ink-900">
                  <Image
                    src={getImage(caseStudy.imageKey).src}
                    alt={getImage(caseStudy.imageKey).alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR}
                  />
                </div>
                <p className="mt-5 tech-label-xs text-steel-300">
                  {caseStudy.client}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <dl className="space-y-px self-start bg-white/12">
                  {[
                    { term: "Challenge", detail: caseStudy.challenge },
                    { term: "Engineering approach", detail: caseStudy.approach },
                    { term: "Solution", detail: caseStudy.solution },
                    { term: "Result", detail: caseStudy.result },
                  ].map((entry, i) => (
                    <div key={entry.term} className="bg-ink-950 py-7">
                      <dt className="flex items-center gap-3">
                        <span className="tech-label-xs text-accent-bright">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="tech-label text-steel-300">{entry.term}</span>
                      </dt>
                      <dd className="mt-3 max-w-2xl text-body-md text-steel-300">
                        {entry.detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </Container>
        </Section>
      )}

      <Section spacing="md">
        <Container>
          <CrossLinks
            title="Reference installations"
            links={caseStudiesForIndustry(industry).map((study) => ({
              label: study.title,
              href: `/case-studies/${study.slug}`,
              note: study.sector,
            }))}
          />
          <CrossLinks
            title="Related reading"
            links={insightsForIndustry(industry).map((insight) => ({
              label: insight.title,
              href: `/insights/${insight.slug}`,
            }))}
          />
        </Container>
      </Section>

      <CTABand
        title={`Specify for ${industry.title}`}
        description="Share your process data and we will confirm the material, geometry and documentation your duty requires."
      />
    </>
  );
}
