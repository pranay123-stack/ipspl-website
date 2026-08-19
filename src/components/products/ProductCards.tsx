import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/data/products";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { headlineSpec } from "@/lib/productSpecs";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * One card per product — image, duty line and headline spec.
 *
 * The listing previously showed five images for seven products and no
 * technical detail, which made the site's most commercially important page
 * thinner than the detail pages it links to.
 */
export function ProductCards() {
  return (
    <RevealGroup
      className="grid gap-px bg-white/10 sm:grid-cols-2 nav:grid-cols-3"
      stagger={0.05}
    >
      {products.map((product) => {
        const image = getImage(product.heroImageKey);
        const spec = headlineSpec(product);

        return (
          <RevealItem key={product.slug} className="bg-surface-base">
            <Link href={`/products/${product.slug}`} className="group flex h-full flex-col">
              <div className="photo-scrim relative aspect-4/3 overflow-hidden bg-surface-card">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
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

                {/* Headline spec — the two figures a specifier checks first. */}
                <dl className="mt-6 space-y-2 border-t border-white/10 pt-5">
                  {spec.bore && (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="tech-label-xs text-steel-300">Bore</dt>
                      <dd className="text-right text-caption tabular-nums text-steel-100">
                        {spec.bore}
                      </dd>
                    </div>
                  )}
                  {spec.temperature && (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="tech-label-xs text-steel-300">Temperature</dt>
                      <dd className="text-right text-caption tabular-nums text-steel-100">
                        {spec.temperature}
                      </dd>
                    </div>
                  )}
                </dl>

                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-6 h-5 w-5 text-steel-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-bright"
                />
              </div>
            </Link>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
