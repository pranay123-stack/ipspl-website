"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Deep-link anchor landing.
 *
 * Two problems this solves:
 *
 * 1. `scroll-behavior: smooth` on the root turned a deep link into a ~1.5s
 *    animated scroll. Measured on /products#lined-valves: scrollY was still 0
 *    at load, 200 at 300ms, and only settled at 4845 after 1500ms. Anything
 *    measuring — or any user scrolling — inside that window sees a no-op.
 *
 * 2. The document grows during load as images resolve, so the position
 *    computed at first paint is stale.
 *
 * The landing is therefore forced to `auto` (instant) and repeated as fonts,
 * images and the load event settle. Smooth scrolling is left intact for
 * in-page clicks, which is where it belongs.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    function land() {
      if (cancelled) return;
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;

      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      el.scrollIntoView({ block: "start" });
      root.style.scrollBehavior = previous;
    }

    // Immediately, then again as the document settles.
    land();
    const timers = [80, 300, 800].map((ms) => window.setTimeout(land, ms));

    if (document.readyState !== "complete") window.addEventListener("load", land);
    document.fonts?.ready.then(land).catch(() => {});
    window.addEventListener("hashchange", land);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("load", land);
      window.removeEventListener("hashchange", land);
    };
  }, [pathname]);

  return null;
}
