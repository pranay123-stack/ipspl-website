"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile widget.
 *
 * Renders nothing at all unless NEXT_PUBLIC_TURNSTILE_SITE_KEY is set, so the
 * form works identically before IPS-PL creates a widget. Because the token is
 * written into a hidden input named `cf-turnstile-response` inside the form,
 * both forms pick it up through the FormData they already build — no change to
 * the submit path.
 *
 * The env var is read through a literal member expression, not a variable, so
 * Next inlines it at build time.
 */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function Turnstile({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY || !holder.current) return;

    const mount = () => {
      if (!window.turnstile || !holder.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(holder.current, {
        sitekey: SITE_KEY,
        theme,
        // Managed mode shows a challenge only when Cloudflare wants one.
        appearance: "interaction-only",
        "response-field-name": "cf-turnstile-response",
      });
    };

    if (window.turnstile) {
      mount();
    } else {
      // One script tag for the page even if both forms are mounted.
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", mount);
      return () => script?.removeEventListener("load", mount);
    }

    const id = widgetId.current;
    return () => {
      if (id) window.turnstile?.remove(id);
      widgetId.current = null;
    };
  }, [theme]);

  if (!SITE_KEY) return null;

  return <div ref={holder} className="mt-6" data-turnstile />;
}

/** Lets a form clear a spent token after a failed submission. */
export function resetTurnstile() {
  window.turnstile?.reset();
}

/**
 * Copies the widget's token into a body the form built from React state.
 *
 * Both forms serialise their own state rather than the DOM, so the hidden
 * input Turnstile writes is never picked up automatically. Reading it here
 * keeps that detail in this file instead of in both forms.
 */
export function attachTurnstileToken(body: FormData): void {
  if (!SITE_KEY || typeof document === "undefined") return;
  const input = document.querySelector<HTMLInputElement>(
    'input[name="cf-turnstile-response"]',
  );
  if (input?.value) body.set("cf-turnstile-response", input.value);
}
