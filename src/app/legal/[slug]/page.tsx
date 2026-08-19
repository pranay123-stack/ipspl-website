import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalPages, getLegalPage } from "@/data/legal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { alternatesFor } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/schema";

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return { title: "Not found" };

  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    alternates: alternatesFor(`/legal/${page.slug}`),
    // Indexing follows the content, not a hand-set flag: a policy that still
    // reads "describe the personal data collected" must not be indexed, and
    // an approved one should be, because it is a real trust signal. Clearing
    // `pending` does both at once.
    ...(page.pending ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd
        json={jsonLdGraph(
          breadcrumbSchema([{ label: "Home", href: "/" }, { label: page.title }]),
        )}
      />

      <PageHero
        eyebrow="Legal"
        title={page.title}
        imageKey="aboutPortrait"
        crumbs={[{ label: "Home", href: "/" }, { label: page.title }]}
      />

      <Section spacing="lg">
        <Container size="narrow">
          <Reveal>
            <p className="border-l-2 border-accent bg-accent/12 px-6 py-5 text-body-md text-steel-100">
              {page.intro}
            </p>

            <div className="mt-14 space-y-12">
              {page.sections.map((section, i) => (
                <section key={section.heading}>
                  <span className="tech-label text-accent-bright">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 text-heading-md text-white">{section.heading}</h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph, j) => (
                      <p key={j} className="text-body-md text-steel-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
