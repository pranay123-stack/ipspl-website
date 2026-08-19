import Image from "next/image";
import { company } from "@/data/company";
import { images, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Company story band — editorial rather than a "welcome to our website"
 * paragraph. Asymmetric: oversized statement against a tall portrait crop.
 */
export function AboutBand() {
  return (
    <Section spacing="lg" tone="muted" id="about" labelledBy="about-heading">
      <Container>
        <div className="grid gap-14 md:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>About IPS-PL</Eyebrow>
              <h2 id="about-heading" className="mt-6 max-w-[14ch] text-display-lg text-white">
                Engineering the materials that keep industry moving.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 max-w-xl space-y-5 text-body-lg text-steel-300">
                <p>
                  Innovative Process Solutions began as a single manufacturing
                  unit and now supplies fluoropolymer-lined equipment to process
                  industries across five countries.
                </p>
                <p>
                  The work is narrow by design. Lined pipes, fittings, valves and
                  engineered fluoropolymer components — nothing else. That focus
                  is what allows the whole sequence, from material selection to
                  final test certificate, to be controlled in-house.
                </p>
              </div>
            </Reveal>

            {/* Values grid */}
            <Reveal delay={0.15}>
              <dl className="mt-12 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                {company.values.map((value) => (
                  <div key={value.title} className="border-t border-white/12 pt-5">
                    <dt className="text-heading-sm text-white">{value.title}</dt>
                    <dd className="mt-2 text-caption text-steel-300">
                      {value.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2} className="mt-12">
              <ArrowLink href="/about">The full story</ArrowLink>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="relative">
            <div className="photo-scrim relative aspect-3/4 overflow-hidden bg-ink-900 lg:sticky lg:top-32">
              <Image
                src={images.aboutPortrait.src}
                alt={images.aboutPortrait.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 to-transparent p-8 pt-24">
                <p className="tech-label text-steel-300">Headquarters</p>
                <p className="mt-2 text-heading-md text-white">Vadodara, Gujarat</p>
                <p className="mt-1 text-caption text-steel-300">India</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
