import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * In-body contextual links.
 *
 * Deliberately quiet — this is internal linking for crawlers and for a reader
 * following a thread, not another CTA block.
 */
export function CrossLinks({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; note?: string }[];
}) {
  if (links.length === 0) return null;

  return (
    <div className="mt-12 border-t border-white/10 pt-7">
      <p className="tech-label text-steel-300">{title}</p>
      <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex min-h-[44px] items-center gap-2 py-2 text-body-sm text-steel-100 transition-colors hover:text-accent-bright"
            >
              {link.label}
              {link.note && <span className="text-caption text-steel-300">— {link.note}</span>}
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
