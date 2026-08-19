"use client";

import { useState } from "react";
import { globalLocations } from "@/data/company";
import { WORLD_MASK, MASK_COLS, MASK_ROWS } from "@/data/worldMap";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { SectionCTA } from "@/components/ui/SectionCTA";

const DOT_RADIUS = 0.28;

/**
 * The land mask as a single SVG path, built once at module load.
 *
 * This used to be one <circle> per land cell — about 2,200 elements, which
 * was 69% of every DOM node on the homepage, for a decorative map. Each dot
 * is now a two-arc subpath in one `d` string: identical rendering, one node,
 * and the browser has one element to style, lay out and paint instead of
 * thousands.
 *
 * Coordinates are rounded to two decimals; at a 100-unit viewBox that is well
 * below a device pixel and it keeps the path string compact in the HTML.
 */
const LAND_PATH: string = WORLD_MASK.map((row, r) => {
  const y = ((r / (MASK_ROWS - 1)) * 100).toFixed(2);
  let d = "";
  for (let c = 0; c < row.length; c++) {
    if (row[c] !== "#") continue;
    const x = (c / (MASK_COLS - 1)) * 100;
    // Two half-arcs make a full circle; `a` is relative, so each subpath is
    // self-contained and order does not matter.
    d += `M${(x - DOT_RADIUS).toFixed(2)} ${y}a${DOT_RADIUS} ${DOT_RADIUS} 0 1 0 ${DOT_RADIUS * 2} 0a${DOT_RADIUS} ${DOT_RADIUS} 0 1 0 ${-DOT_RADIUS * 2} 0`;
  }
  return d;
}).join("");

/**
 * Global engineering network.
 *
 * The map is a dot matrix rasterised from public-domain country outlines
 * (see src/data/worldMap.ts). Markers are positioned with the same
 * projection, so adding a location is a data change in company.ts.
 *
 * Countries shown are those listed on the current IPS-PL contact page.
 */
export function GlobalPresence() {
  const [active, setActive] = useState<string>(
    globalLocations.find((l) => l.isHeadquarters)?.country ?? globalLocations[0].country,
  );

  const activeLocation =
    globalLocations.find((l) => l.country === active) ?? globalLocations[0];

  return (
    <section className="anchor-offset relative overflow-hidden bg-ink-950 text-white" id="global" aria-labelledby="global-heading">
      <div aria-hidden="true" className="tech-grid absolute inset-0 opacity-60" />

      <Container size="wide" className="relative py-section-lg">
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-end">
          <Reveal>
            <Eyebrow tone="light">
              Global Presence
            </Eyebrow>
            <h2 id="global-heading" className="mt-6 max-w-[16ch] text-display-lg text-white">
              A global engineering network.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-body-lg text-steel-300">
              Manufacturing in Vadodara, India, with regional representation
              across Asia and North America supporting enquiries, specification
              and delivery in local time zones.
            </p>
          </Reveal>
        </div>

        {/* Map */}
        <Reveal delay={0.15} className="mt-10">
          <div className="relative w-full" style={{ aspectRatio: `${MASK_COLS} / ${MASK_ROWS}` }}>
            {/* Land dots */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <path d={LAND_PATH} className="fill-white/22" />
            </svg>

            {/* Location markers — presentational. The list below is the
                single interactive control per country; making the pin a
                button too produced two controls with the same name. */}
            {globalLocations.map((location, i) => {
              const isActive = location.country === active;
              return (
                <span
                  key={location.country}
                  aria-hidden="true"
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${location.x}%`, top: `${location.y}%` }}
                >
                  <span
                    className={cn(
                      "map-pulse absolute left-1/2 top-1/2 block h-[34px] w-[34px] rounded-full",
                      location.isHeadquarters ? "bg-accent-bright/25" : "bg-white/20",
                    )}
                    style={{ animationDelay: `${i * 450}ms` }}
                  />
                  <span
                    className={cn(
                      "relative block rounded-full transition-all duration-300",
                      location.isHeadquarters
                        ? "h-2.5 w-2.5 bg-accent-bright"
                        : "h-2 w-2 bg-white",
                      isActive && "ring-4 ring-white/25",
                    )}
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute left-1/2 top-full mt-2.5 -translate-x-1/2 whitespace-nowrap tech-label-xs transition-opacity duration-300",
                      location.isHeadquarters || isActive
                        ? "text-white opacity-100"
                        : "text-steel-300 opacity-0",
                    )}
                  >
                    {location.country}
                  </span>
                </span>
              );
            })}
          </div>
        </Reveal>

        {/* Location detail */}
        <Reveal delay={0.2} className="mt-10 border-t border-white/12 pt-8">
          <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-20">
            <div className="min-w-[260px]">
              <p className="tech-label text-steel-300">Selected location</p>
              <p className="mt-3 text-heading-lg text-white">{activeLocation.country}</p>
              <p className="mt-1.5 text-body-sm text-steel-300">{activeLocation.role}</p>
              {activeLocation.city && (
                <p className="mt-1 text-caption text-steel-300">{activeLocation.city}</p>
              )}
              {activeLocation.contact?.phone && (
                <a
                  href={`tel:${activeLocation.contact.phone.replace(/\s/g, "")}`}
                  className="mt-4 inline-flex min-h-[44px] items-center text-body-sm text-white underline-offset-4 hover:underline"
                >
                  {activeLocation.contact.phone}
                </a>
              )}
            </div>

            <ul className="grid gap-px self-start bg-white/12 sm:grid-cols-2 nav:grid-cols-5">
              {globalLocations.map((location) => (
                <li key={location.country}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(location.country)}
                    onFocus={() => setActive(location.country)}
                    onClick={() => setActive(location.country)}
                    className={cn(
                      "flex w-full flex-col gap-1.5 bg-ink-950 px-5 py-6 text-left transition-colors duration-300 hover:bg-ink-900",
                      location.country === active && "bg-ink-900",
                    )}
                  >
                    <span className="text-heading-sm text-white">{location.country}</span>
                    <span className="text-caption text-steel-300">
                      {location.isHeadquarters ? "Headquarters" : "Representation"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <SectionCTA href="/contact">Contact your regional team</SectionCTA>
      </Container>
    </section>
  );
}
