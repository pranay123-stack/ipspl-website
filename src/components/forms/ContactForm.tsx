"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { contactSchema, CONTACT_FIELDS, FIELD_LABELS } from "@/lib/schemas/enquiry";
import { submitEnquiry } from "@/lib/submitEnquiry";
import { track } from "@/lib/analytics";
import { TextField, TextAreaField, fieldId } from "./Field";

/**
 * The light path. /quote stays the deep technical RFQ; a buyer with a
 * one-line question should never have to open a 14-field form.
 */
type Errors = Record<string, string>;

export function ContactForm() {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [blocker, setBlocker] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);

  const set = (key: string) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = contactSchema.safeParse({ ...form, kind: "contact" });
    if (!parsed.success) {
      const found: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (!found[key]) found[key] = issue.message;
      }
      setErrors(found);
      const first = CONTACT_FIELDS.find((k) => found[k]);
      if (first) {
        requestAnimationFrame(() => {
          const el = document.getElementById(fieldId(first));
          el?.scrollIntoView({ block: "center", behavior: "smooth" });
          el?.focus({ preventScroll: true });
        });
      }
      return;
    }

    setStatus("submitting");
    setBlocker(null);

    const body = new FormData();
    body.set("kind", "contact");
    for (const [k, v] of Object.entries(form)) body.set(k, v);

    const outcome = await submitEnquiry(body);

    if (outcome.ok) {
      track("contact_submit");
      setReference(outcome.reference);
      setStatus("sent");
      requestAnimationFrame(() => doneRef.current?.focus());
      return;
    }

    setStatus("idle");
    if (outcome.kind === "validation") {
      setErrors(outcome.fieldErrors);
      return;
    }
    setBlocker(outcome.message);
  }

  if (status === "sent") {
    return (
      <div className="border border-white/12 p-8" role="status">
        <p ref={doneRef} tabIndex={-1} className="text-heading-md text-white outline-none">
          Message received.
        </p>
        <p className="mt-3 text-body-md text-steel-300">
          {reference ? (
            <>
              Your reference is <strong className="font-mono text-white">{reference}</strong>. We
              will reply shortly.
            </>
          ) : (
            "We will reply shortly."
          )}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <TextField label="Name" name="name" required autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} placeholder="Full name" />
        <TextField label="Company" name="company" required autoComplete="organization" value={form.company} onChange={set("company")} error={errors.company} placeholder="Organisation" />
        <TextField label="Email" name="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} placeholder="name@company.com" className="sm:col-span-2" />
        <TextAreaField label="Message" name="message" required rows={4} value={form.message} onChange={set("message")} error={errors.message} placeholder="How can we help?" className="sm:col-span-2" />
      </div>

      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="rfq-website-contact">Website</label>
        <input id="rfq-website-contact" name="website" type="text" tabIndex={-1} autoComplete="off"
               value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
      </div>

      <div aria-live="polite" role="status">
        {Object.keys(errors).length > 0 && (
          <div className="border border-red-400/50 bg-red-400/10 p-5">
            <h3 className="text-heading-sm text-red-300">
              {Object.keys(errors).length === 1 ? "There is 1 problem" : `There are ${Object.keys(errors).length} problems`}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {CONTACT_FIELDS.filter((k) => errors[k]).map((k) => (
                <li key={k}>
                  <a
                    href={`#${fieldId(k)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(fieldId(k));
                      el?.scrollIntoView({ block: "center", behavior: "smooth" });
                      el?.focus({ preventScroll: true });
                    }}
                    className="inline-block py-1 text-[0.875rem] text-red-300 underline underline-offset-4 hover:text-red-200"
                  >
                    {FIELD_LABELS[k]}: {errors[k]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {blocker && (
          <p className="border border-red-400/50 bg-red-400/10 p-5 text-[0.875rem] leading-6 text-steel-200">
            {blocker}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex min-h-[44px] items-center justify-center gap-3 bg-accent px-8 py-4 tech-label text-white transition-colors duration-300 hover:bg-accent-bright disabled:cursor-wait disabled:bg-steel-500"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </form>
  );
}
