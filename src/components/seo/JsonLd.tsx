/** Server component. Emits one @graph script per page. */
export function JsonLd({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      // Content is built from typed data in src/lib/schema.ts, never user input.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
