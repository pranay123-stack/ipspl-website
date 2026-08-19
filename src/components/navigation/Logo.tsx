import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Typographic brand mark.
 * HANDOVER: replace the inner markup with the supplied IPS-PL logo asset.
 * The wrapper handles sizing and the light/dark colour switch.
 */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      aria-label="Innovative Process Solutions — home"
      className="group flex min-h-[44px] items-center gap-3 py-1"
    >
      {/* Accent block — stands in for the logo device. */}
      <span
        aria-hidden="true"
        className="relative block h-8 w-2 shrink-0 bg-accent transition-transform duration-500 group-hover:scale-y-110"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.375rem] font-semibold tracking-[-0.04em]",
            tone === "light" ? "text-white" : "text-white",
          )}
        >
          IPS<span className="text-accent-bright">·</span>PL
        </span>
        <span
          className={cn(
            "mt-1 hidden whitespace-nowrap text-[0.75rem] font-medium uppercase tracking-[0.16em] sm:block nav:hidden",
            tone === "light" ? "text-steel-300" : "text-steel-300",
          )}
        >
          Innovative Process Solutions
        </span>
      </span>
    </Link>
  );
}
