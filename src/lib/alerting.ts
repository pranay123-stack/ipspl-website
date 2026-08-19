/**
 * DELIVERY FAILURE ALERTS
 * =======================
 * An enquiry that fails to send is a lost customer, and the visitor is told to
 * email sales@ directly — most will not. Without an alert the failure is a line
 * in a log nobody reads.
 *
 * Posts to whatever webhook is configured (Slack, Teams, or any endpoint that
 * accepts JSON). Unconfigured, it logs loudly and returns; the enquiry path
 * never depends on the alert succeeding.
 */
export interface DeliveryFailure {
  reference: string;
  kind: "quote" | "contact";
  /** Enquirer email, so the lead can be recovered by hand. */
  email: string;
  error: unknown;
}

function message(failure: DeliveryFailure): string {
  return [
    `🚨 IPS-PL enquiry delivery FAILED`,
    `Reference: ${failure.reference}`,
    `Type: ${failure.kind}`,
    `Enquirer: ${failure.email}`,
    `Error: ${failure.error instanceof Error ? failure.error.message : String(failure.error)}`,
    `Recover this lead by hand — the enquirer was told to email sales@ips-pl.com.`,
  ].join("\n");
}

export async function alertDeliveryFailure(failure: DeliveryFailure): Promise<void> {
  // Always logged, whether or not a webhook exists.
  console.error("[enquiry] DELIVERY FAILED", {
    reference: failure.reference,
    kind: failure.kind,
    email: failure.email,
    error: failure.error,
  });

  const webhook = process.env.ALERT_WEBHOOK_URL;
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message(failure) }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    // The alert failing is not worth failing the request a second time.
    console.error("[alert] webhook post failed", error);
  }
}
