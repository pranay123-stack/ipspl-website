#!/usr/bin/env node
/**
 * Any page that renders the visible breadcrumb nav must also emit a matching
 * BreadcrumbList. The generator was originally wired into the detail
 * templates only, so seven top-level routes shipped a visible trail with no
 * structured equivalent. Static check, so it catches the next route added.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const APP = new URL("../src/app", import.meta.url).pathname;

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return pages(full);
    return name === "page.tsx" ? [full] : [];
  });
}

const offenders = pages(APP).filter((file) => {
  const src = readFileSync(file, "utf8");
  // `crumbs={` is how PageHero receives the visible trail.
  return src.includes("crumbs={") && !src.includes("breadcrumbSchema(");
});

if (offenders.length === 0) {
  console.log("✓ breadcrumbs: every page with a visible trail emits BreadcrumbList");
  process.exit(0);
}

console.error("\x1b[31m✗ breadcrumbs: visible trail without BreadcrumbList\x1b[0m\n");
for (const file of offenders) console.error(`    · ${file.replace(APP, "src/app")}`);
console.error("\n  Add: <JsonLd json={jsonLdGraph(breadcrumbSchema([...]))} />");
console.error("  The trail must mirror the crumbs prop exactly.\n");
process.exit(1);
