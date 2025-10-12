# Fn

Function utilities for functional programming patterns. Provides utilities for function composition, currying, partial application, piping, and common functional patterns like identity and constant functions. Includes function analysis tools and endomorphism utilities.

## Import

::: code-group

```typescript [Namespace]
import { Fn } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Fn from '@wollybeard/kit/fn'
```

:::

## Basic Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `noop`

```typescript
() => void
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L183" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `$identityPartial`

```typescript
;(<value>(value: PartialDeep<value>) => value)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L188" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `constant`

```typescript
;(<value>(value: value) => () => value)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/constant.ts#L4" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `identity`

```typescript
identity<any>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/identity.ts#L4" />

## Composition

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`

```typescript
function pipe<value>(value: value): value
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L26" />

Pipe a value through a series of unary functions.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
const add1 = (x: number) => x + 1
const double = (x: number) => x * 2
// [!code word:toString:1]
const toString = (x: number) => x.toString()

// [!code word:pipe:1]
Fn.pipe(5, add1, double) // 12
// [!code word:pipe:1]
Fn.pipe(5, add1, double, toString) // "12"
```

## Currying & Binding

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `bind`

```typescript
;(<fn extends AnyAny>(
  fn: AnyAnyParametersMin1 extends fn ? fn
    : { Error: 'Given function must have at least one parameter' },
  arg: Parameters<fn>[0],
) => bind<fn>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L160" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `applySecond`

```typescript
;(<fn extends (...args: any[]) => (arg: any) => any, arg>(fn: fn, arg: arg) =>
  applySecond<fn, arg>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L199" />

Apply the second parameter of a curried function. For a function (a) = (b) = c and a value b, returns (a) = c Useful for creating service interfaces from curried operations.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `curry`

```typescript
;(<fn extends AnyAny>(
  fn: AnyAnyParametersMin1 extends fn ? fn
    : { Error: 'Given function must have at least one parameter' },
) => curry<fn>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/curry.ts#L12" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `uncurry`

```typescript
;(<fn extends AnyAny2Curried>(fn: fn) => uncurry<fn>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/curry.ts#L66" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `flipCurried`

```typescript
;(<fn extends AnyAny2Curried>(fn: fn) => flipCurried<fn>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/curry.ts#L84" />

## Endomorphisms

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `endo`

```typescript
type endo<$T = any> = ($value: $T) => $T
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/endo.ts#L24" />

Endomorphism

- a function from a type to itself.

Unlike identity, this doesn't preserve the exact value, just ensures the output type matches the input type.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
// Builder pattern
type BuilderOp = Fn.endo<StringBuilder>
// [!code word:append:1]
const addText: BuilderOp = sb => sb.append('text')

// Transformations
type StringTransform = Fn.endo<string>
// [!code word:toUpperCase:1]
const uppercase: StringTransform = s => s.toUpperCase()
// [!code word:trim:1]
const trim: StringTransform = s => s.trim()

// Chainable operations
type ChainOp = Fn.endo<ChainableAPI>
// [!code word:setOption:1]
const configure: ChainOp = api => api.setOption('key', 'value')
```

## Introspection

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Parameter`

```typescript
type Parameter = { type: 'name'; value: string } | {
  type: 'destructured'
  names: string[]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/analyze.ts#L6" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `analyzeFunction`

```typescript
(fn: (...args: any[]) => unknown) => { body: string; parameters: Parameter[]; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/analyze.ts#L31" />

Analyze a function to extract its parameter information and body.

Parses a function's string representation to extract:

- Parameter names (both regular and destructured parameters)
- Function body (both statement and expression forms, trimmed and dedented)

The returned body is already cleaned: leading/trailing whitespace removed and common indentation stripped away for clean display in its isolated form.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
const fn = (a, { b, c }) => a + b + c
// [!code word:analyzeFunction:1]
const info = Fn.analyzeFunction(fn)
// info.parameters: [{ type: 'name', value: 'a' }, { type: 'destructured', names: ['b', 'c'] }]
// info.body: "a + b + c" (already trimmed and dedented)
```

## Partial Application

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `_`

```typescript
typeof _
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L15" />

Symbol used to represent a hole in partial application. When used as an argument, indicates that the parameter should be deferred.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
const add = (a: number, b: number) => a + b
const addOne = partial(add, _, 1) // (a: number) => number
addOne(5) // 6
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isHole`

```typescript
(value: unknown) => value is typeof _
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L27" />

Type guard to check if a value is a hole.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `partial`

```typescript
;(<$Fn extends Fn.AnyAny, const $Args extends readonly unknown[]>(
  fn: $Fn,
  ...args: $Args
) => any)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L55" />

Create a partially applied function by providing some arguments upfront. Use the hole symbol (_) to defer parameters.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
// Basic usage
const add = (a: number, b: number) => a + b
// [!code word:partial:1]
const addOne = Fn.partial(add, _, 1)
addOne(5) // 6

// Multiple holes
const greet = (greeting: string, name: string, punctuation: string) =>
  `${greeting}, ${name}${punctuation}`
// [!code word:partial:1]
const casualGreet = Fn.partial(greet, 'Hey', _, '!')
casualGreet('Alice') // 'Hey, Alice!'

// All arguments provided - executes immediately
// [!code word:partial:1]
const result = Fn.partial(add, 1, 2) // 3
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `apply`

```typescript
;(<$Fn extends Fn.AnyAny, const $Args extends readonly unknown[]>(
  fn: $Fn,
  ...args: $Args
) => any)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L97" />

Type-safe partial application with automatic type inference. This is an alias for partial with a more explicit name.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
const multiply = (a: number, b: number, c: number) => a * b * c
// [!code word:apply:1]
const double = Fn.apply(multiply, 2, _, 1)
double(5) // 10
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `defer`

```typescript
;(<$Fn extends Fn.AnyAny>(fn: $Fn, ...args: Parameters<$Fn>) => () =>
  ReturnType<$Fn>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L118" />

Helper to create a deferred computation using partial application. Useful for creating thunks or delayed evaluations.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
const expensiveComputation = (a: number, b: number) => {
  // [!code word:log:1]
  console.log('Computing...')
  return a * b
}

// [!code word:defer:1]
const deferred = Fn.defer(expensiveComputation, 5, 10)
// Nothing logged yet

const result = deferred() // Logs: 'Computing...'
// result: 50
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isPartialArg`

```typescript
(_value: unknown) => _value is unknown
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L131" />

Check if a value is potentially a partially applicable argument (either a hole or a regular value).

## Type Guards

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `is`

```typescript
TypeGuard<AnyAny>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L33" />

## Type Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAny`

```typescript
type AnyAny = (...args: any[]) => any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L8" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAnyParameters2`

```typescript
type AnyAnyParameters2 = (arg1: any, arg2: any) => any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L13" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAnyParametersMin1`

```typescript
type AnyAnyParametersMin1 = (...args: [any, ...any[]]) => any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L18" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAnyParametersMin2`

```typescript
type AnyAnyParametersMin2 = (...args: [any, any, ...any[]]) => any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L23" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAnyParametersMin3`

```typescript
type AnyAnyParametersMin3 = (...args: [any, any, any, ...any[]]) => any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L28" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAnyAsync`

```typescript
type AnyAnyAsync = (...args: any[]) => Prom.AnyAny
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L38" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `GuardedType`

```typescript
type GuardedType<$T> = $T extends (x: any) => x is infer __u__ ? __u__ : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L50" />

Extract the guarded type from a type guard function.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
const isString = (x: any): x is string => typeof x === 'string'
type T = GuardedType<typeof isString> // string
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ReturnExtract`

```typescript
type ReturnExtract<$Type, $Fn extends AnyAny> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (
    ...args: __args__
  ) => __return__ extends Prom.AnyAny
    ? Promise<Extract<Awaited<__return__>, $Type>>
    : Extract<__return__, $Type>
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L73" />

Modify function such that it only returns the given type.

Automatically handles async functions by unwrapping the Promise, extracting the type, and rewrapping in a Promise. For sync functions, the type is extracted directly.

Assumes that the given type is among the possible return types of the function.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
// Sync function
type Fn1 = (x: number) => string | number
type Result1 = ReturnExtract<string, Fn1> // (x: number) => string

// Async function - automatically unwraps and rewraps Promise
type Fn2 = (x: number) => Promise<string | number>
type Result2 = ReturnExtract<string, Fn2> // (x: number) => Promise<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ReturnReplace`

```typescript
type ReturnReplace<$Fn extends AnyAny, $Type> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (...args: __args__) => $Type
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L85" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ReturnExclude`

```typescript
type ReturnExclude<$Type, $Fn extends AnyAny> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (
    ...args: __args__
  ) => __return__ extends Prom.AnyAny
    ? Promise<Exclude<Awaited<__return__>, $Type>>
    : Exclude<__return__, $Type>
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L111" />

Modify function such that it does not return the given type.

Automatically handles async functions by unwrapping the Promise, excluding the type, and rewrapping in a Promise. For sync functions, the type is excluded directly.

If function does not return the given the type, then this is effectively an identity function.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
// Sync function
type Fn1 = (x: number) => string | null
type Result1 = ReturnExclude<null, Fn1> // (x: number) => string

// Async function - automatically unwraps and rewraps Promise
type Fn2 = (x: number) => Promise<string | null>
type Result2 = ReturnExclude<null, Fn2> // (x: number) => Promise<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ReturnExcludeNull`

```typescript
type ReturnExcludeNull<$Fn extends AnyAny> = ReturnExclude<null, $Fn>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L123" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ReturnInclude`

```typescript
type ReturnInclude<$Type, $Fn extends AnyAny> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (
    ...args: __args__
  ) => __return__ extends Prom.AnyAny ? Promise<$Type | Awaited<__return__>>
    : $Type | __return__
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/base.ts#L146" />

Modify function such that it can return an additional type along with its original return types.

Automatically handles async functions by unwrapping the Promise, adding the type to the union, and rewrapping in a Promise. For sync functions, the type is added directly to the return type union.

This is useful for functions that may return early with a specific type (like void).

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
// Sync function
type Fn1 = (x: number) => string
type Result1 = ReturnInclude<null, Fn1> // (x: number) => string | null

// Async function - automatically unwraps and rewraps Promise
type Fn2 = (x: number) => Promise<string>
type Result2 = ReturnInclude<null, Fn2> // (x: number) => Promise<string | null>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAny2Curried`

```typescript
type AnyAny2Curried = (arg1: any) => (arg2: any) => any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/curry.ts#L7" />
