import Image from "next/image";
import { engineeringProcess } from "@/data/capabilities";
import { images, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionCTA } from "@/components/ui/SectionCTA";

/**
 * Engineering process timeline.
 *
 * Positions IPS-PL as an engineering organisation: the sequence from process
 * data to delivered, documented system — not a product list.
 *
 * The five steps carry a headline each and nothing more. They used to carry
 * their four-item activity lists too, which put 5 paragraphs and 20 bullets on
 * screen at once, all at the same 15px — no hierarchy, and 32 characters to a
 * line in a 238px column where comfortable reading starts around 45. It read
 * as one flat grey texture.
 *
 * Every one of those bullets is already on /engineering, in full, which is
 * where a reader who wants the activity list is going anyway — the "Our
 * process" link at the top of this section takes them there. A homepage
 * section earns attention by being scannable, not exhaustive.
 */
export function Capabilities() {
  return (
    <Section spacing="lg" tone="muted" id="engineering" labelledBy="engineering-heading">
      <Container>
        <SectionHeader
          headingId="engineering-heading"
          eyebrow="Engineering"
          title={
            <>
              From requirement to engineered solution.
            </>
          }
          description="Enquiries begin with process data rather than a part number. Media, temperature, duty cycle and failure history determine the specification before any component is selected."
          action={<ArrowLink href="/engineering">Our process</ArrowLink>}
        />

        {/* Horizontal timeline */}
        <div className="relative mt-16">
          <RevealGroup
            /* Subgrid: every cell inherits the row track heights from this
               grid, so the divider rule and bullet list land on the same
               baseline across the row regardless of description length.
               flex-1 only bottom-aligned them, which is not the same thing. */
            className="grid gap-10 sm:grid-cols-2 nav:grid-cols-5 nav:grid-rows-[auto_auto_auto] nav:gap-x-8 nav:gap-y-0"
            stagger={0.09}
          >
            {engineeringProcess.map((step, i) => (
              <RevealItem
                key={step.index}
                className="relative nav:grid nav:grid-rows-subgrid nav:row-span-3"
              >
                {/* Each step draws the connector to the next one, and the last
                    draws none — so the timeline ends on "Deliver" instead of
                    trailing a column's width past it, which is what a single
                    full-width rule did. Self-correcting if a step is added. */}
                {i < engineeringProcess.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-[-2rem] top-[5px] hidden h-px bg-white/12 nav:block"
                  />
                )}

                {/* The node sits on the rule; the number beneath it does the
                    sequencing, so the two are not saying the same thing twice. */}
                <div className="flex items-center gap-3 nav:block">
                  <span
                    aria-hidden="true"
                    className="relative z-1 block h-2.5 w-2.5 shrink-0 bg-accent nav:mb-7"
                  />
                  <p className="tech-label-xs text-steel-300">{step.index}</p>
                </div>

                <h3 className="mt-4 text-heading-md text-white nav:mt-0">{step.title}</h3>

                <p className="mt-3.5 max-w-[34ch] text-body-sm leading-[1.7] text-steel-300">
                  {step.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Supporting imagery */}
        <Reveal delay={0.1} className="mt-16 grid gap-px bg-white/10 sm:grid-cols-3">
          {[images.engineeringDesign, images.engineeringTeam, images.manufacturingDetail].map(
            (image) => (
              <div key={image.src} className="photo-scrim relative aspect-16/10 overflow-hidden bg-ink-900">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover grayscale transition-all duration-[900ms] hover:grayscale-0"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR}
                />
              </div>
            ),
          )}
        </Reveal>
        <SectionCTA href="/quote">Send us your duty conditions</SectionCTA>
      </Container>
    </Section>
  );
}
