"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { mainNav } from "@/data/navigation";
import { company } from "@/data/company";
import { Logo } from "./Logo";

// Deferred: neither surface is needed for first paint, and both pull in the
// motion runtime. Loading them on demand keeps it off the critical path.
const MegaMenu = dynamic(() => import("./MegaMenu").then((m) => m.MegaMenu));
const MobileNav = dynamic(() => import("./MobileNav").then((m) => m.MobileNav));
import { cn } from "@/lib/utils";
import { MOBILE_NAV_ID } from "./ids";

/**
 * Global header.
 *
 * States:
 *  - Transparent over the hero, so the first screen reads as one image.
 *  - After ~80px of scroll it becomes an opaque blurred bar.
 *  - Hovering or focusing "Products" opens the mega menu, which also
 *    forces the solid state so the panel has a surface to sit on.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Mount the drawer only once it has been opened, so its chunk (and the
  // motion runtime) is fetched on interaction rather than on load.
  const [drawerMounted, setDrawerMounted] = useState(false);
  // Focus returns here when the drawer closes, however it was dismissed.
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // The header is 127px at the top of the page and 80px once the utility
  // strip collapses. A fixed 96px scroll-margin tucked anchors under it, so
  // the measured height becomes the single source of truth.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.round(el.getBoundingClientRect().height)}px`,
      );
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close any open surface when the route changes. Adjusting state during
  // render is the documented pattern here — an effect would cascade renders.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  const solid = scrolled || openMenu !== null;

  const linkClass = (active: boolean) =>
    cn(
      "relative flex items-center py-2 text-[0.75rem] font-medium uppercase tracking-[0.08em] transition-colors duration-300 xl:text-[0.8125rem] xl:tracking-[0.1em]",
      "text-white/80 hover:text-white",
      active && "text-white",
    );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-200 focus:border focus:border-accent-bright focus:bg-surface-base focus:px-5 focus:py-3 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-90 transition-all duration-200",
          // A translucent bar reads well over the hero, but it would show a
          // grey seam against the opaque mega menu — so go fully solid then.
          openMenu !== null
            ? "border-b border-white/10 bg-surface-raised"
            : solid
              ? "border-b border-white/10 bg-surface-base/95 backdrop-blur-xl"
              : "border-b border-white/10 bg-transparent",
        )}
      >
        {/* Utility strip — hidden once scrolled to keep the bar compact. */}
        <div
          className={cn(
            "hidden overflow-hidden border-b transition-all duration-500 nav:block",
            solid
              ? "max-h-0 border-transparent opacity-0"
              : "max-h-12 border-white/10 opacity-100",
          )}
        >
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3 md:px-10 xl:px-14">
            <p className="tech-label text-steel-300">
              {company.positioning}
            </p>
            <div className="flex items-center gap-7">
              <a
                href={`tel:${company.contact.phones[0].replace(/\s/g, "")}`}
                className="flex min-h-[44px] items-center gap-2 py-2 text-caption text-steel-300 transition-colors hover:text-white"
              >
                <Phone aria-hidden="true" className="h-3.5 w-3.5" />
                {company.contact.phones[0]}
              </a>
              <span className="tech-label text-steel-300">
                India · Thailand · Vietnam · China · Canada
              </span>
            </div>
          </div>
        </div>

        {/* Primary bar */}
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-8 px-6 py-4 md:px-10 xl:px-14">
          <Logo tone="light" current={pathname === "/"} />

          <nav aria-label="Primary" className="hidden nav:block">
            <ul className="flex items-center gap-5 xl:gap-8">
              {mainNav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.label} className="flex items-center">
                    {item.megaMenu ? (
                      <button
                        type="button"
                        data-megamenu-trigger
                        aria-expanded={openMenu === item.label}
                        aria-controls={`megamenu-${item.label.toLowerCase()}`}
                        aria-haspopup="true"
                        // A mega-menu item is still a link target: on
                        // /products the Products trigger IS the current page,
                        // and "true" would announce only that we are
                        // somewhere in the section.
                        aria-current={
                          pathname === item.href
                            ? "page"
                            : active
                              ? "true"
                              : undefined
                        }
                        onClick={() =>
                          setOpenMenu(openMenu === item.label ? null : item.label)
                        }
                        className={cn(linkClass(active), "gap-1.5")}
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden="true"
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            openMenu === item.label && "rotate-180",
                          )}
                        />
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent-bright transition-transform duration-400",
                            active || openMenu === item.label ? "scale-x-100" : "scale-x-0",
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        // Exact match only: "page" must mean this page, not an
                        // ancestor of it. A section that merely contains the
                        // current page gets `true`, which is what
                        // aria-current is for.
                        aria-current={
                          pathname === item.href
                            ? "page"
                            : active
                              ? "true"
                              : undefined
                        }
                        className={linkClass(active)}
                      >
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent-bright transition-transform duration-400",
                            active ? "scale-x-100" : "scale-x-0",
                          )}
                        />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
              className={cn(
                "hidden whitespace-nowrap px-5 py-3 text-[0.75rem] font-medium uppercase tracking-[0.1em] transition-colors duration-300 xl:inline-flex",
                "text-white/80 hover:text-white",
              )}
            >
              Contact
            </Link>
            <Link
              href="/quote"
              aria-current={pathname === "/quote" ? "page" : undefined}
              className="inline-flex min-h-[44px] items-center whitespace-nowrap bg-accent px-4 py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-accent-bright sm:px-6"
            >
              {/* The label shortens rather than the button disappearing —
                  below 640px the logo and menu trigger leave no room for the
                  full wording, but they do leave room for the action. */}
              <span className="sm:hidden">Quote</span>
              <span className="hidden sm:inline">Request Quote</span>
            </Link>
            <button
              ref={menuTriggerRef}
              type="button"
              onClick={() => {
                setDrawerMounted(true);
                setMobileOpen(true);
              }}
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
              aria-controls={MOBILE_NAV_ID}
              aria-label="Open navigation"
              className={cn(
                "flex h-11 w-11 items-center justify-center border transition-colors nav:hidden",
                "border-white/25 text-white",
              )}
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        {mainNav.map((item) =>
          item.megaMenu && openMenu === item.label ? (
            <MegaMenu
              key={item.label}
              item={item}
              panelId={`megamenu-${item.label.toLowerCase()}`}
              onClose={() => {
                setOpenMenu(null);
                // Return focus to the trigger that opened the panel.
                document
                  .querySelector<HTMLButtonElement>(
                    `[aria-controls="megamenu-${item.label.toLowerCase()}"]`,
                  )
                  ?.focus();
              }}
              onNavigate={() => setOpenMenu(null)}
            />
          ) : null,
        )}
      </header>

      {drawerMounted && (
        <MobileNav
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          triggerRef={menuTriggerRef}
        />
      )}
    </>
  );
}
