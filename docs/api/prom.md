# Prom

Promise utilities for asynchronous operations.

Provides utilities for working with Promises including deferred promise
creation, promise combinators, and async control flow patterns.

## Import

```typescript
import { Prom } from '@wollybeard/kit/prom'
```

## Functions

### createDeferred <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/prom/deferred.ts#L82)</sub>

```typescript
;(<$T>(options?: { strict?: boolean } | undefined) => Deferred<$T>)
```

### maybeAsync <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/prom/prom.ts#L137)</sub>

Handle a function that might return a promise or a regular value,
with unified handlers for both sync and async cases.

```typescript
export function maybeAsync<T, R = T, E = unknown>(
  fn: () => T,
  handlers: MaybeAsyncHandlers<T extends Promise<infer U> ? U : T, R, E> = {},
): T extends Promise<infer U> ? Promise<R | E | U> : T | R | E
```

**Examples:**

```ts twoslash
const result = maybeAsync(
  () => fetchData(),
  {
    then: (data) => processData(data),
    catch: (error) => ({ success: false, error }),
  },
)

// Just error handling
const safeResult = maybeAsync(
  () => riskyOperation(),
  {
    catch: (error, isAsync) => {
      console.error(`Failed ${isAsync ? 'async' : 'sync'}:`, error)
      return null
    },
  },
)

// Just success handling
const transformed = maybeAsync(
  () => getValue(),
  {
    then: (value) => value.toUpperCase(),
  },
)
```

### isShape <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/prom/prom.ts#L51)</sub>

```typescript
(value: unknown) => value is AnyAny
```

## Types

### Deferred <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/prom/deferred.ts#L28)</sub>

A deferred promise with exposed resolve and reject functions.

```typescript
export interface Deferred<$Value> {
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

**Examples:**

```ts twoslash
// Later resolve it
deferred.resolve(42)

// Or reject it
deferred.reject(new Error('failed'))

// Use the promise
await deferred.promise // 42
```

```ts twoslash
const deferred = createDeferred<number>()
console.log(deferred.isResolved) // false
deferred.resolve(42)
console.log(deferred.isResolved) // true
console.log(deferred.isSettled) // true
```

### Any <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/prom/prom.ts#L7)</sub>

Type representing a Promise of unknown type.
Useful for generic promise handling where the resolved type is not important.

```typescript
export type Any = Promise<unknown>
```

### AnyAny <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/prom/prom.ts#L13)</sub>

Type representing a Promise of any type.
Less type-safe than {@link Any}, use with caution.

```typescript
export type AnyAny = Promise<any>
```

### Maybe <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/prom/prom.ts#L29)</sub>

Type representing a value that may or may not be wrapped in a Promise.

```typescript
export type Maybe<$Type> = $Type | Promise<$Type>
```

**Examples:**

```ts twoslash
function process<T>(value: Maybe<T>): Promise<T> {
  return Promise.resolve(value)
}

process(42) // accepts number
process(Promise.resolve(42)) // accepts Promise<number>
```

### AwaitedUnion <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/prom/prom.ts#L76)</sub>

Type that adds an additional type to a potentially promised union.
If the input is a Promise, the additional type is added to the promised value.
If the input is not a Promise, creates a union with the additional type.

```typescript
export type AwaitedUnion<$MaybePromise, $Additional> = $MaybePromise extends
  Promise<infer __promised__> ? Promise<Awaited<__promised__ | $Additional>>
  : $MaybePromise | $Additional
```

**Examples:**

```ts twoslash
type Result1 = AwaitedUnion<Promise<string>, number> // Promise<string | number>

// with non-promise input
type Result2 = AwaitedUnion<string, number> // string | number
```

### MaybeAsyncHandlers <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/prom/prom.ts#L84)</sub>

Options for handling values that might be promises.

```typescript
export interface MaybeAsyncHandlers<T, R = T, E = unknown> {
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
