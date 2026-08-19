"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

/**
 * Mobile-only sticky quote bar.
 *
 * Appears once the reader is ~40% down the page — far enough to have read
 * something, early enough to still act on it. Dismissible, and the dismissal
 * persists for the session so it never nags.
 */
const DISMISS_KEY = "ipspl:quote-bar-dismissed";
const SHOW_AT = 0.4;

export function StickyQuoteBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume dismissed until read

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
      } catch {
        setDismissed(false);
      }
    });
  }, []);

  useEffect(() => {
    if (dismissed) return;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const max = document.body.scrollHeight - window.innerHeight;
        setVisible(max > 0 && window.scrollY / max >= SHOW_AT);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-80 border-t border-white/12 bg-surface-raised/95 backdrop-blur-md nav:hidden"
      role="complementary"
      aria-label="Request a quote"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Link
          href="/quote"
          className="flex min-h-[44px] flex-1 items-center justify-center gap-2.5 bg-accent px-5 py-3 tech-label text-white"
        >
          Request a Quote
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem(DISMISS_KEY, "1");
            } catch {
              /* private mode — dismissal just won't persist */
            }
          }}
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 text-steel-200"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
