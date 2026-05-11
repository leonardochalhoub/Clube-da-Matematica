/**
 * Server component that emits a single JSON-LD <script> tag.
 *
 * Usage:
 *   <JsonLd data={buildCourseSchema({...})} />
 *   <JsonLd data={[schema1, schema2]} />  // emits one script per schema
 */
import type { JSX } from 'react'

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>
}

export function JsonLd({ data }: JsonLdProps): JSX.Element {
  const schemas = Array.isArray(data) ? data : [data]
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify with no extra encoding — Next.js renders <script>
          // as raw HTML, so we need this dangerouslySetInnerHTML pattern.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  )
}
