import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProduct } from "@/data/products";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** Cross-links between products in the same system family. */
export function RelatedProducts({ slugs }: { slugs: string[] }) {
  const related = slugs.map(getProduct).filter((p) => p !== undefined);
  if (related.length === 0) return null;

  return (
    <Section spacing="lg" tone="muted">
      <Container>
        <SectionHeader index="10" eyebrow="Related" title={<>Specified together.</>} />

        <RevealGroup className="mt-14 grid gap-px bg-white/10 sm:grid-cols-3" stagger={0.07}>
          {related.map((product) => {
            const image = getImage(product.heroImageKey);
            return (
              <RevealItem key={product.slug} className="bg-surface-card">
                <Link href={`/products/${product.slug}`} className="group flex h-full flex-col">
                  <div className="photo-scrim relative aspect-4/3 overflow-hidden bg-ink-900">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-heading-md text-white transition-colors duration-300 group-hover:text-accent-bright">
                      {product.title}
                    </h3>
                    <p className="mt-3 flex-1 text-body-sm text-steel-300">
                      {product.shortDescription}
                    </p>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-6 h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </Section>
  );
}
