import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { productCategories } from "@/data/products";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { ArrowLink } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionCTA } from "@/components/ui/SectionCTA";

/**
 * Editorial product showcase.
 * Cards read as portfolio entries — full-bleed image, technical index,
 * title and a rule that draws across on hover — rather than commerce tiles.
 */
export function ProductShowcase() {
  return (
    <Section spacing="lg" id="products" labelledBy="products-heading">
      <Container>
        <SectionHeader
          headingId="products-heading"
          eyebrow="Products"
          title={<>Engineered for performance.</>}
          description="Four product families, engineered as matched systems so that every joint, branch and closure in a line carries the same protection as the pipe itself."
          action={<ArrowLink href="/products">All products</ArrowLink>}
        />

        <RevealGroup className="mt-16 grid gap-px bg-white/10 sm:grid-cols-2">
          {productCategories.map((category) => {
            const image = getImage(category.imageKey);
            return (
              <RevealItem key={category.slug} className="bg-surface-card">
                <Link
                  href={`/products#${category.slug}`}
                  className="group relative flex h-full flex-col"
                >
                  <div className="photo-scrim relative aspect-4/3 overflow-hidden bg-ink-900">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-90" />
                    <span className="absolute left-7 top-7 tech-label text-white/70">
                      {category.index}
                    </span>
                    <span className="absolute bottom-7 right-7 flex h-11 w-11 items-center justify-center border border-white/35 text-white transition-all duration-500 group-hover:border-white group-hover:bg-surface-card group-hover:text-ink-950">
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-7 lg:p-8">
                    <h3 className="text-heading-lg text-white transition-colors duration-300 group-hover:text-accent-bright">
                      {category.title}
                    </h3>
                    <p className="mt-4 max-w-md flex-1 text-body-md text-steel-300">
                      {category.shortDescription}
                    </p>
                    <span
                      aria-hidden="true"
                      className="mt-6 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    />
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
        <SectionCTA href="/quote">Specify a lined system for your duty</SectionCTA>
      </Container>
    </Section>
  );
}
