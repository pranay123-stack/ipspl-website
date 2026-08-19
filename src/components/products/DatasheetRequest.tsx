"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Download, FileText, X } from "lucide-react";
import { submitEnquiry } from "@/lib/submitEnquiry";
import { track } from "@/lib/analytics";
import { TextField, fieldId } from "@/components/forms/Field";
import { cn } from "@/lib/utils";

/**
 * Replaces the dead download affordance on product pages.
 *
 * The block previously rendered a download icon beside document names with no
 * anchor behind it, which reads as a broken download. Each entry is now a
 * button that opens a two-field request, posts through the same enquiry
 * handler with the document name, and fires `datasheet_request`.
 *
 * Built on <dialog> for the same reasons as the mobile nav: Escape, focus
 * move-in and background inertness come from the platform.
 */
export function DatasheetRequest({
  documents,
  productTitle,
}: {
  documents: {
    title: string;
    type: string;
    note: string;
    href?: string;
    fileSize?: string;
  }[];
  productTitle: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [openDoc, setOpenDoc] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [failure, setFailure] = useState<string | null>(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpenDoc(null);
      setStatus("idle");
      setErrors({});
      setFailure(null);
      triggerRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  function open(doc: string, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setOpenDoc(doc);
    setForm({ name: "", email: "", website: "" });
    dialogRef.current?.showModal();
    requestAnimationFrame(() => firstFieldRef.current?.focus());
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found: Record<string, string> = {};
    if (!form.name.trim()) found.name = "Enter your name";
    if (!form.email.trim()) found.email = "Enter a work email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      found.email = "That email address does not look right — check for a typo";
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(fieldId(Object.keys(found)[0]!))?.focus();
      return;
    }

    setStatus("sending");
    setFailure(null);

    const body = new FormData();
    body.set("kind", "contact");
    body.set("name", form.name);
    body.set("company", "Datasheet request");
    body.set("email", form.email);
    body.set("website", form.website);
    body.set("message", `Datasheet request: ${openDoc} — ${productTitle}`);

    const outcome = await submitEnquiry(body);

    if (outcome.ok) {
      track("datasheet_request", { document: openDoc ?? "unknown", product: productTitle });
      setStatus("sent");
      return;
    }
    setStatus("idle");
    setFailure(outcome.message);
  }

  return (
    <>
      <ul className="space-y-px self-start bg-white/12">
        {documents.map((doc) => (
          <li key={doc.title}>
            <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-base p-6">
              <div className="flex min-w-0 items-center gap-5">
                <FileText aria-hidden="true" className="h-5 w-5 shrink-0 text-steel-300" />
                <div className="min-w-0">
                  <p className="text-heading-sm text-white">{doc.title}</p>
                  <p className="mt-1 tech-label-xs text-steel-300">
                    {doc.type}
                    {doc.fileSize && <> · {doc.fileSize}</>}
                  </p>
                </div>
              </div>
              {doc.href ? (
                <a
                  href={doc.href}
                  download
                  onClick={() => track("datasheet_download", { document: doc.title })}
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-2.5 border border-white/25 px-5 py-3 tech-label text-white transition-colors hover:bg-white hover:text-ink-950"
                >
                  Download
                  <Download aria-hidden="true" className="h-4 w-4" />
                  <span className="sr-only">
                    {doc.title} ({doc.type}
                    {doc.fileSize ? `, ${doc.fileSize}` : ""})
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={(e) => open(doc.title, e.currentTarget)}
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-2.5 border border-white/25 px-5 py-3 tech-label text-white transition-colors hover:bg-white hover:text-ink-950"
                >
                  Request
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <dialog ref={dialogRef} aria-labelledby="datasheet-heading" className="doc-dialog">
        <div className="p-7 sm:p-9">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="tech-label text-accent-bright">Technical document</p>
              <h2 id="datasheet-heading" className="mt-3 text-heading-md text-white">
                {openDoc}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 text-white transition-colors hover:bg-white hover:text-ink-950"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          {status === "sent" ? (
            <div role="status" className="mt-8">
              <p className="text-body-md text-white">Request received.</p>
              <p className="mt-3 text-body-sm text-steel-300">
                Our engineering team will send{" "}
                <strong className="text-white">{openDoc}</strong> for {productTitle} to{" "}
                <strong className="text-white">{form.email}</strong>.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-7 inline-flex min-h-[44px] items-center bg-accent px-7 py-3.5 tech-label text-white transition-colors hover:bg-accent-bright"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
              <p className="text-body-sm text-steel-300">
                Two details and we will email it to you.
              </p>

              <TextField
                label="Name"
                name="name"
                required
                autoComplete="name"
                value={form.name}
                onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                error={errors.name}
                placeholder="Full name"
                inputRef={firstFieldRef}
              />
              <TextField
                label="Work email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                error={errors.email}
                placeholder="name@company.com"
              />

              <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label htmlFor="rfq-website-doc">Website</label>
                <input
                  id="rfq-website-doc"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                />
              </div>

              <div aria-live="polite" role="status">
                {failure && (
                  <p className="border border-red-400/50 bg-red-400/10 p-4 text-[0.875rem] leading-6 text-steel-200">
                    {failure}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className={cn(
                  "inline-flex min-h-[44px] w-full items-center justify-center gap-3 bg-accent px-7 py-4 tech-label text-white transition-colors",
                  status === "sending" ? "cursor-wait bg-steel-500" : "hover:bg-accent-bright",
                )}
              >
                {status === "sending" ? "Sending…" : "Request document"}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
