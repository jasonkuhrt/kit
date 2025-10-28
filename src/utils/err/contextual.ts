import { Data } from 'effect'

/**
 * Error with attached context object.
 *
 * Extends Effect's Data.TaggedError to provide:
 * - Type-safe context property
 * - Automatic cause chaining (Effect 3.5+)
 * - _tag discriminant for catchTag
 *
 * @example
 * ```typescript
 * throw new ContextualError({
 *   context: { userId: '123', operation: 'delete' },
 *   cause: originalError
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Use with Effect.catchTag
 * import { Effect } from 'effect'
 *
 * const program: Effect.Effect<string, ContextualError> = Effect.fail(
 *   new ContextualError({ context: { step: 'validation' } })
 * )
 *
 * program.pipe(
 *   Effect.catchTag('ContextualError', (error) =>
 *     Effect.succeed(`Recovered from: ${error.context.step}`)
 *   )
 * )
 * ```
 */
export class ContextualError<
  $Context extends Record<string, unknown> = Record<string, unknown>,
  $Cause extends Error = Error,
> extends Data.TaggedError('ContextualError')<{
  message?: string
  context: $Context
  cause?: $Cause
}> {}
