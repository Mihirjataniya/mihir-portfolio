/**
 * Emits one JSON-LD block into the page.
 *
 * The payload is authored in this codebase, never user input, so there is no
 * untrusted string to escape here. `<` is still escaped because a literal
 * "</script>" inside a JSON string would otherwise close the tag early.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
