# Err

Error handling utilities for robust error management.

Provides utilities for error inspection, stack trace manipulation, try-catch wrappers,
type guards, and null safety. Features formatted error logging and error wrapping utilities.

## Import

```typescript
import { Err } from '@wollybeard/kit/err'
```

## Functions

### log <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/$$.ts#L19)</sub>

```typescript
(error: Error, options?: { color?: boolean; stackTraceColumns?: number; identColumns?: number; showHelp?: boolean; } | undefined) => void
```

### throwNull <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/$$.ts#L35)</sub>

```typescript
;(<V>(value: V, message?: string | undefined) => Exclude<V, null>)
```

### guardNull <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/$$.ts#L59)</sub>

```typescript
;(<fn extends Fn.AnyAny>(fn: fn, message?: string | undefined) =>
  ReturnExclude<null, fn>)
```

### inspect <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/inspect.ts#L224)</sub>

```typescript
;((
  error: Error,
  options?: {
    color?: boolean
    stackTraceColumns?: number
    identColumns?: number
    showHelp?: boolean
  } | undefined,
) => string)
```

### parseStack <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L82)</sub>

```typescript
(stack: string) => StackFrame[]
```

### cleanStackWithStats <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L230)</sub>

```typescript
;((stack: string, options?: StackOptions | undefined) => CleanStackResult)
```

### cleanStack <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L303)</sub>

```typescript
;((stack: string, options?: StackOptions | undefined) => string)
```

### formatFrame <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L310)</sub>

```typescript
;((frame: StackFrame) => string)
```

### mergeStacks <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L354)</sub>

```typescript
;((wrapper: Error, cause: Error) => string)
```

### captureStackTrace <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L402)</sub>

```typescript
;((message?: string) => string)
```

### getCaller <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L411)</sub>

```typescript
;((depth?: number) => StackFrame | undefined)
```

### tryCatch <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L94)</sub>

Try to execute a function or resolve a promise, catching errors instead of throwing.
Returns either the successful result or the caught error.

```typescript
export function tryCatch<returned, thrown>(
  promise: Promise<returned>,
  predicates?: readonly [
    Bool.TypePredicate<thrown>,
    ...readonly Bool.TypePredicate<thrown>[],
  ],
): Promise<returned | (IsUnknown<thrown> extends true ? Error : thrown)>
```

**Examples:**

```ts twoslash
const result = tryCatch(() => JSON.parse(input)) // parsed value | Error

// With promise
const data = await tryCatch(fetch(url)) // Response | Error

// With custom predicates
const isNetworkError = (e: unknown): e is NetworkError =>
  e instanceof Error && e.name === 'NetworkError'

const response = tryCatch(
  () => fetch(url),
  [isNetworkError],
) // Response | NetworkError
```

### tryOrRethrow <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L394)</sub>

Try to execute a function and wrap any thrown errors with a higher-level message.
Handles both synchronous and asynchronous functions automatically.

```typescript
export function tryOrRethrow<$Return>(
  fn: () => $Return,
  wrapper: string | WrapOptions | ((cause: Error) => Error),
): $Return extends Promise<any> ? $Return : $Return
```

**Examples:**

```ts twoslash
const data = await tryOrRethrow(
  fetchData,
  'Failed to fetch data',
)

// With options
const user = await tryOrRethrow(
  () => fetchUser(userId),
  { message: 'Failed to fetch user', context: { userId } },
)

// With wrapper function
const result = await tryOrRethrow(
  riskyOperation,
  wrapWith('Operation failed'),
)

// Custom error wrapper
const config = await tryOrRethrow(
  loadConfig,
  (cause) => new ConfigError('Failed to load config', { cause }),
)
```

### tryAllOrRethrow <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L433)</sub>

Try multiple functions and wrap any errors with a higher-level message.
If any function throws, all errors are collected into an AggregateError.

```typescript
export function tryAllOrRethrow<
  $Fns extends readonly [() => any, ...Array<() => any>],
>(
  fns: $Fns,
  wrapper: string | WrapOptions | ((cause: Error) => Error),
): Promise<{ [K in keyof $Fns]: Awaited<ReturnType<$Fns[K]>> }>
```

**Examples:**

```ts twoslash
[fetchUsers, fetchPosts],
  'Failed to load data'
)

// With context
const [config, schema, data] = await tryAllOrRethrow(
  [loadConfig, loadSchema, loadData],
  { message: 'Failed to initialize', context: { env: 'production' } }
)
```

### tryCatchify <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L50)</sub>

```typescript
;(<fn extends Fn.AnyAny, thrown>(
  fn: fn,
  predicates?: readonly [TypePredicate<thrown>, ...TypePredicate<thrown>[]],
) =>
(...args: Parameters<fn>) =>
  AwaitedUnion<ReturnType<fn>, IsUnknown<thrown> extends true ? Error : thrown>)
```

### tryCatchIgnore <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L155)</sub>

```typescript
;(<$Return>(fn: () => $Return) => $Return)
```

### tryOr <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L202)</sub>

```typescript
;(<success, fallback>(fn: () => success, fallback: LazyMaybe<fallback>) =>
  TryOrReturn<success, fallback>)
```

### tryOrAsync <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L250)</sub>

```typescript
;(<success, fallback>(fn: () => success, fallback: LazyMaybe<fallback>) =>
  Promise<Awaited<success> | Awaited<fallback>>)
```

### tryOrAsyncOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L273)</sub>

```typescript
;(<success>(fn: () => success) => <fallback>(fallback: LazyMaybe<fallback>) =>
  Promise<Awaited<success> | Awaited<fallback>>)
```

### tryOrAsyncWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L290)</sub>

```typescript
;(<fallback>(fallback: LazyMaybe<fallback>) => <success>(fn: () => success) =>
  Promise<Awaited<success> | Awaited<fallback>>)
```

### tryOrOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L308)</sub>

```typescript
;(<success>(fn: () => success) => <fallback>(fallback: LazyMaybe<fallback>) =>
  TryOrReturn<success, fallback>)
```

### tryOrWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L328)</sub>

```typescript
;(<fallback>(fallback: LazyMaybe<fallback>) => <success>(fn: () => success) =>
  TryOrReturn<success, fallback>)
```

### is <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/type.ts#L12)</sub>

```typescript
(value: unknown) => value is Error
```

### isAggregateError <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/type.ts#L21)</sub>

```typescript
(value: unknown) => value is AggregateError
```

### isAbortError <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/type.ts#L44)</sub>

```typescript
(error: any) => error is DOMException & { name: "AbortError"; }
```

### ensure <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/type.ts#L57)</sub>

```typescript
;((value: unknown) => Error)
```

### wrap <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/wrap.ts#L47)</sub>

```typescript
;((cause: unknown, messageOrOptions: string | WrapOptions) => Error)
```

## Constants

### defaultThrowNullMessage <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/$$.ts#L44)</sub>

```typescript
'Unexpected null value.'
```

### tryOrUndefined <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L343)</sub>

```typescript
;(<success>(fn: () => success) => TryOrReturn<success, undefined>)
```

### tryOrNull <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L355)</sub>

```typescript
;(<success>(fn: () => success) => TryOrReturn<success, null>)
```

### wrapOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/wrap.ts#L77)</sub>

```typescript
;((cause: unknown) => (messageOrOptions: string | WrapOptions) => Error)
```

### wrapWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/wrap.ts#L100)</sub>

```typescript
;((messageOrOptions: string | WrapOptions) => (cause: unknown) => Error)
```

## Classes

### CleanError <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L320)</sub>

Enhanced Error class that automatically cleans stack traces.

```typescript
export class CleanError extends Error {
  /**
   * Original uncleaned stack trace.
   */
  originalStack?: string

  /**
   * Additional context for the error.
   */
  context?: Context

  constructor(
    message: string,
    options?: ErrorOptions & { context?: Context; stackOptions?: StackOptions },
  ) {
    super(message, options)
    this.name = this.constructor.name

    if (options?.context) {
      this.context = options.context
    }

    // Clean the stack trace
    if (this.stack) {
      this.originalStack = this.stack
      this.stack = cleanStackWithStats(this.stack, options?.stackOptions).stack
    }

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
```

## Types

### InferOptions <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/inspect.ts#L34)</sub>

Type helper for inferring option types from environment configurable option specifications.
Transforms an array of option specs into a typed options object.

```typescript
export type InferOptions<
  $EnvironmentConfigurableOptions extends EnvironmentConfigurableOptionSpec[],
> = Ts.Simplify<
  ArrMut.ReduceWithIntersection<_InferOptions<$EnvironmentConfigurableOptions>>
>
```

### _InferOptions <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/inspect.ts#L38)</sub>

```typescript
export type _InferOptions<
  $EnvironmentConfigurableOptions extends EnvironmentConfigurableOptionSpec[],
> = {
  [i in keyof $EnvironmentConfigurableOptions]: {
    [_ in $EnvironmentConfigurableOptions[i]['name']]?: ReturnType<
      $EnvironmentConfigurableOptions[i]['parse']
    >
  }
}
```

### InspectOptions <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/inspect.ts#L162)</sub>

Options for configuring error inspection output.
All options can be overridden via environment variables.

```typescript
export type InspectOptions = InferOptions<typeof optionSpecs>
```

**Examples:**

```ts twoslash
Err.inspect(error)

// Customize options
Err.inspect(error, {
  color: false,
  stackTraceColumns: 200,
  showHelp: false,
})

// Set via environment variables
process.env.ERROR_DISPLAY_COLOR = 'false'
process.env.ERROR_DISPLAY_SHOW_HELP = 'false'
```

### InspectConfig <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/inspect.ts#L170)</sub>

Resolved configuration for error inspection with values and sources.
Contains the final values after merging defaults, user options, and environment variables.

```typescript
export type InspectConfig = Resolve<typeof optionSpecs>
```

### StackOptions <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L7)</sub>

Options for cleaning and formatting stack traces.

```typescript
export interface StackOptions {
  /**
   * Remove internal library frames from the stack trace.
   * @default true
   */
  removeInternal?: boolean

  /**
   * Patterns to filter out from stack traces.
   * @default ['node_modules', 'node:internal']
   */
  filterPatterns?: string[]

  /**
   * Maximum number of frames to show.
   * @default 10
   */
  maxFrames?: number

  /**
   * Include source code context around error location.
   * @default false
   */
  includeSource?: boolean

  /**
   * Number of source lines to show before and after error.
   * @default 2
   */
  sourceContext?: number
}
```

### StackFrame <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L42)</sub>

Parsed stack frame information.

```typescript
export interface StackFrame {
  /**
   * Function name or <anonymous>
   */
  function: string

  /**
   * File path
   */
  file: string

  /**
   * Line number
   */
  line: number

  /**
   * Column number
   */
  column: number

  /**
   * Whether this is internal to the library
   */
  isInternal: boolean

  /**
   * Whether this is a native V8 frame
   */
  isNative: boolean

  /**
   * Raw frame string
   */
  raw: string
}
```

### StackCleanStats <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L159)</sub>

Statistics about stack trace filtering.
Provides detailed information about what was filtered during stack cleaning.

```typescript
export interface StackCleanStats {
  /**
   * Total number of frames before filtering.
   */
  totalFrames: number

  /**
   * Number of frames filtered out.
   */
  filteredFrames: number

  /**
   * Number of node_modules frames filtered.
   */
  nodeModulesFrames: number

  /**
   * Number of internal frames filtered.
   */
  internalFrames: number

  /**
   * Number of frames shown.
   */
  shownFrames: number

  /**
   * Whether the output was truncated due to maxFrames.
   */
  wasTruncated: boolean
}
```

**Examples:**

```ts twoslash
console.log(`Filtered ${result.stats.filteredFrames} frames`)
console.log(
  `Showing ${result.stats.shownFrames} of ${result.stats.totalFrames} total`,
)
```

### CleanStackResult <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/stack.ts#L197)</sub>

Result of cleaning a stack trace.
Contains both the cleaned stack string and statistics about what was filtered.

```typescript
export interface CleanStackResult {
  /**
   * The cleaned stack trace string.
   */
  stack: string

  /**
   * Statistics about what was filtered.
   */
  stats: StackCleanStats
}
```

### TryCatchDefaultPredicateTypes <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/try.ts#L24)</sub>

Default error types caught by try/catch functions when no predicates are specified.

```typescript
export type TryCatchDefaultPredicateTypes = Error
```

### Context <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/types.ts#L5)</sub>

Context information that can be attached to errors.
Must be an object to ensure it can be properly serialized and inspected.

```typescript
export type Context = object
```

### ErrorWithContext <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/types.ts#L10)</sub>

An error that includes additional context information.

```typescript
export interface ErrorWithContext extends Error {
  /**
   * Additional context information about the error.
   */
  context?: Context
}
```

### WrapOptions <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/err/wrap.ts#L9)</sub>

Options for wrapping errors with additional context.

```typescript
export interface WrapOptions {
  /**
   * The error message for the wrapper error.
   */
  message: string
  /**
   * Additional context to attach to the error.
   */
  context?: Context
}
```
