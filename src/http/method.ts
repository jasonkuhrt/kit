/**
 * HTTP GET method.
 */
export const get = `get`
export type get = typeof get

/**
 * HTTP POST method.
 */
export const post = `post`
export type post = typeof post

/**
 * HTTP PUT method.
 */
export const put = `put`
export type put = typeof put

/**
 * HTTP DELETE method (internal).
 */
const delete_ = `delete`
type delete_ = typeof delete_

/**
 * HTTP DELETE method.
 */
export { delete_ as delete }

/**
 * HTTP PATCH method.
 */
export const patch = `patch`
export type patch = typeof patch

/**
 * HTTP HEAD method.
 */
export const head = `head`
export type head = typeof head

/**
 * HTTP OPTIONS method.
 */
export const options = `options`
export type options = typeof options

/**
 * HTTP TRACE method.
 */
export const trace = `trace`
export type trace = typeof trace
