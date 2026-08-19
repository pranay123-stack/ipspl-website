import { ZodError } from "zod";
import { enquirySchema } from "@/lib/schemas/enquiry";
import { checkFiles, MAX_TOTAL_BYTES, PLATFORM_BODY_LIMIT } from "@/lib/files";
import { createReference } from "@/lib/reference";
import { getEmailProvider } from "@/lib/email";
import { clientIp, getRateLimiter, rateLimitHeaders } from "@/lib/rateLimit";
import { TURNSTILE_FIELD, verifyTurnstile } from "@/lib/turnstile";
import { alertDeliveryFailure } from "@/lib/alerting";

/** Buffer + Resend attachments need the Node runtime, not Edge. */
export const runtime = "nodejs";
/** Explicit: a form post should never sit near the platform default. */
export const maxDuration = 30;

interface FieldErrors {
  [field: string]: string;
}

function json(body: unknown, status: number, headers?: Record<string, string>) {
  return Response.json(body, { status, headers });
}

export async function POST(request: Request) {
  // ---- 1. Rate limit ----------------------------------------------------
  // Applies to every submission, valid or not: an audit found twelve
  // consecutive malformed posts all answered 400 with no limit headers, so a
  // script had no signal to back off and no ceiling to hit.
  const ip = clientIp(request.headers);
  const limit = await getRateLimiter().check(ip);
  const limitHeaders = rateLimitHeaders(limit);
  if (!limit.ok) {
    return json(
      {
        ok: false,
        kind: "rate_limited",
        message: "Too many enquiries from this connection. Please try again shortly.",
        retryAfterSeconds: limit.retryAfterSeconds,
      },
      429,
      limitHeaders,
    );
  }

  // ---- 2. Content-Length precheck --------------------------------------
  // Belt and braces for the 4–4.5 MB band only: above 4.5 MB the platform
  // returns 413 before this handler ever runs, which is why the client-side
  // check is the primary defence.
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > PLATFORM_BODY_LIMIT) {
    return json(
      { ok: false, kind: "payload_too_large", message: "Attachments are too large." },
      413,
      limitHeaders,
    );
  }

  // ---- 3. Parse ---------------------------------------------------------
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(
      { ok: false, kind: "bad_request", message: "The enquiry could not be read. Please try again." },
      400,
      limitHeaders,
    );
  }

  const raw = Object.fromEntries(
    [...form.entries()].filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

  // ---- 4. Validate (independently of the client) ------------------------
  let enquiry;
  try {
    enquiry = enquirySchema.parse(raw);
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: FieldErrors = {};
      for (const issue of error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      // Honeypot: respond exactly like a success so a bot learns nothing.
      if (fieldErrors.website) {
        return json({ ok: true, reference: createReference() }, 200, limitHeaders);
      }
      return json(
        { ok: false, kind: "validation", message: "Some details need checking.", fieldErrors },
        422,
        limitHeaders,
      );
    }
    throw error;
  }

  // ---- 4b. Turnstile ----------------------------------------------------
  // After validation so a malformed post never costs a Cloudflare round trip,
  // before send so a solved challenge is a precondition for delivery.
  const challenge = await verifyTurnstile(form.get(TURNSTILE_FIELD) as string | null, ip);
  if (!challenge.ok) {
    return json(
      {
        ok: false,
        kind: "challenge_failed",
        message:
          "We could not verify that this came from a browser. Reload the page and try again, or email sales@ips-pl.com.",
      },
      403,
      limitHeaders,
    );
  }

  const reference = createReference();

  // ---- 5. Files ---------------------------------------------------------
  let attachments: Awaited<ReturnType<typeof checkFiles>>["accepted"] = [];
  let rejectedFiles: { filename: string; reason: string }[] = [];

  if (enquiry.kind === "quote") {
    const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length > 0) {
      const result = await checkFiles(files);
      attachments = result.accepted;
      rejectedFiles = result.rejections;
    }
  }

  // ---- 6. Send ----------------------------------------------------------
  try {
    const provider = getEmailProvider();
    if (enquiry.kind === "quote") {
      await provider.sendQuoteEmail({
        enquiry,
        reference,
        attachments: attachments.map((a) => ({
          filename: a.filename,
          content: a.bytes,
          contentType: a.contentType,
        })),
        rejectedFiles,
        drawingsOmitted: Boolean(enquiry.drawingsOmitted),
      });
    } else {
      await provider.sendContactEmail({ enquiry, reference });
    }
  } catch (error) {
    // Awaited: on a serverless runtime the process can be frozen the moment
    // the response is returned, and a floating promise would never send.
    await alertDeliveryFailure({
      reference,
      kind: enquiry.kind,
      email: enquiry.email,
      error,
    });
    return json(
      {
        ok: false,
        kind: "send_failed",
        message:
          "We could not send your enquiry just now. Please try again, or email sales@ips-pl.com directly.",
      },
      502,
      limitHeaders,
    );
  }

  return json(
    { ok: true, reference, rejectedFiles, maxTotalBytes: MAX_TOTAL_BYTES },
    200,
    limitHeaders,
  );
}

/** Anything other than POST. */
export async function GET() {
  return json({ ok: false, message: "Method not allowed" }, 405);
}
