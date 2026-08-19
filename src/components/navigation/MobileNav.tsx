"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, X } from "lucide-react";
import { drawerNav } from "@/data/navigation";
import { company } from "@/data/company";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

/**
 * Mobile navigation drawer.
 *
 * Built on the native <dialog> element rather than a hand-rolled overlay:
 * showModal() gives Escape-to-close, moves focus into the dialog, and makes
 * the rest of the document inert — which is a real focus trap, not an
 * approximation of one. No headless primitive is a dependency here, so the
 * platform element is the most robust option available.
 *
 * Affordances are deliberately not uniform: a chevron means the row expands,
 * an arrow means it navigates. Giving a chevron to a row with no children
 * would remove the ambiguity by making the label wrong.
 */
export function MobileNav({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  /** Focus returns here when the dialog closes. */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  // Drives the content transition; the dialog surface itself is opaque from
  // the first frame so menu items never render over the page behind them.
  const [entered, setEntered] = useState(false);
  const panelId = useId();

  const handleClose = useCallback(() => {
    setEntered(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      // All sections start collapsed — pre-expanding one pushes the rest
      // below the fold on a phone.
      setExpanded(null);
      requestAnimationFrame(() => {
        setEntered(true);
        closeRef.current?.focus();
      });
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Fires for Escape and for close() alike, so state and focus stay in sync
  // however the dialog was dismissed.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onNativeClose = () => {
      setEntered(false);
      onClose();
      triggerRef.current?.focus();
    };
    dialog.addEventListener("close", onNativeClose);
    return () => dialog.removeEventListener("close", onNativeClose);
  }, [onClose, triggerRef]);

  // Background scroll lock, released whenever the dialog is not open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Site navigation"
      className="nav-dialog lg:hidden"
      onCancel={handleClose}
    >
      <div
        className={cn(
          "nav-dialog__content flex h-full flex-col",
          entered && "is-entered",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <Logo tone="light" />
          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            aria-label="Close navigation"
            className="flex h-11 w-11 items-center justify-center border border-white/15 text-white transition-colors hover:bg-white hover:text-ink-950"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="space-y-1">
            {drawerNav.map((section) => {
              const expandable = Boolean(section.groups?.length);
              const isOpen = expanded === section.label;
              const id = `${panelId}-${section.label.toLowerCase()}`;

              return (
                <li key={section.label} className="border-b border-white/8">
                  <div className="flex items-stretch">
                    <Link
                      href={section.href}
                      onClick={handleClose}
                      className="flex flex-1 items-center gap-3 py-5 text-[1.375rem] font-semibold tracking-[-0.03em] text-white"
                    >
                      {section.label}
                      {!expandable && (
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 text-steel-350"
                        />
                      )}
                    </Link>

                    {expandable && (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : section.label)}
                        aria-expanded={isOpen}
                        aria-controls={id}
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${section.label}`}
                        className="flex w-12 items-center justify-center text-steel-300"
                      >
                        <ChevronDown
                          aria-hidden="true"
                          className={cn(
                            "h-5 w-5 transition-transform duration-200",
                            isOpen && "rotate-180",
                          )}
                        />
                      </button>
                    )}
                  </div>

                  {expandable && (
                    <div id={id} hidden={!isOpen} className="pb-6">
                      <div className="space-y-6">
                        {section.groups?.map((group) => (
                          <div key={group.title}>
                            <p className="tech-label text-steel-300">{group.title}</p>
                            <ul className="mt-3 space-y-1">
                              {group.items.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={handleClose}
                                    className="block py-2 text-body-md text-steel-200"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-6 py-6">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/contact"
              onClick={handleClose}
              className="flex items-center justify-center border border-white/25 px-5 py-4 tech-label text-white"
            >
              Contact
            </Link>
            <Link
              href="/quote"
              onClick={handleClose}
              className="flex items-center justify-center bg-accent px-5 py-4 tech-label text-white"
            >
              Request Quote
            </Link>
          </div>
          <a
            href={`tel:${company.contact.phones[0].replace(/\s/g, "")}`}
            className="mt-5 block py-1 text-caption text-steel-300"
          >
            {company.contact.phones[0]}
          </a>
        </div>
      </div>
    </dialog>
  );
}
