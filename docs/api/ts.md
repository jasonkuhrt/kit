# Ts

TypeScript type utilities and type-level programming helpers.

Provides comprehensive type-level utilities including type printing, static
errors, type guards, simplification utilities, exact type matching, and
type testing tools. Features conditional types, type transformations, and
type-level assertions for advanced TypeScript patterns.

## Import

```typescript
import { Ts } from '@wollybeard/kit/ts'
```

## Namespaces

- [**Kind**](/api/ts/kind) - Higher-kinded type utilities for TypeScript.

Provides type-level functions and utilities for simulating higher-kinded
types in TypeScript, enabling more advanced type-level programming patterns.

@module

- [**Test**](/api/ts/test)
- [**Union**](/api/ts/union) - Valid values for discriminant properties in tagged unions.
- [**Variance**](/api/ts/variance) - Phantom type helper that makes a type parameter covariant.

@remarks
Covariance allows subtypes to be assigned to supertypes (natural direction).
Example: `Phantom<Covariant<1>>` can be assigned to `Phantom<Covariant<number>>`.

Use this when you want narrower types to flow to wider types:

- Literal types → base types (`1` → `number`, `'hello'` → `string`)
- Subclasses → base classes
- More specific → more general

@example

```ts
interface Container<T> {
  readonly __type?: Covariant<T>
}

let narrow: Container<1> = {}
let wide: Container<number> = {}

wide = narrow // ✅ Allowed (1 extends number)
narrow = wide // ❌ Error (number does not extend 1)
```

@see {@link https://www.typescriptlang.org/docs/handbook/type-compatibility.html | TypeScript Type Compatibility}

## Functions

### as <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L22)</sub>

```typescript
;(<$value>(value?: unknown) => $value)
```

### isTypeWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/type-guards.ts#L18)</sub>

```typescript
<reference>(reference: reference) => <valueGiven>(value: ValidateIsSupertype<reference, valueGiven>) => value is reference extends valueGiven ? reference : never
```

### isntTypeWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/type-guards.ts#L41)</sub>

```typescript
<reference>(reference: reference) => <valueGiven>(value: ValidateIsSupertype<reference, valueGiven>) => value is reference extends valueGiven ? Exclude<valueGiven, reference> : never
```

## Types

### Print <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/print.ts#L6)</sub>

```typescript
export type Print<$Type, $Fallback extends string | undefined = undefined> =
  // Language base category types
  IsAny<$Type> extends true ? 'any'
    : IsUnknown<$Type> extends true ? 'unknown'
    : IsNever<$Type> extends true ? 'never'
    // Special union type boolean which we display as boolean insead of true | false
    : [$Type] extends [boolean]
      ? ([boolean] extends [$Type] ? 'boolean' : `${$Type}`)
    // General unions types
    : UnionToTuple<$Type> extends ArrMut.Any2OrMoreRO
      ? _PrintUnion<UnionToTuple<$Type>>
    // Primitive and literal types
    : $Type extends true ? 'true'
    : $Type extends false ? 'false'
    : $Type extends void ? ($Type extends undefined ? 'undefined' : 'void')
    : $Type extends string ? (string extends $Type ? 'string' : `'${$Type}'`)
    : $Type extends number ? (number extends $Type ? 'number' : `${$Type}`)
    : $Type extends bigint ? (bigint extends $Type ? 'bigint' : `${$Type}n`)
    : $Type extends null ? 'null'
    : $Type extends undefined ? 'undefined'
    // User-provided fallback takes precedence if type is not a primitive
    : $Fallback extends string ? $Fallback
    // Common object types and specific generic patterns
    : $Type extends Promise<infer T> ? `Promise<${Print<T>}>`
    : $Type extends (infer T)[] ? `Array<${Print<T>}>`
    : $Type extends readonly (infer T)[] ? `ReadonlyArray<${Print<T>}>`
    : $Type extends Date ? 'Date'
    : $Type extends RegExp ? 'RegExp'
    //
    : $Type extends Function ? 'Function'
    : $Type extends symbol ? 'symbol'
    // General object fallback
    : $Type extends object ? 'object'
    // Ultimate fallback
    : '?'
```

### _PrintUnion <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/print.ts#L48)</sub>

```typescript
export type _PrintUnion<$Type extends ArrMut.AnyRO> = $Type extends
  readonly [infer __first__, ...infer __rest__ extends ArrMut.Any1OrMoreRO]
  ? `${Print<__first__>} | ${_PrintUnion<__rest__>}`
  : $Type extends readonly [infer __first__] ? `${Print<__first__>}`
  : $Type extends ArrMut.EmptyRO ? ''
  : never
```

### Interpolatable <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L46)</sub>

Types that TypeScript accepts being interpolated into a Template Literal Type.

These are the types that can be used within template literal types without causing
a TypeScript error. When a value of one of these types is interpolated into a
template literal type, TypeScript will properly convert it to its string representation.

```typescript
export type Interpolatable =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | symbol
  | object
  | unknown
  | any
  | never
```

**Examples:**

```ts twoslash
type Valid1 = `Value: ${string}`
type Valid2 = `Count: ${number}`
type Valid3 = `Flag: ${boolean}`
type Valid4 = `ID: ${123n}`

// Example usage in conditional types:
type Stringify<T extends Interpolatable> = `${T}`
type Result1 = Stringify<42> // "42"
type Result2 = Stringify<true> // "true"
type Result3 = Stringify<'hello'> // "hello"
```

### StaticError <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L100)</sub>

Represents a type error that can be surfaced at the type level.

This is useful for providing more informative error messages directly in TypeScript's
type checking, often used with conditional types or generic constraints. When TypeScript
encounters this type, it will display the error information in a structured way.

```typescript
export interface StaticError<
  $Message extends string = string,
  $Context extends object = {},
  $Hint extends string = '(none)',
> {
  ERROR: $Message
  CONTEXT: $Context
  HINT: $Hint
}
```

**Examples:**

```ts twoslash
type RequireString<T> = T extends string ? T : StaticError<
  'Type must be a string',
  { Received: T },
  'Consider using string or a string literal type'
>

type Good = RequireString<'hello'> // 'hello'
type Bad = RequireString<number> // StaticError<...>
```

```ts twoslash
function processString<T>(
  value: T extends string ? T : StaticError<
    'Argument must be a string',
    { ProvidedType: T }
  >,
): void {
  // Implementation
}

processString('hello') // OK
processString(42) // Type error with custom message
```

### StaticErrorAny <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L110)</sub>

```typescript
export type StaticErrorAny = StaticError<string, object, string>
```

### StaticErrorAssertion <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L140)</sub>

Represents a static assertion error at the type level, optimized for type testing.

This is a simpler, more focused error type compared to {@link StaticError}. It's specifically
designed for type assertions where you need to communicate expected vs. actual types.

```typescript
export interface StaticErrorAssertion<
  $Message extends string = string,
  $Expected = unknown,
  $Actual = unknown,
  $Tip extends string = never,
> {
  MESSAGE: $Message
  EXPECTED: $Expected
  ACTUAL: $Actual
  TIP: $Tip
}
```

**Examples:**

```ts twoslash
function assertParameters<T extends readonly any[]>(
  fn: Parameters<typeof fn> extends T ? typeof fn
    : StaticErrorAssertion<
      'Parameters mismatch',
      T,
      Parameters<typeof fn>
    >,
): void {}

// Error shows:
// MESSAGE: 'Parameters mismatch'
// EXPECTED: [string, number]
// ACTUAL: [number, string]
```

### Show <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L175)</sub>

Like {@link Print} but adds additional styling to display the rendered type in a sentence.

Useful for type-level error messages where you want to clearly distinguish type names
from surrounding text. Wraps the printed type with backticks (\`) like inline code in Markdown.

```typescript
export type Show<$Type> = `\`${Print<$Type>}\``
```

**Examples:**

```ts twoslash
// Result: "Expected `string` but got `number`"

type Message2 = `The type ${Show<'hello' | 'world'>} is not assignable`
// Result: "The type `'hello' | 'world'` is not assignable"

// Using in error messages
type TypeError<Expected, Actual> = StaticError<
  `Type mismatch: expected ${Show<Expected>} but got ${Show<Actual>}`,
  { Expected; Actual }
>
```

### ShowInTemplate <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L204)</sub>

Version of {@link Show} but uses single quotes instead of backticks.

This can be useful in template literal types where backticks would be rendered as "\`"
which is not ideal for readability. Use this when the output will be used within
another template literal type or when backticks cause display issues.

Note that when working with TS-level errors, if TS can instantiate all the types involved then
the result will be a string, not a string literal type. So when working with TS-level errors,
only reach for this variant of {@link Show} if you think there is likelihood that types won't be instantiated.

```typescript
export type ShowInTemplate<$Type> = `'${Print<$Type>}'`
```

**Examples:**

```ts twoslash
type ErrorInTemplate = `Error: ${ShowInTemplate<string>} is required`
// Result: "Error: 'string' is required"

// Comparing Show vs ShowInTemplate
type WithShow = `Type is ${Show<number>}`
// May display as: "Type is \`number\`" (escaped backticks)

type WithShowInTemplate = `Type is ${ShowInTemplate<number>}`
// Displays as: "Type is 'number'" (cleaner)
```

### Simplify <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L244)</sub>

Simplifies complex type intersections and mapped types for better readability.

Forces TypeScript to evaluate and flatten a type, which is especially useful for:

- Intersection types that appear as `A & B & C` in tooltips
- Complex mapped types that show their internal structure
- Making type aliases more readable in IDE tooltips

```typescript
export type Simplify<$Type> =
  & {
    [_ in keyof $Type]: $Type[_]
  }
  & unknown
```

**Examples:**

```ts twoslash
type Complex = { a: string } & { b: number } & { c: boolean }
// Tooltip shows: { a: string } & { b: number } & { c: boolean }

// With Simplify
type Simple = Simplify<Complex>
// Tooltip shows: { a: string; b: number; c: boolean }
```

```ts twoslash
type UserPermissions =
  & { read: boolean }
  & { write: boolean }
  & { admin: boolean }

type FlatPermissions = Simplify<UserPermissions>
// Shows as: { read: boolean; write: boolean; admin: boolean }

// Useful with generic constraints
function processUser<T extends Simplify<UserPermissions>>(user: T) {
  // T will show flattened structure in errors and tooltips
}
```

### SimplifyNullable <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L284)</sub>

Simplify a type while preserving `| null` unions.

This solves a subtle problem with {@link Simplify}: when you have `Type | null`,
using `Simplify<Type | null>` can absorb or transform the `null` in unexpected ways
due to the intersection with `& unknown` or `& {}`. This utility checks for null first,
then explicitly reconstructs the union to ensure `| null` remains intact.

**When to use:**

- Use {@link SimplifyNullable} when simplifying types that may contain `| null` or `| undefined`
- Use {@link Simplify} for non-nullable types or when null handling doesn't matter

```typescript
export type SimplifyNullable<$T> = null extends $T ? (Simplify<$T> & {}) | null
  : Simplify<$T> & {}
```

**Examples:**

```ts twoslash
type User = { name: string } & { age: number }
type MaybeUser = User | null
type Bad = Simplify<MaybeUser> // May not preserve | null correctly

// Solution: SimplifyNullable preserves the null union
type Good = SimplifyNullable<MaybeUser> // { name: string; age: number } | null
```

```ts twoslash
type Simple = SimplifyNullable<{ a: 1 } & { b: 2 }> // { a: 1; b: 2 }

// Preserves null in unions
type Nullable = SimplifyNullable<({ a: 1 } & { b: 2 }) | null> // { a: 1; b: 2 } | null
```

### ExtendsExact <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L324)</sub>

Utilities for working with union types at the type level.

```typescript
export type ExtendsExact<$Input, $Constraint> = $Input extends $Constraint
  ? $Constraint extends $Input ? $Input
  : never
  : never
```

### NotExtends <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L373)</sub>

Type-level utility that checks if a type does NOT extend another type.

Returns `true` if type A does not extend type B, `false` otherwise.
Useful for conditional type logic where you need to check the absence
of a type relationship.

```typescript
export type NotExtends<$A, $B> = [$A] extends [$B] ? false : true
```

**Examples:**

```ts twoslash
type T2 = NotExtends<'hello', string> // false ('hello' extends string)
type T3 = NotExtends<42, number> // false (42 extends number)
type T4 = NotExtends<{ a: 1 }, { b: 2 }> // true (different properties)
```

```ts twoslash
type VarBuilderToType<$Type, $VarBuilder> = $VarBuilder['required'] extends true
  ? Exclude<$Type, undefined>
  : NotExtends<$VarBuilder['default'], undefined> extends true
    ? $Type | undefined
  : $Type

// If default is undefined, type is just $Type
// If default is not undefined, type is $Type | undefined
```

```ts twoslash
type SafeDivide<T> = NotExtends<T, 0> extends true ? number
  : StaticError<'Cannot divide by zero'>

type Result1 = SafeDivide<5> // number
type Result2 = SafeDivide<0> // StaticError<'Cannot divide by zero'>
```

### Writeable <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L384)</sub>

Make all properties in an object mutable (removes readonly modifiers).

```typescript
export type Writeable<$Object> = {
  -readonly [k in keyof $Object]: $Object[k]
}
```

**Examples:**

```ts twoslash
type Mutable = Writeable<Readonly> // { x: number; y: string }
```

### IfExtendsElse <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L423)</sub>

:::warning DEPRECATED

- Commented out 2025-01-07

This utility was too strict - requires BIDIRECTIONAL extends, which rejects
valid narrowed types (e.g., { id: true } for { id: boolean }).

Use Obj.NoExcess instead, which:

- ✓ Rejects excess properties (what you want)
- ✓ Allows valid subtypes/narrowing (what you need)

If a use case for true bidirectional exact matching emerges, uncomment.
Otherwise, remove after 3-6 months (target: ~2025-07-01).

Original implementation:
:::

```typescript
export type IfExtendsElse<$Type, $Extends, $Then, $Else> = $Type extends
  $Extends ? $Then : $Else
```

### IntersectionIgnoreNeverOrAny <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L428)</sub>

Intersection that ignores never and any.

```typescript
export type IntersectionIgnoreNeverOrAny<$T> = IsAny<$T> extends true ? unknown
  : $T extends never ? unknown
  : $T
```

### NeverOrAnyToUnknown <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L433)</sub>

Convert never or any to unknown.

```typescript
export type NeverOrAnyToUnknown<$T> = IsAny<$T> extends true ? unknown
  : $T extends never ? unknown
  : $T
```

### Narrowable <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L438)</sub>

Any narrowable primitive type.

```typescript
export type Narrowable = string | number | bigint | boolean | []
```

### AnyAndUnknownToNever <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/ts.ts#L443)</sub>

Convert any and unknown to never.

```typescript
export type AnyAndUnknownToNever<$T> = IsAny<$T> extends true ? never
  : IsUnknown<$T> extends true ? never
  : $T
```
