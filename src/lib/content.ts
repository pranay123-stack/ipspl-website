/**
 * TODO(content): markers are for the repo, never for the reader.
 *
 * They stay in the data files so they remain grep-able for the handover
 * checklist, but any value carrying one is treated as absent at render time —
 * the field is omitted rather than shown half-finished.
 */
export function published(value: string | undefined | null): string | null {
  if (!value) return null;
  return /TODO\(content\)/i.test(value) ? null : value;
}

/** Filters a list down to values safe to render. */
export function publishedList(values: string[] | undefined): string[] {
  return (values ?? []).filter((v) => published(v) !== null);
}
