import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Clock, Mail, Phone } from "lucide-react";
import { company } from "@/data/company";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Request a Quote for PTFE Lined Equipment | IPS-PL",
  description:
    "Submit process data and drawings for PTFE lined pipes, fittings, valves and engineered fluoropolymer components.",
  path: "/quote",
});

/** What happens after submission — sets expectations on a B2B enquiry. */
const NEXT_STEPS = [
  { index: "01", title: "Technical review", detail: "Your process data is reviewed against liner grade, geometry and standards." },
  { index: "02", title: "Clarification", detail: "We come back on anything missing — commonly vacuum duty and cleaning chemistry." },
  { index: "03", title: "Specification & proposal", detail: "A specification and commercial proposal, with lead time." },
];

export default function QuotePage() {
  return (
    <>
      <JsonLd json={jsonLdGraph(breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Request a Quote" }]))} />

      <PageHero
        title={<>Tell us what your process has to survive.</>}
        description="The more process data you send, the more precise the specification we can return. Approximate figures are more useful than none."
        imageKey="engineeringTeam"
        crumbs={[{ label: "Home", href: "/" }, { label: "Request a Quote" }]}
      />

      <Section spacing="lg">
        <Container>
          <div className="grid gap-16 md:grid-cols-[1fr_280px] lg:gap-24">
            <Reveal>
              <QuoteForm />
            </Reveal>

            {/* Sidebar */}
            <Reveal delay={0.1}>
              <aside className="lg:sticky lg:top-32">
                <div className="border border-white/12 p-7">
                  <p className="tech-label text-steel-300">Prefer to talk</p>
                  <ul className="mt-6 space-y-5">
                    <li className="flex gap-3.5">
                      <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright" />
                      <div>
                        {company.contact.phones.map((phone) => (
                          <a
                            key={phone}
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="flex min-h-[44px] items-center text-body-sm text-white hover:text-accent-bright"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </li>
                    <li className="flex gap-3.5">
                      <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright" />
                      <a
                        href={`mailto:${company.contact.salesEmail}`}
                        className="flex min-h-[44px] items-center text-body-sm text-white hover:text-accent-bright"
                      >
                        {company.contact.salesEmail}
                      </a>
                    </li>
                    <li className="flex gap-3.5">
                      <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright" />
                      <div className="text-body-sm text-steel-300">
                        {company.contact.hours.map((slot) => (
                          <p key={slot.days}>
                            <span className="block text-white">{slot.days}</span>
                            {slot.time}
                          </p>
                        ))}
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 border border-white/12 p-7">
                  <p className="tech-label text-steel-300">What happens next</p>
                  <ol className="mt-6 space-y-6">
                    {NEXT_STEPS.map((step) => (
                      <li key={step.index}>
                        <span className="tech-label-xs text-accent-bright">
                          {step.index}
                        </span>
                        <p className="mt-2 text-heading-sm text-white">{step.title}</p>
                        <p className="mt-1.5 text-caption text-steel-300">{step.detail}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </aside>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
