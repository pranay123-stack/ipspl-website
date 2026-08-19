import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A single quiet conversion link at the end of a section.
 *
 * The homepage previously ran ~10,000px between the hero CTA and the closing
 * one. These are deliberately not buttons — the restrained style holds, and
 * the wording matches what the reader has just read rather than repeating
 * "Request a Quote" eight times.
 */
export function SectionCTA({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-12 border-t border-white/10 pt-7", className)}>
      <Link
        href={href}
        className="group inline-flex min-h-[44px] items-center gap-2.5 py-2 text-[0.9375rem] text-white transition-colors hover:text-accent-bright"
      >
        <span className="relative">
          {children}
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent-bright transition-transform duration-400 group-hover:scale-x-100"
          />
        </span>
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
