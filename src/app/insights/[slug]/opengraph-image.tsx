import { ImageResponse } from "next/og";
import { getInsight, insights } from "@/data/insights";
import { ogImage, OG_ALT, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/ogImage";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsight(slug);
  return new ImageResponse(
    ogImage({
      label: insight?.category ?? "Insights",
      title: insight?.title ?? "Engineering notes",
    }),
    size,
  );
}
