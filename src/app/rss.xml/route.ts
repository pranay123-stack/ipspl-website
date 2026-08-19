import { insights } from "@/data/insights";
import { company } from "@/data/company";
import { getImage } from "@/data/images";
import { readingTimeLabel } from "@/lib/readingTime";
import { SITE_URL } from "@/lib/seo";

/**
 * RSS 2.0 feed for the engineering notes.
 *
 * Both /rss.xml and /feed.xml returned 404. Technical buyers and trade press
 * still read feeds, and it is the cheapest way for anyone tracking the sector
 * to see new material without checking the site.
 *
 * Built from the same `insights` array the pages render, so an article cannot
 * exist in one and not the other. /feed.xml redirects here (next.config.ts).
 */
export const dynamic = "force-static";

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function GET() {
  const sorted = [...insights].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const updated = sorted[0]?.date ?? new Date().toISOString();

  const items = sorted
    .map((insight) => {
      const url = `${SITE_URL}/insights/${insight.slug}`;
      return `    <item>
      <title>${escape(insight.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(insight.date).toUTCString()}</pubDate>
      <category>${escape(insight.category)}</category>
      <description>${escape(insight.excerpt)}</description>
      <enclosure url="${SITE_URL}${escape(getImage(insight.imageKey).src)}" type="image/jpeg" length="0"/>
      <source url="${SITE_URL}/rss.xml">${escape(company.shortName)} engineering notes</source>
      <comments>${url}</comments>
      <!-- ${escape(readingTimeLabel(insight.blocks))} -->
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(company.shortName)} — Engineering Notes</title>
    <link>${SITE_URL}/insights</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Technical notes on fluoropolymer material selection, lined system failure modes, expansion provision and specification practice.</description>
    <language>en</language>
    <copyright>© ${new Date(updated).getUTCFullYear()} ${escape(company.legalName)}</copyright>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
