import type { SpecRow } from "@/lib/types";
import { published } from "@/lib/content";
import { StandardValue } from "@/components/ui/StandardLink";
import { cn } from "@/lib/utils";

/**
 * SPECIFICATION TABLE
 * ===================
 * Specification data is tabular, so it is marked up as a table: a `<caption>`
 * naming what the figures describe, `<th scope="row">` on every label, and a
 * scroll container that is keyboard-reachable — a screen-reader user now gets
 * "Nominal bore, DN 25 to DN 300" rather than an undifferentiated run of text,
 * and a keyboard user can scroll a wide table without a pointer.
 *
 * Rows whose value still carries a TODO(content) marker are dropped, and any
 * row without a `source` renders an unverified marker: these figures have not
 * been signed off against an IPS-PL datasheet, and they appear in structured
 * data where a customer may read them as a commitment.
 */
export function SpecTable({
  rows,
  caption,
  captionVisible = false,
  columns = 1,
  tone = "dark",
  className,
}: {
  rows: SpecRow[];
  /** Always required — it is the table's accessible name. */
  caption: string;
  captionVisible?: boolean;
  columns?: 1 | 2;
  /**
   * Stripe weight only. Text colours are identical in both tones — the
   * homepage's measured contrast ratios must not move.
   */
  tone?: "dark" | "light";
  className?: string;
}) {
  const visible = rows.filter((row) => published(row.value));
  if (visible.length === 0) return null;

  const unverified = visible.some((row) => !row.source);

  return (
    <div className={cn("max-w-xl", className)}>
      <div
        // Focusable so the horizontal scroll is operable from the keyboard.
        // role="group" + the caption as its label keeps that stop announced.
        tabIndex={0}
        role="group"
        aria-label={caption}
        className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
      >
        <table className={cn("w-full border-collapse", columns === 2 && "sm:table-fixed")}>
          <caption
            className={cn(
              "text-left",
              captionVisible ? "pb-3 text-caption text-steel-300" : "sr-only",
            )}
          >
            {caption}
          </caption>
          <tbody>
            {visible.map((row, i) => (
              <tr
                key={row.label}
                className={cn(
                  // Zebra striping carries the eye across the gap between
                  // label and value.
                  i % 2 === 0
                    ? tone === "light"
                      ? "bg-white/4"
                      : "bg-white/3"
                    : "bg-transparent",
                )}
              >
                <th
                  scope="row"
                  className="px-3 py-2.5 text-left align-baseline tech-label-xs font-normal text-steel-300"
                >
                  {row.label}
                </th>
                <td className="px-3 py-2.5 text-right align-baseline text-body-sm font-medium tabular-nums text-white">
                  <StandardValue value={row.value} />
                  {row.note && (
                    <span className="mt-1 block text-caption font-normal tabular-nums text-steel-300">
                      {row.note}
                    </span>
                  )}
                  {!row.source && (
                    <span className="sr-only"> (indicative, pending engineering sign-off)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {unverified && (
        <p className="mt-3 px-3 text-caption text-steel-300">
          Figures are indicative of the range and are confirmed against your
          process data at quotation.
        </p>
      )}
    </div>
  );
}
