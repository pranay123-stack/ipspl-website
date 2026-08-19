import Image from "next/image";
import { manufacturingStages } from "@/data/capabilities";
import { getImage, images, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionCTA } from "@/components/ui/SectionCTA";

/**
 * Immersive manufacturing section.
 * Full-bleed photograph with an animated technical rule system, followed by
 * the five controlled production stages.
 */
export function Manufacturing() {
  return (
    <section aria-labelledby="manufacturing-heading" className="relative overflow-hidden bg-ink-950 text-white">
      {/* Full-bleed backdrop */}
      <div className="absolute inset-0">
        <Image
          src={images.manufacturingFloor.src}
          alt={images.manufacturingFloor.alt}
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/88 to-ink-950" />
      </div>
      <div aria-hidden="true" className="tech-grid absolute inset-0 opacity-80" />

      <Container size="wide" className="relative py-section-lg">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-end">
          <Reveal>
            <Eyebrow tone="light">
              Manufacturing
            </Eyebrow>
            <h2 id="manufacturing-heading" className="mt-6 max-w-[19ch] text-balance text-display-lg text-white">
              Precision manufacturing. Controlled at every stage.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="max-w-lg text-body-lg text-steel-300">
              Housing preparation, lining, forming, thermal conditioning and
              machining are carried out in-house. Controlling the whole sequence
              is what makes liner integrity repeatable rather than incidental.
            </p>
            <div className="mt-8">
              <ArrowLink href="/capabilities" tone="light">
                Manufacturing capabilities
              </ArrowLink>
            </div>
          </Reveal>
        </div>

        {/* Stage rail */}
        <RevealGroup
          className="mt-16 grid gap-px bg-white/12 sm:grid-cols-2 nav:grid-cols-5"
          stagger={0.07}
        >
          {manufacturingStages.map((stage) => {
            const image = getImage(stage.imageKey);
            return (
              <RevealItem key={stage.index} className="group bg-ink-950">
                <div className="relative aspect-4/3 overflow-hidden bg-surface-card">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover opacity-90 transition-all duration-[900ms] group-hover:scale-105 group-hover:opacity-100"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
                  <span className="absolute left-5 top-5 tech-label text-white/70">
                    {stage.index}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-heading-sm text-white">{stage.title}</h3>
                  <p className="mt-2.5 text-caption text-steel-300">{stage.description}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
        <SectionCTA href="/quote">Discuss a manufacturing requirement</SectionCTA>
      </Container>
    </section>
  );
}
