import Image from "next/image";
import Link from "next/link";
import type { Insight } from "@/lib/types";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { readingTimeLabel } from "@/lib/readingTime";
import { StubFlag } from "@/components/dev/ContentFlag";

/**
 * Editorial insight card, styled like an industrial publication rather than
 * a blog tile. `featured` renders a larger lead item.
 */
export function InsightCard({
  insight,
  featured = false,
  headingLevel = 3,
}: {
  insight: Insight;
  featured?: boolean;
  /** Set to 2 where the card is the first heading under the page <h1>. */
  headingLevel?: 2 | 3;
}) {
  const image = getImage(insight.imageKey);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="h-full">
      <Link href={`/insights/${insight.slug}`} className="group flex h-full flex-col">
        <div
          className={cn(
            "relative overflow-hidden bg-ink-900",
            featured ? "aspect-16/9" : "aspect-4/3",
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 640px) 100vw, 33vw"}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR}
          />
        </div>

        <div className="flex flex-1 flex-col pt-6">
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

          <Heading
            className={cn(
              "mt-4 text-balance text-white transition-colors duration-300 group-hover:text-accent-bright",
              featured ? "max-w-3xl text-heading-lg" : "text-heading-md",
            )}
          >
            {insight.title}
          </Heading>

          <p
            className={cn(
              "mt-3 flex-1 text-steel-300",
              featured ? "max-w-2xl text-body-md" : "text-body-sm",
            )}
          >
            {insight.excerpt}
          </p>

          <span className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 tech-label-xs text-steel-300">
            <span>{insight.authorPerson?.name ?? insight.author}</span>
            <span aria-hidden="true">·</span>
            <span>{readingTimeLabel(insight.blocks)}</span>
            <StubFlag isStub={insight.isStub} label="stub" />
          </span>
        </div>
      </Link>
    </article>
  );
}
