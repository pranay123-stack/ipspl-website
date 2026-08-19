"use client";

import { CalendarClock, ArrowUpRight } from "lucide-react";
import { company } from "@/data/company";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * "Talk to an engineer" — the lower-commitment path to a conversation.
 *
 * Deliberately a link out, not an embedded scheduler. Embedding would run a
 * third party's script inside our pages, break the zero-cookie position the
 * cookie policy states, and require a consent banner for EU/UK visitors. The
 * link costs none of that and books exactly the same meeting.
 *
 * Deliberately secondary, too. The conversion this site is built around is a
 * completed enquiry with process data and drawings — that is what lets
 * engineering quote. A booked call carries none of that information, so if it
 * sat beside "Request a Quote" with equal weight it would trade good leads for
 * worse ones. It exists to catch the buyer who will not upload commercially
 * sensitive drawings to a supplier they have never spoken to.
 *
 * Renders nothing until `contact.bookingUrl` is set.
 */
export function BookingLink({
  label = "Talk to an engineer",
  className,
  tone = "quiet",
  context,
}: {
  label?: string;
  className?: string;
  /** `quiet` is an inline text link; `panel` is a bordered block. */
  tone?: "quiet" | "panel";
  /** Where the click came from, so the funnel can be read per placement. */
  context: string;
}) {
  const url = company.contact.bookingUrl;
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("booking_click", { context })}
      className={cn(
        "group inline-flex min-h-[44px] items-center gap-2.5 text-white transition-colors hover:text-accent-bright",
        tone === "panel"
          ? "w-full justify-center border border-white/25 px-5 py-3 tech-label hover:bg-white hover:text-ink-950"
          : "py-2 text-body-sm underline-offset-4 hover:underline",
        className,
      )}
    >
      <CalendarClock aria-hidden="true" className="h-4 w-4 shrink-0" />
      {label}
      <ArrowUpRight
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
      <span className="sr-only">(opens the booking calendar in a new tab)</span>
    </a>
  );
}
