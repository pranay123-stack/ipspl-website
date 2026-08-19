#!/usr/bin/env node
/**
 * SEO LINT — title and description length
 * =======================================
 * Reads the prerendered HTML rather than the source, so it checks what a
 * search engine will actually receive: template composition, absolute-title
 * overrides and generated metadata all included.
 *
 * Bands come from the brief:
 *   title        50–60  — beyond 60 Google truncates in the SERP
 *   description 140–158 — below 140 wastes the snippet, above 158 truncates
 *
 * Runs as part of `npm run build`. `CHECK_SEO=warn` downgrades to a warning
 * for work in progress.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const BUILD = join(process.cwd(), ".next/server/app");
export const TITLE_MIN = 50;
export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 140;
export const DESCRIPTION_MAX = 158;

const warnOnly = process.env.CHECK_SEO === "warn";

function htmlFiles(dir) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out = out.concat(htmlFiles(full));
    else if (name.endsWith(".html") && !name.startsWith("_")) out.push(full);
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;/g, "/");

let pages;
try {
  pages = htmlFiles(BUILD);
} catch {
  console.error("✗ check:seo — no build output. Run `next build` first.");
  process.exit(1);
}

const failures = [];
const seenTitles = new Map();
const seenDescriptions = new Map();

for (const file of pages) {
  const rel = relative(BUILD, file).replace(/\.html$/, "");
  const route = rel === "index" ? "/" : `/${rel}`;
  const html = readFileSync(file, "utf8");

  const title = decode((html.match(/<title>(.*?)<\/title>/s) ?? [])[1] ?? "");
  const description = decode(
    (html.match(/<meta name="description" content="(.*?)"\s*\/?>/s) ?? [])[1] ?? "",
  );

  if (!title) failures.push([route, "title", "missing"]);
  else if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    failures.push([route, "title", `${title.length} chars (want ${TITLE_MIN}–${TITLE_MAX}): ${title}`]);
  }

  if (!description) failures.push([route, "description", "missing"]);
  else if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    failures.push([
      route,
      "description",
      `${description.length} chars (want ${DESCRIPTION_MIN}–${DESCRIPTION_MAX})`,
    ]);
  }

  // Duplicates are as damaging as bad lengths — two pages competing for one
  // snippet means neither is described.
  if (title) {
    if (seenTitles.has(title)) failures.push([route, "title", `duplicate of ${seenTitles.get(title)}`]);
    else seenTitles.set(title, route);
  }
  if (description) {
    if (seenDescriptions.has(description)) {
      failures.push([route, "description", `duplicate of ${seenDescriptions.get(description)}`]);
    } else seenDescriptions.set(description, route);
  }

  // `keywords` is ignored by every major engine and publishes the targeting
  // list to competitors.
  if (/<meta name="keywords"/.test(html)) failures.push([route, "keywords", "present"]);
}

if (failures.length === 0) {
  console.log(`✓ seo: ${pages.length} routes — titles ${TITLE_MIN}–${TITLE_MAX}, descriptions ${DESCRIPTION_MIN}–${DESCRIPTION_MAX}, all unique`);
  process.exit(0);
}

const label = warnOnly ? "⚠" : "✗";
console.error(`${label} seo: ${failures.length} problem(s) across ${pages.length} routes\n`);
for (const [route, field, detail] of failures) {
  console.error(`  ${route}\n    ${field}: ${detail}`);
}
if (!warnOnly) {
  console.error("\nFix the metadata, or run with CHECK_SEO=warn while working.");
  process.exit(1);
}
