"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * DEVELOPMENT-ONLY PLACEHOLDER OVERLAY
 * ====================================
 * Badges every image on screen that is still licence-free stock, with its
 * manifest key, so replacing photography is a matter of reading the badge and
 * editing that entry.
 *
 * Implemented as a single DOM scan rather than a flag inside each of the 21
 * components that render an <Image>: the badge is a development affordance and
 * should not be threaded through twenty-one component signatures, and a scan
 * cannot miss a slot someone adds later.
 *
 * Identification is by file path — every placeholder lives under
 * /images/placeholder/, which is also what `npm run check:images` asserts, so
 * the overlay and the build guard agree by construction.
 */
const PLACEHOLDER_DIR = "/images/placeholder/";

interface Badge {
  key: string;
  top: number;
  left: number;
  width: number;
}

export function PlaceholderOverlay() {
  const pathname = usePathname();
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    let frame = 0;

    const scan = () => {
      const found: Badge[] = [];
      for (const img of Array.from(document.images)) {
        // next/image rewrites src to /_next/image?url=<encoded>, so decode.
        const url = decodeURIComponent(img.currentSrc || img.src);
        if (!url.includes(PLACEHOLDER_DIR)) continue;
        const key = url.split(PLACEHOLDER_DIR)[1]?.split(/[.?]/)[0];
        if (!key) continue;

        const box = img.getBoundingClientRect();
        // Skip anything scrolled out of view or collapsed — a mega-menu panel
        // that is closed still has images in the DOM.
        if (box.width < 24 || box.bottom < 0 || box.top > window.innerHeight) continue;
        found.push({ key, top: box.top, left: box.left, width: box.width });
      }
      setBadges(found);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    };

    schedule();
    // Images decode after mount, and layout shifts as they do.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [pathname]);

  if (badges.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      data-dev-overlay
      className="pointer-events-none fixed inset-0 z-[9999]"
    >
      {badges.map((badge, i) => (
        <span
          key={`${badge.key}-${i}`}
          data-dev-flag
          style={{ top: badge.top, left: badge.left, maxWidth: badge.width }}
          className="absolute truncate bg-amber-400/90 px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-wider text-black"
        >
          stock · {badge.key}
        </span>
      ))}
    </div>
  );
}
