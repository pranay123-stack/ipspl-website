/**
 * Enquiry reference, e.g. IPS-260819-K4M2.
 *
 * Printed on the thank-you page, in the acknowledgement and in the internal
 * email, so an enquirer whose drawings were too large can quote it when
 * sending them on separately.
 */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1

export function createReference(now: Date = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `IPS-${yy}${mm}${dd}-${suffix}`;
}
