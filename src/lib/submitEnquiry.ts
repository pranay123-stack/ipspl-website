"use client";

/**
 * Client transport for both forms.
 *
 * Every failure mode is a distinct, named outcome so the UI can say something
 * actionable rather than "something went wrong". In particular `payload_too_large`
 * is reachable two ways: our own handler returning 413 (the 4–4.5 MB band), and
 * the platform rejecting the body before the handler runs (above 4.5 MB), which
 * arrives as an opaque 413 with a non-JSON body.
 */

export type SubmitOutcome =
  | { ok: true; reference: string; rejectedFiles: { filename: string; reason: string }[] }
  | { ok: false; kind: "validation"; message: string; fieldErrors: Record<string, string> }
  | { ok: false; kind: "payload_too_large"; message: string }
  | { ok: false; kind: "rate_limited"; message: string; retryAfterSeconds?: number }
  | { ok: false; kind: "challenge_failed"; message: string }
  | { ok: false; kind: "send_failed"; message: string }
  | { ok: false; kind: "network"; message: string };

export async function submitEnquiry(body: FormData): Promise<SubmitOutcome> {
  let response: Response;
  try {
    response = await fetch("/api/enquiry", { method: "POST", body });
  } catch {
    return {
      ok: false,
      kind: "network",
      message:
        "We could not reach the server. Check your connection and try again — your details are still here.",
    };
  }

  // The platform rejects oversized bodies before our handler runs, so this
  // response may not be JSON at all.
  if (response.status === 413) {
    return {
      ok: false,
      kind: "payload_too_large",
      message: "Your drawings are too large to send with this form.",
    };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    return {
      ok: false,
      kind: "send_failed",
      message:
        "We could not send your enquiry just now. Please try again, or email sales@ips-pl.com directly.",
    };
  }

  const payload = data as Record<string, unknown>;

  if (response.ok && payload.ok) {
    return {
      ok: true,
      reference: String(payload.reference ?? ""),
      rejectedFiles: Array.isArray(payload.rejectedFiles)
        ? (payload.rejectedFiles as { filename: string; reason: string }[])
        : [],
    };
  }

  const kind = String(payload.kind ?? "send_failed");
  const message = String(payload.message ?? "We could not send your enquiry.");

  if (kind === "validation") {
    return {
      ok: false,
      kind: "validation",
      message,
      fieldErrors: (payload.fieldErrors as Record<string, string>) ?? {},
    };
  }
  if (kind === "rate_limited") {
    // Retry-After is authoritative; the body value is a convenience copy.
    const header = Number(response.headers.get("Retry-After"));
    return {
      ok: false,
      kind: "rate_limited",
      message,
      retryAfterSeconds: Number.isFinite(header)
        ? header
        : (payload.retryAfterSeconds as number | undefined),
    };
  }
  if (kind === "challenge_failed") return { ok: false, kind: "challenge_failed", message };
  if (kind === "payload_too_large") return { ok: false, kind: "payload_too_large", message };
  return { ok: false, kind: "send_failed", message };
}
