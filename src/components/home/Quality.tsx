import Image from "next/image";
import { FileCheck2, ScrollText, ShieldCheck } from "lucide-react";
import { qualityPillars } from "@/data/capabilities";
import { company } from "@/data/company";
import { images, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionCTA } from "@/components/ui/SectionCTA";

/**
 * Quality section.
 * Certifications are presented as technical documents rather than badges.
 * No certificate numbers are shown — those are marked TO BE CONFIRMED in data.
 */
export function Quality() {
  return (
    <Section spacing="lg" id="quality" labelledBy="quality-heading">
      <Container>
        <div className="grid gap-14 md:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Quality</Eyebrow>
            <h2 id="quality-heading" className="mt-6 max-w-[15ch] text-display-lg text-white">
              Engineered to specification. Verified at every stage.
            </h2>
            <p className="mt-7 max-w-xl text-body-lg text-steel-300">
              Verification is built into production rather than applied as a
              final gate. Test and guarantee certificates are issued with supply,
              so what was installed can be evidenced years later.
            </p>

            {/* Certification documents */}
            <div className="mt-12 space-y-px bg-white/10">
              {company.certifications.map((cert) => (
                <div
                  key={cert.title}
                  className="group flex items-start gap-6 bg-surface-card p-6 transition-colors duration-300 hover:bg-surface-card"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center border border-white/12 bg-surface-raised text-accent-bright"
                  >
                    <CertIcon kind={cert.icon} />
                  </span>
                  <div>
                    <p className="text-heading-sm text-white">{cert.title}</p>
                    <p className="mt-1.5 text-body-sm text-steel-300">{cert.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div>
            <Reveal className="photo-scrim relative aspect-4/3 overflow-hidden bg-ink-900">
              <Image
                src={images.qualityInspection.src}
                alt={images.qualityInspection.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR}
              />
            </Reveal>

            <RevealGroup className="mt-px grid gap-px bg-white/10 sm:grid-cols-2" stagger={0.06}>
              {qualityPillars.map((pillar) => (
                <RevealItem key={pillar.index} className="bg-surface-card p-7">
                  <span className="tech-label text-accent-bright">
                    {pillar.index}
                  </span>
                  <h3 className="mt-3 text-heading-sm text-white">{pillar.title}</h3>
                  <p className="mt-2.5 text-caption text-steel-300">{pillar.description}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
        <SectionCTA href="/quote">Request test and material documentation</SectionCTA>
      </Container>
    </Section>
  );
}

/** Certification glyphs, from the same icon set used for contact details. */
function CertIcon({ kind }: { kind: "shield" | "spec" | "certificate" }) {
  const cls = "h-5 w-5";
  if (kind === "shield") return <ShieldCheck aria-hidden="true" className={cls} />;
  if (kind === "spec") return <ScrollText aria-hidden="true" className={cls} />;
  return <FileCheck2 aria-hidden="true" className={cls} />;
}
