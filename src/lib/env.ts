/**
 * DEPLOYMENT-CONFIGURABLE VALUES
 * ==============================
 * Reads the handful of settings that change per deployment, or that IPS-PL
 * should be able to change without a developer editing TypeScript.
 *
 * Two things worth knowing before adding more.
 *
 * `NEXT_PUBLIC_*` is inlined at build time, not read at runtime — every page
 * here is prerendered, so a changed value needs a rebuild before it appears.
 * What this buys is that the change happens in the hosting dashboard rather
 * than in the source, which is a different person's job.
 *
 * And each read must be a literal `process.env.NEXT_PUBLIC_THING` expression.
 * Next replaces those textually during the build; a computed lookup like
 * `process.env[name]` finds nothing and silently yields undefined.
 */

/**
 * A URL from the environment, or null.
 *
 * Validated rather than trusted: a typo in a dashboard field would otherwise
 * render a link that goes nowhere, and a half-typed URL is worse than an
 * absent one because the absent one renders nothing at all.
 */
function url(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    // Only http(s) — a `javascript:` value here would be an injected link.
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return trimmed;
  } catch {
    return null;
  }
}

/** A non-empty string from the environment, or the supplied fallback. */
function text(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

/** A comma-separated list, or the supplied fallback. */
function list(value: string | undefined, fallback: string[]): string[] {
  const items = value?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  return items.length ? items : fallback;
}

export const env = {
  /** Scheduling link. Absent until IPS-PL supplies one — see BookingLink. */
  bookingUrl: url(process.env.NEXT_PUBLIC_BOOKING_URL),
  /** Drives the footer social link and Organization.sameAs. */
  linkedin: url(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  /** Drives the Directions link on /contact and joins sameAs. */
  googleBusinessProfile: url(process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE),
  /** Google Maps embed for /contact. Absent means no iframe is ever created. */
  mapsEmbedUrl: url(process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL),

  /**
   * Published contact details. These have defaults because the site must
   * render correctly with no environment at all — a missing variable should
   * never leave a blank where a phone number belongs.
   */
  contactEmail: text(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "info@ips-pl.com"),
  salesEmail: text(process.env.NEXT_PUBLIC_SALES_EMAIL, "sales@ips-pl.com"),
  phones: list(process.env.NEXT_PUBLIC_PHONES, ["+91 2668 263555", "+91 2668 263666"]),
};
