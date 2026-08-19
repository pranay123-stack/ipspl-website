import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { caseStudies, getCaseStudy } from "@/data/projects";
import { getImage } from "@/data/images";
import { getProduct } from "@/data/products";
import { published, publishedList } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, caseStudySchema, jsonLdGraph } from "@/lib/schema";
import { CrossLinks } from "@/components/seo/CrossLinks";
import { CTABand } from "@/components/ui/CTABand";
import { alternatesFor } from "@/lib/seo";
import type { Product } from "@/lib/types";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case study not found" };

  return {
    // Authored rather than composed: the composed form ran to 100 characters
    // on the longest study, and summaries were written for the card, not the
    // SERP. `npm run check:seo` holds both to the band.
    title: { absolute: study.seo.title },
    description: study.seo.description,
    alternates: alternatesFor(`/case-studies/${study.slug}`),
    openGraph: {
      type: "article",
      title: study.title,
      description: study.summary,
      images: [{ url: getImage(study.imageKey).src }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const supplied = study.productSlugs
    .map(getProduct)
    .filter((p): p is Product => p !== undefined);

  const others = caseStudies.filter((s) => s.slug !== study.slug);

  // Duty rows are the figures a specifying engineer scans for first, so they
  // lead the page — but only the ones that have actually been confirmed.
  const duty = [
    ["Media", published(study.duty?.media)],
    ["Temperature", published(study.duty?.temperature)],
    ["Pressure", published(study.duty?.pressure)],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  const scope = publishedList(study.scopeSupplied);
  const outcome = published(study.outcome);

  const narrative = [
    { heading: "The challenge", body: study.challenge },
    { heading: "Our approach", body: study.approach },
    { heading: "The solution", body: study.solution },
    { heading: "The result", body: study.result },
  ];

  return (
    <>
      <JsonLd
        json={jsonLdGraph(
          caseStudySchema(study, supplied),
          breadcrumbSchema([
            { label: "Home", href: "/" },
            { label: "Case Studies", href: "/case-studies" },
            { label: study.sector },
          ]),
        )}
      />

      <PageHero
        eyebrow={study.sector}
        title={study.title}
        description={study.summary}
        imageKey={study.imageKey}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/case-studies" },
          { label: study.sector },
        ]}
        meta={[
          { label: "Client", value: study.client },
          ...duty.map(([label, value]) => ({ label, value })),
        ]}
      />

      <Section spacing="lg">
        <Container size="narrow">
          <Reveal>
            {duty.length > 0 && (
              <dl className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
                {duty.map(([label, value]) => (
                  <div key={label} className="bg-surface-base p-6">
                    <dt className="tech-label-xs text-steel-300">{label}</dt>
                    <dd className="mt-2 text-body-md text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-14 space-y-12">
              {narrative.map((part) => (
                <section key={part.heading}>
                  <h2 className="text-heading-lg text-white">{part.heading}</h2>
                  <p className="mt-4 text-body-lg text-steel-300">{part.body}</p>
                </section>
              ))}

              {outcome && (
                <section>
                  <h2 className="text-heading-lg text-white">Measured outcome</h2>
                  <p className="mt-4 border-l-2 border-accent-bright py-1 pl-6 text-body-lg text-steel-100">
                    {outcome}
                  </p>
                </section>
              )}
            </div>

            {scope.length > 0 && (
              <div className="mt-14 border-t border-white/10 pt-8">
                <h2 className="tech-label text-steel-300">Scope supplied</h2>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {scope.map((item) => (
                    <li key={item} className="flex gap-3.5 text-body-md text-steel-200">
                      <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-accent-bright" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <CrossLinks
              title="Products supplied on this project"
              links={supplied.map((product) => ({
                label: product.title,
                href: `/products/${product.slug}`,
              }))}
            />

            <p className="mt-12 text-caption text-steel-300">
              Client identity is withheld by agreement. Duty figures and outcomes
              are confirmed with the customer before publication.
            </p>
          </Reveal>
        </Container>
      </Section>

      {others.length > 0 && (
        <Section spacing="lg" tone="muted">
          <Container>
            <Reveal>
              <Eyebrow>More References</Eyebrow>
              <h2 className="mt-6 text-heading-xl text-white">Other installations</h2>
            </Reveal>
            <ul className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug} className="bg-surface-base">
                  <Link
                    href={`/case-studies/${item.slug}`}
                    className="group flex h-full flex-col p-8 transition-colors hover:bg-white/4"
                  >
                    <span className="tech-label-xs text-steel-300">{item.sector}</span>
                    <span className="mt-4 text-heading-md text-white group-hover:text-accent-bright">
                      {item.title}
                    </span>
                    <span className="mt-3 text-body-sm text-steel-300">{item.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Reveal delay={0.15} className="mt-14">
              <Link
                href="/case-studies"
                className="inline-flex min-h-[44px] items-center text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-white underline-offset-4 hover:underline"
              >
                All case studies
              </Link>
            </Reveal>
          </Container>
        </Section>
      )}

      <CTABand
        title="Have a comparable duty?"
        description="Send your process data and we will tell you what we have supplied into a similar application."
      />
    </>
  );
}
