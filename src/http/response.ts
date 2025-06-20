import { Status } from './status/$.ts'

/**
 * Pre-configured 404 Not Found response.
 *
 * @example
 * ```ts
 * return Response.notFound
 * // returns a 404 response
 * ```
 */
export const notFound: Response = new Response(Status.NotFound.description, { status: Status.NotFound.code })
