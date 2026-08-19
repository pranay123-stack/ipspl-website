import Link from "next/link";
import { products } from "@/data/products";
import { headlineSpec, linerOptions } from "@/lib/productSpecs";

/**
 * Comparison table for the seven products.
 *
 * Every cell reads from the same `specifications` / `standards` / `materials`
 * arrays the detail pages render, so the table cannot drift from them. A
 * product that does not publish a figure shows an em dash — nothing is
 * inferred to fill a column.
 */
export function ProductComparison() {
  const rows = products.map((product) => ({
    product,
    spec: headlineSpec(product),
    liners: linerOptions(product),
  }));

  const cell = "px-4 py-4 align-top text-body-sm";
  const head =
    "px-4 py-3 text-left tech-label-xs text-steel-300 border-b border-white/12 whitespace-nowrap";

  return (
    // Wide technical tables scroll inside their own container; the page never
    // scrolls horizontally.
    <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
      <table className="w-full min-w-[880px] border-collapse">
        <caption className="sr-only">
          Comparison of IPS-PL product families by bore range, design pressure,
          service temperature, liner options and governing standard.
        </caption>
        <thead>
          <tr>
            <th scope="col" className={head}>
              Product
            </th>
            <th scope="col" className={head}>
              Bore / size
            </th>
            <th scope="col" className={head}>
              Design pressure
            </th>
            <th scope="col" className={head}>
              Service temperature
            </th>
            <th scope="col" className={head}>
              Liner options
            </th>
            <th scope="col" className={head}>
              Standard
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ product, spec, liners }, i) => (
            <tr key={product.slug} className={i % 2 === 0 ? "bg-white/3" : undefined}>
              <th scope="row" className={`${cell} font-medium`}>
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex min-h-[44px] items-center text-white underline-offset-4 hover:text-accent-bright hover:underline"
                >
                  {product.title}
                </Link>
              </th>
              <td className={`${cell} tabular-nums text-steel-200`}>{spec.bore ?? "—"}</td>
              <td className={`${cell} tabular-nums text-steel-200`}>{spec.pressure ?? "—"}</td>
              <td className={`${cell} tabular-nums text-steel-200`}>{spec.temperature ?? "—"}</td>
              <td className={`${cell} text-steel-200`}>
                {liners.length ? liners.join(", ") : "—"}
              </td>
              <td className={`${cell} text-steel-200`}>{spec.standard ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-5 max-w-2xl text-caption text-steel-300">
        Figures are the published range for each family. Confirm the duty
        against your process data — our engineering team will specify liner
        grade, wall thickness and geometry for the application.
      </p>
    </div>
  );
}
