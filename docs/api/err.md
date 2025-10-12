# Err

Error handling utilities for robust error management. Provides utilities for error inspection, stack trace manipulation, try-catch wrappers, type guards, and null safety. Features formatted error logging and error wrapping utilities.

## Import

::: code-group

```typescript [Namespace]
import { Err } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Err from '@wollybeard/kit/err'
```

:::

## Conversion

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `ensure`

```typescript
;((value: unknown) => Error)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/type.ts#L65" />

Ensure that the given value is an error and return it. If it is not an error than wrap it in one, passing the given value as the error message.

## Inspection

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `log`

```typescript
(error: Error, options?: { color?: boolean; stackTraceColumns?: number; identColumns?: number; maxFrames?: number; showHelp?: boolean; } | undefined) => void
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/$$.ts#L21" />

Log an error to console with nice formatting.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `InspectOptions`

```typescript
type InspectOptions = InferOptions<typeof optionSpecs>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/inspect.ts#L175" />

Options for configuring error inspection output. All options can be overridden via environment variables.

color

- Whether to use ANSI color codes for better readability (default: true, env: ERROR_DISPLAY_COLOR)

stackTraceColumns

- Maximum column width before truncating stack trace lines (default: 120, env: ERROR_DISPLAY_STACK_TRACE_COLUMNS)

identColumns

- Number of spaces to use for indentation (default: 4, env: ERROR_DISPLAY_IDENT_COLUMNS)

maxFrames

- Maximum number of stack frames to show; 0 to hide stack traces entirely (default: 10, env: ERROR_DISPLAY_MAX_FRAMES)

showHelp

- Whether to display the environment variable help section (default: true, env: ERROR_DISPLAY_SHOW_HELP)

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// Use default options
// [!code word:inspect:1]
Err.inspect(error)

// Customize options
// [!code word:inspect:1]
Err.inspect(error, {
  color: false,
  stackTraceColumns: 200,
  showHelp: false,
})

// Hide stack traces (useful for test snapshots)
// [!code word:inspect:1]
Err.inspect(error, { maxFrames: 0, showHelp: false, color: false })

// Set via environment variables
// [!code word:ERROR_DISPLAY_COLOR:1]
process.env.ERROR_DISPLAY_COLOR = 'false'
// [!code word:ERROR_DISPLAY_SHOW_HELP:1]
process.env.ERROR_DISPLAY_SHOW_HELP = 'false'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `inspect`

```typescript
;((
  error: Error,
  options?: {
    color?: boolean
    stackTraceColumns?: number
    identColumns?: number
    maxFrames?: number
    showHelp?: boolean
  } | undefined,
) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/inspect.ts#L239" />

Render an error to a string with detailed formatting.

Features:

- Nested error support (causes and aggregate errors)
- Context object formatting
- Stack trace cleaning with filtering indicators
- Tree-like visual guides for nested structures
- Configurable via options or environment variables

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// Simple error
const error = new Error('Something went wrong')
// [!code word:log:1]
// [!code word:inspect:1]
console.log(Err.inspect(error))

// Error with context
const contextError = new Error('API failed')
// [!code word:context:1]
contextError.context = { userId: 123, endpoint: '/api/users' }
// [!code word:log:1]
// [!code word:inspect:1]
console.log(Err.inspect(contextError))

// Aggregate error with multiple failures
const errors = [
  new Error('Database connection failed'),
  new Error('Redis timeout'),
]
const aggregate = new AggregateError(errors, 'Multiple services failed')
// [!code word:log:1]
// [!code word:inspect:1]
console.log(Err.inspect(aggregate))

// Disable help section
// [!code word:log:1]
// [!code word:inspect:1]
console.log(Err.inspect(error, { showHelp: false }))
```

## Stack Traces

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `StackOptions`

```typescript
interface StackOptions {
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

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L9" />

Options for cleaning and formatting stack traces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `StackFrame`

```typescript
interface StackFrame {
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

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L46" />

Parsed stack frame information.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `parseStack`

```typescript
(stack: string) => StackFrame[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L88" />

Parse a stack trace string into structured frames.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `StackCleanStats`

```typescript
interface StackCleanStats {
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

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L167" />

Statistics about stack trace filtering. Provides detailed information about what was filtered during stack cleaning.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:stack:1]
const result = cleanStackWithStats(error.stack)
// [!code word:log:1]
// [!code word:filteredFrames:1]
console.log(`Filtered ${result.stats.filteredFrames} frames`)
// [!code word:log:1]
// [!code word:shownFrames:1]
// [!code word:totalFrames:1]
console.log(
  `Showing ${result.stats.shownFrames} of ${result.stats.totalFrames} total`,
)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `CleanStackResult`

```typescript
interface CleanStackResult {
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

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L207" />

Result of cleaning a stack trace. Contains both the cleaned stack string and statistics about what was filtered.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `cleanStackWithStats`

```typescript
;((stack: string, options?: StackOptions | undefined) => CleanStackResult)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L242" />

Clean a stack trace by removing internal frames and applying filters. Returns both the cleaned stack and detailed statistics about filtering.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
const error = new Error('Something failed')
// [!code word:cleanStackWithStats:1]
// [!code word:stack:1]
const result = Err.cleanStackWithStats(error.stack, {
  removeInternal: true,
  filterPatterns: ['node_modules'],
  maxFrames: 10,
})

// [!code word:log:1]
// [!code word:stack:1]
console.log(result.stack) // Cleaned stack trace
// [!code word:log:1]
// [!code word:nodeModulesFrames:1]
console.log(`Filtered ${result.stats.nodeModulesFrames} node_modules frames`)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `cleanStack`

```typescript
;((stack: string, options?: StackOptions | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L317" />

:::warning DEPRECATED
Use cleanStackWithStats for detailed filtering information
:::

Clean a stack trace by removing internal frames and applying filters.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `formatFrame`

```typescript
;((frame: StackFrame) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L326" />

Format a stack frame for better readability.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `CleanError`

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
    // [!code word:name:1]
    this.name = this.constructor.name

    // [!code word:context:1]
    if (options?.context) {
      // [!code word:context:1]
      this.context = options.context
    }

    // Clean the stack trace
    if (this.stack) {
      this.originalStack = this.stack
      // [!code word:stackOptions:1]
      this.stack = cleanStackWithStats(this.stack, options?.stackOptions).stack
    }

    // Ensure proper prototype chain
    // [!code word:setPrototypeOf:1]
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L338" />

Enhanced Error class that automatically cleans stack traces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mergeStacks`

```typescript
;((wrapper: Error, cause: Error) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L374" />

Merge stack traces from multiple errors (useful for wrapped errors). This preserves the full error chain while removing duplicates.

## Try-Catch

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryCatch`

```typescript
function tryCatch<returned, thrown>(
  promise: Promise<returned>,
  predicates?: readonly [
    Bool.TypePredicate<thrown>,
    ...readonly Bool.TypePredicate<thrown>[],
  ],
): Promise<returned | (IsUnknown<thrown> extends true ? Error : thrown)>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L100" />

Try to execute a function or resolve a promise, catching errors instead of throwing. Returns either the successful result or the caught error.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// With function
// [!code word:tryCatch:1]
// [!code word:parse:1]
const result = Err.tryCatch(() => JSON.parse(input)) // parsed value | Error

// With promise
// [!code word:tryCatch:1]
const data = await Err.tryCatch(fetch(url)) // Response | Error

// With custom predicates
const isNetworkError = (e: unknown): e is NetworkError =>
  // [!code word:name:1]
  e instanceof Error && e.name === 'NetworkError'

// [!code word:tryCatch:1]
const response = Err.tryCatch(
  () => fetch(url),
  [isNetworkError],
) // Response | NetworkError
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `TryCatchDefaultPredicateTypes`

```typescript
type TryCatchDefaultPredicateTypes = Error
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L26" />

Default error types caught by try/catch functions when no predicates are specified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryCatchify`

```typescript
;(<fn extends Fn.AnyAny, thrown>(
  fn: fn,
  predicates?: readonly [TypePredicate<thrown>, ...TypePredicate<thrown>[]],
) =>
(...args: Parameters<fn>) =>
  AwaitedUnion<ReturnType<fn>, IsUnknown<thrown> extends true ? Error : thrown>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L54" />

Transform a function to return caught errors instead of throwing them. The transformed function will return either the result or the caught error.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// Transform a throwing function
// [!code word:tryCatchify:1]
// [!code word:parse:1]
const parseJsonSafe = Err.tryCatchify(JSON.parse)
const result = parseJsonSafe('{"valid": true}') // { valid: true }
const error = parseJsonSafe('invalid') // SyntaxError

// With custom error predicates
const isNetworkError = (e: unknown): e is NetworkError =>
  // [!code word:name:1]
  e instanceof Error && e.name === 'NetworkError'

// [!code word:tryCatchify:1]
const fetchSafe = Err.tryCatchify(fetch, [isNetworkError])
const response = await fetchSafe(url) // Response | NetworkError
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryCatchIgnore`

```typescript
;(<$Return>(fn: () => $Return) => $Return)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L158" />

Try to execute a function and silently ignore any errors. Returns the result if successful, or undefined if it throws. For async functions, errors are silently caught without rejection.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// Sync function
// [!code word:tryCatchIgnore:1]
// [!code word:parse:1]
Err.tryCatchIgnore(() => JSON.parse(invalidJson)) // returns undefined

// Async function
// [!code word:tryCatchIgnore:1]
await Err.tryCatchIgnore(async () => {
  throw new Error('Network error')
}) // returns undefined, no rejection
```

## Try-Or

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrRethrow`

```typescript
function tryOrRethrow<$Return>(
  fn: () => $Return,
  wrapper: string | WrapOptions | ((cause: Error) => Error),
): $Return extends Promise<any> ? $Return : $Return
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L397" />

Try to execute a function and wrap any thrown errors with a higher-level message. Handles both synchronous and asynchronous functions automatically.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// Simple string message
// [!code word:tryOrRethrow:1]
const data = await Err.tryOrRethrow(
  fetchData,
  'Failed to fetch data',
)

// With options
// [!code word:tryOrRethrow:1]
const user = await Err.tryOrRethrow(
  () => fetchUser(userId),
  { message: 'Failed to fetch user', context: { userId } },
)

// With wrapper function
// [!code word:tryOrRethrow:1]
const result = await Err.tryOrRethrow(
  riskyOperation,
  wrapWith('Operation failed'),
)

// Custom error wrapper
// [!code word:tryOrRethrow:1]
const config = await Err.tryOrRethrow(
  loadConfig,
  (cause) => new ConfigError('Failed to load config', { cause }),
)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryAllOrRethrow`

```typescript
function tryAllOrRethrow<
  $Fns extends readonly [() => any, ...Array<() => any>],
>(
  fns: $Fns,
  wrapper: string | WrapOptions | ((cause: Error) => Error),
): Promise<{ [K in keyof $Fns]: Awaited<ReturnType<$Fns[K]>> }>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L438" />

Try multiple functions and wrap any errors with a higher-level message. If any function throws, all errors are collected into an AggregateError.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:tryAllOrRethrow:1]
const [users, posts] = await Err.tryAllOrRethrow(
  [fetchUsers, fetchPosts],
  'Failed to load data',
)

// With context
// [!code word:tryAllOrRethrow:1]
const [config, schema, data] = await Err.tryAllOrRethrow(
  [loadConfig, loadSchema, loadData],
  { message: 'Failed to initialize', context: { env: 'production' } },
)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOr`

```typescript
;(<success, fallback>(fn: () => success, fallback: LazyMaybe<fallback>) =>
  TryOrReturn<success, fallback>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L203" />

Try to execute a function and return a fallback value if it throws.

**Type constraints:**

- If fn is synchronous, fallback must also be synchronous
- If fn is asynchronous, fallback can be either sync or async
- For sync functions with async fallbacks, use tryOrAsync instead

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// Sync function with sync fallback
// [!code word:tryOr:1]
const data = Err.tryOr(
  // [!code word:parse:1]
  () => JSON.parse(input),
  { error: 'Invalid JSON' },
)

// Async function with sync fallback
// [!code word:tryOr:1]
const config = await Err.tryOr(
  async () => loadConfig(),
  () => getDefaultConfig(),
)

// Async function with async fallback
// [!code word:tryOr:1]
const data = await Err.tryOr(
  async () => fetchFromPrimary(),
  async () => fetchFromSecondary(),
)

// This would be a TYPE ERROR:
// const bad = Err.tryOr(
//   () => 42,                    // sync
//   async () => 'fallback'       // async - not allowed!
// )
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrAsync`

```typescript
;(<success, fallback>(fn: () => success, fallback: LazyMaybe<fallback>) =>
  Promise<Awaited<success> | Awaited<fallback>>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L239" />

Try to execute a function and return a fallback value if it throws. Always returns a Promise, allowing async fallbacks for sync functions.

Use this when:

- You have a sync function with an async fallback
- You want consistent async behavior regardless of input types

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// Sync function with async fallback
// [!code word:tryOrAsync:1]
const data = await Err.tryOrAsync(
  () => readFileSync('config.json'),
  async () => fetchDefaultConfig(),
)

// Ensures consistent Promise return
// [!code word:tryOrAsync:1]
const result = await Err.tryOrAsync(
  () => 42,
  () => 'fallback',
) // Always Promise<number | string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrAsyncOn`

```typescript
;(<success>(fn: () => success) => <fallback>(fallback: LazyMaybe<fallback>) =>
  Promise<Awaited<success> | Awaited<fallback>>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L264" />

Curried version of tryOrAsync that takes the function first. Useful for creating reusable async error handlers.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:tryOrAsyncOn:1]
// [!code word:parse:1]
const parseJsonOrFetch = Err.tryOrAsyncOn(() => JSON.parse(input))
const data = await parseJsonOrFetch(async () => fetchDefault())
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrAsyncWith`

```typescript
;(<fallback>(fallback: LazyMaybe<fallback>) => <success>(fn: () => success) =>
  Promise<Awaited<success> | Awaited<fallback>>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L283" />

Curried version of tryOrAsync that takes the fallback first. Always returns a Promise regardless of input types.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:tryOrAsyncWith:1]
const orFetchDefault = Err.tryOrAsyncWith(async () => fetchDefault())
const data1 = await orFetchDefault(() => localData())
const data2 = await orFetchDefault(() => cachedData())
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrOn`

```typescript
;(<success>(fn: () => success) => <fallback>(fallback: LazyMaybe<fallback>) =>
  TryOrReturn<success, fallback>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L303" />

Curried version of tryOr that takes the function first. Useful for creating reusable error handlers.

**Note:** Same type constraints as tryOr apply

- sync functions require sync fallbacks.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:tryOrOn:1]
// [!code word:parse:1]
const parseJsonOr = Err.tryOrOn(() => JSON.parse(input))
const data = parseJsonOr({ error: 'Invalid JSON' })
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrWith`

```typescript
;(<fallback>(fallback: LazyMaybe<fallback>) => <success>(fn: () => success) =>
  TryOrReturn<success, fallback>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L325" />

Curried version of tryOr that takes the fallback first. Useful for creating reusable fallback patterns.

**Note:** Same type constraints as tryOr apply

- sync functions require sync fallbacks.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:tryOrWith:1]
const orDefault = Err.tryOrWith({ status: 'unknown', data: null })

const result1 = orDefault(() => fetchStatus())
const result2 = orDefault(() => getLatestData())
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `tryOrUndefined`

```typescript
;(<success>(fn: () => success) => TryOrReturn<success, undefined>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L342" />

Try to execute a function and return undefined if it throws. Shorthand for tryOrWith(undefined).

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:tryOrUndefined:1]
// [!code word:getItem:1]
const data = Err.tryOrUndefined(() => localStorage.getItem('key'))
// data is string | undefined
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `tryOrNull`

```typescript
;(<success>(fn: () => success) => TryOrReturn<success, null>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L356" />

Try to execute a function and return null if it throws. Shorthand for tryOrWith(null).

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:tryOrNull:1]
const user = await Err.tryOrNull(async () => fetchUser(id))
// user is User | null
```

## Type Guards

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown) => value is Error
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/type.ts#L14" />

Type predicate to check if a value is an Error instance.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:is:1]
Err.is(new Error('test')) // true
// [!code word:is:1]
Err.is('not an error') // false
// [!code word:is:1]
Err.is(null) // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isAggregateError`

```typescript
(value: unknown) => value is AggregateError
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/type.ts#L25" />

Check if a value is an AggregateError instance.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isAbortError`

```typescript
(error: any) => error is DOMException & { name: "AbortError"; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/type.ts#L50" />

Check if an error is an AbortError (from AbortController/AbortSignal).

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
const controller = new AbortController()
// [!code word:abort:1]
controller.abort()

try {
  // [!code word:signal:1]
  await fetch(url, { signal: controller.signal })
} catch (error) {
  // [!code word:isAbortError:1]
  if (Err.isAbortError(error)) {
    // [!code word:log:1]
    console.log('Request was aborted')
  }
}
```

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Context`

```typescript
type Context = object
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/types.ts#L7" />

Context information that can be attached to errors. Must be an object to ensure it can be properly serialized and inspected.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `ErrorWithContext`

```typescript
interface ErrorWithContext extends Error {
  /**
   * Additional context information about the error.
   */
  context?: Context
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/types.ts#L14" />

An error that includes additional context information.

## Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `throwNull`

```typescript
;(<V>(value: V, message?: string | undefined) => Exclude<V, null>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/$$.ts#L39" />

Throw an error if the value is null, otherwise return the non-null value.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:throwNull:1]
const result = Err.throwNull(maybeNull) // throws if null
// [!code word:throwNull:1]
const safe = Err.throwNull(maybeNull, 'Custom error message')
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultThrowNullMessage`

```typescript
'Unexpected null value.'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/$$.ts#L50" />

Default error message used by throwNull when no custom message is provided.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `guardNull`

```typescript
;(<fn extends Fn.AnyAny>(fn: fn, message?: string | undefined) =>
  ReturnExclude<null, fn>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/$$.ts#L67" />

Wrap a function to throw an error if it returns null.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:find:1]
// [!code word:id:1]
const find = (id: string) => items.find(item => item.id === id) ?? null
// [!code word:guardNull:1]
const findOrThrow = Err.guardNull(find, 'Item not found')

const item = findOrThrow('123') // throws if not found
```

## Wrapping

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `WrapOptions`

```typescript
interface WrapOptions {
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

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/wrap.ts#L11" />

Options for wrapping errors with additional context.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `wrap`

```typescript
;((cause: unknown, messageOrOptions: string | WrapOptions) => Error)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/wrap.ts#L51" />

Wrap an error with a higher-level error message. If the input is not an Error, it will be converted to one using ensure.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
try {
  await fetchData()
} catch (error) {
  // [!code word:wrap:1]
  throw Err.wrap(error, 'Failed to fetch data')
}

// With context
try {
  await fetchUser(userId)
} catch (error) {
  // [!code word:wrap:1]
  throw Err.wrap(error, {
    message: 'Failed to fetch user',
    context: { userId },
  })
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `wrapOn`

```typescript
;((cause: unknown) => (messageOrOptions: string | WrapOptions) => Error)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/wrap.ts#L83" />

Curried version of wrap that takes the error first. Useful for error handling pipelines.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:wrapOn:1]
const wrapFetchError = Err.wrapOn(networkError)
throw wrapFetchError('Failed to fetch data')
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `wrapWith`

```typescript
;((messageOrOptions: string | WrapOptions) => (cause: unknown) => Error)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/wrap.ts#L108" />

Curried version of wrap that takes the message/options first. Useful for creating reusable error wrappers.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:wrapWith:1]
const wrapAsFetchError = Err.wrapWith('Failed to fetch data')

try {
  await fetchData()
} catch (error) {
  throw wrapAsFetchError(error)
}

// With context
// [!code word:wrapWith:1]
const wrapAsUserError = Err.wrapWith({
  message: 'Failed to process user',
  context: { operation: 'update' },
})
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `InferOptions`

```typescript
type InferOptions<
  $EnvironmentConfigurableOptions extends EnvironmentConfigurableOptionSpec[],
> = Ts.Simplify<
  ArrMut.ReduceWithIntersection<_InferOptions<$EnvironmentConfigurableOptions>>
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/inspect.ts#L34" />

Type helper for inferring option types from environment configurable option specifications. Transforms an array of option specs into a typed options object.

$EnvironmentConfigurableOptions

- Array of option specifications

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `_InferOptions`

```typescript
type _InferOptions<
  $EnvironmentConfigurableOptions extends EnvironmentConfigurableOptionSpec[],
> = {
  [i in keyof $EnvironmentConfigurableOptions]: {
    [_ in $EnvironmentConfigurableOptions[i]['name']]?: ReturnType<
      $EnvironmentConfigurableOptions[i]['parse']
    >
  }
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/inspect.ts#L38" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `InspectConfig`

```typescript
type InspectConfig = Resolve<typeof optionSpecs>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/inspect.ts#L183" />

Resolved configuration for error inspection with values and sources. Contains the final values after merging defaults, user options, and environment variables.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `captureStackTrace`

```typescript
;((message?: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L422" />

Capture the current stack trace at a specific point. Useful for adding trace information without throwing.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getCaller`

```typescript
;((depth?: number) => StackFrame | undefined)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L431" />

Get the caller information from the current stack.
