import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { images, IMAGE_BLUR } from "@/data/images";
import { company } from "@/data/company";
import { Container } from "@/components/layout/Container";

/**
 * Homepage hero.
 *
 * Deliberately a server component with CSS-driven entrance animation rather
 * than Framer Motion: the first screen is the LCP candidate, and holding it at
 * opacity 0 until hydration pushed LCP past 3.5s on throttled mobile. CSS
 * animates from the first paint instead, with no JS on the critical path.
 *
 * Keyframes live in globals.css and collapse under prefers-reduced-motion.
 */

const HEADLINE = "Engineering materials for the world's most demanding processes.";

const CREDENTIALS = [
  "ASTM F1545 lined systems",
  "ISO 9001:2015",
  "In-house manufacturing",
  "Global supply",
];

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink-950">
      {/* Backdrop */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Oversized so neither the drift nor the parallax exposes an edge. */}
        <div className="hero-parallax absolute -inset-y-[6%] inset-x-0">
          <Image
            src={images.hero.src}
            alt={images.hero.alt}
            fill
            priority
            loading="eager"
            fetchPriority="high"
            /*
             * The hero fills a 112svh-tall, full-width box with object-cover,
             * so the drawn width is not the viewport width — it is
             * max(100vw, containerHeight x 4/3). On a tall phone that is
             * genuinely about 3x the viewport width, which is why these
             * values exceed 100vw; describing it as 100vw would fetch a
             * candidate a third of the size actually painted.
             *
             * Above roughly a 4:3 viewport the cover crop becomes
             * width-driven and the drawn width is exactly 100vw — the
             * previous 110vw asked for 10% more pixels than are ever painted.
             *
             * Measured, not guessed: at 390x780 the box is 874px tall and the
             * image paints 1165px wide (299vw); at 768x1024 it paints 1529px
             * (199vw); at 1280x800 and above, 100vw.
             */
            sizes="(max-width: 480px) 300vw, (max-width: 768px) 200vw, (max-width: 1024px) 150vw, 100vw"
            className="hero-drift object-cover object-center"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR}
          />
        </div>

        {/* Scrims sit outside the moving layer so they stay put.
            Weighted to the left, where the headline sits, which lets the
            photograph stay legible on the right rather than being flattened
            uniformly across the frame. */}
        <div className="absolute inset-0 bg-ink-950/38" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-ink-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/88 via-ink-950/40 to-transparent" />
      </div>

      {/* Faint engineering grid */}
      <div aria-hidden="true" className="tech-grid tech-grid-fade absolute inset-0 opacity-70" />

      <Container
        /* Asymmetric on purpose: the header is fixed and overlays the top of
           this section, so symmetric padding centres the content in the full
           viewport rather than in the part of it the reader can actually see.
           The extra top padding is ~1x the header height at each breakpoint. */
        className="relative pb-16 pt-36 sm:pb-24 sm:pt-44 nav:pb-32 nav:pt-64"
      >
        {/* Eyebrow */}
        <div className="hero-fade-up flex items-center gap-4" style={{ animationDelay: "80ms" }}>
          <span aria-hidden="true" className="h-px w-12 bg-accent-bright" />
          <p className="tech-label text-accent-bright">{company.descriptor}</p>
        </div>

        {/* Headline — a single text node. Line breaks come from max-width
            and text-wrap: balance, so the accessible name reads as real
            prose and adapts across viewports instead of breaking at fixed
            points. */}
        <div className="mt-5 overflow-hidden sm:mt-7">
          <h1
            id="hero-heading"
            className="hero-rise max-w-[34ch] text-balance text-display-2xl text-white"
            style={{ animationDelay: "150ms" }}
          >
            {HEADLINE}
          </h1>
        </div>

        <div className="mt-8 flex flex-col gap-7 md:flex-row md:items-end md:justify-between lg:gap-8">
          <p
            className="hero-fade-up max-w-xl text-body-lg text-steel-200"
            style={{ animationDelay: "380ms" }}
          >
            Advanced PTFE-lined systems, valves, fittings and engineered
            fluoropolymer solutions for critical process industries.
          </p>

          <div
            className="hero-fade-up flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "460ms" }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-3 bg-white px-8 py-4.5 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-ink-950 transition-colors duration-300 hover:bg-accent hover:text-white"
            >
              Explore Solutions
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
        </div>

        {/* Credentials rail */}
        <div
          className="hero-fade-up mt-9 flex flex-wrap items-center justify-between gap-x-10 gap-y-3 border-t border-white/12 pt-5 sm:mt-12 sm:pt-6"
          style={{ animationDelay: "560ms" }}
        >
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            {CREDENTIALS.map((item) => (
              <span key={item} className="tech-label text-steel-300">
                {item}
              </span>
            ))}
          </div>

          {/* Sits on the rail rather than below it — one less stacked row. */}
          <span className="hero-bob hidden items-center gap-2.5 text-steel-350 md:flex">
            <span className="tech-label">Scroll</span>
            <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
        </div>
      </Container>
    </section>
  );
}
