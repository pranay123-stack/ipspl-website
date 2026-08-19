import { ImageResponse } from "next/og";
import { getProduct, products } from "@/data/products";
import { headlineSpec } from "@/lib/productSpecs";
import { ogImage, OG_ALT, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/ogImage";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  const spec = product ? headlineSpec(product) : null;

  return new ImageResponse(
    ogImage({
      label: product?.eyebrow ?? "Products",
      title: product?.title ?? "IPS-PL Products",
      // The bore range is the first figure a specifier checks.
      meta: spec?.bore ?? undefined,
    }),
    size,
  );
}
