"use client";

import { useSyncExternalStore } from "react";

/**
 * Published opening hours, with the visitor's own time beside them.
 *
 * The site claims regional representation across Asia and North America, then
 * printed its hours only as "08:00 – 18:00 IST". A buyer in Alberta had to work
 * out for themselves that this means roughly 21:30 to 07:30 their time — which
 * is exactly the arithmetic a site claiming to support local time zones should
 * be doing for them.
 *
 * Rendered progressively: the server outputs the IST times alone, and the local
 * conversion is added after mount. It has to be, because the server cannot know
 * the visitor's zone — and doing it during render would produce different
 * markup on server and client, which React would reject.
 *
 * Anyone already in India sees nothing extra; telling them 08:00 IST is 08:00
 * their time is noise.
 */
const IST_OFFSET_MINUTES = 5 * 60 + 30;

/** "08:00 – 18:00 IST" → ["08:00", "18:00"], or null if it is not that shape. */
function parseWindow(time: string): [string, string] | null {
  const match = time.match(/(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})/);
  return match ? [match[1]!, match[2]!] : null;
}

interface Converted {
  from: string;
  to: string;
  /** -1 when the window starts the previous local day, +1 the next. */
  dayShift: number;
}

function toVisitorTime(from: string, to: string, offsetMinutes: number): Converted {
  const minutesOf = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h! * 60 + m!;
  };
  // getTimezoneOffset() is minutes *behind* UTC, so local = utc - offset.
  const shift = -offsetMinutes - IST_OFFSET_MINUTES;
  const format = (minutes: number) => {
    const wrapped = ((minutes % 1440) + 1440) % 1440;
    const h = String(Math.floor(wrapped / 60)).padStart(2, "0");
    const m = String(wrapped % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const start = minutesOf(from) + shift;
  return {
    from: format(start),
    to: format(minutesOf(to) + shift),
    dayShift: Math.floor(start / 1440),
  };
}

/**
 * The visitor's zone, read once and cached.
 *
 * Cached at module scope because useSyncExternalStore compares snapshots with
 * Object.is — returning a fresh object on every call would re-render forever.
 * A zone does not change mid-session, so one read is enough.
 */
let cachedZone: { offset: number } | null | undefined;

function zoneSnapshot(): { offset: number } | null {
  if (cachedZone === undefined) {
    const offset = new Date().getTimezoneOffset();
    // -330 is IST. Nothing useful to add for a visitor already there.
    cachedZone = offset === -IST_OFFSET_MINUTES ? null : { offset };
  }
  return cachedZone;
}

/** The server has no zone to report, so it reports none and the markup matches. */
const serverSnapshot = () => null;
/** A time zone does not change during a session; nothing to subscribe to. */
const subscribe = () => () => {};

export function LocalHours({
  hours,
  className,
}: {
  hours: readonly { days: string; time: string }[];
  className?: string;
}) {
  // useSyncExternalStore rather than an effect: this reads a browser value
  // that the server cannot know, which is precisely what its server-snapshot
  // argument is for. Setting state inside an effect would do the same job
  // while triggering a second render pass for no reason.
  const zone = useSyncExternalStore(subscribe, zoneSnapshot, serverSnapshot);

  return (
    <div className={className}>
      {hours.map((slot) => {
        const parsed = zone ? parseWindow(slot.time) : null;
        const local = parsed ? toVisitorTime(parsed[0], parsed[1], zone!.offset) : null;

        return (
          <p key={slot.days}>
            <span className="text-white">{slot.days}</span> · {slot.time}
            {local && (
              <span className="mt-0.5 block text-caption text-steel-350">
                {local.from} – {local.to} your time
                {local.dayShift !== 0 && (
                  <> ({local.dayShift < 0 ? "previous" : "next"} day)</>
                )}
              </span>
            )}
          </p>
        );
      })}
    </div>
  );
}
