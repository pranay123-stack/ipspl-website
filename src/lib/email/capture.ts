import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ContactEmailInput, EmailProvider, QuoteEmailInput } from "./types";
import {
  renderContactAck, renderContactInternal, renderQuoteAck, renderQuoteInternal,
} from "./render";

/**
 * CAPTURE PROVIDER — for integration tests and local preview
 * ==========================================================
 * Writes every message it is asked to send to EMAIL_CAPTURE_DIR as JSON,
 * instead of sending it. That turns "the enquiry was delivered" into something
 * a test can assert rather than take on faith: the console fallback proves only
 * that the handler returned 200, which it would also do if the send were
 * skipped entirely.
 *
 * Selected only when EMAIL_CAPTURE_DIR is set and RESEND_API_KEY is not, so it
 * can never take over a configured production deployment.
 */
const FAILURE_ADDRESS = "delivery-failure@ips-pl.test";

interface Captured {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  reference: string;
  role: "internal" | "acknowledgement";
  attachments?: { filename: string; bytes: number }[];
}

function write(dir: string, reference: string, messages: Captured[]) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${reference}.json`), JSON.stringify(messages, null, 2));
}

export function createCaptureProvider(dir: string): EmailProvider {
  const salesInbox = process.env.SALES_INBOX_EMAIL ?? "sales@ips-pl.com";

  return {
    async sendQuoteEmail(input: QuoteEmailInput) {
      // Lets a test exercise the delivery-failure path — the alert, the 502
      // and the message telling the visitor to email sales@ directly — without
      // breaking a real provider.
      if (input.enquiry.email === FAILURE_ADDRESS) {
        throw new Error("capture: simulated delivery failure");
      }

      const internal = renderQuoteInternal(input);
      const ack = renderQuoteAck(input);
      write(dir, input.reference, [
        {
          role: "internal",
          to: salesInbox,
          replyTo: input.enquiry.email,
          subject: internal.subject,
          text: internal.text,
          reference: input.reference,
          attachments: input.attachments.map((a) => ({
            filename: a.filename,
            bytes: a.content.byteLength,
          })),
        },
        {
          role: "acknowledgement",
          to: input.enquiry.email,
          replyTo: salesInbox,
          subject: ack.subject,
          text: ack.text,
          reference: input.reference,
        },
      ]);
    },

    async sendContactEmail(input: ContactEmailInput) {
      if (input.enquiry.email === FAILURE_ADDRESS) {
        throw new Error("capture: simulated delivery failure");
      }

      const internal = renderContactInternal(input);
      const ack = renderContactAck(input);
      write(dir, input.reference, [
        {
          role: "internal",
          to: salesInbox,
          replyTo: input.enquiry.email,
          subject: internal.subject,
          text: internal.text,
          reference: input.reference,
        },
        {
          role: "acknowledgement",
          to: input.enquiry.email,
          replyTo: salesInbox,
          subject: ack.subject,
          text: ack.text,
          reference: input.reference,
        },
      ]);
    },
  };
}
