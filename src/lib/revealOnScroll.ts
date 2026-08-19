"use client";

/**
 * Shared scroll-reveal registry.
 *
 * Why not IntersectionObserver: it only reports *changes* in intersection.
 * If the viewport jumps from above an element to below it inside a single
 * frame — fast wheel scroll, a jump to an anchor, or a slow device where
 * hydration lands late — the element never registers as intersecting and its
 * content stays permanently invisible.
 *
 * A single rAF-throttled scroll pass tests absolute position instead, so it
 * cannot miss an element regardless of how the viewport got there. One
 * listener serves every reveal on the page, and entries are dropped from the
 * set as soon as they fire.
 */

type Entry = { el: HTMLElement; reveal: () => void };

const pending = new Set<Entry>();
let listening = false;
let queued = false;

/**
 * Reveal BEFORE the element reaches the viewport, not after.
 *
 * Triggering on entry meant a tall block (the article CTA is 325px, the
 * related-articles grid 516px) was still mid-transition — and therefore
 * partly transparent — while on screen. Starting 260px early means the
 * transition has finished by the time the reader gets there, so meaningful
 * content is never shipped at opacity 0.
 */
const PRE_TRIGGER = 260;

function pass() {
  queued = false;
  const limit = window.innerHeight + PRE_TRIGGER;
  for (const entry of pending) {
    if (entry.el.getBoundingClientRect().top < limit) {
      entry.reveal();
      pending.delete(entry);
    }
  }
  if (pending.size === 0) stop();
}

function schedule() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(pass);
}

function start() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
}

function stop() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

/** Registers an element. Returns an unsubscribe function. */
export function observeReveal(el: HTMLElement, reveal: () => void): () => void {
  // Above-the-fold content is revealed immediately and without transition:
  // the effect is decoration for content the reader scrolls to, and running
  // it on the first screen only delays the first meaningful paint.
  if (typeof window !== "undefined" && el.getBoundingClientRect().top < window.innerHeight) {
    el.dataset.revealInstant = "true";
    reveal();
    return () => {};
  }

  const entry: Entry = { el, reveal };
  pending.add(entry);
  start();
  schedule();
  return () => {
    pending.delete(entry);
    if (pending.size === 0) stop();
  };
}
