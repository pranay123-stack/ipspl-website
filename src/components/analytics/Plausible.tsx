import Script from "next/script";

/**
 * Server component — renders the tag only when the domain env var is present,
 * so development and preview builds stay clean. The src is the first-party
 * proxy path configured in next.config.ts.
 */
export function Plausible() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <>
      <Script id="plausible-queue" strategy="afterInteractive">
        {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
      </Script>
      <Script defer data-domain={domain} src="/js/script.js" strategy="afterInteractive" />
    </>
  );
}
