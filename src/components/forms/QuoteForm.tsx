"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Paperclip, X } from "lucide-react";
import { products } from "@/data/products";
import { industries } from "@/data/industries";
import { quoteSchema, QUOTE_STEP_1, FIELD_LABELS } from "@/lib/schemas/enquiry";
import {
  ACCEPTED_EXTENSIONS, MAX_FILES, MAX_FILE_BYTES, MAX_TOTAL_BYTES, mb,
} from "@/lib/fileRules";
import { submitEnquiry } from "@/lib/submitEnquiry";
import { Turnstile, attachTurnstileToken, resetTurnstile } from "@/components/forms/Turnstile";
import { track } from "@/lib/analytics";
import { TextField, SelectField, TextAreaField, FieldSet, fieldId } from "./Field";
import { cn } from "@/lib/utils";

const COUNTRIES = [
  "India", "Thailand", "Vietnam", "China", "Canada", "United States",
  "United Kingdom", "Germany", "France", "Netherlands", "Italy", "Spain",
  "Saudi Arabia", "United Arab Emirates", "Qatar", "Oman", "Kuwait",
  "Singapore", "Malaysia", "Indonesia", "Japan", "South Korea",
  "Australia", "Brazil", "South Africa", "Other",
];

type FormState = Record<string, string>;

const EMPTY: FormState = {
  name: "", company: "", email: "", phone: "", country: "", product: "",
  industry: "", quantity: "", media: "", temperature: "", pressure: "",
  application: "", message: "", website: "",
};

/** Survives an accidental back-navigation or refresh mid-enquiry. */
const STORAGE_KEY = "ipspl:quote-draft";

type Errors = Record<string, string>;
type Blocker =
  | null
  | { kind: "payload_too_large"; message: string }
  | { kind: "rate_limited" | "challenge_failed" | "send_failed" | "network"; message: string };

export function QuoteForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const [blocker, setBlocker] = useState<Blocker>(null);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const startedRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const restoredRef = useRef(false);

  // ---- Draft persistence -------------------------------------------------
  useEffect(() => {
    // Deferred: a synchronous setState in an effect body cascades renders.
    queueMicrotask(() => {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as { form?: FormState; step?: 1 | 2 };
          if (parsed.form) setForm({ ...EMPTY, ...parsed.form });
          if (parsed.step === 2) setStep(2);
        }
      } catch {
        /* a corrupt draft must never block the form */
      }
      restoredRef.current = true;
    });
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step }));
    } catch {
      /* private mode / quota — persistence is a convenience, not a requirement */
    }
  }, [form, step]);

  const set = (key: string) => (value: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("quote_start");
    }
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // ---- Validation --------------------------------------------------------
  /** Step 1 carries the entire required floor, so step 2 can never block. */
  function validateStep1(): Errors {
    const result = quoteSchema.safeParse({ ...form, kind: "quote" });
    if (result.success) return {};
    const found: Errors = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (QUOTE_STEP_1.includes(key as (typeof QUOTE_STEP_1)[number]) && !found[key]) {
        found[key] = issue.message;
      }
    }
    return found;
  }

  function focusFirstError(found: Errors) {
    const first = QUOTE_STEP_1.find((k) => found[k]);
    if (!first) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(fieldId(first));
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus({ preventScroll: true });
    });
  }

  function goToStep(next: 1 | 2) {
    setStep(next);
    if (next === 2) track("quote_step_1_complete");
    // Focus the new step's heading so the change is announced and the
    // keyboard position is correct.
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  function handleContinue(event: React.MouseEvent<HTMLButtonElement>) {
    // The step buttons share a position in the tree, so React mutates one DOM
    // node's `type` from "button" to "submit" when the step advances. Because
    // setStep flushes synchronously inside this handler, the browser then
    // evaluates the click's default action against a submit button and posts
    // the form. Distinct keys below stop the node being reused; this is the
    // belt-and-braces half.
    event.preventDefault();
    const found = validateStep1();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }
    goToStep(2);
  }

  // ---- Files -------------------------------------------------------------
  function totalBytes(list: File[]) {
    return list.reduce((sum, f) => sum + f.size, 0);
  }

  function onFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const rejected: string[] = [];
    const next = [...files];

    for (const file of incoming) {
      const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
      if (!ACCEPTED_EXTENSIONS.includes(ext as (typeof ACCEPTED_EXTENSIONS)[number])) {
        rejected.push(`${file.name} — file type not accepted`);
        continue;
      }
      if (next.length >= MAX_FILES) {
        rejected.push(`${file.name} — no more than ${MAX_FILES} files`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        rejected.push(`${file.name} — over ${mb(MAX_FILE_BYTES)} MB`);
        continue;
      }
      if (totalBytes(next) + file.size > MAX_TOTAL_BYTES) {
        rejected.push(`${file.name} — would exceed the ${mb(MAX_TOTAL_BYTES)} MB total`);
        continue;
      }
      next.push(file);
    }

    setFiles(next);
    setFileError(
      rejected.length
        ? `${rejected.join("; ")}. Send anything larger to sales@ips-pl.com once you have your reference.`
        : null,
    );
  }

  // ---- Submit ------------------------------------------------------------
  function buildBody(includeFiles: boolean): FormData {
    const body = new FormData();
    body.set("kind", "quote");
    for (const [k, v] of Object.entries(form)) body.set(k, v);
    if (!includeFiles) body.set("drawingsOmitted", "true");
    if (includeFiles) for (const f of files) body.append("files", f);
    attachTurnstileToken(body);
    return body;
  }

  async function send(includeFiles: boolean) {
    setStatus("submitting");
    setBlocker(null);

    track("quote_step_2_complete", { product: form.product || "unspecified" });
    const outcome = await submitEnquiry(buildBody(includeFiles));

    if (outcome.ok) {
      track("quote_submitted", { product: form.product || "unspecified" });
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      const drawingsPending = !includeFiles || outcome.rejectedFiles.length > 0;
      router.push(
        `/quote/thank-you?ref=${encodeURIComponent(outcome.reference)}${drawingsPending ? "&drawings=pending" : ""}`,
      );
      return;
    }

    setStatus("idle");

    if (outcome.kind === "validation") {
      setErrors(outcome.fieldErrors);
      const firstStep1 = QUOTE_STEP_1.find((k) => outcome.fieldErrors[k]);
      if (firstStep1) {
        goToStep(1);
        focusFirstError(outcome.fieldErrors);
      }
      return;
    }

    // A Turnstile token is single-use; a spent one must be cleared or the
    // retry fails for a reason the visitor cannot see.
    resetTurnstile();
    setBlocker({ kind: outcome.kind, message: outcome.message });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const found = validateStep1();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      goToStep(1);
      focusFirstError(found);
      return;
    }

    // Primary defence: the platform rejects oversized bodies before our
    // handler ever runs, so this check has to happen here.
    if (totalBytes(files) > MAX_TOTAL_BYTES) {
      setBlocker({
        kind: "payload_too_large",
        message: `Your drawings total ${mb(totalBytes(files))} MB, over the ${mb(MAX_TOTAL_BYTES)} MB limit.`,
      });
      return;
    }

    await send(true);
  }

  const stepErrors = Object.entries(errors).filter(([k]) =>
    step === 1 ? QUOTE_STEP_1.includes(k as (typeof QUOTE_STEP_1)[number]) : true,
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-12">
      {/* Progress ---------------------------------------------------------- */}
      <div className="border-b border-white/10 pb-6">
        <ol className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {[
            { n: 1 as const, label: "Who you are & what you need" },
            { n: 2 as const, label: "Process conditions & drawings" },
          ].map((s) => (
            <li key={s.n}>
              <span
                aria-current={step === s.n ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2.5 tech-label",
                  step === s.n ? "text-accent-bright" : "text-steel-300",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center border",
                    step === s.n
                      ? "border-accent-bright text-accent-bright"
                      : "border-white/20 text-steel-300",
                  )}
                >
                  {s.n}
                </span>
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div role="group" aria-labelledby="quote-step-heading">
        <h2
          id="quote-step-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-heading-lg text-white outline-none"
        >
          {step === 1 ? "Who you are and what you need" : "Process conditions and drawings"}
          <span className="sr-only"> — step {step} of 2</span>
        </h2>
        <p className="mt-3 max-w-xl text-body-md text-steel-300">
          {step === 1
            ? "Four details so we can route your enquiry to the right engineer."
            : "All optional. The more process data you send, the more precise the specification we can return."}
        </p>

        {/* Step 1 ---------------------------------------------------------- */}
        {step === 1 && (
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <TextField label="Name" name="name" required autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} placeholder="Full name" />
            <TextField label="Company" name="company" required autoComplete="organization" value={form.company} onChange={set("company")} error={errors.company} placeholder="Organisation" />
            <TextField label="Email" name="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} placeholder="name@company.com" />
            <TextField label="Phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} placeholder="Including country code" />
            <SelectField label="Country" name="country" autoComplete="country-name" options={COUNTRIES} value={form.country} onChange={set("country")} hint="Routes your enquiry to the nearest representative" />
            <SelectField label="Product" name="product" required options={products.map((p) => p.title)} value={form.product} onChange={set("product")} error={errors.product} />
          </div>
        )}

        {/* Step 2 ---------------------------------------------------------- */}
        {step === 2 && (
          <div className="mt-10 space-y-12">
            <FieldSet index="01" title="Requirement" description="What the equipment is for.">
              <SelectField label="Industry" name="industry" options={industries.map((i) => i.title)} value={form.industry} onChange={set("industry")} />
              <TextField label="Quantity" name="quantity" value={form.quantity} onChange={set("quantity")} placeholder="e.g. 40 m, 12 off, or to BOM" />
              <TextField label="Application" name="application" value={form.application} onChange={set("application")} placeholder="e.g. reactor discharge line" className="sm:col-span-2" />
            </FieldSet>

            <FieldSet index="02" title="Process conditions" description="What determines liner grade, wall thickness and geometry. Approximate figures are fine.">
              <TextField label="Chemical / media" name="media" value={form.media} onChange={set("media")} placeholder="e.g. 98% sulphuric acid" hint="Include cleaning agents and trace contaminants" />
              <TextField label="Operating temperature" name="temperature" value={form.temperature} onChange={set("temperature")} placeholder="e.g. 20 – 120 °C" hint="Normal and upset conditions" />
              <TextField label="Pressure" name="pressure" value={form.pressure} onChange={set("pressure")} placeholder="e.g. 6 bar g, full vacuum" hint="State if the line can be pump-emptied" />
              <TextAreaField label="Message" name="message" rows={4} value={form.message} onChange={set("message")} placeholder="Anything else we should know — existing installation, failure history, schedule." className="sm:col-span-2" />
            </FieldSet>

            <FieldSet index="03" title="Drawings" description="Isometrics, datasheets, P&IDs or photographs.">
              <div className="sm:col-span-2">
                <label
                  htmlFor="rfq-files"
                  className="flex cursor-pointer items-center gap-4 border border-dashed border-white/25 p-6 transition-colors duration-200 hover:border-accent-bright hover:bg-accent/10"
                >
                  <Paperclip aria-hidden="true" className="h-5 w-5 shrink-0 text-steel-300" />
                  <span>
                    <span className="block text-body-sm text-white">Attach drawings</span>
                    <span className="mt-1 block text-caption text-steel-300">
                      {ACCEPTED_EXTENSIONS.join(", ")} · up to {MAX_FILES} files,{" "}
                      {mb(MAX_FILE_BYTES)} MB each, {mb(MAX_TOTAL_BYTES)} MB total
                    </span>
                  </span>
                  <input
                    id="rfq-files"
                    name="files"
                    type="file"
                    multiple
                    accept={ACCEPTED_EXTENSIONS.join(",")}
                    onChange={(e) => onFiles(e.target.files)}
                    className="sr-only"
                  />
                </label>

                {fileError && (
                  <p role="alert" className="mt-3 text-[0.875rem] leading-5 text-red-400">
                    {fileError}
                  </p>
                )}

                {files.length > 0 && (
                  <ul className="mt-4 space-y-px bg-white/10">
                    {files.map((file, i) => (
                      <li key={`${file.name}-${i}`} className="flex items-center justify-between gap-4 bg-surface-raised px-4 py-3">
                        <span className="min-w-0 flex-1 truncate text-caption text-steel-200">{file.name}</span>
                        <span className="shrink-0 tech-label-xs text-steel-300">{mb(file.size)} MB</span>
                        <button
                          type="button"
                          onClick={() => setFiles((prev) => prev.filter((_, index) => index !== i))}
                          aria-label={`Remove ${file.name}`}
                          className="flex h-11 w-11 shrink-0 items-center justify-center text-steel-300 transition-colors hover:text-red-400"
                        >
                          <X aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FieldSet>
          </div>
        )}
      </div>

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="rfq-website">Website</label>
        <input
          id="rfq-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
        />
      </div>

      {/* Error summary + blockers ----------------------------------------- */}
      <div aria-live="polite" role="status" className="space-y-6">
        {stepErrors.length > 0 && (
          <div className="border border-red-400/50 bg-red-400/10 p-6">
            <h3 className="text-heading-sm text-red-300">
              {stepErrors.length === 1
                ? "There is 1 problem with this enquiry"
                : `There are ${stepErrors.length} problems with this enquiry`}
            </h3>
            <ul className="mt-4 space-y-2">
              {QUOTE_STEP_1.filter((k) => errors[k]).map((k) => (
                <li key={k}>
                  <a
                    href={`#${fieldId(k)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (step !== 1) goToStep(1);
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

        {blocker?.kind === "payload_too_large" && (
          <div className="border border-accent-bright/50 bg-accent/10 p-6">
            <h3 className="text-heading-sm text-white">Drawings too large to send</h3>
            <p className="mt-3 max-w-xl text-body-sm text-steel-200">
              {blocker.message} You can still send the enquiry now — we will reply with
              a reference number, and you can email the drawings to sales@ips-pl.com
              quoting it. Nothing you have typed will be lost.
            </p>
            <button
              type="button"
              onClick={() => send(false)}
              disabled={status === "submitting"}
              className="mt-5 inline-flex min-h-[44px] items-center gap-3 bg-accent px-7 py-4 tech-label text-white transition-colors hover:bg-accent-bright disabled:cursor-wait disabled:bg-steel-500"
            >
              Send the enquiry without drawings
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        )}

        <Turnstile />

        {blocker && blocker.kind !== "payload_too_large" && (
          <div className="border border-red-400/50 bg-red-400/10 p-6">
            <h3 className="text-heading-sm text-red-300">
              {blocker.kind === "rate_limited"
                ? "Too many attempts"
                : blocker.kind === "challenge_failed"
                  ? "We could not verify your browser"
                  : "We could not send your enquiry"}
            </h3>
            <p className="mt-3 max-w-xl text-[0.875rem] leading-6 text-steel-200">{blocker.message}</p>
          </div>
        )}
      </div>

      {/* Actions ----------------------------------------------------------- */}
      <div className="flex flex-col gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
        {step === 2 ? (
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="inline-flex min-h-[44px] items-center gap-2.5 py-2 tech-label text-steel-200 transition-colors hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to your details
          </button>
        ) : (
          <p className="max-w-md text-caption text-steel-300">
            Fields marked <span className="text-accent-bright">*</span> are required. We use
            these details only to respond to your enquiry.
          </p>
        )}

        {step === 1 ? (
          <button
            key="quote-continue"
            type="button"
            onClick={handleContinue}
            className="group inline-flex min-h-[44px] items-center justify-center gap-3 bg-accent px-9 py-4 tech-label text-white transition-colors duration-300 hover:bg-accent-bright"
          >
            Continue
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            key="quote-submit"
            type="submit"
            disabled={status === "submitting"}
            className="group inline-flex min-h-[44px] items-center justify-center gap-3 bg-accent px-9 py-4 tech-label text-white transition-colors duration-300 hover:bg-accent-bright disabled:cursor-wait disabled:bg-steel-500"
          >
            {status === "submitting" ? "Sending…" : "Submit Enquiry"}
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </form>
  );
}
