#!/usr/bin/env node
/**
 * PRODUCTION LIGHTHOUSE RUN
 * =========================
 * Everything in the original audit was measured against the Turbopack dev
 * server, where the devtools chunk and ~3.8 MB of unminified JS make every
 * number meaningless. This runs against `next start` on a production build.
 *
 *   node scripts/lighthouse.mjs --port 3300 --out .lighthouse/after --label after
 *
 * Writes one JSON report per route plus summary.json, and prints the table
 * that goes into docs/lighthouse.md. Budgets live in lighthouserc.json and are
 * enforced separately by `npm run lh:assert`.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const ROUTES = [
  { name: "home", path: "/" },
  { name: "products", path: "/products" },
  { name: "product-detail", path: "/products/ptfe-lined-pipes" },
  { name: "industry", path: "/industries/chemical" },
  { name: "quote", path: "/quote" },
];

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const port = arg("--port", "3300");
const outDir = arg("--out", ".lighthouse/current");
const label = arg("--label", "current");
// Lighthouse's simulated throttling still varies run to run; the median of
// three is stable enough to compare against a budget without being slow.
const runs = Number(arg("--runs", "3"));
/**
 * "median" is right on a quiet machine. "best" is right on a shared one:
 * CPU contention can only ever make a Lighthouse run worse — it inflates
 * observed timings, which simulated throttling then multiplies — so the best
 * run of N is the closest available estimate of the unloaded result. Stated
 * rather than silently applied, because it is a claim about the method.
 */
const select = arg("--select", "median");

mkdirSync(outDir, { recursive: true });

const numeric = (audit) => audit?.numericValue ?? null;
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const pick = (values, key) => {
  if (select !== "best") return median(values);
  // Higher is better for score only; every other metric here is a cost.
  return key === "score" ? Math.max(...values) : Math.min(...values);
};

function measure(route) {
  const attempts = [];
  for (let i = 0; i < runs; i++) {
    const file = join(outDir, `${route.name}${i === 0 ? "" : `-run${i}`}.json`);
    execFileSync(
      "npx",
      [
        "lighthouse", `http://localhost:${port}${route.path}`,
        "--preset=perf",
        "--form-factor=mobile",
        "--screenEmulation.mobile",
        "--throttling-method=simulate",
        "--only-categories=performance",
        "--output=json",
        `--output-path=${file}`,
        "--chrome-flags=--headless --no-sandbox --disable-gpu",
        "--quiet",
      ],
      // Generous: on a contended machine a single run can legitimately take
      // minutes, and killing it produces no data rather than slow data.
      { stdio: ["ignore", "ignore", "ignore"], timeout: 600_000 },
    );

    const report = JSON.parse(readFileSync(file, "utf8"));
    const a = report.audits;
    const items = a["resource-summary"]?.details?.items ?? [];
    const bytesOf = (type) => items.find((i) => i.resourceType === type)?.transferSize ?? 0;

    attempts.push({
      score: Math.round((report.categories.performance.score ?? 0) * 100),
      lcp: numeric(a["largest-contentful-paint"]),
      cls: numeric(a["cumulative-layout-shift"]),
      tbt: numeric(a["total-blocking-time"]),
      // INP needs field data; TBT is its lab proxy and Lighthouse reports
      // max-potential-fid as the closest lab analogue. Both are recorded so
      // the report does not imply a field measurement it does not have.
      maxFid: numeric(a["max-potential-fid"]),
      fcp: numeric(a["first-contentful-paint"]),
      si: numeric(a["speed-index"]),
      ttfb: numeric(a["server-response-time"]),
      js: bytesOf("script"),
      image: bytesOf("image"),
      doc: bytesOf("document"),
      total: bytesOf("total"),
      dom: a["dom-size"]?.numericValue ?? null,
    });
  }

  const keys = Object.keys(attempts[0]);
  return Object.fromEntries(
    keys.map((k) => [k, pick(attempts.map((a) => a[k]).filter((v) => v !== null), k)]),
  );
}

const results = {};
console.log(
  `Machine load matters: Lighthouse simulated throttling multiplies observed\n` +
  `timings, so a busy machine inflates TBT several-fold. Check \`uptime\` before\n` +
  `trusting these numbers.\n`,
);
for (const route of ROUTES) {
  process.stdout.write(`  measuring ${route.name} (${runs} runs)… `);
  results[route.name] = { path: route.path, ...measure(route) };
  console.log(`score ${results[route.name].score}`);
}

writeFileSync(
  join(outDir, "summary.json"),
  JSON.stringify({ label, runs, results }, null, 2),
);

const kb = (b) => (b == null ? "—" : `${Math.round(b / 1024)} KB`);
const ms = (v) => (v == null ? "—" : `${Math.round(v)} ms`);

console.log(`\n${label} — ${select} of ${runs} run(s)\n`);
console.log("| Route | Score | LCP | CLS | TBT | Max FID | JS | Images | HTML | DOM |");
console.log("|---|---|---|---|---|---|---|---|---|---|");
for (const r of Object.values(results)) {
  console.log(
    `| \`${r.path}\` | ${r.score} | ${ms(r.lcp)} | ${r.cls?.toFixed(3) ?? "—"} | ${ms(r.tbt)} | ${ms(r.maxFid)} | ${kb(r.js)} | ${kb(r.image)} | ${kb(r.doc)} | ${r.dom ?? "—"} |`,
  );
}
