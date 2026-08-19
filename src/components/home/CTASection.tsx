import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { images, IMAGE_BLUR } from "@/data/images";
import { company } from "@/data/company";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";

/** Closing call to action. Two routes: technical conversation, or formal RFQ. */
export function CTASection() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0">
        <Image
          src={images.ctaBackdrop.src}
          alt={images.ctaBackdrop.alt}
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/55" />
      </div>
      <div aria-hidden="true" className="tech-grid absolute inset-0 opacity-70" />

      <Container className="relative py-section-lg">
        <Reveal>
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-12 bg-accent-bright" />
            <p className="tech-label text-accent-bright">Talk to Engineering</p>
          </div>

          <h2 id="cta-heading" className="mt-8 max-w-[15ch] text-display-xl text-white">
            Have a demanding process requirement?
          </h2>

          <p className="mt-8 max-w-xl text-body-lg text-steel-300">
            Talk to our engineering team about your next fluoropolymer
            application. Bring your process data — media, temperature, pressure
            and duty cycle — and we will work back to a specification.
          </p>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 bg-white px-8 py-4.5 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-ink-950 transition-colors duration-300 hover:bg-accent hover:text-white"
            >
              Discuss Your Requirement
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/quote"
              className="group inline-flex items-center justify-center gap-3 border border-white/30 px-8 py-4.5 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
            >
              Request a Quote
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-12 gap-y-5 border-t border-white/12 pt-8">
            <div>
              <p className="tech-label text-steel-300">Direct line</p>
              <a
                href={`tel:${company.contact.phones[0].replace(/\s/g, "")}`}
                className="mt-2 flex min-h-[44px] items-center text-heading-sm text-white transition-colors hover:text-accent-bright"
              >
                {company.contact.phones[0]}
              </a>
            </div>
            <div>
              <p className="tech-label text-steel-300">Email</p>
              <a
                href={`mailto:${company.contact.salesEmail}`}
                className="mt-2 flex min-h-[44px] items-center text-heading-sm text-white transition-colors hover:text-accent-bright"
              >
                {company.contact.salesEmail}
              </a>
            </div>
            <div>
              <p className="tech-label text-steel-300">Working hours</p>
              <p className="mt-2 text-heading-sm text-white">
                {company.contact.hours[0].time}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
