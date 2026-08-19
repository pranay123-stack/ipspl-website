"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Fires phone_click and email_click for every tel:/mailto: link on the site.
 *
 * `phone_click` and `email_click` were declared in the event union but never
 * called from anywhere — the two highest-intent actions a visitor can take
 * short of the form, and neither was measured.
 *
 * Delegated from the document rather than attached per link: fifteen of these
 * links live in server components, which cannot carry an onClick, and a new one
 * added later is instrumented without anybody remembering to do it.
 */
export function ContactLinkTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest?.("a[href^='tel:'], a[href^='mailto:']");
      if (!(link instanceof HTMLAnchorElement)) return;

      const isPhone = link.href.startsWith("tel:");
      track(isPhone ? "phone_click" : "email_click", {
        // Where on the site the click happened, which is the part that informs
        // layout decisions. The number itself is already known.
        location: link.closest("header")
          ? "header"
          : link.closest("footer")
            ? "footer"
            : link.closest("dialog")
              ? "menu"
              : "page",
        path: window.location.pathname,
      });
    };

    // Capture phase: the browser may navigate away on a tel: link before a
    // bubbled listener runs.
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
