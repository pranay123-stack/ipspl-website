import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";

/** Compact closing CTA reused across interior pages. */
export function CTABand({
  title = "Discuss your requirement",
  description = "Send us your process data — media, temperature, pressure and duty cycle — and our engineering team will work back to a specification.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div aria-hidden="true" className="tech-grid absolute inset-0 opacity-60" />
      <Container className="relative py-section-md">
        <Reveal>
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-10 bg-accent-bright" />
                <p className="tech-label text-accent-bright">Next step</p>
              </div>
              <h2 className="mt-6 max-w-[16ch] text-display-lg text-white">{title}</h2>
              <p className="mt-6 max-w-xl text-body-lg text-steel-300">{description}</p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="group inline-flex items-center justify-center gap-3 bg-white px-8 py-4.5 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-ink-950 transition-colors duration-300 hover:bg-accent hover:text-white"
              >
                Request a Quote
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-3 border border-white/30 px-8 py-4.5 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
              >
                Contact Us
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
