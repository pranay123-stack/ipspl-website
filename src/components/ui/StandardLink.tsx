import { ExternalLink } from "lucide-react";
import { standardsIn } from "@/data/standards";

/**
 * Renders a spec value with any standard it cites turned into a link to the
 * publishing body.
 *
 * Text outside a designation is left exactly as authored — this decorates the
 * value, it never rewrites it.
 */
export function StandardValue({ value }: { value: string }) {
  const cited = standardsIn(value);
  if (cited.length === 0) return <>{value}</>;

  // Split on the designations, keeping them as capture groups so the
  // surrounding punctuation survives.
  const pattern = new RegExp(
    `(${cited.map((s) => s.designation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );

  return (
    <>
      {value.split(pattern).map((part, i) => {
        const match = cited.find(
          (s) => s.designation.toLowerCase() === part.toLowerCase(),
        );
        if (!match) return <span key={i}>{part}</span>;
        return (
          <a
            key={i}
            href={match.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${match.designation} — published by ${match.body}`}
            className="inline-flex items-baseline gap-1 underline decoration-white/30 underline-offset-4 hover:decoration-accent-bright hover:text-accent-bright"
          >
            {part}
            <ExternalLink aria-hidden="true" className="h-3 w-3 shrink-0 self-center" />
            <span className="sr-only">(opens {match.body} in a new tab)</span>
          </a>
        );
      })}
    </>
  );
}
