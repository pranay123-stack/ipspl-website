import type { ArticleBlock } from "@/lib/types";

/** Words per minute for technical prose. */
export const WPM = 225;

/** Counts words in the text-bearing parts of an article. */
export function countWords(blocks: ArticleBlock[]): number {
  const text = blocks
    .flatMap((block) => {
      switch (block.type) {
        case "heading":
        case "paragraph":
        case "callout":
          return [block.text];
        case "list":
          return block.items;
        case "table":
          return [block.caption, ...block.head, ...block.rows.flat()];
        case "figure":
          return [block.caption];
        default:
          return [];
      }
    })
    .join(" ");

  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Read time derived from the actual body, never authored by hand.
 *
 * Every article previously carried a hardcoded label that overstated its
 * length by 4-7x — a 91-word piece advertised "3 min read", implying ~675
 * words. Computing it means the label cannot lie again.
 */
export function readingMinutes(blocks: ArticleBlock[]): number {
  return Math.max(1, Math.round(countWords(blocks) / WPM));
}

export function readingTimeLabel(blocks: ArticleBlock[]): string {
  return `${readingMinutes(blocks)} min read`;
}
