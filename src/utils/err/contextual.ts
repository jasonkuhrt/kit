/**
 * An error with additional contextual data.
 *
 * @category Types
 */
export type ContextualError<$Context extends Record<string, unknown> = Record<string, unknown>> = Error & {
  context: $Context
}

/**
 * Create an error with contextual data about it.
 *
 * The context object is attached to the error instance and the message property
 * is made enumerable for better debugging experience.
 *
 * @param message - The error message
 * @param context - Contextual data to attach to the error
 * @returns An Error instance with the context attached
 *
 * @example
 * ```ts
 * const error = Err.createContextualError('Failed to fetch user', {
 *   userId: '123',
 *   endpoint: '/api/users',
 *   statusCode: 404
 * })
 *
 * console.log(error.context.userId) // '123'
 * ```
 *
 * @category Utilities
 */
export const createContextualError = <$Context extends Record<string, unknown>>(
  message: string,
  context: $Context,
): ContextualError<$Context> => {
  const e = new Error(message) as ContextualError<$Context>

  Object.defineProperty(e, `message`, {
    enumerable: true,
    value: e.message,
  })

  e.context = context

  return e
}
