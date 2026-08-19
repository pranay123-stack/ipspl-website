import { ImageResponse } from "next/og";
import { ogImage, OG_ALT, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/ogImage";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Homepage share card. Every LinkedIn or WhatsApp share of the site root
 * previously rendered blank — there was no og:image tag at all on any
 * top-level page.
 */
export default function Image() {
  return new ImageResponse(
    ogImage({
      label: "Engineered Fluoropolymer Solutions",
      title: "PTFE Lined Piping Systems",
    }),
    size,
  );
}
