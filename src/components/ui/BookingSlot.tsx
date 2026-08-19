import { company } from "@/data/company";
import { BookingLink } from "./BookingLink";

/**
 * The framed version of the booking link used beneath the quote form.
 *
 * The copy does the ranking: it names the reason someone would not complete
 * the form — drawings they are not ready to share with a supplier they have
 * not spoken to — and offers the call as the answer to that, rather than as a
 * second, easier button.
 */
export function BookingSlot() {
  if (!company.contact.bookingUrl) return null;

  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <p className="tech-label text-steel-300">Not ready to send drawings?</p>
      <p className="mt-4 max-w-lg text-body-md text-steel-300">
        Book fifteen minutes with an engineer first. Bring the duty — media,
        temperature, pressure — and we will tell you what we would need to
        quote it properly.
      </p>
      <div className="mt-6">
        <BookingLink tone="panel" label="Book a call" context="quote-form" />
      </div>
    </div>
  );
}
