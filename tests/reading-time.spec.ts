import { expect, test } from "@playwright/test";
import type { ArticleBlock } from "../src/lib/types";
import { countWords, readingMinutes, readingTimeLabel, WPM } from "../src/lib/readingTime";
import { insights } from "../src/data/insights";

/**
 * 2.2 — the read-time label must be derived, never authored.
 *
 * Every article previously carried a hardcoded label overstating its length by
 * 4-7x: a 91-word piece advertised "3 min read" (~675 words implied). These
 * assertions make that class of drift impossible.
 */
const words = (n: number): ArticleBlock[] => [
  { type: "paragraph", text: Array.from({ length: n }, () => "word").join(" ") },
];

test.describe("reading time", () => {
  test("counts words across every text-bearing block type", () => {
    const blocks: ArticleBlock[] = [
      { type: "heading", text: "One two" },
      { type: "paragraph", text: "three four five" },
      { type: "list", items: ["six seven", "eight"] },
      { type: "callout", tone: "note", text: "nine" },
      { type: "figure", imageKey: "hero", caption: "ten" },
      { type: "table", caption: "eleven", head: ["twelve"], rows: [["thirteen"]] },
    ];
    expect(countWords(blocks)).toBe(13);
  });

  test("never returns less than one minute", () => {
    expect(readingMinutes(words(1))).toBe(1);
    expect(readingMinutes([])).toBe(1);
  });

  test("rounds to the nearest minute at the stated rate", () => {
    expect(readingMinutes(words(WPM))).toBe(1);
    expect(readingMinutes(words(WPM * 2))).toBe(2);
    expect(readingMinutes(words(WPM * 3 + 10))).toBe(3);
  });

  test("label matches the computed minutes", () => {
    expect(readingTimeLabel(words(WPM * 4))).toBe("4 min read");
  });

  test("no published article claims more than its word count supports", () => {
    for (const insight of insights) {
      const actual = countWords(insight.blocks);
      const claimed = readingMinutes(insight.blocks) * WPM;
      // The label is derived, so the claim can only exceed the body by the
      // rounding window — never by a multiple, as it did before.
      expect(claimed - actual, `${insight.slug}`).toBeLessThan(WPM);
    }
  });
});
