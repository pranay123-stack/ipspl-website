"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { NavItem } from "@/lib/types";
import { getImage, IMAGE_BLUR } from "@/data/images";

/**
 * Desktop mega menu.
 *
 * Opened by click or by keyboard, never by hover alone — a hover-only menu is
 * unreachable by keyboard and unusable on touch. The trigger owns
 * aria-expanded / aria-controls; this panel owns Escape, the focus trap and
 * click-outside.
 */
export function MegaMenu({
  item,
  panelId,
  onClose,
  onNavigate,
}: {
  item: NavItem;
  panelId: string;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const menu = item.megaMenu;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    function focusables(): HTMLElement[] {
      return Array.from(
        panel!.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Trap: cycle within the panel while it is open.
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;

      // Focus starts on the trigger, which sits outside the panel in DOM
      // order — so the first Tab has to be pulled in, or it walks straight
      // past the open menu into the rest of the nav.
      if (!panel!.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!panel!.contains(target) && !(target as HTMLElement).closest?.("[data-megamenu-trigger]")) {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [onClose]);

  if (!menu) return null;

  const feature = menu.feature;
  const featureImage = feature ? getImage(feature.imageKey) : null;

  return (
    <div
      ref={panelRef}
      id={panelId}
      className="absolute inset-x-0 top-full border-t border-white/10 bg-surface-raised shadow-[0_28px_70px_-20px_rgba(0,0,0,0.75)]"
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-10 md:px-10 lg:grid-cols-[1fr_auto] xl:px-14">
        <div className="grid gap-x-12 gap-y-9 sm:grid-cols-2 nav:grid-cols-4">
          {menu.columns.map((column) => (
            <div key={column.title}>
              <p className="tech-label border-b border-white/10 pb-3 text-steel-300">
                {column.title}
              </p>
              <ul className="mt-5 space-y-4">
                {column.items.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={onNavigate} className="group block">
                      <span className="flex items-center gap-2 text-heading-sm text-white transition-colors group-hover:text-accent-bright">
                        {link.label}
                        <ArrowRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </span>
                      {link.description && (
                        <span className="mt-1.5 block max-w-[26ch] text-caption text-steel-300">
                          {link.description}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {feature && featureImage && (
          <Link
            href={feature.href}
            onClick={onNavigate}
            className="group relative hidden w-[300px] overflow-hidden bg-surface-card lg:block"
          >
            <Image
              src={featureImage.src}
              alt={featureImage.alt}
              fill
              sizes="300px"
              className="object-cover opacity-55 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-surface-base/50 to-transparent" />
            <div className="relative flex h-full min-h-[280px] flex-col justify-end p-7">
              <p className="tech-label text-accent-bright">{feature.eyebrow}</p>
              <p className="mt-3 text-heading-md text-white">{feature.title}</p>
              <p className="mt-3 text-caption text-steel-300">{feature.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 tech-label text-white">
                Explore
                <ArrowRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
