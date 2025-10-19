# Fn

Function utilities for functional programming patterns.

Provides utilities for function composition, currying, partial application, piping, and common functional patterns like identity and constant functions. Includes function analysis tools and endomorphism utilities.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `constant`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/constant.ts#L4" /> {#f-constant-4}

```typescript
<value>(value: value): () => value
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `noop`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L183" /> {#f-noop-183}

```typescript
(): void
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `$identityPartial`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L188" /> {#f-$identity-partial-188}

```typescript
<value>(value: PartialDeep<value>): value
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `identity`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/identity.ts#L4" /> {#f-identity-4}

```typescript
(value: $value): $value
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `identity`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/identity.ts#L9" /> {#t-identity-9}

```typescript
type identity<$Value = any> = <$value extends $Value>(value: $value) => $value
```

## Composition

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L26" /> {#f-pipe-26}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `bind`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L160" /> {#f-bind-160}

```typescript
<fn extends AnyAny>(fn: AnyAnyParametersMin1 extends fn ? fn : { Error: "Given function must have at least one parameter"; }, arg: Parameters < fn > [0]): bind<fn>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `bind`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L175" /> {#t-bind-175}

```typescript
type bind<$Fn extends AnyAnyParametersMin1> = $Fn extends
  (...args: [any, ...infer __args_tail__]) => infer __return__
  ? (...args: __args_tail__) => __return__
  : never
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `applySecond`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L199" /> {#f-apply-second-199}

```typescript
<fn extends (...args: any[]) => (arg: any) => any, arg > (fn: fn, arg: arg): applySecond<fn, arg>
```

Apply the second parameter of a curried function. For a function (a) = (b) = c and a value b, returns (a) = c Useful for creating service interfaces from curried operations.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `applySecond`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L214" /> {#t-apply-second-214}

```typescript
type applySecond<$Fn, $Arg> = $Fn extends
  (...args: infer __args__) => (arg: $Arg) => infer __return__
  ? (...args: __args__) => __return__
  : never
```

Apply the second parameter of a curried function. For a function (a) = (b) = c, returns (a) = c Useful for creating service interfaces from curried operations.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `curry`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/curry.ts#L12" /> {#f-curry-12}

```typescript
<fn extends AnyAny>(fn: AnyAnyParametersMin1 extends fn ? fn : { Error: "Given function must have at least one parameter"; }): curry<fn>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `curry`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/curry.ts#L27" /> {#t-curry-27}

```typescript
type curry<fn extends AnyAny> = fn extends
  (...args: infer __args__) => infer __return__
  ? Curry__Signature<__args__, __return__>
  : never
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `uncurry`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/curry.ts#L66" /> {#f-uncurry-66}

```typescript
<fn extends AnyAny2Curried>(fn: fn): uncurry<fn>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `uncurry`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/curry.ts#L74" /> {#t-uncurry-74}

```typescript
type uncurry<$Fn extends AnyAny2Curried> = $Fn extends
  (...args: infer __arg1__) => (...args: infer __arg2__) => infer __return__
  ? (...args: [...__arg1__, ...__arg2__]) => __return__
  : never
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `flipCurried`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/curry.ts#L84" /> {#f-flip-curried-84}

```typescript
<fn extends AnyAny2Curried>(fn: fn): flipCurried<fn>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `flipCurried`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/curry.ts#L92" /> {#t-flip-curried-92}

```typescript
type flipCurried<$Fn extends AnyAny2Curried> = $Fn extends
  (...args: infer __args1__) => (...args: infer __args2__) => infer __return__
  ? (...args: __args2__) => (...args: __args1__) => __return__
  : never
```

## Endomorphisms

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `endo`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/endo.ts#L24" /> {#t-endo-24}

```typescript
type endo<$T = any> = ($value: $T) => $T
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `endo`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/endo.ts#L38" /> {#f-endo-38}

```typescript
(value: any): any
```

The identity endomorphism

- returns the value unchanged. This is both an endomorphism and the identity function.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
// [!code word:endo:1]
const result = Fn.endo(5) // returns 5
const obj = { a: 1 }
// [!code word:endo:1]
const same = Fn.endo(obj) // returns the same object reference
```

## Introspection

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Parameter`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/analyze.ts#L6" /> {#u-parameter-6}

```typescript
type Parameter = { type: 'name'; value: string } | {
  type: 'destructured'
  names: string[]
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `analyzeFunction`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/analyze.ts#L31" /> {#f-analyze-function-31}

```typescript
(fn: (...args: any[]) => unknown): { body: string; parameters: Parameter[]; }
```

**Parameters:**

- `fn` - The function to analyze

**Returns:** An object containing the function's cleaned body and parameters

**Throws:**

- Error If the function cannot be parsed or has invalid structure

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isUnary`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/analyze.ts#L110" /> {#f-is-unary-110}

```typescript
(fn: (...args: any[]) => unknown): boolean
```

**Parameters:**

- `fn` - The function to check

**Returns:** True if the function has exactly one parameter, false otherwise

Check if a function is unary (has exactly one parameter).

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
const unary = (x: number) => x * 2
const binary = (a: number, b: number) => a + b
const nullary = () => 42

// [!code word:isUnary:1]
Fn.isUnary(unary) // true
// [!code word:isUnary:1]
Fn.isUnary(binary) // false
// [!code word:isUnary:1]
Fn.isUnary(nullary) // false
```

## Partial Application

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `_`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L15" /> {#c-_-15}

```typescript
typeof _
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `_`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L20" /> {#t-_-20}

```typescript
type _ = typeof _
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isHole`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L27" /> {#f-is-hole-27}

```typescript
(value: unknown): boolean
```

Type guard to check if a value is a hole.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `partial`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L55" /> {#f-partial-55}

```typescript
<$Fn extends Fn.AnyAny, $Args extends readonly unknown[] > (fn: $Fn, ...args ?: $Args): any
```

**Parameters:**

- `fn` - The function to partially apply
- `args` - Arguments with holes (_) for deferred parameters

**Returns:** A new function accepting the remaining arguments, or the result if all arguments are provided

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `apply`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L97" /> {#c-apply-97}

```typescript
;(<$Fn extends Fn.AnyAny, const $Args extends readonly unknown[]>(
  fn: $Fn,
  ...args: $Args
) => any)
```

Type-safe partial application with automatic type inference. This is an alias for `partial` with a more explicit name.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `defer`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L118" /> {#f-defer-118}

```typescript
<$Fn extends Fn.AnyAny>(fn: $Fn, ...args ?: Parameters<$Fn>): () => ReturnType<$Fn>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isPartialArg`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/partial/runtime.ts#L131" /> {#f-is-partial-arg-131}

```typescript
(_value: unknown): boolean
```

Check if a value is potentially a partially applicable argument (either a hole or a regular value).

## Type Guards

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L33" /> {#c-is-33}

```typescript
TypeGuard<AnyAny>
```

## Type Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAny`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L8" /> {#t-any-any-8}

```typescript
type AnyAny = (...args: any[]) => any
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAnyParameters2`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L13" /> {#t-any-any-parameters2-13}

```typescript
type AnyAnyParameters2 = (arg1: any, arg2: any) => any
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAnyParametersMin1`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L18" /> {#t-any-any-parameters-min1-18}

```typescript
type AnyAnyParametersMin1 = (...args: [any, ...any[]]) => any
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAnyParametersMin2`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L23" /> {#t-any-any-parameters-min2-23}

```typescript
type AnyAnyParametersMin2 = (...args: [any, any, ...any[]]) => any
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAnyParametersMin3`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L28" /> {#t-any-any-parameters-min3-28}

```typescript
type AnyAnyParametersMin3 = (...args: [any, any, any, ...any[]]) => any
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAnyAsync`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L38" /> {#t-any-any-async-38}

```typescript
type AnyAnyAsync = (...args: any[]) => Prom.AnyAny
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `GuardedType`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L50" /> {#t-guarded-type-50}

```typescript
type GuardedType<$T> = $T extends (x: any) => x is infer __u__ ? __u__ : never
```

Extract the guarded type from a type guard function.

**Examples:**

```typescript twoslash
// @noErrors
import { Fn } from '@wollybeard/kit/fn'
// ---cut---
const isString = (x: any): x is string => typeof x === 'string'
type T = GuardedType<typeof isString> // string
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ReturnExtract`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L73" /> {#t-return-extract-73}

```typescript
type ReturnExtract<$Type, $Fn extends AnyAny> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (
    ...args: __args__
  ) => __return__ extends Prom.AnyAny
    ? Promise<Extract<Awaited<__return__>, $Type>>
    : Extract<__return__, $Type>
  : never
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ReturnReplace`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L85" /> {#t-return-replace-85}

```typescript
type ReturnReplace<$Fn extends AnyAny, $Type> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (...args: __args__) => $Type
  : never
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ReturnExclude`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L111" /> {#t-return-exclude-111}

```typescript
type ReturnExclude<$Type, $Fn extends AnyAny> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (
    ...args: __args__
  ) => __return__ extends Prom.AnyAny
    ? Promise<Exclude<Awaited<__return__>, $Type>>
    : Exclude<__return__, $Type>
  : never
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ReturnExcludeNull`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L123" /> {#t-return-exclude-null-123}

```typescript
type ReturnExcludeNull<$Fn extends AnyAny> = ReturnExclude<null, $Fn>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ReturnInclude`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/base.ts#L146" /> {#t-return-include-146}

```typescript
type ReturnInclude<$Type, $Fn extends AnyAny> = $Fn extends
  (...args: infer __args__) => infer __return__ ? (
    ...args: __args__
  ) => __return__ extends Prom.AnyAny ? Promise<$Type | Awaited<__return__>>
    : $Type | __return__
  : never
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAny2Curried`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/core/curry.ts#L7" /> {#t-any-any2curried-7}

```typescript
type AnyAny2Curried = (arg1: any) => (arg2: any) => any
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L28" /> {#f-pipe-28}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L30" /> {#f-pipe-30}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L32" /> {#f-pipe-32}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L34" /> {#f-pipe-34}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L36" /> {#f-pipe-36}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L38" /> {#f-pipe-38}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L40" /> {#f-pipe-40}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L42" /> {#f-pipe-42}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L44" /> {#f-pipe-44}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L46" /> {#f-pipe-46}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/fn/pipe.ts#L48" /> {#f-pipe-48}

```typescript
<value>(value: value): value
  <value, f1 extends (value: value) => any>(value: value, f1: f1): ReturnType < f1 >
    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any > (value: value, f1: f1, f2: f2): ReturnType < f2 >
      <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any > (value: value, f1: f1, f2: f2, f3: f3): ReturnType < f3 >
        <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4): ReturnType < f4 >
          <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5): ReturnType < f5 >
            <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6): ReturnType < f6 >
              <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7): ReturnType < f7 >
                <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8): ReturnType < f8 >
                  <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9): ReturnType < f9 >
                    <value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any, f5 extends (value: ReturnType<f4>) => any, f6 extends (value: ReturnType<f5>) => any, f7 extends (value: ReturnType<f6>) => any, f8 extends (value: ReturnType<f7>) => any, f9 extends (value: ReturnType<f8>) => any, f10 extends (value: ReturnType<f9>) => any > (value: value, f1: f1, f2: f2, f3: f3, f4: f4, f5: f5, f6: f6, f7: f7, f8: f8, f9: f9, f10: f10): ReturnType<f10>
                      (value: any, ...fns ?: (value: any) => any)[]): any
```

**Parameters:**

- `value` - The initial value to pipe through the functions

**Returns:** The final transformed value
