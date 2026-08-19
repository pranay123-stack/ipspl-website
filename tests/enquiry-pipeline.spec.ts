import { expect, test } from "@playwright/test";
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { EMAIL_CAPTURE_DIR } from "../playwright.config";

/**
 * 3.3 — the enquiry pipeline, end to end.
 *
 * A 200 from the handler is not evidence of delivery: the handler would also
 * return 200 if the send were skipped. These read what the email provider was
 * actually handed.
 */
const ENDPOINT = "/api/enquiry";

interface Captured {
  role: "internal" | "acknowledgement";
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  reference: string;
  attachments?: { filename: string; bytes: number }[];
}

function captured(reference: string): Captured[] {
  return JSON.parse(readFileSync(join(EMAIL_CAPTURE_DIR, `${reference}.json`), "utf8"));
}

function contact(overrides: Record<string, string> = {}) {
  return {
    kind: "contact",
    name: "Priya Nair",
    company: "Meridian Chemicals",
    email: "priya.nair@meridian.test",
    message: "We are specifying a lined acid transfer line and would like to discuss liner grade.",
    website: "",
    ...overrides,
  };
}

test.beforeAll(() => {
  rmSync(EMAIL_CAPTURE_DIR, { recursive: true, force: true });
});

test.describe("enquiry pipeline", () => {
  test("a valid contact enquiry is delivered to sales and acknowledged", async ({ request }) => {
    const response = await request.post(ENDPOINT, { form: contact() });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.reference).toMatch(/^[A-Z0-9-]{6,}$/);

    const messages = captured(body.reference);
    expect(messages).toHaveLength(2);

    const internal = messages.find((m) => m.role === "internal")!;
    expect(internal.to).toBe("sales@ips-pl.com");
    // Reply-To is what makes the lead answerable in one click.
    expect(internal.replyTo).toBe("priya.nair@meridian.test");
    expect(internal.text).toContain("Meridian Chemicals");
    expect(internal.text).toContain("liner grade");
    expect(internal.text).toContain(body.reference);

    const ack = messages.find((m) => m.role === "acknowledgement")!;
    expect(ack.to).toBe("priya.nair@meridian.test");
    expect(ack.text).toContain(body.reference);
  });

  test("a valid quote enquiry carries its attachment through to the email", async ({ request }) => {
    const response = await request.post(ENDPOINT, {
      multipart: {
        kind: "quote",
        name: "Daniel Okafor",
        company: "Harbour Process",
        email: "d.okafor@harbour.test",
        phone: "+44 20 7946 0000",
        country: "United Kingdom",
        product: "PTFE Lined Pipes",
        message: "Replacement spools for a sulphuric acid line, drawings attached.",
        website: "",
        files: {
          name: "line-iso.pdf",
          mimeType: "application/pdf",
          buffer: Buffer.from("%PDF-1.4 test drawing"),
        },
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);

    const internal = captured(body.reference).find((m) => m.role === "internal")!;
    expect(internal.attachments).toHaveLength(1);
    expect(internal.attachments![0].filename).toBe("line-iso.pdf");
    expect(internal.attachments![0].bytes).toBeGreaterThan(0);
  });

  test("a delivery failure returns 502 and never reports success", async ({ request }) => {
    const response = await request.post(ENDPOINT, {
      form: contact({ email: "delivery-failure@ips-pl.test" }),
    });
    expect(response.status()).toBe(502);

    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.kind).toBe("send_failed");
    // The visitor must be given a way through, not just an apology.
    expect(body.message).toContain("sales@ips-pl.com");
  });

  test("the honeypot is answered like a success so a bot learns nothing", async ({ request }) => {
    const response = await request.post(ENDPOINT, {
      form: contact({ website: "https://spam.example" }),
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);

    // But nothing was actually sent.
    expect(() => captured(body.reference)).toThrow();
  });

  test("a malformed submission returns 422 with per-field messages", async ({ request }) => {
    const response = await request.post(ENDPOINT, {
      form: { kind: "contact", name: "", company: "", email: "not-an-email", message: "" },
    });
    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.kind).toBe("validation");
    expect(Object.keys(body.fieldErrors)).toEqual(
      expect.arrayContaining(["name", "email", "message"]),
    );
    // Messages must be publishable verbatim, not zod's internal wording.
    for (const message of Object.values(body.fieldErrors) as string[]) {
      expect(message).not.toMatch(/expected|invalid_type|String must contain/i);
    }
  });

  test("GET is rejected", async ({ request }) => {
    expect((await request.get(ENDPOINT)).status()).toBe(405);
  });
});
