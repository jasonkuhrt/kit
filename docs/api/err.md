# Err

Error handling utilities for robust error management.

Provides utilities for error inspection, stack trace manipulation, try-catch wrappers, type guards, and null safety. Features formatted error logging and error wrapping utilities.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `ensure`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/type.ts#L65" /> {#f-ensure-65}

```typescript
(value: unknown): Error
```

Ensure that the given value is an error and return it. If it is not an error than wrap it in one, passing the given value as the error message.

## Inspection

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `log`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/$$.ts#L23" /> {#f-log-23}

```typescript
(error: Error, options?: { color?: boolean; stackTraceColumns?: number; identColumns?: number; maxFrames?: number; showHelp?: boolean; } | undefined): void
```

Log an error to console with nice formatting.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `InspectOptions`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/inspect.ts#L175" /> {#t-inspect-options-175}

```typescript
type InspectOptions = InferOptions<typeof optionSpecs>
```

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
  showHelp: false
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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `inspect`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/inspect.ts#L239" /> {#f-inspect-239}

```typescript
(error: Error, options?: { color?: boolean; stackTraceColumns?: number; identColumns?: number; maxFrames?: number; showHelp?: boolean; } | undefined): string
```

**Parameters:**

- `error` - The error to inspect
- `options` - Optional configuration for formatting

**Returns:** A formatted string representation of the error

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
  new Error('Redis timeout')
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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `StackOptions`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L9" /> {#i-stack-options-9}

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

Options for cleaning and formatting stack traces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `StackFrame`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L46" /> {#i-stack-frame-46}

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

Parsed stack frame information.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `parseStack`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L88" /> {#f-parse-stack-88}

```typescript
(stack: string): StackFrame[]
```

Parse a stack trace string into structured frames.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `StackCleanStats`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L167" /> {#i-stack-clean-stats-167}

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
console.log(`Showing ${result.stats.shownFrames} of ${result.stats.totalFrames} total`)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `CleanStackResult`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L207" /> {#i-clean-stack-result-207}

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

Result of cleaning a stack trace. Contains both the cleaned stack string and statistics about what was filtered.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `cleanStackWithStats`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L242" /> {#f-clean-stack-with-stats-242}

```typescript
(stack: string, options?: StackOptions | undefined): CleanStackResult
```

**Parameters:**

- `stack` - The raw stack trace string to clean
- `options` - Optional configuration for filtering and formatting

**Returns:** Object containing cleaned stack and filtering statistics

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
  maxFrames: 10
})

// [!code word:log:1]
// [!code word:stack:1]
console.log(result.stack) // Cleaned stack trace
// [!code word:log:1]
// [!code word:nodeModulesFrames:1]
console.log(`Filtered ${result.stats.nodeModulesFrames} node_modules frames`)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `cleanStack`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L318" /> {#f-clean-stack-318}

```typescript
(stack: string, options?: StackOptions | undefined): string
```

**Parameters:**

- `stack` - The raw stack trace string to clean
- `options` - Optional configuration for filtering

**Returns:** The cleaned stack trace string

:::warning DEPRECATED
Use cleanStackWithStats for detailed filtering information
:::

Clean a stack trace by removing internal frames and applying filters.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `formatFrame`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L327" /> {#f-format-frame-327}

```typescript
(frame: StackFrame): string
```

Format a stack frame for better readability.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `CleanError`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L339" /> {#class-clean-error-339}

```typescript
class {
  constructor(message: string, options?: (ErrorOptions & { context?: object; stackOptions?: StackOptions; }) | undefined)

  // Properties
  originalStack?: string | undefined
  context?: object | undefined
}
```

**Properties:**

- `originalStack` - Original uncleaned stack trace.
- `context` - Additional context for the error.

Enhanced Error class that automatically cleans stack traces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mergeStacks`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L375" /> {#f-merge-stacks-375}

```typescript
(wrapper: Error, cause: Error): string
```

Merge stack traces from multiple errors (useful for wrapped errors). This preserves the full error chain while removing duplicates.

## Try-Catch

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryCatch`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L109" /> {#f-try-catch-109}

```typescript
<returned, thrown > (promise: Promise<returned>, predicates ?: readonly[TypePredicate<thrown>, ...TypePredicate < thrown > []] | undefined): Promise < returned | (IsUnknown<thrown> extends true ? Error : thrown)>
  <returned, thrown > (fn: () => returned, predicates ?: readonly[TypePredicate<thrown>, ...TypePredicate < thrown > []] | undefined): AwaitedUnion < returned, IsUnknown<thrown> extends true ? Error : thrown >
    <returned, thrown > (fnOrPromise: Promise<any> | (() => returned), predicates ?: readonly[TypePredicate<thrown>, ...TypePredicate < thrown > []] =[
      is as Bool.TypePredicate<thrown>,
    ]): any
```

**Parameters:**

- `predicates` - Type predicates to filter which errors to catch (defaults to all Error instances)

**Returns:** The result if successful, or the caught error

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
  [isNetworkError]
) // Response | NetworkError
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `TryCatchDefaultPredicateTypes`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L35" /> {#t-try-catch-default-predicate-types-35}

```typescript
type TryCatchDefaultPredicateTypes = Error
```

Default error types caught by try/catch functions when no predicates are specified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryCatchify`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L63" /> {#f-try-catchify-63}

```typescript
<fn extends Fn.AnyAny, thrown > (fn: fn, predicates ?: readonly[TypePredicate<thrown>, ...TypePredicate < thrown > []] =[is as Bool.TypePredicate<thrown>]): (...args: Parameters<fn>) => AwaitedUnion<ReturnType<fn>, IsUnknown<thrown> extends true ? Error : thrown>
```

**Parameters:**

- `fn` - The function to transform
- `predicates` - Type predicates to filter which errors to catch (defaults to all Error instances)

**Returns:** A new function that returns results or errors instead of throwing

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryCatchIgnore`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L167" /> {#f-try-catch-ignore-167}

```typescript
<$Return>(fn: () => $Return): $Return
```

**Parameters:**

- `fn` - The function to execute

**Returns:** The result of the function if successful, undefined otherwise

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrRethrow`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L406" /> {#f-try-or-rethrow-406}

```typescript
<$Return>(fn: () => $Return, wrapper: string | WrapOptions | ((cause: Error) => Error)): $Return extends Promise<any> ? $Return : $Return
```

**Parameters:**

- `fn` - The function to execute
- `wrapper` - Either a string message, options object, or a function that wraps the error

**Returns:** The result of the function if successful

**Throws:**

- The wrapped error if the function throws

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
  'Failed to fetch data'
)

// With options
// [!code word:tryOrRethrow:1]
const user = await Err.tryOrRethrow(
  () => fetchUser(userId),
  { message: 'Failed to fetch user', context: { userId } }
)

// With wrapper function
// [!code word:tryOrRethrow:1]
const result = await Err.tryOrRethrow(
  riskyOperation,
  wrapWith('Operation failed')
)

// Custom error wrapper
// [!code word:tryOrRethrow:1]
const config = await Err.tryOrRethrow(
  loadConfig,
  (cause) => new ConfigError('Failed to load config', { cause })
)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryAllOrRethrow`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L447" /> {#f-try-all-or-rethrow-447}

```typescript
<$Fns extends readonly [() => any, ...Array<() => any>]>(fns: $Fns, wrapper: string | WrapOptions | ((cause: Error) => Error)): Promise<{ [K in keyof $Fns]: Awaited<ReturnType<$Fns[K]>>; }>
```

**Parameters:**

- `fns` - Array of functions to execute
- `wrapper` - Either a string message, options object, or a function that wraps the error

**Returns:** Array of results if all succeed

**Throws:**

- AggregateError with wrapped individual errors if any fail

Try multiple functions and wrap any errors with a higher-level message. If any function throws, all errors are collected into an AggregateError.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:tryAllOrRethrow:1]
const [users, posts] = await Err.tryAllOrRethrow(
  [fetchUsers, fetchPosts],
  'Failed to load data'
)

// With context
// [!code word:tryAllOrRethrow:1]
const [config, schema, data] = await Err.tryAllOrRethrow(
  [loadConfig, loadSchema, loadData],
  { message: 'Failed to initialize', context: { env: 'production' } }
)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOr`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L212" /> {#f-try-or-212}

```typescript
<success, fallback > (fn: () => success, fallback: LazyMaybe<fallback>): TryOrReturn<success, fallback>
```

**Parameters:**

- `fn` - The function to execute
- `fallback` - The fallback value or function (must be sync if fn is sync)

**Returns:** The result of the function if successful, or the fallback value if it throws

Try to execute a function and return a fallback value if it throws.

**Type constraints:**

- If `fn` is synchronous, `fallback` must also be synchronous
- If `fn` is asynchronous, `fallback` can be either sync or async
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
  { error: 'Invalid JSON' }
)

// Async function with sync fallback
// [!code word:tryOr:1]
const config = await Err.tryOr(
  async () => loadConfig(),
  () => getDefaultConfig()
)

// Async function with async fallback
// [!code word:tryOr:1]
const data = await Err.tryOr(
  async () => fetchFromPrimary(),
  async () => fetchFromSecondary()
)

// This would be a TYPE ERROR:
// const bad = Err.tryOr(
//   () => 42,                    // sync
//   async () => 'fallback'       // async - not allowed!
// )
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrAsync`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L248" /> {#f-try-or-async-248}

```typescript
<success, fallback > (fn: () => success, fallback: LazyMaybe<fallback>): Promise<Awaited<success> | Awaited<fallback>>
```

**Parameters:**

- `fn` - The function to execute (sync or async)
- `fallback` - The fallback value or function (sync or async)

**Returns:** Always returns a Promise of the result or fallback

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
  async () => fetchDefaultConfig()
)

// Ensures consistent Promise return
// [!code word:tryOrAsync:1]
const result = await Err.tryOrAsync(
  () => 42,
  () => 'fallback'
) // Always Promise<number | string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrAsyncOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L273" /> {#f-try-or-async-on-273}

```typescript
<success>(fn: () => success): <fallback>(fallback: LazyMaybe<fallback>) => Promise<Awaited<success> | Awaited<fallback>>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrAsyncWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L292" /> {#f-try-or-async-with-292}

```typescript
<fallback>(fallback: LazyMaybe<fallback>): <success>(fn: () => success) => Promise<Awaited<success> | Awaited<fallback>>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L312" /> {#f-try-or-on-312}

```typescript
<success>(fn: () => success): <fallback>(fallback: LazyMaybe<fallback>) => TryOrReturn<success, fallback>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryOrWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L334" /> {#f-try-or-with-334}

```typescript
<fallback>(fallback: LazyMaybe<fallback>): <success>(fn: () => success) => TryOrReturn<success, fallback>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `tryOrUndefined`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L351" /> {#c-try-or-undefined-351}

```typescript
<success>(fn: () => success) => TryOrReturn<success, undefined>
```

Try to execute a function and return undefined if it throws. Shorthand for `tryOrWith(undefined)`.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `tryOrNull`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/try.ts#L365" /> {#c-try-or-null-365}

```typescript
<success>(fn: () => success) => TryOrReturn<success, null>
```

Try to execute a function and return null if it throws. Shorthand for `tryOrWith(null)`.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/type.ts#L14" /> {#f-is-14}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - The value to check

**Returns:** True if the value is an Error instance

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isAggregateError`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/type.ts#L25" /> {#f-is-aggregate-error-25}

```typescript
(value: unknown): boolean
```

Check if a value is an AggregateError instance.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isAbortError`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/type.ts#L50" /> {#f-is-abort-error-50}

```typescript
(error: any): boolean
```

**Parameters:**

- `error` - The error to check

**Returns:** True if the error is an AbortError

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `ContextualError`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/contextual.ts#L6" /> {#intersection-contextual-error-6}

```typescript
type ContextualError<$Context extends Record<string, unknown> = Record<string, unknown>> = Error & {
  context: $Context
}
```

An error with additional contextual data.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Context`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/types.ts#L7" /> {#t-context-7}

```typescript
type Context = object
```

Context information that can be attached to errors. Must be an object to ensure it can be properly serialized and inspected.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `ErrorWithContext`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/types.ts#L15" /> {#i-error-with-context-15}

```typescript
interface ErrorWithContext extends Error {
  /**
   * Additional context information about the error.
   */
  context?: Context
}
```

:::warning DEPRECATED
Use ContextualError instead for better type safety.
:::

An error that includes additional context information.

## Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `throwNull`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/$$.ts#L41" /> {#f-throw-null-41}

```typescript
<V>(value: V, message ?: string | undefined): Exclude<V, null>
```

**Parameters:**

- `value` - The value to check
- `message` - Optional custom error message

**Returns:** The value if not null

**Throws:**

- Error if the value is null

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultThrowNullMessage`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/$$.ts#L52" /> {#c-default-throw-null-message-52}

```typescript
"Unexpected null value."
```

Default error message used by throwNull when no custom message is provided.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `guardNull`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/$$.ts#L69" /> {#f-guard-null-69}

```typescript
<fn extends Fn.AnyAny>(fn: fn, message ?: string | undefined): ReturnExclude<null, fn>
```

**Parameters:**

- `fn` - The function to wrap
- `message` - Optional custom error message when null is returned

**Returns:** A wrapped function that throws on null return values

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `createContextualError`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/contextual.ts#L33" /> {#f-create-contextual-error-33}

```typescript
<$Context extends Record<string, unknown>>(message: string, context: $Context): ContextualError<$Context>
```

**Parameters:**

- `message` - The error message
- `context` - Contextual data to attach to the error

**Returns:** An Error instance with the context attached

Create an error with contextual data about it.

The context object is attached to the error instance and the message property is made enumerable for better debugging experience.

**Examples:**

```typescript twoslash
// @noErrors
import { Err } from '@wollybeard/kit/err'
// ---cut---
// [!code word:createContextualError:1]
const error = Err.createContextualError('Failed to fetch user', {
  userId: '123',
  endpoint: '/api/users',
  statusCode: 404
})

// [!code word:log:1]
// [!code word:userId:1]
console.log(error.context.userId) // '123'
```

## Wrapping

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `WrapOptions`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/wrap.ts#L11" /> {#i-wrap-options-11}

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

Options for wrapping errors with additional context.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `wrap`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/wrap.ts#L51" /> {#f-wrap-51}

```typescript
(cause: unknown, messageOrOptions: string | WrapOptions): Error
```

**Parameters:**

- `cause` - The error to wrap (will be set as the cause)
- `messageOrOptions` - Either a string message or options with message and context

**Returns:** A new Error with the given message and the original error as cause

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
    context: { userId }
  })
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `wrapOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/wrap.ts#L83" /> {#c-wrap-on-83}

```typescript
(cause: unknown) => (messageOrOptions: string | WrapOptions) => Error
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `wrapWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/wrap.ts#L108" /> {#c-wrap-with-108}

```typescript
(messageOrOptions: string | WrapOptions) => (cause: unknown) => Error
```

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
  context: { operation: 'update' }
})
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `captureStackTrace`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L423" /> {#f-capture-stack-trace-423}

```typescript
(message?: string = 'Captured stack'): string
```

Capture the current stack trace at a specific point. Useful for adding trace information without throwing.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getCaller`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/err/stack.ts#L432" /> {#f-get-caller-432}

```typescript
(depth?: number = 1): StackFrame | undefined
```

Get the caller information from the current stack.
