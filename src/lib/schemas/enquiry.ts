import { z } from "zod";

/**
 * Disable zod's JIT schema compilation before any schema is built.
 *
 * Zod probes for `new Function` to decide whether it can compile validators.
 * The probe is wrapped in try/catch and degrades safely, but the browser still
 * files a `script-src` violation for it — which showed up as the only CSP
 * report on /quote and /contact when the report-only policy went live. Turning
 * the probe off removes the report and the last reason `'unsafe-eval'` would
 * ever be needed. The cost is interpreted rather than compiled validation of
 * one twelve-field form, which is not measurable here.
 */
z.config({ jitless: true });

/**
 * ENQUIRY SCHEMA
 * ==============
 * One definition, imported by both the client form and the route handler.
 * The server parses independently and never trusts a client-side result —
 * sharing the schema keeps the messages identical, not the trust boundary.
 */

const email = z
  // The `error` param covers a missing key as well as a wrong type — without
  // it zod emits "Invalid input: expected string, received undefined", which
  // the client renders straight under the field label.
  .string({ error: "Enter a work email address" })
  .trim()
  .min(1, "Enter a work email address")
  .email("That email address does not look right — check for a typo");

/** Honeypot: a real person never fills this; bots fill everything. */
const honeypot = z.string({ error: "Rejected" }).max(0, "Rejected").optional().or(z.literal(""));

const optionalText = z
  .string({ error: "Enter plain text" })
  .trim()
  .max(2000, "Please keep this under 2000 characters")
  .optional()
  .or(z.literal(""));

export const quoteSchema = z.object({
  kind: z.literal("quote", { error: "Unknown enquiry type" }),
  name: z
    .string({ error: "Enter your name" })
    .trim()
    .min(1, "Enter your name")
    .max(120, "Please keep your name under 120 characters"),
  company: z
    .string({ error: "Enter your company or organisation" })
    .trim()
    .min(1, "Enter your company or organisation")
    .max(160, "Please keep this under 160 characters"),
  email,
  product: z
    .string({ error: "Select the product you need quoted" })
    .trim()
    .min(1, "Select the product you need quoted")
    .max(160, "Please keep this under 160 characters"),

  // Optional throughout — the process fields carry the intent, so gating on
  // them would cost enquiries for no gain.
  phone: optionalText,
  country: optionalText,
  industry: optionalText,
  quantity: optionalText,
  media: optionalText,
  temperature: optionalText,
  pressure: optionalText,
  application: optionalText,
  message: optionalText,

  /** Set when the enquirer re-sent without drawings after a 413. */
  drawingsOmitted: z.coerce.boolean().optional(),
  website: honeypot,
});

export const contactSchema = z.object({
  kind: z.literal("contact", { error: "Unknown enquiry type" }),
  name: z
    .string({ error: "Enter your name" })
    .trim()
    .min(1, "Enter your name")
    .max(120, "Please keep your name under 120 characters"),
  company: z
    .string({ error: "Enter your company or organisation" })
    .trim()
    .min(1, "Enter your company or organisation")
    .max(160, "Please keep this under 160 characters"),
  email,
  message: z
    .string({ error: "Tell us how we can help" })
    .trim()
    .min(1, "Tell us how we can help")
    .max(2000, "Please keep your message under 2000 characters"),
  website: honeypot,
});

export const enquirySchema = z.discriminatedUnion("kind", [quoteSchema, contactSchema]);

export type QuoteEnquiry = z.infer<typeof quoteSchema>;
export type ContactEnquiry = z.infer<typeof contactSchema>;
export type Enquiry = z.infer<typeof enquirySchema>;

/** Step 1 of the quote form, in error-summary order. Country sits here
 *  because it routes the lead to the right regional representative. */
export const QUOTE_STEP_1 = ["name", "company", "email", "phone", "country", "product"] as const;
/** Step 2. All optional. */
export const QUOTE_STEP_2 = [
  "industry", "quantity", "media", "temperature", "pressure", "application", "message",
] as const;

export const CONTACT_FIELDS = ["name", "company", "email", "message"] as const;

/** Human labels for the error summary and the internal spec sheet. */
export const FIELD_LABELS: Record<string, string> = {
  name: "Name", company: "Company", email: "Email", phone: "Phone",
  country: "Country", product: "Product", industry: "Industry",
  quantity: "Quantity", media: "Chemical / media", temperature: "Operating temperature",
  pressure: "Pressure", application: "Application", message: "Message",
};
