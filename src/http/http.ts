export * as Headers from './headers.js'
export * as MimeType from './mime-type.js'
export * as Response from './response.js'
export * from './status/index.js'

export * as Method from './method.js'

import type * as _Method from './method.js'

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
