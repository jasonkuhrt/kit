# Prom

Promise utilities for asynchronous operations.

Provides utilities for working with Promises including deferred promise creation, promise combinators, and async control flow patterns.

## Import

::: code-group

```typescript [Namespace]
import { Prom } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Prom from '@wollybeard/kit/prom'
```

:::

## Deferred

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Deferred`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/prom/deferred.ts#L30" /> {#i-deferred-30}

```typescript
interface Deferred<$Value> {
  /**
   * The promise that will be resolved or rejected.
   */
  promise: Promise<$Value>
  /**
   * Resolve the promise with a value.
   */
  resolve: (value: $Value) => void
  /**
   * Reject the promise with an error.
   */
  reject: (error: unknown) => void
  /**
   * Whether the promise has been resolved.
   */
  readonly isResolved: boolean
  /**
   * Whether the promise has been rejected.
   */
  readonly isRejected: boolean
  /**
   * Whether the promise has been settled (resolved or rejected).
   */
  readonly isSettled: boolean
}
```

A deferred promise with exposed resolve and reject functions.

**Examples:**

```typescript twoslash
// @noErrors
import { Prom } from '@wollybeard/kit/prom'
// ---cut---
const deferred = createDeferred<number>()

// Later resolve it
// [!code word:resolve:1]
deferred.resolve(42)

// Or reject it
// [!code word:reject:1]
deferred.reject(new Error('failed'))

// Use the promise
// [!code word:promise:1]
await deferred.promise  // 42
```

```typescript twoslash
// @noErrors
import { Prom } from '@wollybeard/kit/prom'
// ---cut---
// Check resolution state
const deferred = createDeferred<number>()
// [!code word:log:1]
// [!code word:isResolved:1]
console.log(deferred.isResolved)  // false
// [!code word:resolve:1]
deferred.resolve(42)
// [!code word:log:1]
// [!code word:isResolved:1]
console.log(deferred.isResolved)  // true
// [!code word:log:1]
// [!code word:isSettled:1]
console.log(deferred.isSettled)   // true
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `createDeferred`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/prom/deferred.ts#L86" /> {#f-create-deferred-86}

```typescript
<$T>(options ?: { strict?: boolean; } | undefined): Deferred<$T>
```

**Parameters:**

- `options` - Configuration options

**Returns:** A deferred promise object

Create a deferred promise with exposed resolve and reject functions.

**Examples:**

```typescript twoslash
// @noErrors
import { Prom } from '@wollybeard/kit/prom'
// ---cut---
const deferred = createDeferred<number>()

setTimeout(() => {
// [!code word:resolve:1]
  deferred.resolve(42)
}, 1000)

// [!code word:promise:1]
const result = await deferred.promise  // 42
```

```typescript twoslash
// @noErrors
import { Prom } from '@wollybeard/kit/prom'
// ---cut---
// Strict mode prevents multiple resolutions
const deferred = createDeferred<number>({ strict: true })

// [!code word:resolve:1]
deferred.resolve(1)
// [!code word:resolve:1]
deferred.resolve(2)  // Throws error
```

## Type Guards

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isShape`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/prom/prom.ts#L59" /> {#f-is-shape-59}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - The value to test.

**Returns:** True if the value has Promise-like shape.

Check if a value has the shape of a Promise. Tests for the presence of then, catch, and finally methods.

**Examples:**

```typescript twoslash
// @noErrors
import { Prom } from '@wollybeard/kit/prom'
// ---cut---
// with a promise
// [!code word:isShape:1]
// [!code word:resolve:1]
Prom.isShape(Promise.resolve(42)) // true

// with a thenable object
// [!code word:isShape:1]
Prom.isShape({ then: () => { }, catch: () => { }, finally: () => { } }) // true

// with non-promise values
// [!code word:isShape:1]
Prom.isShape(42) // false
// [!code word:isShape:1]
Prom.isShape({}) // false
```

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Any`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/prom/prom.ts#L9" /> {#t-any-9}

```typescript
type Any = Promise<unknown>
```

Type representing a Promise of unknown type. Useful for generic promise handling where the resolved type is not important.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAny`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/prom/prom.ts#L17" /> {#t-any-any-17}

```typescript
type AnyAny = Promise<any>
```

Type representing a Promise of any type. Less type-safe than Any, use with caution.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Maybe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/prom/prom.ts#L35" /> {#u-maybe-35}

```typescript
type Maybe<$Type> = $Type | Promise<$Type>
```

Type representing a value that may or may not be wrapped in a Promise.

**Examples:**

```typescript twoslash
// @noErrors
import { Prom } from '@wollybeard/kit/prom'
// ---cut---
// function that accepts sync or async values
function process<T>(value: Maybe<T>): Promise<T> {
// [!code word:resolve:1]
  return Promise.resolve(value)
}

process(42) // accepts number
// [!code word:resolve:1]
process(Promise.resolve(42)) // accepts Promise<number>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AwaitedUnion`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/prom/prom.ts#L86" /> {#t-awaited-union-86}

```typescript
type AwaitedUnion<$MaybePromise, $Additional> =
  $MaybePromise extends Promise<infer __promised__>
  ? Promise<Awaited<__promised__ | $Additional>>
  : $MaybePromise | $Additional
```

Type that adds an additional type to a potentially promised union. If the input is a Promise, the additional type is added to the promised value. If the input is not a Promise, creates a union with the additional type.

**Examples:**

```typescript twoslash
// @noErrors
import { Prom } from '@wollybeard/kit/prom'
// ---cut---
// with promise input
type Result1 = AwaitedUnion<Promise<string>, number> // Promise<string | number>

// with non-promise input
type Result2 = AwaitedUnion<string, number> // string | number
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Envelope`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/prom/prom.ts#L96" /> {#t-envelope-96}

```typescript
type Envelope<T = unknown> = {
  fail: boolean
  value: T
  async: boolean
}
```

Envelope containing execution metadata.

## Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `maybeAsync`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/prom/prom.ts#L231" /> {#f-maybe-async-231}

```typescript
<T, R = T, E = unknown > (fn: () => T, handlers ?: MaybeAsyncHandlers<T extends Promise<infer U> ? U : T, R, E> = {}): T extends Promise<infer U> ? Promise<R | E | U> : T | R | E
```

**Parameters:**

- `fn` - Function to execute that might return a promise
- `handlers` - Object with then/catch handlers

**Returns:** The result, potentially wrapped in a Promise

Handle a function that might return a promise or a regular value, with unified handlers for both sync and async cases.

Implemented using maybeAsyncEnvelope internally.

**Examples:**

```typescript twoslash
// @noErrors
import { Prom } from '@wollybeard/kit/prom'
// ---cut---
// Basic usage
// [!code word:maybeAsync:1]
const result = Prom.maybeAsync(
  () => fetchData(),
  {
    then: (data) => processData(data),
    catch: (error) => ({ success: false, error })
  }
)

// Just error handling
// [!code word:maybeAsync:1]
const safeResult = Prom.maybeAsync(
  () => riskyOperation(),
  {
    catch: (error, isAsync) => {
// [!code word:error:1]
      console.error(`Failed ${isAsync ? 'async' : 'sync'}:`, error)
      return null
    }
  }
)

// Just success handling
// [!code word:maybeAsync:1]
const transformed = Prom.maybeAsync(
  () => getValue(),
  {
// [!code word:toUpperCase:1]
    then: (value) => value.toUpperCase()
  }
)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `maybeAsyncEnvelope`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/prom/prom.ts#L147" /> {#f-maybe-async-envelope-147}

```typescript
<$return>(fn: () => $return): $return extends Promise<infer __awaited__> ? Promise<Envelope<__awaited__>> : Envelope<$return>
```

**Parameters:**

- `fn` - Function to execute

**Returns:** Envelope (sync) or Promise of envelope (async) with execution metadata

Execute a function and return an envelope with metadata about the execution.

Returns metadata indicating:

- **channel**: Whether the function succeeded (`'succeed'`) or failed (`'fail'`)
- **async**: Whether execution was asynchronous (promise) or synchronous
- **value/error**: The result value or thrown/rejected error

Never throws or rejects

- all errors are captured in the envelope. Preserves sync/async distinction in both return type and metadata.

Useful when you need to:

- Distinguish `Promise.resolve(Error)` from `Promise.reject(Error)`
- Know whether execution was sync or async
- Handle errors without try/catch blocks

**Examples:**

```typescript twoslash
// @noErrors
import { Prom } from '@wollybeard/kit/prom'
// ---cut---
// Sync success
// [!code word:maybeAsyncEnvelope:1]
const result = Prom.maybeAsyncEnvelope(() => 42)
// { channel: 'succeed', value: 42, async: false }

// Sync failure
// [!code word:maybeAsyncEnvelope:1]
const result = Prom.maybeAsyncEnvelope(() => { throw new Error('fail') })
// { channel: 'fail', error: Error('fail'), async: false }

// Async success
// [!code word:maybeAsyncEnvelope:1]
// [!code word:resolve:1]
const result = await Prom.maybeAsyncEnvelope(() => Promise.resolve('ok'))
// { channel: 'succeed', value: 'ok', async: true }

// Async failure
// [!code word:maybeAsyncEnvelope:1]
// [!code word:reject:1]
const result = await Prom.maybeAsyncEnvelope(() => Promise.reject('error'))
// { channel: 'fail', error: 'error', async: true }

// Promise resolving to Error (not a rejection!)
// [!code word:maybeAsyncEnvelope:1]
// [!code word:resolve:1]
const result = await Prom.maybeAsyncEnvelope(() => Promise.resolve(new Error('value')))
// { channel: 'succeed', value: Error('value'), async: true }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `MaybeAsyncHandlers`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/prom/prom.ts#L174" /> {#i-maybe-async-handlers-174}

```typescript
interface MaybeAsyncHandlers<T, R = T, E = unknown> {
  /**
   * Handler for successful values (sync or async).
   */
  then?: (value: T) => R

  /**
   * Handler for errors (sync or async).
   * @param error - The caught error
   * @param isAsync - Whether the error occurred asynchronously
   */
  catch?: (error: unknown, isAsync: boolean) => E
}
```

Options for handling values that might be promises.
