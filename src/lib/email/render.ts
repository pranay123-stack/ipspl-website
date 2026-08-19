import { FIELD_LABELS, type QuoteEnquiry } from "@/lib/schemas/enquiry";
import type { ContactEmailInput, QuoteEmailInput } from "./types";

const SALES_INBOX = process.env.SALES_INBOX_EMAIL ?? "sales@ips-pl.com";

/** Escapes user input before it goes anywhere near an HTML email body. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const ORDER: (keyof QuoteEnquiry)[] = [
  "name", "company", "email", "phone", "country",
  "product", "industry", "quantity",
  "media", "temperature", "pressure", "application", "message",
];

/** Internal notification: every field as a readable spec sheet. */
export function renderQuoteInternal(input: QuoteEmailInput) {
  const { enquiry, reference, attachments, rejectedFiles, drawingsOmitted } = input;

  const rows = ORDER.filter((k) => {
    const v = enquiry[k];
    return typeof v === "string" && v.trim().length > 0;
  }).map((k) => ({ label: FIELD_LABELS[k] ?? String(k), value: String(enquiry[k]) }));

  // The drawings banner leads, because it is the action the reader must take.
  const banner = drawingsOmitted
    ? `DRAWINGS NOT ATTACHED - the enquirer was asked to send them to ${SALES_INBOX} quoting ${reference}.`
    : rejectedFiles.length > 0
      ? `SOME FILES REJECTED - ${rejectedFiles.map((r) => `${r.filename} (${r.reason})`).join("; ")}. The enquirer was asked to send them to ${SALES_INBOX} quoting ${reference}.`
      : "";

  const text = [
    banner ? `** ${banner} **` : "",
    `Reference: ${reference}`,
    "",
    ...rows.map((r) => `${r.label.padEnd(22)} ${r.value}`),
    "",
    attachments.length
      ? `Attachments (${attachments.length}): ${attachments.map((a) => a.filename).join(", ")}`
      : "Attachments: none",
  ].filter(Boolean).join("\n");

  const html = `
<div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#0a0e14;max-width:640px">
  ${banner ? `<p style="background:#fdecea;border-left:4px solid #c0392b;padding:12px 16px;font-weight:600;margin:0 0 20px">${esc(banner)}</p>` : ""}
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#6b7688">New quote enquiry</p>
  <h1 style="margin:0 0 20px;font-size:20px">${esc(enquiry.product)} &mdash; ${esc(enquiry.company)}</h1>
  <table style="border-collapse:collapse;width:100%;font-size:14px">
    <tbody>
      <tr><td style="padding:8px 12px;background:#eef4fe;font-weight:600;width:40%">Reference</td><td style="padding:8px 12px;background:#eef4fe"><strong>${esc(reference)}</strong></td></tr>
      ${rows.map((r, i) => `<tr><td style="padding:8px 12px;${i % 2 ? "background:#f4f6f8;" : ""}font-weight:600">${esc(r.label)}</td><td style="padding:8px 12px;${i % 2 ? "background:#f4f6f8;" : ""}white-space:pre-wrap">${esc(r.value)}</td></tr>`).join("")}
    </tbody>
  </table>
  <p style="margin:20px 0 0;font-size:13px;color:#4a5568">
    ${attachments.length ? `Attachments (${attachments.length}): ${esc(attachments.map((a) => a.filename).join(", "))}` : "No attachments."}
  </p>
</div>`.trim();

  return { subject: `[${reference}] Quote enquiry - ${enquiry.product} - ${enquiry.company}`, html, text };
}

/** Auto-acknowledgement to the enquirer. */
export function renderQuoteAck(input: QuoteEmailInput) {
  const { enquiry, reference, drawingsOmitted, rejectedFiles } = input;
  const needsDrawings = drawingsOmitted || rejectedFiles.length > 0;

  const drawingsLine = needsDrawings
    ? `We were not able to receive your drawings with this enquiry. Please reply to this email, or send them to ${SALES_INBOX}, quoting ${reference}.`
    : "";

  const text = [
    `Thank you for your enquiry, ${enquiry.name}.`,
    "",
    `We have received your request regarding ${enquiry.product}.`,
    `Your reference is ${reference}.`,
    drawingsLine ? `\n${drawingsLine}` : "",
    "",
    "Our engineering team will review your process data and respond with a specification and commercial proposal.",
    "",
    "Innovative Process Solutions Pvt. Ltd.",
  ].filter(Boolean).join("\n");

  const html = `
<div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#0a0e14;max-width:600px;line-height:1.6">
  <p>Thank you for your enquiry, ${esc(enquiry.name)}.</p>
  <p>We have received your request regarding <strong>${esc(enquiry.product)}</strong>.<br>
     Your reference is <strong>${esc(reference)}</strong>.</p>
  ${drawingsLine ? `<p style="background:#fff6e5;border-left:4px solid #d08700;padding:12px 16px">${esc(drawingsLine)}</p>` : ""}
  <p>Our engineering team will review your process data and respond with a specification and commercial proposal.</p>
  <p style="color:#4a5568;font-size:13px;margin-top:24px">Innovative Process Solutions Pvt. Ltd.</p>
</div>`.trim();

  return { subject: `We have your enquiry - ${reference}`, html, text };
}

export function renderContactInternal(input: ContactEmailInput) {
  const { enquiry, reference } = input;
  const text = [
    `Reference: ${reference}`, "",
    `Name:    ${enquiry.name}`,
    `Company: ${enquiry.company}`,
    `Email:   ${enquiry.email}`, "",
    enquiry.message,
  ].join("\n");
  const html = `
<div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#0a0e14;max-width:600px;line-height:1.6">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#6b7688">New contact enquiry</p>
  <h1 style="margin:0 0 16px;font-size:20px">${esc(enquiry.company)}</h1>
  <p><strong>Reference:</strong> ${esc(reference)}<br>
     <strong>Name:</strong> ${esc(enquiry.name)}<br>
     <strong>Email:</strong> ${esc(enquiry.email)}</p>
  <p style="white-space:pre-wrap;background:#f4f6f8;padding:14px 16px">${esc(enquiry.message)}</p>
</div>`.trim();
  return { subject: `[${reference}] Contact enquiry - ${enquiry.company}`, html, text };
}

export function renderContactAck(input: ContactEmailInput) {
  const { enquiry, reference } = input;
  const text = `Thank you for getting in touch, ${enquiry.name}.\n\nWe have received your message (reference ${reference}) and will reply shortly.\n\nInnovative Process Solutions Pvt. Ltd.`;
  const html = `
<div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#0a0e14;max-width:600px;line-height:1.6">
  <p>Thank you for getting in touch, ${esc(enquiry.name)}.</p>
  <p>We have received your message (reference <strong>${esc(reference)}</strong>) and will reply shortly.</p>
  <p style="color:#4a5568;font-size:13px;margin-top:24px">Innovative Process Solutions Pvt. Ltd.</p>
</div>`.trim();
  return { subject: `We have your message - ${reference}`, html, text };
}
