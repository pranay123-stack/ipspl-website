import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { company, globalLocations } from "@/data/company";
import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { CrossLinks } from "@/components/seo/CrossLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/schema";
import { LocationMap } from "@/components/contact/LocationMap";
import { BookingLink } from "@/components/ui/BookingLink";

export const metadata: Metadata = pageMetadata({
  title: "Contact Our Engineering Team | IPS-PL Vadodara, India",
  description:
    "Contact Innovative Process Solutions: manufacturing in Vadodara, India, with regional representation in Thailand, Vietnam, China and Canada. Mon-Sat.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd json={jsonLdGraph(breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Contact" }]))} />

      <PageHero
        eyebrow="Contact"
        title={<>Talk to our engineering team.</>}
        description="Manufacturing in Vadodara, India, with regional representation across Asia and North America."
        imageKey="engineeringWorkshop"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <Section spacing="lg">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
            {/* Head office */}
            <Reveal>
              <p className="tech-label text-steel-300">Registered office & works</p>
              <h2 className="mt-6 text-heading-xl text-white">
                {company.legalName}
              </h2>

              <ul className="mt-10 space-y-7">
                <li className="flex gap-4">
                  <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-accent-bright" />
                  <address className="text-body-lg not-italic text-steel-300">
                    {company.contact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </li>
                <li className="flex gap-4">
                  <Phone aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-accent-bright" />
                  <div>
                    {company.contact.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="flex min-h-[44px] items-center text-body-lg text-white transition-colors hover:text-accent-bright"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </li>
                <li className="flex gap-4">
                  <Mail aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-accent-bright" />
                  <div>
                    <a
                      href={`mailto:${company.contact.email}`}
                      className="flex min-h-[44px] items-center text-body-lg text-white transition-colors hover:text-accent-bright"
                    >
                      {company.contact.email}
                    </a>
                    <a
                      href={`mailto:${company.contact.salesEmail}`}
                      className="flex min-h-[44px] items-center text-body-lg text-white transition-colors hover:text-accent-bright"
                    >
                      {company.contact.salesEmail}
                    </a>

                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-accent-bright" />
                  <div className="text-body-lg text-steel-300">
                    {company.contact.hours.map((slot) => (
                      <p key={slot.days}>
                        <span className="text-white">{slot.days}</span> · {slot.time}
                      </p>
                    ))}
                  </div>
                </li>
              </ul>

              {/* Sits after the published contact routes, not before them: a
                  buyer who wants to phone should reach the number first. */}
              <div className="mt-8 border-t border-white/10 pt-7 empty:hidden">
                <BookingLink label="Book a call with an engineer" context="contact-page" />
              </div>
            </Reveal>

            {/* Light path: a short message, not the 14-field RFQ. */}
            <Reveal delay={0.1}>
              <div className="border border-white/12 p-8 lg:p-10">
                <h2 className="text-heading-lg text-white">Send us a message</h2>
                <p className="mt-4 max-w-lg text-body-md text-steel-300">
                  For a quick question. If you have a specification or drawings to
                  send, the{" "}
                  <Link href="/quote" className="text-white underline underline-offset-4">
                    request-a-quote form
                  </Link>{" "}
                  captures the process data our engineers need.
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Where to find us. Deliberately after the form: the map is useful
          context, not a conversion path. */}
      <Section spacing="md">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Find Us"
              title={<>The Vadodara works.</>}
              description="Manufacturing, lining, machining and inspection all happen at one site in the GIDC Waghodia estate. Visitors are welcome by arrangement."
            />
            <div className="mt-12 max-w-3xl">
              <LocationMap
                addressLines={company.contact.addressLines}
                directionsUrl={company.contact.googleBusinessProfile}
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Regional offices */}
      <Section spacing="lg" tone="dark">
        <Container>
          <SectionHeader
            eyebrow="Global Network"
            tone="light"
            title={<>Regional representation.</>}
            description="Regional representation across Asia and North America, supporting enquiries, specification and delivery in local time zones."
          />

          <RevealGroup
            className="mt-14 grid gap-px bg-white/12 sm:grid-cols-2 nav:grid-cols-5"
            stagger={0.06}
          >
            {globalLocations.map((location) => (
              <RevealItem key={location.country} className="bg-ink-950 p-7">
                <h3 className="text-heading-md text-white">{location.country}</h3>
                <p className="mt-2.5 text-caption text-steel-300">{location.role}</p>
                {location.city && (
                  <p className="mt-1 tech-label-xs text-steel-300">
                    {location.city}
                  </p>
                )}
                {location.contact?.phone && (
                  <a
                    href={`tel:${location.contact.phone.replace(/\s/g, "")}`}
                    className="mt-4 block text-body-sm text-white transition-colors hover:text-accent-bright"
                  >
                    {location.contact.phone}
                  </a>
                )}
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
      <Section spacing="md">
        <Container>
          <CrossLinks
            title="Before you write"
            links={[
              { label: "Browse the product range", href: "/products" },
              { label: "Industries we supply", href: "/industries" },
              { label: "Our engineering process", href: "/engineering" },
              { label: "Request a detailed quote", href: "/quote" },
            ]}
          />
        </Container>
      </Section>

    </>
  );
}
