import { ImageResponse } from "next/og";
import { ogImage, OG_ALT, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/ogImage";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    ogImage({ label: "Insights", title: "Engineering Notes on Lined Systems" }),
    size,
  );
}
