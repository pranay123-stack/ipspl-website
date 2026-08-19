import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { company } from "@/data/company";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Enquiry received",
  description: "Your enquiry has been received by the IPS-PL engineering team.",
  // A conversion page, so it must be reachable and trackable — but never
  // indexed, or it competes with /quote in search.
  robots: { index: false, follow: true },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; drawings?: string }>;
}) {
  const { ref, drawings } = await searchParams;
  const drawingsPending = drawings === "pending";

  return (
    <section aria-labelledby="thanks-heading" className="relative overflow-hidden bg-surface-base">
      <div aria-hidden="true" className="tech-grid tech-grid-fade absolute inset-0 opacity-70" />

      <Container className="relative py-section-lg">
        <span className="flex h-14 w-14 items-center justify-center border border-accent-bright text-accent-bright">
          <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
        </span>

        <h1 id="thanks-heading" className="mt-8 max-w-[20ch] text-display-lg text-white">
          Enquiry received.
        </h1>

        {ref && (
          <p className="mt-6 text-body-lg text-steel-300">
            Your reference is{" "}
            <strong className="font-mono text-white">{ref}</strong>. Quote it in any
            correspondence about this enquiry.
          </p>
        )}

        <p className="mt-5 max-w-xl text-body-lg text-steel-300">
          Our engineering team will review your process data and respond with a
          specification and commercial proposal. A confirmation is on its way to
          your inbox.
        </p>

        {drawingsPending && (
          <div className="mt-10 max-w-xl border-l-2 border-accent-bright bg-accent/10 p-6">
            <p className="tech-label text-accent-bright">Drawings still needed</p>
            <p className="mt-3 text-body-md text-steel-200">
              Your drawings were too large to send with the form. Please email them
              to{" "}
              <a
                href={`mailto:${company.contact.salesEmail}`}
                className="inline-flex min-h-[44px] items-center text-white underline underline-offset-4"
              >
                {company.contact.salesEmail}
              </a>
              {ref ? <> quoting <strong className="font-mono">{ref}</strong></> : null}, and we
              will attach them to your enquiry.
            </p>
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-8">
          <Link
            href="/products"
            className="inline-flex min-h-[44px] items-center bg-accent px-7 py-4 tech-label text-white transition-colors hover:bg-accent-bright"
          >
            Browse products
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center py-2 tech-label text-white underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </Container>
    </section>
  );
}
