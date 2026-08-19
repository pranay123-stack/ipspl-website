import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/data/industries";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { ArrowLink } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionCTA } from "@/components/ui/SectionCTA";

/**
 * Industries grid.
 * Tall portrait crops with the description revealed on hover / focus, so the
 * grid reads as a wall of imagery until the user engages with it.
 */
export function Industries() {
  return (
    <Section spacing="lg" tone="dark" id="industries" labelledBy="industries-heading">
      <Container>
        <SectionHeader
          headingId="industries-heading"
          eyebrow="Industries"
          tone="light"
          title={<>Built for critical industries.</>}
          description="Where corrosion, purity or availability determines whether a plant runs — across chemical, pharmaceutical, energy and water processing."
          action={<ArrowLink href="/industries" tone="light">All industries</ArrowLink>}
        />

        <RevealGroup
          className="mt-16 grid gap-px bg-white/10 sm:grid-cols-2 nav:grid-cols-4"
          stagger={0.06}
        >
          {industries.map((industry) => {
            const image = getImage(industry.imageKey);
            return (
              <RevealItem key={industry.slug}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group relative block aspect-4/5 overflow-hidden bg-ink-900"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover opacity-60 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:opacity-75"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/10" />

                  <div className="relative flex h-full flex-col justify-end p-7">
                    <span className="tech-label text-white/55">
                      {industry.index}
                    </span>
                    <h3 className="mt-3 text-heading-md text-white">{industry.title}</h3>

                    {/* Description slides up on hover; always present for screen readers. */}
                    <p className="mt-3 text-caption text-steel-300">
                      {industry.shortDescription}
                    </p>

                    <span className="mt-5 flex items-center gap-2 tech-label text-white">
                      <span
                        aria-hidden="true"
                        className="h-px w-6 origin-left bg-accent-bright transition-transform duration-500 group-hover:w-10"
                      />
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
        <SectionCTA href="/quote">Specify for your sector</SectionCTA>
      </Container>
    </Section>
  );
}
