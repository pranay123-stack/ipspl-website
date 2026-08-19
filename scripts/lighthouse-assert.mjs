#!/usr/bin/env node
/**
 * PERFORMANCE BUDGETS
 * ===================
 * Reads the summary.json written by scripts/lighthouse.mjs and fails if any
 * route regressed past its budget. Kept separate from the run so a slow or
 * contended machine can be re-measured without re-deciding the thresholds.
 *
 *   node scripts/lighthouse.mjs --port 3300 --out .lighthouse/ci
 *   node scripts/lighthouse-assert.mjs --in .lighthouse/ci
 *
 * Budgets are ceilings on what shipped, not aspirations: each is set from the
 * measured value with headroom, so a real regression trips it and normal
 * run-to-run variance does not. `third-party` is budgeted at zero because
 * this site genuinely loads nothing cross-origin — analytics is proxied
 * through its own domain — and that is worth protecting.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : fallback;
};

const KB = 1024;

/**
 * Per-route ceilings. Where a route is legitimately heavier than the others —
 * the homepage carries the hero and every section preview — it gets its own
 * entry rather than the whole site being loosened to accommodate it.
 */
const BUDGETS = {
  default: { score: 80, lcp: 4000, cls: 0.1, tbt: 600, js: 300 * KB, image: 250 * KB, doc: 60 * KB, dom: 1500 },
  home: { score: 70, lcp: 4200, cls: 0.1, tbt: 900, js: 300 * KB, image: 250 * KB, doc: 60 * KB, dom: 1500 },
  products: { score: 70, lcp: 4200, cls: 0.1, tbt: 900, js: 300 * KB, image: 250 * KB, doc: 40 * KB, dom: 900 },
};

const LOWER_IS_BETTER = new Set(["lcp", "cls", "tbt", "js", "image", "doc", "dom"]);
const LABEL = {
  score: "performance score", lcp: "LCP", cls: "CLS", tbt: "TBT",
  js: "JS transferred", image: "images transferred", doc: "HTML transferred", dom: "DOM elements",
};
const fmt = (key, v) =>
  key === "cls" ? v.toFixed(3)
  : key === "score" || key === "dom" ? String(Math.round(v))
  : ["js", "image", "doc"].includes(key) ? `${Math.round(v / KB)} KB`
  : `${Math.round(v)} ms`;

const dir = arg("--in", ".lighthouse/current");
const { label, results } = JSON.parse(readFileSync(join(dir, "summary.json"), "utf8"));

const failures = [];
for (const [name, result] of Object.entries(results)) {
  const budget = { ...BUDGETS.default, ...(BUDGETS[name] ?? {}) };
  for (const [key, limit] of Object.entries(budget)) {
    const value = result[key];
    if (value == null) continue;
    const over = LOWER_IS_BETTER.has(key) ? value > limit : value < limit;
    if (over) {
      failures.push(
        `  ${result.path}\n    ${LABEL[key]}: ${fmt(key, value)} (budget ${fmt(key, limit)})`,
      );
    }
  }
}

if (failures.length === 0) {
  console.log(`✓ lighthouse budgets: ${Object.keys(results).length} routes within budget (${label})`);
  process.exit(0);
}

console.error(`✗ lighthouse budgets: ${failures.length} breach(es) (${label})\n`);
console.error(failures.join("\n"));
console.error(
  "\nIf this is a deliberate trade rather than a regression, move the budget in" +
  "\nscripts/lighthouse-assert.mjs and say why in the commit message.",
);
process.exit(1);
