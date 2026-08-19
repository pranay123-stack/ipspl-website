/**
 * DEVELOPMENT-ONLY CONTENT FLAGS
 * ==============================
 * Marks stand-in content in the running site so it is visible while working,
 * not only in a build script's output.
 *
 * Placeholder photography is flagged by PlaceholderOverlay, which scans the
 * DOM. This file covers what a DOM scan cannot see: an article whose body is
 * scaffolding reads exactly like a finished one.
 *
 * Renders nothing in a production build — the check is on NODE_ENV, which is
 * statically "production" at build time, so the markup is removed rather than
 * hidden with CSS.
 */
const isDev = process.env.NODE_ENV !== "production";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      // aria-hidden: a note to whoever is building the site. It must not reach
      // a screen reader as if it were page content.
      aria-hidden="true"
      data-dev-flag
      className="pointer-events-none z-10 inline-flex items-center gap-1.5 bg-fuchsia-400/90 px-2 py-1 font-mono text-[10px] uppercase leading-none tracking-wider text-ink-950"
    >
      {children}
    </span>
  );
}

/** Flags an article whose body is scaffolding awaiting real content. */
export function StubFlag({ isStub, label = "stub article" }: { isStub?: boolean; label?: string }) {
  if (!isDev || !isStub) return null;
  return <Badge>{label}</Badge>;
}
