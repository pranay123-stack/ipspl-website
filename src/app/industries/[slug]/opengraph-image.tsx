import { ImageResponse } from "next/og";
import { getIndustry, industries } from "@/data/industries";
import { ogImage, OG_ALT, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/ogImage";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  return new ImageResponse(
    ogImage({ label: "Industry", title: industry?.title ?? "Industries" }),
    size,
  );
}
