import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { company, globalLocations, servedSectors } from "@/data/company";
import { images, IMAGE_BLUR } from "@/data/images";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CTABand } from "@/components/ui/CTABand";
import { CrossLinks } from "@/components/seo/CrossLinks";
import { products } from "@/data/products";
import { industries } from "@/data/industries";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Fluoropolymer Manufacturer in Vadodara, India | IPS-PL",
  description:
    "Innovative Process Solutions Pvt. Ltd. manufactures lined pipes, fittings, valves and PTFE products from Vadodara, Gujarat, supplying five countries.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd json={jsonLdGraph(breadcrumbSchema([{ label: "Home", href: "/" }, { label: "About" }]))} />

      <PageHero
        eyebrow="About IPS-PL"
        title={<>Engineering the materials that keep industry moving.</>}
        description={company.positioning}
        imageKey="aboutPortrait"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        meta={[
          { label: "Headquarters", value: "Vadodara, India" },
          { label: "Countries", value: String(globalLocations.length) },
          { label: "Quality system", value: "ISO 9001:2015" },
        ]}
      />

      {/* Story */}
      <Section spacing="lg">
        <Container>
          <div className="grid gap-14 md:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <Reveal>
              <Eyebrow>The Company</Eyebrow>
              <h2 className="mt-6 max-w-[18ch] text-heading-xl text-white">
                A single manufacturing unit that became an international supplier.
              </h2>
              <div className="mt-8 space-y-5 text-body-lg text-steel-300">
                <p>
                  Innovative Process Solutions Pvt. Ltd. manufactures lined pipes,
                  fittings and valves alongside virgin PTFE products from its works
                  in Vadodara, Gujarat.
                </p>
                <p>
                  The company describes itself as a fully integrated brand in the
                  fluoropolymer sector, and the integration is the point: housing
                  preparation, lining, forming, machining, inspection and testing
                  all happen under one roof, which is what allows liner integrity to
                  be a controlled variable rather than a hoped-for outcome.
                </p>
                <p>
                  Today that work reaches process industries across five countries —
                  refineries, pharmaceutical manufacturers, power generation,
                  aviation, detergent and chemical producers.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="photo-scrim relative aspect-3/4 overflow-hidden bg-ink-900">
                <Image
                  src={images.manufacturingFloor.src}
                  alt={images.manufacturingFloor.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR}
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section spacing="lg" tone="dark">
        <Container>
          <SectionHeader
            eyebrow="What We Stand For"
            tone="light"
            title={<>Commitments, stated plainly.</>}
          />
          <RevealGroup
            className="mt-14 grid gap-px bg-white/12 sm:grid-cols-2 md:grid-cols-3"
            stagger={0.06}
          >
            {company.values.map((value, i) => (
              <RevealItem key={value.title} className="bg-ink-950 p-8 lg:p-10">
                <span className="tech-label text-accent-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-heading-md text-white">{value.title}</h3>
                <p className="mt-3 text-body-sm text-steel-300">{value.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* Sectors + presence */}
      <Section spacing="lg" tone="muted">
        <Container>
          <div className="grid gap-14 md:grid-cols-2 lg:gap-20">
            <Reveal>
              <Eyebrow>Sectors Supplied</Eyebrow>
              <h2 className="mt-6 text-heading-lg text-white">
                Where IPS-PL equipment is installed.
              </h2>
              <ul className="mt-8 divide-y divide-white/10 border-t border-white/10">
                {servedSectors.map((sector) => (
                  <li key={sector} className="py-4 text-body-md text-steel-200">
                    {sector}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <Eyebrow>Presence</Eyebrow>
              <h2 className="mt-6 text-heading-lg text-white">
                Manufacturing in India, representation across four more markets.
              </h2>
              <ul className="mt-8 divide-y divide-white/10 border-t border-white/10">
                {globalLocations.map((location) => (
                  <li
                    key={location.country}
                    className="flex items-baseline justify-between gap-6 py-4"
                  >
                    <span className="text-body-md text-white">{location.country}</span>
                    <span className="text-caption text-steel-300">{location.role}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Additional services — verified from the current site */}
      <Section spacing="md">
        <Container>
          <Reveal>
            <Eyebrow>Also Provided</Eyebrow>
            <h2 className="mt-6 max-w-[22ch] text-heading-lg text-white">
              Support that continues past despatch.
            </h2>
            <RevealGroup className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2 nav:grid-cols-4">
              {[
                { title: "Installation manuals", detail: "Supplied with equipment, including torque guidance." },
                { title: "R&D specimens", detail: "PTFE, PFA and FEP specimens available for evaluation." },
                { title: "Customer consultancy", detail: "Application review and material selection support." },
                { title: "Emergency response", detail: "Support for breakdown and shutdown requirements." },
              ].map((service) => (
                <RevealItem key={service.title} className="bg-surface-card p-7">
                  <h3 className="text-heading-sm text-white">{service.title}</h3>
                  <p className="mt-2.5 text-caption text-steel-300">{service.detail}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <CrossLinks
            title="What we make"
            links={products.slice(0, 4).map((p) => ({
              label: p.title,
              href: `/products/${p.slug}`,
            }))}
          />
          <CrossLinks
            title="Who we supply"
            links={industries.slice(0, 4).map((i) => ({
              label: i.title,
              href: `/industries/${i.slug}`,
            }))}
          />
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
