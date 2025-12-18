import { Data } from 'effect'

/**
 * Generic internal error with sensible defaults.
 *
 * Use when an unexpected internal condition occurs that
 * doesn't warrant a specific error type.
 *
 * @example
 * ```typescript
 * throw new ErrorInternal({
 *   message: 'Unexpected state',
 *   context: { state: currentState }
 * })
 * ```
 *
 * @example
 * ```typescript
 * // With defaults
 * throw new ErrorInternal() // message: "Something went wrong."
 * ```
 *
 * @example
 * ```typescript
 * // Use with Effect.catchTag
 * import { Effect } from 'effect'
 *
 * program.pipe(
 *   Effect.catchTag('ErrorInternal', (error) =>
 *     Effect.succeed(`Internal error: ${error.message}`)
 *   )
 * )
 * ```
 */
export class ErrorInternal<
  $Context extends Record<string, unknown> = Record<string, unknown>,
  $Cause extends Error = Error,
> extends Data.TaggedError('ErrorInternal')<{
  message?: string
  context?: $Context
  cause?: $Cause
}> {
  constructor(
    options: {
      message?: string
      context?: $Context
      cause?: $Cause
    } = {},
  ) {
    const props: any = {
      message: options.message ?? 'Something went wrong.',
    }
    if (options.context !== undefined) props.context = options.context
    if (options.cause !== undefined) props.cause = options.cause
    super(props)
  }
}
