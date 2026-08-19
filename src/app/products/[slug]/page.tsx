import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Check } from "lucide-react";
import { products, getProduct } from "@/data/products";
import { getImage, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SpecTable } from "@/components/ui/SpecTable";
import { publishedSpecs } from "@/lib/productSpecs";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { DatasheetRequest } from "@/components/products/DatasheetRequest";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, jsonLdGraph, productSchema } from "@/lib/schema";
import { CrossLinks } from "@/components/seo/CrossLinks";
import { ProductFaq } from "@/components/products/ProductFaq";
import { productFaq } from "@/lib/productFaq";
import { caseStudiesForProduct, industriesForProduct, insightsForProduct } from "@/lib/crossLinks";
import { CTABand } from "@/components/ui/CTABand";
import { alternatesFor } from "@/lib/seo";

/** Pre-render every product at build time. Scales with the data file. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: alternatesFor(`/products/${product.slug}`),
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      type: "website",
      images: [{ url: getImage(product.heroImageKey).src }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo.title,
      description: product.seo.description,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const faq = productFaq(product);
  const usedIn = industriesForProduct(product.slug);
  const relatedReading = insightsForProduct(product.slug);



  return (
    <>
      <JsonLd
        json={jsonLdGraph(
          productSchema(product),
          breadcrumbSchema([
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.title },
          ]),
          ...(faq.length ? [faqSchema(faq)] : []),
        )}
      />

      <PageHero
        eyebrow={product.eyebrow}
        title={product.title}
        description={product.shortDescription}
        imageKey={product.heroImageKey}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.title },
        ]}
        meta={publishedSpecs(product.specifications).slice(0, 3).map((spec) => ({
          label: spec.label,
          value: spec.value,
        }))}
      />

      {/* Overview + headline specifications */}
      <Section spacing="lg">
        <Container>
          <div className="grid gap-14 md:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <Reveal>
              <Eyebrow>Overview</Eyebrow>
              <h2 className="mt-6 max-w-[18ch] text-heading-xl text-white">
                Built for the duty, not the catalogue.
              </h2>
              <p className="mt-7 text-body-lg text-steel-300">{product.overview}</p>

              <div className="mt-12">
                <p className="tech-label text-steel-300">Engineering capabilities</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {product.capabilities.map((capability) => (
                    <li key={capability} className="flex gap-3 text-body-sm text-steel-200">
                      <Check
                        aria-hidden="true"
                        className="mt-1 h-4 w-4 shrink-0 text-accent-bright"
                      />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="border border-white/12 p-8 lg:p-10">
                <p className="tech-label text-steel-300">Technical specification</p>
                <SpecTable
                  rows={product.specifications}
                  caption={`${product.title} — published specification range`}
                  className="mt-6"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Applications */}
      <Section spacing="lg" tone="dark">
        <Container>
          <SectionHeader
            eyebrow="Applications"
            tone="light"
            title={<>Where it is specified.</>}
          />

          <RevealGroup
            className="mt-14 grid gap-px bg-white/12 sm:grid-cols-2 nav:grid-cols-5"
            stagger={0.06}
          >
            {product.applications.map((application, i) => (
              <RevealItem key={application} className="bg-ink-950 p-7">
                <span className="tech-label-xs text-accent-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-body-sm text-steel-200">{application}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Materials & standards */}
      <Section spacing="lg" tone="muted">
        <Container>
          <div className="grid gap-14 md:grid-cols-2 lg:gap-20">
            <Reveal>
              <Eyebrow>Materials</Eyebrow>
              <h2 className="mt-6 text-heading-lg text-white">
                Liner grade selected against the duty.
              </h2>
              <ul className="mt-8 divide-y divide-white/10 border-t border-white/10">
                {product.materials.map((material) => (
                  <li key={material} className="py-4 text-body-md text-steel-200">
                    {material}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <Eyebrow>Standards</Eyebrow>
              <h2 className="mt-6 text-heading-lg text-white">
                Designed and verified to specification.
              </h2>
              <SpecTable
                rows={product.standards}
                caption={`${product.title} — governing standards`}
                className="mt-8"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Manufacturing process */}
      <Section spacing="lg">
        <Container>
          <SectionHeader
            eyebrow="Manufacturing"
            title={<>Controlled at every stage.</>}
            description="The full sequence is carried out in-house, which is what makes liner integrity repeatable rather than incidental."
          />

          <div className="mt-14 grid gap-14 md:grid-cols-[1fr_0.8fr] lg:gap-20">
            <RevealGroup className="space-y-px self-start bg-white/10" stagger={0.07}>
              {product.manufacturing.map((step, i) => (
                <RevealItem key={step.title} className="bg-surface-card">
                  <div className="flex gap-7 py-7">
                    <span className="tech-label text-accent-bright">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-heading-sm text-white">{step.title}</h3>
                      <p className="mt-2 max-w-xl text-body-sm text-steel-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.12}>
              <div className="grid gap-px bg-white/10">
                {product.galleryImageKeys.map((key) => {
                  const image = getImage(key);
                  return (
                    <div
                      key={key}
                      className="photo-scrim relative aspect-4/3 overflow-hidden bg-ink-900"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR}
                      />
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Quality & documents */}
      <Section spacing="lg" tone="dark">
        <Container>
          <div className="grid gap-14 md:grid-cols-2 lg:gap-20">
            <Reveal>
              <Eyebrow tone="light">
                Quality & Testing
              </Eyebrow>
              <h2 className="mt-6 max-w-[16ch] text-heading-xl text-white">
                Verified before it leaves the works.
              </h2>
              <ul className="mt-10 space-y-4">
                {product.quality.map((item) => (
                  <li key={item} className="flex gap-3.5 text-body-md text-steel-300">
                    <Check
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-accent-bright"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <Eyebrow tone="light">
                Technical Documents
              </Eyebrow>
              <h2 className="mt-6 text-heading-lg text-white">
                Documentation issued with supply.
              </h2>

              <div className="mt-10">
                <DatasheetRequest documents={product.documents} productTitle={product.title} />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Questions answered from the specification data already on this page. */}
      <Section spacing="lg" tone="muted">
        <Container>
          <SectionHeader
            eyebrow="Common questions"
            headingId="faq-heading"
            title={<>Specifying {product.title}.</>}
          />
          <ProductFaq entries={faq} />
        </Container>
      </Section>

      {/* Contextual internal links, generated from the data model. */}
      <Section spacing="md">
        <Container>
          <CrossLinks
            title="Commonly specified in"
            links={usedIn.map((industry) => ({
              label: industry.title,
              href: `/industries/${industry.slug}`,
              note: industry.shortDescription.split(" ").slice(0, 5).join(" ") + "…",
            }))}
          />
          <CrossLinks
            title="Supplied on these projects"
            links={caseStudiesForProduct(product.slug).map((study) => ({
              label: study.title,
              href: `/case-studies/${study.slug}`,
              note: study.sector,
            }))}
          />
          <CrossLinks
            title="Related reading"
            links={relatedReading.map((insight) => ({
              label: insight.title,
              href: `/insights/${insight.slug}`,
            }))}
          />
        </Container>
      </Section>

      <RelatedProducts slugs={product.related} />

      <CTABand
        title={`Specify ${product.title}`}
        description="Send your process data and drawings. Our engineering team will confirm liner grade, geometry and standards against the duty."
      />
    </>
  );
}
