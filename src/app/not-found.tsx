import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { productCategories } from "@/data/products";
import { industries } from "@/data/industries";
import { company } from "@/data/company";
import { Container } from "@/components/layout/Container";

/**
 * 404.
 *
 * Previously a headline followed by a link row and ~300px of void. It now
 * carries the same routes a lost visitor actually needs — the product
 * families, the top sectors, and a direct line to the engineering team.
 */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-surface-base text-steel-100">
      <div aria-hidden="true" className="tech-grid tech-grid-fade absolute inset-0 opacity-70" />

      <Container className="relative py-section-lg">
        <p className="tech-label text-accent-bright">Error 404</p>
        <h1 className="mt-6 max-w-[20ch] text-balance text-display-lg text-white">
          That page is not in our catalogue.
        </h1>
        <p className="mt-6 max-w-xl text-body-lg text-steel-300">
          The link may be out of date, or the page renamed. Everything we
          manufacture is below — or speak to an engineer directly and we will
          point you at the right specification.
        </p>

        <div className="mt-14 grid gap-px bg-white/10 md:grid-cols-2">
          <div className="bg-surface-base p-8">
            <p className="tech-label border-b border-white/10 pb-3 text-steel-300">
              Product families
            </p>
            <ul className="mt-5 space-y-3.5">
              {productCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products#${category.slug}`}
                    className="group flex min-h-[44px] items-center justify-between gap-4 py-2 text-body-md text-steel-200 transition-colors hover:text-white"
                  >
                    {category.title}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-steel-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-base p-8">
            <p className="tech-label border-b border-white/10 pb-3 text-steel-300">
              Industries
            </p>
            <ul className="mt-5 space-y-3.5">
              {industries.slice(0, 4).map((industry) => (
                <li key={industry.slug}>
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="group flex min-h-[44px] items-center justify-between gap-4 py-2 text-body-md text-steel-200 transition-colors hover:text-white"
                  >
                    {industry.title}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-steel-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-8">
          <Link
            href="/quote"
            className="inline-flex items-center bg-accent px-7 py-4 tech-label text-white transition-colors hover:bg-accent-bright"
          >
            Request a Quote
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center py-2 tech-label text-white underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
          <a
            href={`tel:${company.contact.phones[0].replace(/\s/g, "")}`}
            className="inline-flex min-h-[44px] items-center py-2 text-body-sm text-steel-300 transition-colors hover:text-white"
          >
            {company.contact.phones[0]}
          </a>
        </div>
      </Container>
    </section>
  );
}
