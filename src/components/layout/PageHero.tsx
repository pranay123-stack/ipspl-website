import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { Container } from "./Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  href?: string;
}

/**
 * Shared interior page hero.
 * Dark photographic band so the transparent header state reads consistently
 * on every route, with breadcrumbs for orientation and SEO.
 */
export function PageHero({
  eyebrow,
  index,
  title,
  description,
  imageKey,
  crumbs = [],
  meta,
  size = "default",
}: {
  eyebrow?: string;
  index?: string;
  title: React.ReactNode;
  description?: string;
  imageKey: string;
  crumbs?: Crumb[];
  /** Small key/value pairs shown along the bottom rule. */
  meta?: { label: string; value: string }[];
  size?: "default" | "tall";
}) {
  const image = getImage(imageKey);

  return (
    <section
      className={cn(
        "relative flex flex-col justify-end overflow-hidden bg-ink-950",
        size === "tall" ? "min-h-[78vh]" : "min-h-[62vh]",
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR}
        />
        <div className="absolute inset-0 bg-ink-950/48" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-ink-950/60" />
      </div>
      <div aria-hidden="true" className="tech-grid tech-grid-fade absolute inset-0 opacity-60" />

      <Container className="relative pb-16 pt-40">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {i > 0 && (
                    <ChevronRight
                      aria-hidden="true"
                      className="h-3 w-3 text-steel-300"
                    />
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-1 py-2 tech-label-xs text-steel-300 transition-colors hover:text-white"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current="page"
                      className="tech-label-xs text-steel-200"
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <Eyebrow index={index} tone="light">
            {eyebrow}
          </Eyebrow>
        )}

        <h1 className="mt-6 max-w-[20ch] text-display-xl text-balance text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-7 max-w-2xl text-body-lg text-steel-300">{description}</p>
        )}

        {meta && meta.length > 0 && (
          <dl className="mt-14 flex flex-wrap gap-x-14 gap-y-6 border-t border-white/12 pt-8">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="tech-label text-steel-300">{item.label}</dt>
                <dd className="mt-2 text-heading-sm text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Container>
    </section>
  );
}
