"use client";

import { useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";

/**
 * Lazily-loaded map of the Vadodara works.
 *
 * /contact had no map and no iframe at all. This one costs nothing on first
 * paint: until the visitor asks for it, the component is a static panel with
 * the address and a link — no iframe, no Google request, no third-party
 * cookie, and no effect on LCP. Clicking mounts the embed.
 *
 * Requires NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL. Without it the panel still
 * renders the address and any directions link, because an address a buyer can
 * copy is most of the value and a broken embed is worse than none.
 */
const EMBED_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;

export function LocationMap({
  addressLines,
  directionsUrl,
}: {
  addressLines: readonly string[];
  /** Google Business Profile or Maps link. */
  directionsUrl: string | null;
}) {
  const [shown, setShown] = useState(false);
  const address = addressLines.join(", ");

  if (shown && EMBED_URL) {
    return (
      <div className="border border-white/12 bg-surface-card">
        <iframe
          src={EMBED_URL}
          title={`Map showing the IPS-PL works at ${address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-16/10 w-full border-0"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="border border-white/12 bg-surface-card">
      <div className="flex aspect-16/10 flex-col items-start justify-center gap-5 p-8">
        <MapPin aria-hidden="true" className="h-6 w-6 text-accent-bright" />
        <address className="not-italic text-body-md text-steel-200">
          {addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>

        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {EMBED_URL && (
            <button
              type="button"
              onClick={() => setShown(true)}
              className="inline-flex min-h-[44px] items-center border border-white/25 px-5 py-3 tech-label text-white transition-colors hover:bg-white hover:text-ink-950"
            >
              Show map
            </button>
          )}
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 py-3 tech-label text-white underline-offset-4 hover:text-accent-bright hover:underline"
            >
              Directions
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          )}
        </div>

        {!EMBED_URL && !directionsUrl && (
          <p className="max-w-sm text-caption text-steel-300">
            {/* Honest placeholder: a map slot with nothing behind it would be
                a worse answer than saying so. */}
            A map and directions link appear here once the Google Business
            Profile is supplied.
          </p>
        )}
      </div>
    </div>
  );
}
