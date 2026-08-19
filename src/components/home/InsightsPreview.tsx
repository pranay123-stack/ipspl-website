import { insights } from "@/data/insights";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { ArrowLink } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { InsightCard } from "@/components/insights/InsightCard";

/** Latest technical editorial. Mock articles — see data/insights.ts. */
export function InsightsPreview() {
  const [lead, ...rest] = insights.slice(0, 4);

  return (
    <Section spacing="lg" tone="muted" id="insights" labelledBy="insights-heading">
      <Container>
        <SectionHeader
          headingId="insights-heading"
          eyebrow="Insights"
          title={<>Engineering notes.</>}
          description="Material selection, failure modes and specification practice from the engineering team."
          action={<ArrowLink href="/insights">All insights</ArrowLink>}
        />

        <RevealGroup className="mt-16 grid gap-12 md:grid-cols-[1.35fr_1fr]" stagger={0.08}>
          <RevealItem>
            <InsightCard insight={lead} featured />
          </RevealItem>

          <RevealItem>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              {rest.map((insight) => (
                <div
                  key={insight.slug}
                  className="border-t border-white/12 pt-8 first:border-t-0 first:pt-0 sm:border-t-0 sm:pt-0 lg:border-t lg:pt-8 lg:first:border-t-0 lg:first:pt-0"
                >
                  <InsightCardCompact slug={insight.slug} />
                </div>
              ))}
            </div>
          </RevealItem>
        </RevealGroup>
      </Container>
    </Section>
  );
}

/* Compact variant reuses the data but drops the image for a denser rail. */
import Link from "next/link";
import { getInsight } from "@/data/insights";
import { formatDate } from "@/lib/utils";

function InsightCardCompact({ slug }: { slug: string }) {
  const insight = getInsight(slug);
  if (!insight) return null;

  return (
    <Link href={`/insights/${insight.slug}`} className="group block">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="tech-label-xs text-accent-bright">
          {insight.category}
        </span>
        <span aria-hidden="true" className="h-px w-4 bg-ink-900/20" />
        <time
          dateTime={insight.date}
          className="tech-label-xs text-steel-300"
        >
          {formatDate(insight.date)}
        </time>
      </div>
      <h3 className="mt-3 text-heading-sm text-white transition-colors duration-300 group-hover:text-accent-bright">
        {insight.title}
      </h3>
      <p className="mt-2 text-body-sm text-steel-300">{insight.excerpt}</p>
    </Link>
  );
}
