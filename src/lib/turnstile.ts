/**
 * CLOUDFLARE TURNSTILE
 * ====================
 * A second signal alongside the honeypot: the honeypot catches naive form
 * fillers, Turnstile catches the ones that render JavaScript.
 *
 * Disabled unless BOTH keys are present. IPS-PL does not hold Turnstile keys
 * yet, so the site has to run correctly without them — and the failure mode
 * matters: if a missing secret silently rejected every submission, the form
 * would look fine and lose every lead. So the check is skipped when unconfigured
 * and enforced when configured, never half-applied.
 *
 * To enable: create a widget at dash.cloudflare.com → Turnstile, then set
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY. No code change.
 */
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const TURNSTILE_FIELD = "cf-turnstile-response";

/** Both halves must be present — a site key alone renders an unverifiable widget. */
export function isTurnstileEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY,
  );
}

export type TurnstileVerdict =
  | { ok: true; skipped: boolean }
  | { ok: false; reason: string };

export async function verifyTurnstile(
  token: string | null,
  ip: string,
): Promise<TurnstileVerdict> {
  if (!isTurnstileEnabled()) return { ok: true, skipped: true };

  if (!token) return { ok: false, reason: "missing-input-response" };

  try {
    const body = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
    });
    // Cloudflare treats the IP as advisory; omit the placeholder rather than
    // send "unknown" and have it counted as a mismatch.
    if (ip && ip !== "unknown") body.set("remoteip", ip);

    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      // A challenge check must not hold a form submission open indefinitely.
      signal: AbortSignal.timeout(8000),
    });

    const result = (await response.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    return result.success
      ? { ok: true, skipped: false }
      : { ok: false, reason: result["error-codes"]?.join(",") ?? "verification-failed" };
  } catch (error) {
    // Cloudflare being unreachable must not cost a lead. Log it, let it through,
    // and rely on the honeypot and the rate limiter for this request.
    console.error("[turnstile] verification unavailable, allowing submission", error);
    return { ok: true, skipped: true };
  }
}
