#!/usr/bin/env node
/**
 * Build-time guard: fails when any image is still licence-free stock.
 *
 * Runs as part of `npm run build`. A manufacturer whose pitch is "we make this
 * in Vadodara" cannot ship generic refinery stock — and a buyer who
 * reverse-image-searches will find it. This makes that impossible to do by
 * accident.
 *
 * Set CHECK_IMAGES=warn to downgrade to a warning while photography is
 * still being commissioned.
 */
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/data/images.ts", import.meta.url), "utf8");

const entries = [...source.matchAll(/^ {2}(\w+): \{[\s\S]*?isPlaceholder: (true|false),/gm)]
  .map(([, key, flag]) => ({ key, isPlaceholder: flag === "true" }));

const placeholders = entries.filter((e) => e.isPlaceholder);
const mode = process.env.CHECK_IMAGES ?? "error";

if (placeholders.length === 0) {
  console.log(`✓ images: all ${entries.length} assets are final photography`);
  process.exit(0);
}

const lines = [
  "",
  `  ${placeholders.length} of ${entries.length} images are still placeholders:`,
  ...placeholders.map((p) => `    · ${p.key}`),
  "",
  "  Replace the file in /public/images, update alt + credit,",
  "  and set isPlaceholder: false in src/data/images.ts.",
  "",
];

if (mode === "warn") {
  console.warn(`\x1b[33m⚠ images: stock photography still in use\x1b[0m${lines.join("\n")}`);
  process.exit(0);
}

console.error(`\x1b[31m✗ images: refusing to build with stock photography\x1b[0m${lines.join("\n")}`);
console.error("  Run with CHECK_IMAGES=warn to proceed anyway.\n");
process.exit(1);
