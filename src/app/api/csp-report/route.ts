/**
 * CSP VIOLATION REPORTS
 * =====================
 * The policy ships as Report-Only, which is only worth doing if the reports go
 * somewhere. Browsers POST here with `application/csp-report` (the `report-uri`
 * format) or `application/reports+json` (the newer `report-to` format); both
 * are accepted.
 *
 * Reports are logged, not stored. Before enforcing the policy, watch these
 * logs for a week: what appears here is exactly what would break.
 */
export const runtime = "nodejs";

interface LegacyReport {
  "csp-report"?: {
    "document-uri"?: string;
    "violated-directive"?: string;
    "blocked-uri"?: string;
    "line-number"?: number;
    "script-sample"?: string;
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LegacyReport | LegacyReport[];
    const reports = Array.isArray(body) ? body : [body];

    for (const entry of reports) {
      const report = entry["csp-report"] ?? entry;
      console.warn("[csp]", {
        document: (report as Record<string, unknown>)["document-uri"],
        directive: (report as Record<string, unknown>)["violated-directive"],
        blocked: (report as Record<string, unknown>)["blocked-uri"],
        sample: (report as Record<string, unknown>)["script-sample"],
      });
    }
  } catch {
    // A malformed report is not worth a 4xx — the browser cannot act on it,
    // and returning an error only produces retries.
  }

  // 204: nothing to say back to the browser.
  return new Response(null, { status: 204 });
}
