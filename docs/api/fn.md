# Fn

Function utilities for functional programming patterns.

Provides utilities for function composition, currying, partial application,
piping, and common functional patterns like identity and constant functions.
Includes function analysis tools and endomorphism utilities.

## Import

```typescript
import { Fn } from '@wollybeard/kit/fn'
```

## Functions

### analyzeFunction <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/analyze.ts#L23)</sub>

```typescript
(fn: (...args: any[]) => unknown) => { body: string; parameters: Parameter[]; }
```

### bind <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L126)</sub>

```typescript
;(<fn extends AnyAny>(
  fn: AnyAnyParametersMin1 extends fn ? fn
    : { Error: 'Given function must have at least one parameter' },
  arg: Parameters<fn>[0],
) => bind<fn>)
```

### noop <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L143)</sub>

```typescript
() => void
```

### $identityPartial <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L145)</sub>

```typescript
;(<value>(value: PartialDeep<value>) => value)
```

### applySecond <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L154)</sub>

```typescript
;(<fn extends (...args: any[]) => (arg: any) => any, arg>(fn: fn, arg: arg) =>
  applySecond<fn, arg>)
```

### constant <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/constant.ts#L1)</sub>

```typescript
;(<value>(value: value) => () => value)
```

### curry <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/curry.ts#L6)</sub>

```typescript
;(<fn extends AnyAny>(
  fn: AnyAnyParametersMin1 extends fn ? fn
    : { Error: 'Given function must have at least one parameter' },
) => curry<fn>)
```

### uncurry <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/curry.ts#L54)</sub>

```typescript
;(<fn extends AnyAny2Curried>(fn: fn) => uncurry<fn>)
```

### flipCurried <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/curry.ts#L66)</sub>

```typescript
;(<fn extends AnyAny2Curried>(fn: fn) => flipCurried<fn>)
```

### identity <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/identity.ts#L1)</sub>

```typescript
identity<any>
```

### isHole <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/partial/runtime.ts#L20)</sub>

```typescript
(value: unknown) => value is typeof _
```

### partial <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/partial/runtime.ts#L47)</sub>

```typescript
;(<$Fn extends Fn.AnyAny, const $Args extends readonly unknown[]>(
  fn: $Fn,
  ...args: $Args
) => any)
```

### defer <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/partial/runtime.ts#L108)</sub>

```typescript
;(<$Fn extends Fn.AnyAny>(fn: $Fn, ...args: Parameters<$Fn>) => () =>
  ReturnType<$Fn>)
```

### isPartialArg <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/partial/runtime.ts#L119)</sub>

```typescript
(_value: unknown) => _value is unknown
```

### pipe <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/pipe.ts#L25)</sub>

Pipe a value through a series of unary functions.

```typescript
export function pipe<value>(value: value): value
```

**Examples:**

```typescript twoslash
const double = (x: number) => x * 2
const toString = (x: number) => x.toString()

pipe(5, add1, double) // 12
pipe(5, add1, double, toString) // "12"
```

## Constants

### is <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L15)</sub>

```typescript
TypeGuard<AnyAny>
```

### _ <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/partial/runtime.ts#L14)</sub>

```typescript
typeof _
```

### apply <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/partial/runtime.ts#L88)</sub>

```typescript
;(<$Fn extends Fn.AnyAny, const $Args extends readonly unknown[]>(
  fn: $Fn,
  ...args: $Args
) => any)
```

## Types

### Parameter <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/analyze.ts#L3)</sub>

```typescript
export type Parameter = { type: 'name'; value: string } | {
  type: 'destructured'
  names: string[]
}
```

### AnyAny <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L5)</sub>

```typescript
export type AnyAny = (...args: any[]) => any
```

### AnyAnyParameters2 <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L7)</sub>

```typescript
export type AnyAnyParameters2 = (arg1: any, arg2: any) => any
```

### AnyAnyParametersMin1 <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L9)</sub>

```typescript
export type AnyAnyParametersMin1 = (...args: [any, ...any[]]) => any
```

### AnyAnyParametersMin2 <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L11)</sub>

```typescript
export type AnyAnyParametersMin2 = (...args: [any, any, ...any[]]) => any
```

### AnyAnyParametersMin3 <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L13)</sub>

```typescript
export type AnyAnyParametersMin3 = (...args: [any, any, any, ...any[]]) => any
```

### AnyAnyAsync <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L17)</sub>

```typescript
export type AnyAnyAsync = (...args: any[]) => Prom.AnyAny
```

### GuardedType <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L28)</sub>

Extract the guarded type from a type guard function.

```typescript
export type GuardedType<$T> = $T extends (x: any) => x is infer __u__ ? __u__
  : never
```

**Examples:**

```ts twoslash
type T = GuardedType<typeof isString> // string
```

### ReturnExtract <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L50)</sub>

Modify function such that it only returns the given type.

Automatically handles async functions by unwrapping the Promise, extracting the type,
and rewrapping in a Promise. For sync functions, the type is extracted directly.

Assumes that the given type is among the possible return types of the function.

```typescript
export type ReturnExtract<$Type, $Fn extends AnyAny> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (
    ...args: __args__
  ) => __return__ extends Prom.AnyAny
    ? Promise<Extract<Awaited<__return__>, $Type>>
    : Extract<__return__, $Type>
  : never
```

**Examples:**

```ts twoslash
type Fn1 = (x: number) => string | number
type Result1 = ReturnExtract<string, Fn1> // (x: number) => string

// Async function - automatically unwraps and rewraps Promise
type Fn2 = (x: number) => Promise<string | number>
type Result2 = ReturnExtract<string, Fn2> // (x: number) => Promise<string>
```

### ReturnReplace <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L59)</sub>

```typescript
export type ReturnReplace<$Fn extends AnyAny, $Type> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (...args: __args__) => $Type
  : never
```

### ReturnExclude <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L84)</sub>

Modify function such that it does not return the given type.

Automatically handles async functions by unwrapping the Promise, excluding the type,
and rewrapping in a Promise. For sync functions, the type is excluded directly.

If function does not return the given the type, then this is effectively an identity function.

```typescript
export type ReturnExclude<$Type, $Fn extends AnyAny> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (
    ...args: __args__
  ) => __return__ extends Prom.AnyAny
    ? Promise<Exclude<Awaited<__return__>, $Type>>
    : Exclude<__return__, $Type>
  : never
```

**Examples:**

```ts twoslash
type Fn1 = (x: number) => string | null
type Result1 = ReturnExclude<null, Fn1> // (x: number) => string

// Async function - automatically unwraps and rewraps Promise
type Fn2 = (x: number) => Promise<string | null>
type Result2 = ReturnExclude<null, Fn2> // (x: number) => Promise<string>
```

### ReturnExcludeNull <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L93)</sub>

```typescript
export type ReturnExcludeNull<$Fn extends AnyAny> = ReturnExclude<null, $Fn>
```

### ReturnInclude <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/base.ts#L115)</sub>

Modify function such that it can return an additional type along with its original return types.

Automatically handles async functions by unwrapping the Promise, adding the type to the union,
and rewrapping in a Promise. For sync functions, the type is added directly to the return type union.

This is useful for functions that may return early with a specific type (like void).

```typescript
export type ReturnInclude<$Type, $Fn extends AnyAny> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (
    ...args: __args__
  ) => __return__ extends Prom.AnyAny ? Promise<$Type | Awaited<__return__>>
    : $Type | __return__
  : never
```

**Examples:**

```ts twoslash
type Fn1 = (x: number) => string
type Result1 = ReturnInclude<null, Fn1> // (x: number) => string | null

// Async function - automatically unwraps and rewraps Promise
type Fn2 = (x: number) => Promise<string>
type Result2 = ReturnInclude<null, Fn2> // (x: number) => Promise<string | null>
```

### AnyAny2Curried <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/curry.ts#L4)</sub>

```typescript
export type AnyAny2Curried = (arg1: any) => (arg2: any) => any
```

### endo <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/fn/endo.ts#L23)</sub>

Endomorphism - a function from a type to itself.

Unlike {@link identity}, this doesn't preserve the exact value,
just ensures the output type matches the input type.

```typescript
export type endo<$T = any> = ($value: $T) => $T
```

**Examples:**

```typescript twoslash
type BuilderOp = Fn.endo<StringBuilder>
const addText: BuilderOp = sb => sb.append('text')

// Transformations
type StringTransform = Fn.endo<string>
const uppercase: StringTransform = s => s.toUpperCase()
const trim: StringTransform = s => s.trim()

// Chainable operations
type ChainOp = Fn.endo<ChainableAPI>
const configure: ChainOp = api => api.setOption('key', 'value')
```
