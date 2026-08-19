import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function Section({
  children,
  className,
  spacing = "lg",
  tone = "light",
  id,
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg" | "xl";
  tone?: "light" | "muted" | "dark";
  id?: string;
  /** Id of the heading that names this landmark. */
  labelledBy?: string;
}) {
  const pad = {
    sm: "py-section-sm",
    md: "py-section-md",
    lg: "py-section-lg",
    xl: "py-section-xl",
  }[spacing];

  const toneClass = {
    light: "bg-surface-base text-steel-100",
    muted: "bg-surface-raised text-steel-100 border-y border-white/6",
    dark: "bg-surface-base text-steel-100",
  }[tone];

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      // The header is fixed at 79px once scrolled; without this an anchor
      // target lands underneath it. Applied only when the section is
      // addressable, so it costs nothing elsewhere.
      className={cn(pad, toneClass, id && "anchor-offset", className)}
    >
      {children}
    </section>
  );
}

/**
 * Standard editorial section opener: numbered eyebrow, oversized headline,
 * optional supporting paragraph and a trailing action.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  headingId,
  description,
  action,
  tone = "dark",
  align = "left",
  className,
}: {
  index?: string;
  eyebrow: string;
  /** Pass a string; use max-width and text-balance for line breaks. */
  title: React.ReactNode;
  /** Id so the parent <section> can reference it via aria-labelledby. */
  headingId?: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <div
        className={cn(
          "flex flex-col gap-8 md:flex-row md:items-end md:justify-between",
          align === "center" && "items-center text-center lg:flex-col lg:items-center",
        )}
      >
        <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          <Eyebrow index={index} tone={tone === "light" ? "light" : "dark"}>
            {eyebrow}
          </Eyebrow>
          <h2
            id={headingId}
            className={cn(
              "mt-6 text-heading-xl text-balance",
              tone === "light" ? "text-white" : "text-white",
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "mt-6 max-w-2xl text-body-lg",
                tone === "light" ? "text-steel-300" : "text-steel-300",
                align === "center" && "mx-auto",
              )}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </Reveal>
  );
}
