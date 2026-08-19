import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { insights, getInsight } from "@/data/insights";
import { getImage } from "@/data/images";
import { formatDate } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { InsightCard } from "@/components/insights/InsightCard";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { readingTimeLabel } from "@/lib/readingTime";
import { StubFlag } from "@/components/dev/ContentFlag";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, jsonLdGraph } from "@/lib/schema";
import { CrossLinks } from "@/components/seo/CrossLinks";
import { productsForInsight } from "@/lib/crossLinks";
import { CTABand } from "@/components/ui/CTABand";
import { alternatesFor } from "@/lib/seo";

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) return { title: "Article not found" };

  return {
    title: insight.title,
    description: insight.excerpt,
    alternates: alternatesFor(`/insights/${insight.slug}`),
    openGraph: {
      type: "article",
      title: insight.title,
      description: insight.excerpt,
      publishedTime: insight.date,
      images: [{ url: getImage(insight.imageKey).src }],
    },
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();

  const related = insights.filter((i) => i.slug !== insight.slug).slice(0, 3);



  return (
    <>
      <JsonLd
        json={jsonLdGraph(
          articleSchema(insight),
          breadcrumbSchema([
            { label: "Home", href: "/" },
            { label: "Insights", href: "/insights" },
            { label: insight.category },
          ]),
        )}
      />

      <PageHero
        eyebrow={insight.category}
        title={insight.title}
        imageKey={insight.imageKey}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights" },
          { label: insight.category },
        ]}
        meta={[
          { label: "Published", value: formatDate(insight.date) },
          ...(insight.updated
            ? [{ label: "Updated", value: formatDate(insight.updated) }]
            : []),
          { label: "Author", value: insight.author },
          { label: "Reading time", value: readingTimeLabel(insight.blocks) },
        ]}
      />

      <Section spacing="lg">
        <Container size="narrow">
          <Reveal>
            <p className="mb-6 empty:hidden">
              <StubFlag isStub={insight.isStub} />
            </p>
            <ArticleBody blocks={insight.blocks} />

            {insight.tags && insight.tags.length > 0 && (
              <div className="mt-12 border-t border-white/10 pt-7">
                <p className="tech-label text-steel-300">Topics</p>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {insight.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border border-white/15 px-3.5 py-2 text-caption text-steel-200"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md">
        <Container size="narrow">
          <CrossLinks
            title="Products in this article"
            links={productsForInsight(insight).map((product) => ({
              label: product.title,
              href: `/products/${product.slug}`,
            }))}
          />
        </Container>
      </Section>

      <Section spacing="lg" tone="muted">
        <Container>
          <Reveal>
            <Eyebrow>Continue Reading</Eyebrow>
            <h2 className="mt-6 text-heading-xl text-white">More engineering notes</h2>
          </Reveal>
          <div className="mt-12 grid gap-12 sm:grid-cols-2 md:grid-cols-3">
            {related.map((item) => (
              <Reveal key={item.slug} delay={0.06}>
                <InsightCard insight={item} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} className="mt-14">
            <Link
              href="/insights"
              className="inline-flex min-h-[44px] items-center text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-white underline-offset-4 hover:underline"
            >
              All insights
            </Link>
          </Reveal>
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
