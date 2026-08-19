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

export type AnalyticsEvent =
  | "quote_start"
  | "quote_step_2"
  | "quote_submit"
  | "contact_submit"
  | "datasheet_request"
  | "datasheet_download"
  | "tel_click"
  | "mailto_click";

export function track(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  window.plausible?.(event, props ? { props } : undefined);
}

export const isAnalyticsEnabled = () => Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
