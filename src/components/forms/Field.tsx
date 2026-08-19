"use client";

import { cn } from "@/lib/utils";

/**
 * Form controls.
 *
 * Ids are derived from `name` rather than useId() so the error summary can
 * link straight to a field (`#rfq-email`) and so focus management can find
 * the first invalid control. Names are static and unique, so this is
 * hydration-safe.
 */
export function fieldId(name: string) {
  return `rfq-${name}`;
}

interface BaseProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  /** WCAG 2.1 SC 1.3.5 — lets the browser autofill known values. */
  autoComplete?: string;
}

function FieldShell({
  label,
  id,
  required,
  error,
  hint,
  className,
  children,
}: BaseProps & { id: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex items-baseline gap-2 tech-label text-steel-300"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-accent-bright">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-caption text-steel-300">
          {hint}
        </p>
      )}
      {error && (
        // 14px, not 13px — error text is the one thing a user must not miss.
        <p id={`${id}-error`} role="alert" className="mt-2 text-[0.875rem] leading-5 text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * A filled control with a full border, not an underline.
 * Underline-only fields made "Full name" and "Select…" read as entered
 * values rather than prompts; a bounded, filled box reads as empty input.
 */
const controlBase =
  "mt-3 w-full border bg-surface-raised px-3.5 py-3 text-body-md text-white outline-none transition-colors duration-200 " +
  // steel-350 is dimmer than a real value (white) but still clears 4.5:1.
  "placeholder:text-steel-350 focus:border-accent-bright focus:ring-2 focus:ring-accent/30";

function borderFor(error?: string) {
  return error ? "border-red-400" : "border-white/18 hover:border-white/30";
}

export function TextField({
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  inputRef,
  ...rest
}: BaseProps & {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  /** Lets a dialog move focus to its first field on open. */
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  const id = fieldId(rest.name);
  return (
    <FieldShell {...rest} id={id}>
      <input
        ref={inputRef}
        id={id}
        name={rest.name}
        type={type}
        value={value}
        required={rest.required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={rest.error ? true : undefined}
        aria-describedby={rest.error ? `${id}-error` : rest.hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(controlBase, borderFor(rest.error))}
      />
    </FieldShell>
  );
}

export function SelectField({
  options,
  value,
  onChange,
  placeholder = "Select…",
  autoComplete,
  ...rest
}: BaseProps & {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = fieldId(rest.name);
  return (
    <FieldShell {...rest} id={id}>
      <select
        id={id}
        name={rest.name}
        value={value}
        required={rest.required}
        autoComplete={autoComplete}
        aria-invalid={rest.error ? true : undefined}
        aria-describedby={rest.error ? `${id}-error` : rest.hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          controlBase,
          "cursor-pointer appearance-none",
          value === "" && "text-steel-350",
          borderFor(rest.error),
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-ink-900 text-white">
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({
  rows = 4,
  placeholder,
  value,
  onChange,
  ...rest
}: BaseProps & {
  rows?: number;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = fieldId(rest.name);
  return (
    <FieldShell {...rest} id={id}>
      <textarea
        id={id}
        name={rest.name}
        rows={rows}
        value={value}
        required={rest.required}
        placeholder={placeholder}
        aria-invalid={rest.error ? true : undefined}
        aria-describedby={rest.error ? `${id}-error` : rest.hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(controlBase, "resize-y", borderFor(rest.error))}
      />
    </FieldShell>
  );
}

/** Groups related fields under a numbered technical heading. */
export function FieldSet({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-white/10 pt-10">
      <legend className="sr-only">{title}</legend>
      <div className="grid gap-10 md:grid-cols-[240px_1fr] md:gap-16">
        <div>
          <span className="tech-label text-accent-bright">{index}</span>
          <h2 className="mt-3 text-heading-md text-white">{title}</h2>
          {description && (
            <p className="mt-3 text-caption text-steel-300">{description}</p>
          )}
        </div>
        <div className="grid gap-8 sm:grid-cols-2">{children}</div>
      </div>
    </fieldset>
  );
}
