import * as MimeType from './mime-type.ts'

/**
 * HTTP Accept header name.
 */
export const Accept = `Accept`
/**
 * HTTP Content-Type header name.
 */
export const ContentType = `Content-Type`
/**
 * HTTP Cache-Control header name.
 */
export const CacheControl = `Cache-Control`

/**
 * Create a Content-Type header tuple.
 *
 * @param mimeType - The MIME type value.
 * @returns A tuple of header name and value.
 *
 * @example
 * ```ts
 * const header = contentType(MimeType.applicationJson)
 * // returns ['Content-Type', 'application/json']
 * ```
 */
export const contentType = (mimeType: MimeType.Any) => {
  return [ContentType, mimeType] as [typeof ContentType, MimeType.Any]
}

/**
 * Build a Cache-Control header value for HTTP responses.
 *
 * @param input - Cache control directives.
 * @param input.maxAge - Maximum age in seconds.
 * @param input.sMaxAge - Shared cache maximum age in seconds.
 * @param input.noCache - Disable caching.
 * @param input.noStore - Prevent storage.
 * @param input.noTransform - Prevent transformations.
 * @param input.mustUnderstand - Must understand directive.
 * @param input.mustRevalidate - Must revalidate directive.
 * @param input.proxyRevalidate - Proxy must revalidate.
 * @param input.immutable - Resource is immutable.
 * @param input.visibility - Cache visibility ('public' or 'private').
 * @param input.staleWhileRevalidate - Serve stale while revalidating (seconds).
 * @param input.staleIfError - Serve stale on error (seconds).
 * @returns A tuple of header name and formatted value.
 *
 * @example
 * ```ts
 * const header = responseCacheControl({
 *   maxAge: 3600,
 *   visibility: 'public',
 *   immutable: true
 * })
 * // returns ['Cache-Control', 'public, max-age=3600, immutable']
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control
 */
export const responseCacheControl = (input: {
  maxAge?: number
  sMaxAge?: number
  noCache?: boolean
  noStore?: boolean
  noTransform?: boolean
  mustUnderstand?: boolean
  mustRevalidate?: boolean
  proxyRevalidate?: boolean
  immutable?: boolean
  visibility?: `public` | `private`
  staleWhileRevalidate?: number
  staleIfError?: number
}) => {
  const maxAge = input.maxAge ? `max-age=${input.maxAge}` : ``
  const immutable = input.immutable ? `immutable` : ``
  const sMaxAge = input.sMaxAge ? `s-maxage=${input.sMaxAge}` : ``
  const visibility = input.visibility ? `${input.visibility}` : ``
  const staleWhileRevalidate = input.staleWhileRevalidate ? `stale-while-revalidate=${input.staleWhileRevalidate}` : ``
  const staleIfError = input.staleIfError ? `stale-if-error=${input.staleIfError}` : ``
  const noCache = input.noCache ? `no-cache` : ``
  const noStore = input.noStore ? `no-store` : ``
  const noTransform = input.noTransform ? `no-transform` : ``
  const mustUnderstand = input.mustUnderstand ? `must-understand` : ``
  const mustRevalidate = input.mustRevalidate ? `must-revalidate` : ``
  const proxyRevalidate = input.proxyRevalidate ? `proxy-revalidate` : ``
  const parts = [
    visibility,
    maxAge,
    immutable,
    sMaxAge,
    staleWhileRevalidate,
    staleIfError,
    noCache,
    noStore,
    noTransform,
    mustUnderstand,
    mustRevalidate,
    proxyRevalidate,
  ]
  const value = parts.filter(Boolean).join(`, `)
  return [CacheControl, value] as [typeof CacheControl, string]
}
