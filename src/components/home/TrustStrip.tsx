"use client";

import { useEffect, useRef, useState } from "react";
import { observeReveal } from "@/lib/revealOnScroll";
import { company } from "@/data/company";
import { Container } from "@/components/layout/Container";

/**
 * Counts up to a numeric target when scrolled into view.
 * Non-numeric values (e.g. "ASTM F1545") are rendered unchanged.
 */
function Metric({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observeReveal(node, () => setInView(true));
  }, []);

  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";

  const [display, setDisplay] = useState<string>(
    target === null ? value : `0${suffix}`,
  );

  useEffect(() => {
    if (target === null || !inView) return;
    let cancelled = false;
    let frame = 0;
    const total = 44;
    const tick = () => {
      if (cancelled) return;
      frame += 1;
      // Ease-out so the number settles rather than stopping abruptly.
      const progress = 1 - Math.pow(1 - frame / total, 3);
      setDisplay(`${Math.round(target * progress)}${suffix}`);
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [inView, target, suffix]);

  // Text values (e.g. "ASTM F1545") set smaller so they hold one line.
  return (
    <span
      ref={ref}
      className={
        target === null
          ? "block text-heading-lg text-white"
          : "block text-heading-xl tabular-nums text-white"
      }
    >
      {target === null ? value : display}
    </span>
  );
}

/**
 * Trust strip.
 * Figures come from company.trustMetrics; those marked `unverified` are
 * placeholders awaiting IPS-PL confirmation.
 */
export function TrustStrip() {
  return (
    <section aria-label="Company credentials" className="border-b border-white/10 bg-surface-card">
      <Container>
        <dl className="grid grid-cols-2 divide-white/10 nav:grid-cols-4 lg:divide-x">
          {company.trustMetrics.map((metric, i) => (
            <div
              key={metric.label}
              className={`px-0 py-10 lg:px-10 ${i === 0 ? "lg:pl-0" : ""} ${
                i < 2 ? "border-b border-white/10 lg:border-b-0" : ""
              } ${i % 2 === 1 ? "pl-8 lg:pl-10" : ""}`}
            >
              <dd>
                <Metric value={metric.value} />
              </dd>
              <dt className="mt-3 max-w-[22ch] text-caption text-steel-300">
                {metric.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
