export * as Headers from './headers.ts'
export * as Method from './method.ts'
export * as MimeType from './mime-type.ts'
export * as Response from './response.ts'
export * from './status/$.ts'

import type * as _Method from './method.ts'

/**
 * Union type of all supported HTTP methods.
 */
export type Method =
  | _Method.delete
  | _Method.get
  | _Method.head
  | _Method.options
  | _Method.patch
  | _Method.post
  | _Method.put
