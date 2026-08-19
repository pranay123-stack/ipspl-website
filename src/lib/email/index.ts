import { Resend } from "resend";
import { createCaptureProvider } from "./capture";
import type { ContactEmailInput, EmailProvider, QuoteEmailInput } from "./types";
import {
  renderContactAck, renderContactInternal, renderQuoteAck, renderQuoteInternal,
} from "./render";

export type { QuoteEmailInput, ContactEmailInput, Attachment } from "./types";

const SALES_INBOX = process.env.SALES_INBOX_EMAIL ?? "sales@ips-pl.com";
/** Verified sending subdomain, so SPF/DKIM never touch the ips-pl.com flow. */
const FROM = process.env.RESEND_FROM ?? "IPS-PL Enquiries <enquiries@mail.ips-pl.com>";

/**
 * Resend implementation. The route handler depends on EmailProvider, not on
 * this module's internals, so swapping providers is one file.
 */
function createResendProvider(apiKey: string): EmailProvider {
  const resend = new Resend(apiKey);

  return {
    async sendQuoteEmail(input: QuoteEmailInput) {
      const internal = renderQuoteInternal(input);
      const ack = renderQuoteAck(input);

      // Internal first: if the acknowledgement fails, the lead is still captured.
      await resend.emails.send({
        from: FROM,
        to: [SALES_INBOX],
        replyTo: input.enquiry.email,
        subject: internal.subject,
        html: internal.html,
        text: internal.text,
        attachments: input.attachments.map((a) => ({
          filename: a.filename,
          content: a.content,
        })),
      });

      await resend.emails.send({
        from: FROM,
        to: [input.enquiry.email],
        replyTo: SALES_INBOX,
        subject: ack.subject,
        html: ack.html,
        text: ack.text,
      });
    },

    async sendContactEmail(input: ContactEmailInput) {
      const internal = renderContactInternal(input);
      const ack = renderContactAck(input);

      await resend.emails.send({
        from: FROM, to: [SALES_INBOX], replyTo: input.enquiry.email,
        subject: internal.subject, html: internal.html, text: internal.text,
      });
      await resend.emails.send({
        from: FROM, to: [input.enquiry.email], replyTo: SALES_INBOX,
        subject: ack.subject, html: ack.html, text: ack.text,
      });
    },
  };
}

/**
 * Dev fallback: logs instead of sending, so the repo runs with no API key.
 * Never used when RESEND_API_KEY is present.
 */
function createConsoleProvider(): EmailProvider {
  const note = (label: string, ref: string, to: string) =>
    console.warn(`[email:dev] ${label} ${ref} -> ${to} (RESEND_API_KEY not set; nothing sent)`);
  return {
    async sendQuoteEmail(i) { note("quote", i.reference, i.enquiry.email); },
    async sendContactEmail(i) { note("contact", i.reference, i.enquiry.email); },
  };
}

let cached: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (key) {
    cached = createResendProvider(key);
    return cached;
  }
  // Capture is checked only after Resend, so setting it on a configured
  // production deployment cannot silently swallow live enquiries.
  const captureDir = process.env.EMAIL_CAPTURE_DIR;
  cached = captureDir ? createCaptureProvider(captureDir) : createConsoleProvider();
  return cached;
}

export const isEmailConfigured = () => Boolean(process.env.RESEND_API_KEY);
