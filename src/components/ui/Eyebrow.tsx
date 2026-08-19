import { cn } from "@/lib/utils";

/**
 * Small uppercase technical label, optionally prefixed with an index —
 * e.g. "01 / PRODUCTS". Part of the site's editorial numbering language.
 */
export function Eyebrow({
  index,
  children,
  tone = "dark",
  className,
}: {
  index?: string;
  children: React.ReactNode;
  tone?: "dark" | "light" | "accent";
  className?: string;
}) {
  const toneClass =
    tone === "light"
      ? "text-steel-300"
      : tone === "accent"
        ? "text-accent-bright"
        : "text-steel-300";

  return (
    <p className={cn("tech-label flex items-center gap-3", toneClass, className)}>
      {index && (
        <>
          <span className={tone === "light" ? "text-white/90" : "text-white"}>{index}</span>
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
        </>
      )}
      <span>{children}</span>
    </p>
  );
}
