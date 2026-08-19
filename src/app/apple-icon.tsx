import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon. Mirrors the typographic mark in Logo.tsx. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05070a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 12, height: 76, background: "#0f5fd4" }} />
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -2,
              fontFamily: "sans-serif",
            }}
          >
            IPS
          </div>
        </div>
      </div>
    ),
    size,
  );
}
