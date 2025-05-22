import * as MimeType from './mime-type.js'

export const Accept = `Accept`
export const ContentType = `Content-Type`
export const CacheControl = `Cache-Control`

export const contentType = (mimeType: MimeType.Any) => {
  return [ContentType, mimeType] as [typeof ContentType, MimeType.Any]
}

/**
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
