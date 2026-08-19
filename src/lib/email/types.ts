import type { ContactEnquiry, QuoteEnquiry } from "@/lib/schemas/enquiry";

export interface Attachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export interface QuoteEmailInput {
  enquiry: QuoteEnquiry;
  reference: string;
  attachments: Attachment[];
  /** Filenames the server refused, with the reason. */
  rejectedFiles: { filename: string; reason: string }[];
  /** True when the enquirer re-sent without drawings after a 413. */
  drawingsOmitted: boolean;
}

export interface ContactEmailInput {
  enquiry: ContactEnquiry;
  reference: string;
}

/**
 * The provider boundary. The route handler depends on this, never on Resend,
 * so the provider can be swapped without touching request handling.
 */
export interface EmailProvider {
  sendQuoteEmail(input: QuoteEmailInput): Promise<void>;
  sendContactEmail(input: ContactEmailInput): Promise<void>;
}
