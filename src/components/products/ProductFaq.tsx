import type { FaqEntry } from "@/lib/productFaq";

/**
 * Native disclosure elements — no JS, keyboard-operable by default, and the
 * answers are present in the DOM for crawlers whether or not they are open.
 */
export function ProductFaq({ entries }: { entries: FaqEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
      {entries.map((entry) => (
        <details key={entry.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-heading-sm text-white marker:content-none hover:text-accent-bright">
            {entry.question}
            <span
              aria-hidden="true"
              className="relative h-4 w-4 shrink-0 text-steel-300 transition-transform duration-200 group-open:rotate-45"
            >
              <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
              <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 text-body-md text-steel-300">{entry.answer}</p>
        </details>
      ))}
    </div>
  );
}
