"use client";

import { observeReveal } from "@/lib/revealOnScroll";
import {
  Children,
  createContext,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal primitives.
 *
 * Implemented with IntersectionObserver plus a CSS transition rather than a
 * JS animation runtime. The site has ~100 revealed elements; driving all of
 * them through a motion library added measurable main-thread work at hydration
 * for what amounts to an opacity and transform change.
 *
 * The public API is unchanged, and prefers-reduced-motion is honoured by the
 * global transition override in globals.css.
 */

/** Observes an element and reports the first time it enters the viewport. */
function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observeReveal(node, () => setRevealed(true));
  }, []);

  return { ref, revealed };
}

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before animating — used to stagger sibling elements. */
  delay?: number;
  className?: string;
  /** Retained for API compatibility; all reveals render a <div>. */
  as?: "div" | "section" | "li" | "article" | "span";
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      data-revealed={revealed}
      style={{ "--reveal-delay": `${Math.round(delay * 1000)}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/** Shares the group's visibility and stagger step with its items. */
const GroupContext = createContext<{ revealed: boolean; stagger: number }>({
  revealed: true,
  stagger: 0,
});

/**
 * Reveals each child in sequence once the group scrolls into view.
 * Children should be <RevealItem> elements.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>();

  // Index each item so it can compute its own stagger offset.
  let index = 0;
  const indexed = Children.map(children, (child) =>
    isValidElement<{ index?: number }>(child)
      ? cloneElement(child, { index: index++ })
      : child,
  );

  return (
    <GroupContext.Provider value={{ revealed, stagger }}>
      <div ref={ref} className={className}>
        {indexed}
      </div>
    </GroupContext.Provider>
  );
}

export function RevealItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Injected by RevealGroup. */
  index?: number;
}) {
  const { revealed, stagger } = useContext(GroupContext);

  return (
    <div
      className={cn("reveal", className)}
      data-revealed={revealed}
      style={
        { "--reveal-delay": `${Math.round(index * stagger * 1000)}ms` } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
