import { ImageResponse } from "next/og";
import { caseStudies, getCaseStudy } from "@/data/projects";
import { ogImage, OG_ALT, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/ogImage";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return new ImageResponse(
    ogImage({
      label: study?.sector ?? "Case Study",
      title: study?.title ?? "Reference installation",
    }),
    size,
  );
}
