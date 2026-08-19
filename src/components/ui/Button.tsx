import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "onDark";

const base =
  "group inline-flex items-center justify-center gap-3 px-7 py-4 text-[0.8125rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-bright",
  secondary: "border border-white/18 text-white hover:border-ink-900 hover:bg-ink-900 hover:text-white",
  ghost: "text-white hover:text-accent-bright px-0 py-2",
  onDark: "border border-white/25 text-white hover:bg-white hover:text-ink-900",
};

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
}

export function Button({
  href,
  children,
  variant = "primary",
  withArrow = true,
  className,
}: ButtonProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      <span>{children}</span>
      {withArrow && (
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}

/** Text link with a rule that draws in on hover. Used for editorial CTAs. */
export function ArrowLink({
  href,
  children,
  tone = "dark",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-[44px] items-center gap-2.5 py-2.5 text-[0.8125rem] font-medium uppercase tracking-[0.12em]",
        tone === "light" ? "text-white" : "text-white",
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className={cn(
            "absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-400 group-hover:scale-x-100",
            tone === "light" ? "bg-surface-card" : "bg-accent",
          )}
        />
      </span>
      <ArrowRight
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}
