# Ts.Test

_Ts_ / **Test**

## Import

```typescript
import { Ts } from '@wollybeard/kit/ts'

// Access via namespace
Ts.Test.someFunction()
```

## Functions

### exactConst <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L825)</sub>

```typescript
;(<$Expected>() =>
<const $Actual>(
  _actual: (<T>() => T extends $Actual ? 1 : 2) extends
    <T>() => T extends $Expected ? 1 : 2 ? $Actual
    : StaticErrorAssertion<
      'Actual value type is not exactly equal to expected type',
      $Expected,
      $Actual,
      never
    >,
) => void )
```

### subConst <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L853)</sub>

```typescript
;(<$Expected>() =>
<const $Actual>(
  _actual: $Actual extends $Expected ? $Actual
    : StaticErrorAssertion<
      'Actual value type does not extend expected type',
      $Expected,
      $Actual,
      never
    >,
) => void )
```

### bidConst <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L882)</sub>

```typescript
;(<$Expected>() =>
<const $Actual>(
  _actual: $Actual extends $Expected ? $Expected extends $Actual ? $Actual
    : StaticErrorAssertion<
      'Types are not bidirectionally assignable (Expected does not extend Actual)',
      $Expected,
      $Actual,
      never
    >
    : StaticErrorAssertion<
      'Types are not bidirectionally assignable (Actual does not extend Expected)',
      $Expected,
      $Actual,
      never
    >,
) => void )
```

## Types

### exact <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L65)</sub>

Assert that two types are exactly equal (structurally).

Uses a conditional type inference trick to check exact structural equality,
correctly handling any, never, and unknown edge cases.

This checks for structural equality - types must have the same structure,
not just compute to the same result. For bidirectional extends, use {@link bid}.

When exact equality fails but bidirectional assignability passes, provides
a helpful tip about using {@link bid} or applying {@link Simplify} from `#ts`.

```typescript
export type exact<$Expected, $Actual> =
  (<T>() => T extends $Actual ? 1 : 2) extends
    (<T>() => T extends $Expected ? 1 : 2) ? true
    // If structural equality fails, check if bidirectional assignability passes
    : $Actual extends $Expected
      ? $Expected extends $Actual ? StaticErrorAssertion<
          'Types are mutually assignable but not structurally equal',
          $Expected,
          $Actual,
          'Use bid() for mutual assignability OR apply Simplify<T> to normalize types'
        >
      : StaticErrorAssertion<
        'Types are not structurally equal',
        $Expected,
        $Actual
      >
    : StaticErrorAssertion<
      'Types are not structurally equal',
      $Expected,
      $Actual
    >
```

**Examples:**

```ts twoslash
Ts.Test.exact<string, string>,           // ✓ Pass
  Ts.Test.exact<string | number, string>,  // ✗ Fail - Type error
  Ts.Test.exact<{ a: 1 }, { a: 1 }>,       // ✓ Pass
  Ts.Test.exact<any, unknown>,             // ✗ Fail - Type error
  Ts.Test.exact<1 | 2, 2 | 1>              // ✗ Fail with tip - types are mutually assignable but not structurally equal
>
```

### bid <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L132)</sub>

Assert that two types are bidirectionally assignable (mutually assignable).

This checks that types are mutually assignable (A extends B and B extends A),
which means they compute to the same result even if their structure differs.

Use this when you care about semantic equality rather than structural equality.
For strict structural equality, use {@link exact}.

**Linting:** When `KitLibrarySettings.Ts.Test.Settings.lintBidForExactPossibility` is `true`,
this will show an error if {@link exact} would work, encouraging use of the stricter assertion.
See module documentation for configuration example.

```typescript
export type bid<$Expected, $Actual> = $Actual extends $Expected
  ? $Expected extends $Actual
    // Both directions pass - check if exact would also pass
    ? (<T>() => T extends $Actual ? 1 : 2) extends
      (<T>() => T extends $Expected ? 1 : 2)
      // Exact also passes - check if linting is enabled
      ? GetTestSetting<'lintBidForExactPossibility'> extends true
        ? StaticErrorAssertion<
          'Types are structurally equal',
          $Expected,
          $Actual,
          'Use exact() instead - bid() is only needed when types are mutually assignable but not structurally equal'
        >
      : true // Linting disabled, allow it
    : true // Only bid passes (not exact) - this is correct usage
  : StaticErrorAssertion<
    'Types are not bidirectionally assignable (Expected does not extend Actual)',
    $Expected,
    $Actual
  >
  : StaticErrorAssertion<
    'Types are not bidirectionally assignable (Actual does not extend Expected)',
    $Expected,
    $Actual
  >
```

**Examples:**

```ts twoslash
Ts.Test.bid<string, string>,      // ✓ Pass (or error if linting enabled - should use exact)
  Ts.Test.bid<1 | 2, 2 | 1>,        // ✓ Pass (or error if linting enabled - should use exact)
  Ts.Test.bid<string & {}, string>, // ✓ Pass - both compute to string (exact would fail)
  Ts.Test.bid<string, number>       // ✗ Fail - Type error
>
```

### sub <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L205)</sub>

Assert that a type extends (is a subtype of) another type.

Equivalent to TypeScript's `extends` keyword: checks if `$Actual extends $Expected`.
This is useful for validating type relationships and narrowing.

For exact type equality (not just subtyping), use {@link exact} instead.

```typescript
export type sub<$Expected, $Actual> = $Actual extends $Expected ? true
  : StaticErrorAssertion<
    'Actual type does not extend expected type',
    $Expected,
    $Actual
  >
```

**Examples:**

```ts twoslash
Ts.Test.sub<string, 'hello'>,           // ✓ Pass - 'hello' extends string
  Ts.Test.sub<'hello', string>,           // ✗ Fail - string doesn't extend 'hello'
  Ts.Test.sub<{ a: 1 }, { a: 1; b: 2 }>,  // ✓ Pass - more specific extends less specific
  Ts.Test.sub<object, { a: 1 }>           // ✓ Pass - { a: 1 } extends object
>
```

### subNoExcess <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L288)</sub>

Assert that a type extends the expected type AND has no excess properties.

Similar to {@link sub} but also rejects excess properties beyond those defined
in the expected type. This catches common bugs like typos in configuration objects
or accidentally passing extra properties.

This is particularly useful for:

- Validating configuration objects
- Checking function parameters that shouldn't have extra properties
- Testing that types don't have unexpected fields

```typescript
export type subNoExcess<$Expected, $Actual> = $Actual extends $Expected
  ? Exclude<keyof $Actual, keyof $Expected> extends never ? true
  : StaticErrorAssertion<
    'Type has excess properties not present in expected type',
    $Expected,
    $Actual
  >
  : StaticErrorAssertion<
    'Actual type does not extend expected type',
    $Expected,
    $Actual
  >
```

**Examples:**

```ts twoslash
type _ = Ts.Test.Cases<
  Ts.Test.subNoExcess<Config, { id: true }>, // ✓ Pass
  Ts.Test.subNoExcess<Config, { id: true; name: 'test' }>, // ✓ Pass - optional included
  Ts.Test.subNoExcess<Config, { id: true; $skip: true }>, // ✗ Fail - excess property
  Ts.Test.subNoExcess<Config, { id: 'wrong' }> // ✗ Fail - wrong type
>
```

```ts twoslash
type Q = { id: boolean }

type T1 = Ts.Test.sub<Q, { id: true; extra: 1 }> // ✓ Pass (sub allows excess)
type T2 = Ts.Test.subNoExcess<Q, { id: true; extra: 1 }> // ✗ Fail (subNoExcess rejects)
```

### subNot <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L368)</sub>

Assert that a type does NOT extend another type.

```typescript
export type subNot<$NotExpected, $Actual> = $Actual extends $NotExpected
  ? StaticErrorAssertion<
    'Actual type extends type it should not extend',
    $NotExpected,
    $Actual
  >
  : true
```

**Examples:**

```ts twoslash
Ts.Test.subNot<number, string>,  // ✓ Pass
  Ts.Test.subNot<string, 'hello'>  // ✗ Fail - 'hello' extends string
>
```

### equalNever <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L420)</sub>

Assert that a type is exactly `never`.

```typescript
export type equalNever<$Actual> = [$Actual] extends [never] ? true
  : StaticErrorAssertion<'Type is not never', never, $Actual>
```

**Examples:**

```ts twoslash
Ts.Test.equalNever<never>,  // ✓ Pass
  Ts.Test.equalNever<string>  // ✗ Fail - Type error
>
```

### equalAny <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L458)</sub>

Assert that a type is exactly `any`.

Uses the `0 extends 1 & T` trick to detect `any`.

```typescript
export type equalAny<$Actual> = 0 extends 1 & $Actual ? true
  : StaticErrorAssertion<'Type is not any', never, $Actual>
```

**Examples:**

```ts twoslash
Ts.Test.equalAny<any>,      // ✓ Pass
  Ts.Test.equalAny<unknown>,  // ✗ Fail - Type error
  Ts.Test.equalAny<string>    // ✗ Fail - Type error
>
```

### equalUnknown <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L494)</sub>

Assert that a type is exactly `unknown`.

```typescript
export type equalUnknown<$Actual> = unknown extends $Actual
  ? (0 extends 1 & $Actual ? StaticErrorAssertion<
      'Type is any, not unknown',
      unknown,
      $Actual
    >
    : true)
  : StaticErrorAssertion<'Type is not unknown', never, $Actual>
```

**Examples:**

```ts twoslash
Ts.Test.equalUnknown<unknown>,  // ✓ Pass
  Ts.Test.equalUnknown<any>,      // ✗ Fail - Type error
  Ts.Test.equalUnknown<string>    // ✗ Fail - Type error
>
```

### equalEmptyObject <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L543)</sub>

Assert that a type is an empty object (no properties).

Uses {@link Obj.IsEmpty} from kit to check if the object has no keys.
Note: `{}` in TypeScript means "any non-nullish value", not an empty object.

```typescript
export type equalEmptyObject<$Actual extends object> =
  Obj.IsEmpty<$Actual> extends true ? true
    : StaticErrorAssertion<
      'Type is not an empty object (has keys)',
      Obj.Empty,
      $Actual
    >
```

**Examples:**

```ts twoslash
Ts.Test.equalEmptyObject<Record<string, never>>,  // ✓ Pass
  Ts.Test.equalEmptyObject<{}>,                      // ✗ Fail - {} is not empty
  Ts.Test.equalEmptyObject<{ a: 1 }>                 // ✗ Fail - has properties
>
```

### sup <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L593)</sub>

Assert that a type is a supertype of (i.e., extended by) another type.

Equivalent to TypeScript's `extends` keyword: checks if `$Actual extends $Supertype`.
This is the reverse parameter order of {@link sub} - the expected type is the supertype.
Less commonly used than `sub` - most cases should use `sub` with reversed parameters for clarity.

```typescript
export type sup<$Supertype, $Actual> = $Actual extends $Supertype ? true
  : StaticErrorAssertion<
    'Actual type does not extend expected supertype',
    $Supertype,
    $Actual
  >
```

**Examples:**

```ts twoslash
Ts.Test.sup<object, { a: 1 }>,  // ✓ Pass - { a: 1 } extends object (object is supertype)
  Ts.Test.sup<{ a: 1 }, object>,  // ✗ Fail - object doesn't extend { a: 1 }
  Ts.Test.sup<string, 'hello'>    // ✓ Pass - 'hello' extends string (string is supertype)
>
```

### parameters <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L643)</sub>

Assert that a function's parameters match the expected type.
Combines `Parameters<typeof fn>` with assertion in one step.

```typescript
export type parameters<
  $Expected extends readonly any[],
  $Function extends (...args: any[]) => any,
> = sub<
  $Expected,
  Parameters<$Function>
>
```

**Examples:**

```ts twoslash
type _ = Ts.Test.Cases<
  Ts.Test.parameters<[number, number], typeof add>, // ✓ Pass
  Ts.Test.parameters<[string, string], typeof add> // ✗ Fail - Type error
>
```

### promise <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L686)</sub>

Assert that a type is a Promise with specific element type.

```typescript
export type promise<$Type, $Actual> = $Actual extends Promise<$Type> ? true
  : StaticErrorAssertion<
    'Type is not a Promise with expected element type',
    Promise<$Type>,
    $Actual
  >
```

**Examples:**

```ts twoslash
Ts.Test.promise<number, Promise<number>>,  // ✓ Pass
  Ts.Test.promise<string, Promise<number>>,  // ✗ Fail - Type error
  Ts.Test.promise<number, number>            // ✗ Fail - Type error
>
```

### promiseNot <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L726)</sub>

Assert that a type is NOT a Promise.

```typescript
export type promiseNot<$Actual> = $Actual extends Promise<any>
  ? StaticErrorAssertion<
    'Type is a Promise but should not be',
    never,
    $Actual
  >
  : true
```

**Examples:**

```ts twoslash
Ts.Test.promiseNot<number>,          // ✓ Pass
  Ts.Test.promiseNot<Promise<number>>  // ✗ Fail - Type error
>
```

### array <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L765)</sub>

Assert that a type is an array with specific element type.

```typescript
export type array<$ElementType, $Actual> = $Actual extends $ElementType[] ? true
  : StaticErrorAssertion<
    'Type is not an array with expected element type',
    $ElementType[],
    $Actual
  >
```

**Examples:**

```ts twoslash
Ts.Test.array<string, string[]>,  // ✓ Pass
  Ts.Test.array<number, string[]>,  // ✗ Fail - Type error
  Ts.Test.array<string, string>     // ✗ Fail - Type error
>
```

### Case <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L917)</sub>

Type-level test assertion that requires the result to be true.
Used in type-level test suites to ensure a type evaluates to true.

```typescript
export type Case<$Result extends true> = $Result
```

**Examples:**

```ts twoslash
Ts.Test.Case<Equal<string, string>>,  // OK - evaluates to true
  Ts.Test.Case<Equal<string, number>>,  // Error - doesn't extend true
]
```

### Cases <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/test.ts#L939)</sub>

Type-level batch assertion helper that accepts multiple assertions.
Each type parameter must extend true, allowing batch type assertions.

```typescript
export type Cases<
  _T1 extends true = true,
  _T2 extends true = true,
  _T3 extends true = true,
  _T4 extends true = true,
  _T5 extends true = true,
  _T6 extends true = true,
  _T7 extends true = true,
  _T8 extends true = true,
  _T9 extends true = true,
  _T10 extends true = true,
  _T11 extends true = true,
  _T12 extends true = true,
  _T13 extends true = true,
  _T14 extends true = true,
  _T15 extends true = true,
  _T16 extends true = true,
  _T17 extends true = true,
  _T18 extends true = true,
  _T19 extends true = true,
  _T20 extends true = true,
  _T21 extends true = true,
  _T22 extends true = true,
  _T23 extends true = true,
  _T24 extends true = true,
  _T25 extends true = true,
  _T26 extends true = true,
  _T27 extends true = true,
  _T28 extends true = true,
  _T29 extends true = true,
  _T30 extends true = true,
  _T31 extends true = true,
  _T32 extends true = true,
  _T33 extends true = true,
  _T34 extends true = true,
  _T35 extends true = true,
  _T36 extends true = true,
  _T37 extends true = true,
  _T38 extends true = true,
  _T39 extends true = true,
  _T40 extends true = true,
  _T41 extends true = true,
  _T42 extends true = true,
  _T43 extends true = true,
  _T44 extends true = true,
  _T45 extends true = true,
  _T46 extends true = true,
  _T47 extends true = true,
  _T48 extends true = true,
  _T49 extends true = true,
  _T50 extends true = true,
  _T51 extends true = true,
  _T52 extends true = true,
  _T53 extends true = true,
  _T54 extends true = true,
  _T55 extends true = true,
  _T56 extends true = true,
  _T57 extends true = true,
  _T58 extends true = true,
  _T59 extends true = true,
  _T60 extends true = true,
  _T61 extends true = true,
  _T62 extends true = true,
  _T63 extends true = true,
  _T64 extends true = true,
  _T65 extends true = true,
  _T66 extends true = true,
  _T67 extends true = true,
  _T68 extends true = true,
  _T69 extends true = true,
  _T70 extends true = true,
  _T71 extends true = true,
  _T72 extends true = true,
  _T73 extends true = true,
  _T74 extends true = true,
  _T75 extends true = true,
  _T76 extends true = true,
  _T77 extends true = true,
  _T78 extends true = true,
  _T79 extends true = true,
  _T80 extends true = true,
  _T81 extends true = true,
  _T82 extends true = true,
  _T83 extends true = true,
  _T84 extends true = true,
  _T85 extends true = true,
  _T86 extends true = true,
  _T87 extends true = true,
  _T88 extends true = true,
  _T89 extends true = true,
  _T90 extends true = true,
  _T91 extends true = true,
  _T92 extends true = true,
  _T93 extends true = true,
  _T94 extends true = true,
  _T95 extends true = true,
  _T96 extends true = true,
  _T97 extends true = true,
  _T98 extends true = true,
  _T99 extends true = true,
  _T100 extends true = true,
> = true
```

**Examples:**

```ts twoslash
Equal<string, string>,     // ✓ Pass
  Extends<string, 'hello'>,  // ✓ Pass
  Never<never>               // ✓ Pass
>

// Type error if any assertion fails
type _ = Ts.Test.Cases<
  Equal<string, string>,     // ✓ Pass
  Equal<string, number>,     // ✗ Fail - Type error here
  Extends<string, 'hello'>   // ✓ Pass
>
```
