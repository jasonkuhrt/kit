import { Cause, Data } from 'effect'

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

/**
 * Shape of errors created by TaggedContextualError factory.
 */
export interface TaggedContextualErrorLike {
  readonly tags: readonly string[]
}

/**
 * Extract errors from a union that have a specific tag.
 *
 * @example
 * ```typescript
 * type AllErrors = InputError | FatalError | OtherError
 * type InputErrors = ErrorsWithTag<AllErrors, 'input'>
 * // => InputError (if it has tags: ['input', ...])
 * ```
 */
export type ErrorsWithTag<$Errors, $Tag extends string> = $Errors extends TaggedContextualErrorLike
  ? $Tag extends $Errors['tags'][number] ? $Errors
  : never
  : never

/**
 * Configuration for constraining an error class.
 */
export interface ConstraintConfig<$Context extends Record<string, unknown>> {
  /**
   * Function to derive the error message from context.
   * If provided, message will be automatically computed when not explicitly passed at throw site.
   */
  message?: (context: $Context) => string
}

/**
 * Constructor type returned by TaggedContextualError factory.
 */
export interface TaggedContextualErrorClass<
  $Tag extends string,
  $Tags extends readonly string[] = readonly string[],
  $Context extends Record<string, unknown> = Record<string, unknown>,
  $Cause extends Error = Error,
> {
  readonly _tag: $Tag
  readonly tags: $Tags

  /**
   * Constrain the context and optionally add message derivation.
   *
   * @example
   * ```typescript
   * const MyError = TaggedContextualError('MyError', ['input'])
   *   .constrain<{ userId: string }>({
   *     message: (ctx) => `User ${ctx.userId} not found`,
   *   })
   *
   * // Usage - message derived automatically
   * new MyError({ context: { userId: '123' } })
   *
   * // Or override with explicit message
   * new MyError({ message: 'Custom', context: { userId: '123' } })
   * ```
   */
  constrain<$NewContext extends Record<string, unknown>>(
    config?: ConstraintConfig<$NewContext>,
  ): TaggedContextualErrorClass<$Tag, $Tags, $NewContext, $Cause>

  /**
   * Constrain the context type for this error class.
   * @deprecated Use `.constrain()` instead
   */
  constrainContext<$NewContext extends Record<string, unknown>>(): TaggedContextualErrorClass<
    $Tag,
    $Tags,
    $NewContext,
    $Cause
  >

  /**
   * Constrain the cause type for this error class.
   */
  constrainCause<$NewCause extends Error>(): TaggedContextualErrorClass<$Tag, $Tags, $Context, $NewCause>

  new(args: {
    message?: string
    context: $Context
    cause?: $Cause
  }): Cause.YieldableError & {
    readonly _tag: $Tag
    readonly tags: $Tags
    readonly message?: string
    readonly context: $Context
    readonly cause?: $Cause
  }
}

/**
 * Factory for creating custom tagged contextual error classes.
 *
 * @example
 * ```typescript
 * const MyError = TaggedContextualError('MyError', ['input', 'recoverable'])
 * throw new MyError({ context: { userId: '123' } })
 *
 * // Narrow by tag
 * type InputErrors = ErrorsWithTag<AllErrors, 'input'>
 * ```
 */
export const TaggedContextualError = <
  const $Tag extends string,
  const $Tags extends readonly string[] = readonly never[],
>(
  tag: $Tag,
  tags?: $Tags,
): TaggedContextualErrorClass<$Tag, $Tags> => {
  const tags_ = tags ?? ([] as unknown as $Tags)

  const createErrorClass = (deriveMessage?: (context: Record<string, unknown>) => string) => {
    const ErrorClass = class TaggedContextualError extends Data.TaggedError(tag)<{
      message?: string
      context: Record<string, unknown>
      cause?: Error
    }> {
      static readonly _tag = tag
      static readonly tags = tags_
      readonly tags = tags_

      constructor(args: { message?: string; context: Record<string, unknown>; cause?: Error }) {
        // If message provided, use it; otherwise derive from context if derivation exists
        const message = args.message ?? (deriveMessage ? deriveMessage(args.context) : undefined)
        super(message !== undefined ? { ...args, message } : args)
      }

      static constrain(config?: ConstraintConfig<Record<string, unknown>>) {
        return createErrorClass(config?.message)
      }

      static constrainContext() {
        return this
      }

      static constrainCause() {
        return this
      }
    }
    return ErrorClass
  }

  return createErrorClass() as any
}

/**
 * Type guard for narrowing errors by tag.
 *
 * @example
 * ```typescript
 * if (hasTag(error, 'fatal')) {
 *   // error is narrowed to errors with 'fatal' in their tags
 * }
 * ```
 */
export const hasTag = <
  $Error extends TaggedContextualErrorLike,
  $Tag extends string,
>(
  error: $Error,
  tag: $Tag,
): error is ErrorsWithTag<$Error, $Tag> => {
  return error.tags.includes(tag)
}
