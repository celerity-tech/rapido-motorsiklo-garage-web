/**
 * Renders a JSON-LD structured-data block. The `<` escaping prevents the
 * serialized payload from breaking out of the <script> context (XSS via data).
 * Server component — safe to drop into any layout or page.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
