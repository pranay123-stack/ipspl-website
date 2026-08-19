import type { ReactElement } from "react";

/**
 * Branded 1200x630 share card.
 *
 * Uses the existing colour tokens as literals — ImageResponse renders in
 * Satori, which has no access to the CSS custom properties or the Tailwind
 * theme, so the values are mirrored here deliberately rather than imported.
 * Keep them in step with @theme in globals.css.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = "Innovative Process Solutions — engineered fluoropolymer systems";

const INK = "#05070a";
const RAISED = "#0a0e14";
const ACCENT = "#0f5fd4";
const ACCENT_BRIGHT = "#3b87f5";
const STEEL_100 = "#e3e7ec";
const STEEL_300 = "#98a1b0";

export function ogImage({
  label,
  title,
  meta,
}: {
  /** Small uppercase section label, e.g. "Products". */
  label: string;
  /** The page title, wrapped by Satori. */
  title: string;
  /** Optional right-aligned technical detail, e.g. a bore range. */
  meta?: string;
}): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: `linear-gradient(135deg, ${INK} 0%, ${RAISED} 55%, ${INK} 100%)`,
        padding: "64px 72px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Brand row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 10, height: 44, background: ACCENT }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, fontWeight: 600, color: "#ffffff", letterSpacing: -1 }}>
            IPS·PL
          </div>
          <div style={{ fontSize: 15, color: STEEL_300, letterSpacing: 3, marginTop: 2 }}>
            INNOVATIVE PROCESS SOLUTIONS
          </div>
        </div>
      </div>

      {/* Title block */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 20, color: ACCENT_BRIGHT, letterSpacing: 4, marginBottom: 20 }}>
          {label.toUpperCase()}
        </div>
        <div
          style={{
            fontSize: 66,
            fontWeight: 600,
            color: "#ffffff",
            lineHeight: 1.08,
            letterSpacing: -2,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
      </div>

      {/* Footer rule */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid rgba(255,255,255,0.14)`,
          paddingTop: 26,
        }}
      >
        <div style={{ fontSize: 19, color: STEEL_100, letterSpacing: 2 }}>
          ASTM F1545 · ISO 9001:2015
        </div>
        <div style={{ fontSize: 19, color: STEEL_300, letterSpacing: 2 }}>
          {meta ?? "ips-pl.com"}
        </div>
      </div>
    </div>
  );
}
