# Ts.Test

_Ts_ / **Test**

## Import

```typescript
import { Ts } from '@wollybeard/kit/ts'

// Access via namespace
Ts.Test.someFunction()
```

## Functions

### exactConst

```typescript
exactConst = <$Expected>() =>
<const $Actual>(
  _actual: (<T>() => T extends $Actual ? 1 : 2) extends
    (<T>() => T extends $Expected ? 1 : 2) ? $Actual
    : StaticErrorAssertion<
      'Actual value type is not exactly equal to expected type',
      $Expected,
      $Actual
    >,
): void => {}
```

### subConst

```typescript
subConst = <$Expected>() =>
<const $Actual>(
  _actual: $Actual extends $Expected ? $Actual
    : StaticErrorAssertion<
      'Actual value type does not extend expected type',
      $Expected,
      $Actual
    >,
): void => {}
```

### bidConst

```typescript
bidConst = <$Expected>() =>
<const $Actual>(
  _actual: $Actual extends $Expected ? $Expected extends $Actual ? $Actual
    : StaticErrorAssertion<
      'Types are not bidirectionally assignable (Expected does not extend Actual)',
      $Expected,
      $Actual
    >
    : StaticErrorAssertion<
      'Types are not bidirectionally assignable (Actual does not extend Expected)',
      $Expected,
      $Actual
    >,
): void => {}
```

## Types

### exact

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

### bid

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

### sub

```typescript
export type sub<$Expected, $Actual> = $Actual extends $Expected ? true
  : StaticErrorAssertion<
    'Actual type does not extend expected type',
    $Expected,
    $Actual
  >
```

### subNoExcess

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

### subNot

```typescript
export type subNot<$NotExpected, $Actual> = $Actual extends $NotExpected
  ? StaticErrorAssertion<
    'Actual type extends type it should not extend',
    $NotExpected,
    $Actual
  >
  : true
```

### equalNever

```typescript
export type equalNever<$Actual> = [$Actual] extends [never] ? true
  : StaticErrorAssertion<'Type is not never', never, $Actual>
```

### equalAny

```typescript
export type equalAny<$Actual> = 0 extends 1 & $Actual ? true
  : StaticErrorAssertion<'Type is not any', never, $Actual>
```

### equalUnknown

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

### equalEmptyObject

```typescript
export type equalEmptyObject<$Actual extends object> =
  Obj.IsEmpty<$Actual> extends true ? true
    : StaticErrorAssertion<
      'Type is not an empty object (has keys)',
      Obj.Empty,
      $Actual
    >
```

### sup

```typescript
export type sup<$Supertype, $Actual> = $Actual extends $Supertype ? true
  : StaticErrorAssertion<
    'Actual type does not extend expected supertype',
    $Supertype,
    $Actual
  >
```

### parameters

```typescript
export type parameters<
  $Expected extends readonly any[],
  $Function extends (...args: any[]) => any,
> = sub<
  $Expected,
  Parameters<$Function>
>
```

### promise

```typescript
export type promise<$Type, $Actual> = $Actual extends Promise<$Type> ? true
  : StaticErrorAssertion<
    'Type is not a Promise with expected element type',
    Promise<$Type>,
    $Actual
  >
```

### promiseNot

```typescript
export type promiseNot<$Actual> = $Actual extends Promise<any>
  ? StaticErrorAssertion<
    'Type is a Promise but should not be',
    never,
    $Actual
  >
  : true
```

### array

```typescript
export type array<$ElementType, $Actual> = $Actual extends $ElementType[] ? true
  : StaticErrorAssertion<
    'Type is not an array with expected element type',
    $ElementType[],
    $Actual
  >
```

### Case

```typescript
export type Case<$Result extends true> = $Result
```

### Cases

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
