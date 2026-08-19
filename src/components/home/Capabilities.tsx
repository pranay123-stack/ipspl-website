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
 * Positions IPS-PL as an engineering organisation: the sequence from process
 * data to delivered, documented system — not a product list.
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
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[13px] hidden h-px bg-ink-900/12 lg:block"
          />
          <RevealGroup
            /* Subgrid: every cell inherits the row track heights from this
               grid, so the divider rule and bullet list land on the same
               baseline across the row regardless of description length.
               flex-1 only bottom-aligned them, which is not the same thing. */
            className="grid gap-10 sm:grid-cols-2 nav:grid-cols-5 nav:grid-rows-[auto_auto_auto_auto] nav:gap-6"
            stagger={0.09}
          >
            {engineeringProcess.map((step) => (
              <RevealItem
                key={step.index}
                className="relative nav:grid nav:grid-rows-subgrid nav:row-span-4"
              >
                <div>
                  <span className="mb-6 hidden h-[27px] w-[27px] border border-white/18 bg-surface-raised nav:block">
                    <span className="ml-[9px] mt-[9px] block h-[7px] w-[7px] bg-accent" />
                  </span>
                  <p className="tech-label text-steel-300">{step.index}</p>
                </div>

                <h3 className="text-heading-md text-white">{step.title}</h3>

                <p className="text-body-sm text-steel-300">{step.description}</p>

                <ul className="space-y-2.5 border-t border-white/10 pt-5">
                  {step.detail.map((detail) => (
                    <li key={detail} className="flex gap-2.5 text-caption text-steel-300">
                      <span aria-hidden="true" className="mt-[7px] h-px w-2.5 shrink-0 bg-accent-bright" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
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
