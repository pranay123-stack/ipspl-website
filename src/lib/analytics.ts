"use client";

/**
 * PLAUSIBLE EVENTS
 * ================
 * Cookieless, so no consent banner is required. Loaded only when
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, which keeps it off in development,
 * and proxied through /js/script.js so ad blockers do not eat it.
 */

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

/**
 * The enquiry funnel, named as the brief specifies.
 *
 * `quote_step_2_complete` and `quote_submitted` look redundant but are not:
 * the first fires when client validation passes and the request goes out, the
 * second when the server accepts it. A gap between them is server-side
 * failure — the one funnel drop that would otherwise be invisible.
 */
export type AnalyticsEvent =
  | "quote_start"
  | "quote_step_1_complete"
  | "quote_step_2_complete"
  | "quote_submitted"
  | "contact_submitted"
  | "datasheet_request"
  | "datasheet_download"
  | "booking_click"
  | "phone_click"
  | "email_click";

export function track(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  window.plausible?.(event, props ? { props } : undefined);
}

export const isAnalyticsEnabled = () => Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
