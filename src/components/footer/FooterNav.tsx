"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { footerNav } from "@/data/navigation";

/**
 * Footer link columns.
 *
 * Split out as the footer's only client boundary so the rest of the footer —
 * address, phone numbers, certifications, the whole legal strip — stays server
 * rendered. One boundary carrying href/label pairs, rather than turning each
 * link into its own, or making the entire footer a client component to read
 * one value.
 */
export function FooterNav({ groups }: { groups: typeof footerNav }) {
  const pathname = usePathname();

  return (
    <>
      {groups.map((group) => (
        <nav key={group.title} aria-label={group.title}>
          <p className="tech-label border-b border-white/10 pb-3 text-steel-300">
            {group.title}
          </p>
          <ul className="mt-5 space-y-3.5">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="inline-flex min-h-[44px] items-center py-2 text-body-sm text-steel-300 transition-colors hover:text-white aria-[current=page]:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </>
  );
}
