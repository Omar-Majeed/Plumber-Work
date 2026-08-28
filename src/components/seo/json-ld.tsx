/**
 * Emits JSON-LD. The payload is produced from typed helpers in `lib/seo.ts`,
 * serialised with JSON.stringify, and `<` is escaped so the script tag cannot
 * be broken out of. No user input reaches this component.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      /* Serialised, escaped, non-user data — see the note above. */
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
