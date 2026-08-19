import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { footerNav, legalNav } from "@/data/navigation";
import { FooterNav } from "./FooterNav";
import { company, globalLocations } from "@/data/company";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/navigation/Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white">
      <div aria-hidden="true" className="tech-grid absolute inset-0 opacity-60" />

      <Container className="relative">
        {/* Top: brand + navigation */}
        <div className="grid gap-14 py-section-md lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-8 max-w-sm text-body-md text-steel-300">
              {company.summary}
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex gap-3.5">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright" />
                <address className="text-body-sm not-italic text-steel-300">
                  {company.contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>

              <div className="flex gap-3.5">
                <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright" />
                <div className="text-body-sm text-steel-300">
                  {company.contact.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="flex min-h-[44px] items-center transition-colors hover:text-white"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex gap-3.5">
                <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent-bright" />
                <a
                  href={`mailto:${company.contact.email}`}
                  className="inline-flex min-h-[44px] items-center py-2 text-body-sm text-steel-300 transition-colors hover:text-white"
                >
                  {company.contact.email}
                </a>
              </div>
            </div>

            {(company.contact.linkedin || company.contact.social.length > 0) && (
              <ul className="mt-8 flex flex-wrap gap-3">
                {company.contact.linkedin && (
                  <li>
                    <a
                      href={company.contact.linkedin}
                      rel="me noopener"
                      target="_blank"
                      className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-steel-300 transition-colors hover:border-white hover:text-white"
                      aria-label="IPS-PL on LinkedIn"
                    >
                      <LinkedInMark />
                    </a>
                  </li>
                )}
                {company.contact.social.map((profile) => (
                  <li key={profile.url}>
                    <a
                      href={profile.url}
                      rel="me noopener"
                      target="_blank"
                      className="inline-flex min-h-[44px] items-center border border-white/15 px-4 tech-label text-steel-300 transition-colors hover:border-white hover:text-white"
                    >
                      {profile.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <FooterNav groups={footerNav} />
          </div>
        </div>

        {/* Global presence strip */}
        <div className="border-t border-white/10 py-10">
          <p className="tech-label text-steel-300">Global Presence</p>
          <ul className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
            {globalLocations.map((location) => (
              <li key={location.country} className="flex items-baseline gap-2.5">
                <span className="text-body-sm font-medium text-white">
                  {location.country}
                </span>
                <span className="text-caption text-steel-300">{location.role}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-5 border-t border-white/10 py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-caption text-steel-300">
            © {year} {company.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center py-2 text-caption text-steel-300 transition-colors hover:text-steel-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

/** LinkedIn brand mark — lucide v1 no longer ships brand icons. */
function LinkedInMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4V9Z" />
    </svg>
  );
}
