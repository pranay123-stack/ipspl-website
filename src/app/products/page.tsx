import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { productCategories, getProductsByCategory } from "@/data/products";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCards } from "@/components/products/ProductCards";
import { ProductComparison } from "@/components/products/ProductComparison";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, jsonLdGraph, productListSchema } from "@/lib/schema";
import { products } from "@/data/products";
import { CTABand } from "@/components/ui/CTABand";

export const metadata: Metadata = pageMetadata({
  title: "PTFE Lined Pipes, Fittings & Valves | Products | IPS-PL",
  description:
    "PTFE lined pipes, fittings, valves, bellows, dip pipes and virgin PTFE products engineered to ASTM F1545 for corrosive process service.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        json={jsonLdGraph(
          productListSchema(products),
          breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Products" }]),
        )}
      />
      <PageHero
        eyebrow="Products"
        title={<>Engineered for demanding environments.</>}
        description="Four product families, engineered as matched systems. Every joint, branch and closure in a line carries the same protection as the pipe itself."
        imageKey="productPiping"
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        meta={[
          { label: "Product families", value: "04" },
          { label: "Lining specification", value: "ASTM F1545" },
          { label: "Quality system", value: "ISO 9001:2015" },
        ]}
      />

      {/* Choosing between the families — the question a first-time buyer
          actually arrives with. Every claim below is drawn from the detail
          pages, not added here. */}
      <Section spacing="lg">
        <Container>
          <Reveal>
            <Eyebrow>How to choose</Eyebrow>
            <h2 className="mt-6 max-w-[22ch] text-heading-xl text-white">
              Four families, chosen by what the line has to survive.
            </h2>
            <div className="mt-7 grid gap-6 text-body-lg text-steel-300 md:grid-cols-2 md:gap-10">
              <div className="space-y-5">
                <p>
                  Start with the duty, not the part. A{" "}
                  <strong className="font-medium text-white">lined piping system</strong>{" "}
                  is specified as a matched set — pipe, fittings and valves lined
                  to one specification — because a system sourced against a bill
                  of materials fails at whichever joint was lined to a different
                  standard.
                </p>
                <p>
                  <strong className="font-medium text-white">Lined valves</strong>{" "}
                  are the exception worth separating out. A valve has to seal
                  repeatedly against media that attacks everything else in the
                  plant, so the wetted path stays fluoropolymer through the seat,
                  body and stem interface rather than only through the bore.
                </p>
              </div>
              <div className="space-y-5">
                <p>
                  <strong className="font-medium text-white">Engineered
                  components</strong> — bellows, dip pipes, headers, domes — are
                  made to the vessel rather than to a catalogue. Reach for these
                  when thermal growth needs somewhere to go, or when the
                  fluoropolymer barrier has to extend across a reactor envelope.
                </p>
                <p>
                  <strong className="font-medium text-white">PTFE products</strong>{" "}
                  are the sealing and wear parts that hold the rest together:
                  virgin grades where purity and chemical resistance govern,
                  filled grades where creep resistance, thermal conductivity or
                  wear life matter more.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-16">
            <ProductCards />
          </Reveal>
        </Container>
      </Section>

      {/* Comparison ------------------------------------------------------- */}
      <Section spacing="lg" tone="muted" id="compare">
        <Container>
          <Reveal>
            <Eyebrow>Compare</Eyebrow>
            <h2 className="mt-6 max-w-[24ch] text-heading-xl text-white">
              The seven products side by side.
            </h2>
            <p className="mt-6 max-w-2xl text-body-lg text-steel-300">
              Bore range, design pressure, service temperature, liner options and
              the governing standard for each family.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <ProductComparison />
          </Reveal>
        </Container>
      </Section>

      {productCategories.map((category, i) => {
        const items = getProductsByCategory(category.slug);
        const image = getImage(category.imageKey);
        const flip = i % 2 === 1;

        return (
          <Section
            key={category.slug}
            id={category.slug}
            spacing="lg"
            tone={i % 2 === 0 ? "light" : "muted"}
            className="anchor-offset"
          >
            <Container>
              <div
                className={`grid gap-12 md:grid-cols-2 lg:gap-20 ${
                  flip ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <Reveal className="relative">
                  <div className="photo-scrim relative aspect-4/3 overflow-hidden bg-ink-900">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR}
                    />
                  </div>
                </Reveal>

                <Reveal delay={0.1} className="flex flex-col justify-center">
                  <Eyebrow>Product Family</Eyebrow>
                  <h2 className="mt-6 text-heading-xl text-white">{category.title}</h2>
                  <p className="mt-6 max-w-xl text-body-lg text-steel-300">
                    {category.overview}
                  </p>

                  <ul className="mt-10 divide-y divide-white/10 border-t border-white/10">
                    {items.map((product) => (
                      <li key={product.slug}>
                        <Link
                          href={`/products/${product.slug}`}
                          className="group flex items-center justify-between gap-6 py-5"
                        >
                          <span>
                            <span className="block text-heading-sm text-white transition-colors duration-300 group-hover:text-accent-bright">
                              {product.title}
                            </span>
                            <span className="mt-1 block max-w-md text-caption text-steel-300">
                              {product.shortDescription}
                            </span>
                          </span>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-5 w-5 shrink-0 text-steel-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-bright"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </Container>
          </Section>
        );
      })}

      <CTABand />
    </>
  );
}
