#!/usr/bin/env node
/**
 * Generates docs/photography-brief.md from the repo, not from memory.
 *
 * Every figure in the brief — which page a slot appears on, what aspect ratio
 * the layout crops it to, how wide it renders — is read out of the JSX and the
 * data files. A hand-written brief goes stale the first time a layout changes;
 * this one is regenerated with `npm run docs:photography`.
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(SRC).filter((f) => /\.(tsx?|ts)$/.test(f));
const source = new Map(files.map((f) => [f, readFileSync(f, "utf8")]));

// --- registry -------------------------------------------------------------
const manifest = source.get(join(SRC, "data/images.ts"));
const entries = [...manifest.matchAll(
  /^  (\w+): \{\n(?:.*?\n)*?  \},$/gm,
)].map((m) => {
  const block = m[0];
  const get = (field) => {
    const hit = block.match(new RegExp(`${field}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`));
    return hit ? hit[1].replace(/\\"/g, '"') : null;
  };
  return {
    key: m[1],
    alt: get("alt"),
    brief: get("brief"),
    isPlaceholder: /isPlaceholder: true/.test(block),
  };
});

/**
 * Largest px width a `sizes` string can resolve to.
 *
 * Values above 100vw are deliberate: a cover-cropped hero renders wider than
 * the viewport so the crop is not upscaled. They are honoured here, then the
 * delivery figure is capped — nobody needs a 10,000px JPEG.
 */
function widestFrom(sizes) {
  let widest = 0;
  for (const value of sizes) {
    for (const m of value.matchAll(/(\d+)px/g)) widest = Math.max(widest, Number(m[1]));
    // 1920 is the widest viewport the header tests cover.
    for (const m of value.matchAll(/(\d+)vw/g)) {
      widest = Math.max(widest, Math.round((Number(m[1]) / 100) * 1920));
    }
  }
  return widest || null;
}

// --- where each slot renders, read from the built HTML ---------------------
/**
 * Page, crop and rendered width come from `.next/server/app/**\/*.html`, not
 * from tracing imports.
 *
 * Static tracing cannot answer this honestly: `imageKey` is a field name in
 * four data files and `PageHero` is imported by every route, so an import
 * graph attributes every crop on the site to every photograph. The prerendered
 * HTML states exactly which slot appeared on which page, inside which
 * aspect-ratio wrapper, at which `sizes`.
 */
const BUILD = join(ROOT, ".next/server/app");

function htmlFiles(dir) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out = out.concat(htmlFiles(full));
    else if (name.endsWith(".html") && !name.startsWith("_")) out.push(full);
  }
  return out;
}

function routeOfHtml(file) {
  const rel = relative(BUILD, file).replace(/\.html$/, "");
  return rel === "index" ? "/" : `/${rel}`;
}

let pages = [];
try {
  pages = htmlFiles(BUILD);
} catch {
  console.error("✗ No build output. Run `npm run build` first.");
  process.exit(1);
}

const usage = new Map(entries.map((e) => [e.key, []]));

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const route = routeOfHtml(file);

  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = img[0];
    // Both the optimiser URL and a plain src carry the filename.
    const key = (tag.match(/(?:%2F|\/)([A-Za-z0-9_]+)\.(?:jpg|jpeg|png|webp|avif)/) ?? [])[1];
    if (!key || !usage.has(key)) continue;

    // Nearest preceding aspect class is the wrapper this image fills.
    const before = html.slice(Math.max(0, img.index - 900), img.index);
    const ratio = [...before.matchAll(/aspect-([a-z0-9/]+)/g)].pop();
    const sizes = tag.match(/sizes="([^"]+)"/);

    usage.get(key).push({
      route,
      ratios: ratio && !["auto", "ratio"].includes(ratio[1]) ? [ratio[1]] : [],
      widest: widestFrom(sizes ? [sizes[1]] : []),
    });
  }
}

for (const entry of entries) {
  entry.uses = usage.get(entry.key);
  entry.ratios = [...new Set(entry.uses.flatMap((u) => u.ratios))];
  entry.widest = entry.uses.reduce((max, u) => Math.max(max, u.widest ?? 0), 0) || null;
  entry.routes = [...new Set(entry.uses.map((u) => u.route))].sort();
}

// --- render ---------------------------------------------------------------
const placeholders = entries.filter((e) => e.isPlaceholder);
const ratioLabel = (r) => (r.includes("/") ? r.replace("/", ":") : r);
// Delivery width: the widest rendered CSS px, doubled for 2x displays, floored
// at 2000px so a crop still has room and capped at 4000px — beyond that the
// file size costs more than the sharpness is worth.
const delivery = (w) => Math.min(4000, Math.max(2000, (w ?? 0) * 2));

const rows = entries
  .map(
    (e) =>
      `| \`${e.key}\` | ${
        e.routes.length > 4
          ? `${e.routes.slice(0, 4).join(", ")} +${e.routes.length - 4} more`
          : e.routes.join(", ") || "—"
      } | ${
        e.ratios.map(ratioLabel).join(", ") || "—"
      } | ${e.widest ? `${e.widest}px` : "—"} | ${delivery(e.widest)}px | ${
        e.isPlaceholder ? "stock" : "**supplied**"
      } |`,
  )
  .join("\n");

const details = entries
  .map(
    (e) => `### \`${e.key}\`${e.isPlaceholder ? "" : " — supplied"}

${e.brief ?? "_No art-direction note. Add `brief` in `src/data/images.ts`._"}

- **Appears on:** ${e.routes.join(", ") || "not currently rendered"}
- **Cropped to:** ${
      e.ratios.map(ratioLabel).join(", ") ||
      "no fixed ratio — fills a full-bleed hero, so the crop varies with viewport"
    }
- **Renders up to:** ${e.widest ? `${e.widest}px wide` : "unconstrained"} → **deliver ≥ ${delivery(e.widest)}px on the long edge**
- **Alt text to replace:** "${e.alt}"
`,
  )
  .join("\n");

const doc = `# Photography brief — IPS-PL

<!-- GENERATED by scripts/photography-brief.mjs — run \`npm run docs:photography\`.
     Edit the \`brief\` field in src/data/images.ts, not this file. -->

${placeholders.length} of ${entries.length} slots are still licence-free stock. For a
manufacturer whose pitch is *"we make this in Vadodara"*, that is the largest
credibility gap on the site: a buyer who reverse-image-searches a product shot
finds it on Unsplash.

Every ratio and pixel width below is read out of the layout code, so this brief
cannot drift from what the site actually renders.

## How to install a photograph

1. Drop the file at \`public/images/<key>.jpg\`
2. In \`src/data/images.ts\`, set \`src\`, rewrite \`alt\` to describe **what is
   happening**, remove \`credit\`, and set \`isPlaceholder: false\`
3. \`npm run check:images\` — it counts down as you go

Once every slot is supplied, remove \`CHECK_IMAGES=warn\` from the \`check\` script
so the build fails if stock ever returns.

## Shooting specification

- Landscape unless the table says otherwise; **minimum long edge as stated per slot**
- Well lit, in focus, no motion blur — a modern phone in good light is fine
- No identifiable faces without written consent
- No competitor branding or third-party logos in frame
- JPEG or PNG straight off the camera; optimisation happens at build time
- Shoot **wider than the crop**. A 21:9 hero throws away most of a 3:2 frame.

## Slot index

| Key | Page | Crop | Renders to | Deliver | Status |
|---|---|---|---|---|---|
${rows}

## Priority

The three shots that close most of the gap, in order:

1. \`manufacturingLining\` — the flaring operation. The process that defines the product.
2. \`productPiping\` / \`linedPipe\` — finished spools, racked and tagged. What the buyer receives.
3. \`productComponents\` / \`linedFittings\` — flange faces close in. The joint detail the pitch rests on.

## Per-slot art direction

${details}`;

writeFileSync(join(ROOT, "docs/photography-brief.md"), doc);
console.log(
  `✓ docs/photography-brief.md — ${entries.length} slots, ${placeholders.length} awaiting photography`,
);
