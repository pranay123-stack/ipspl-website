import { cn } from "@/lib/utils";

/**
 * Site-wide horizontal rhythm. `wide` is used for full-bleed editorial
 * sections; `narrow` for long-form reading measure.
 */
export function Container({
  children,
  size = "default",
  className,
}: {
  children: React.ReactNode;
  size?: "default" | "wide" | "narrow";
  className?: string;
}) {
  const width =
    size === "wide" ? "max-w-[1680px]" : size === "narrow" ? "max-w-3xl" : "max-w-[1400px]";
  return (
    <div className={cn("mx-auto w-full px-6 md:px-10 xl:px-14", width, className)}>
      {children}
    </div>
  );
}
