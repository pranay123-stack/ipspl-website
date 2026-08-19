import Image from "next/image";
import { getProduct } from "@/data/products";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { SpecTable } from "@/components/ui/SpecTable";
import { publishedSpecs } from "@/lib/productSpecs";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Featured product experience — one product presented editorially rather
 * than as a datasheet. Image holds one side, technical narrative the other.
 */
export function FeaturedProduct() {
  const product = getProduct("ptfe-lined-pipes");
  if (!product) return null;

  const image = getImage(product.heroImageKey);

  return (
    <section aria-labelledby="featured-product-heading" className="relative overflow-hidden bg-ink-950 text-white">
      <div aria-hidden="true" className="tech-grid absolute inset-0 opacity-50" />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-14 py-section-lg md:grid-cols-2 lg:gap-20">
          {/* Visual */}
          <Reveal className="relative">
            <div className="photo-scrim relative aspect-4/5 overflow-hidden bg-surface-card lg:aspect-square">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/55 to-transparent" />
            </div>
            {/* Technical corner tag */}
            <div className="absolute -bottom-px -right-px hidden border-l border-t border-white/15 bg-ink-950 px-7 py-5 lg:block">
              <p className="tech-label text-steel-300">Lining specification</p>
              <p className="mt-2 text-heading-md text-white">ASTM F1545</p>
            </div>
          </Reveal>

          {/* Narrative */}
          <Reveal delay={0.12}>
            <Eyebrow tone="light">
              Featured System
            </Eyebrow>
            <h2 id="featured-product-heading" className="mt-6 text-display-lg text-white">{product.title}</h2>
            <p className="mt-7 max-w-xl text-body-lg text-steel-300">{product.overview}</p>

            <SpecTable
              rows={publishedSpecs(product.specifications).slice(0, 5)}
              caption={`${product.title} — headline specification`}
              tone="light"
              className="mt-12"
            />

            <div className="mt-10">
              <Button href={`/products/${product.slug}`} variant="onDark">
                Explore Product
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
