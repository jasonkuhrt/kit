# Ts.Inhabitance

Type utilities for detecting TypeScript edge case types: `any`, `never`, and `unknown`.

These utilities are useful for conditional type logic that needs to handle these special types differently.

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Inhabitance
```

```typescript [Barrel]
import { Inhabitance } from '@wollybeard/kit/ts'
```

:::

## Namespaces

| Namespace                              | Description |
| -------------------------------------- | ----------- |
| [**`Case`**](/api/ts/inhabitance/case) | —           |

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsNever`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/inhabitance.ts#L22" /> {#t-is-never-22}

```typescript
type IsNever<$Type> = [$Type] extends [never] ? true : false
```

Type utilities for detecting TypeScript edge case types: `any`, `never`, and `unknown`.

These utilities are useful for conditional type logic that needs to handle these special types differently.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsAny`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/inhabitance.ts#L40" /> {#t-is-any-40}

```typescript
type IsAny<T> = 0 extends 1 & T ? true : false
```

Check if a type is `any`.

Uses the fact that `any` is the only type where `0 extends (1 & T)` is true, since `any` absorbs all type operations including impossible intersections.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equal<IsAny<any>, true>,
  Ts.Test.equal<IsAny<unknown>, false>,
  Ts.Test.equal<IsAny<string>, false>,
  Ts.Test.equal<IsAny<never>, false>
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsUnknown`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/inhabitance.ts#L59" /> {#t-is-unknown-59}

```typescript
type IsUnknown<T> = unknown extends T ? (IsAny<T> extends true ? false : true)
  : false
```

Check if a type is `unknown`.

Unknown is the top type

- everything extends unknown (except any, which is special). So we check if unknown extends the type (only true for unknown and any), then exclude any using IsAny.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equal<IsUnknown<unknown>, true>,
  Ts.Test.equal<IsUnknown<any>, false>,
  Ts.Test.equal<IsUnknown<string>, false>,
  Ts.Test.equal<IsUnknown<never>, false>
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsAnyOrUnknown`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/inhabitance.ts#L74" /> {#t-is-any-or-unknown-74}

```typescript
type IsAnyOrUnknown<T> = unknown extends T ? true : false
```

Detect if a type is `any` or `unknown`.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equal<IsAnyOrUnknown<any>, true>,
  Ts.Test.equal<IsAnyOrUnknown<unknown>, true>,
  Ts.Test.equal<IsAnyOrUnknown<never>, false>,
  Ts.Test.equal<IsAnyOrUnknown<string>, false>
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsAnyOrUnknownOrNever`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/inhabitance.ts#L90" /> {#t-is-any-or-unknown-or-never-90}

```typescript
type IsAnyOrUnknownOrNever<T> = [T] extends [never] ? true /* never */
  : unknown extends T ? true /* any or unknown, we don't care which */
  : false
```

Detect if a type is `any`, `unknown`, or `never`.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equal<IsAnyOrUnknownOrNever<any>, true>,
  Ts.Test.equal<IsAnyOrUnknownOrNever<unknown>, true>,
  Ts.Test.equal<IsAnyOrUnknownOrNever<never>, true>,
  Ts.Test.equal<IsAnyOrUnknownOrNever<string>, false>
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `GetCase`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/inhabitance.ts#L96" /> {#t-get-case-96}

```typescript
type GetCase<T> = [T] extends [never] ? Case.Never
  : unknown extends T ? (
      0 extends (1 & T) ? Case.Any
        : Case.Unknown
    )
  : Case.Proper
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Case`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/inhabitance.ts#L105" /> {#u-case-105}

```typescript
type Case =
  | Case.Any
  | Case.Unknown
  | Case.Never
  | Case.Proper
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsEmpty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/inhabitance.ts#L143" /> {#t-is-empty-143}

```typescript
type IsEmpty<$T> = $T extends readonly [] ? true
  : $T extends '' ? true
  : $T extends object ? keyof $T extends never ? true : false
  : false
```

Check if a type is empty.

Empty types:

- Empty array: `[]` or `readonly []`
- Empty object: `keyof T extends never` (no properties)
- Empty string: `''`

Note: `{}` and `interface Foo {}` mean "non-nullish", NOT empty!

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equal<IsEmpty<[]>, true>,
  Ts.Test.equal<IsEmpty<readonly []>, true>,
  Ts.Test.equal<IsEmpty<''>, true>,
  Ts.Test.equal<IsEmpty<Record<string, never>>, true>,
  Ts.Test.equal<IsEmpty<[1]>, false>,
  Ts.Test.equal<IsEmpty<'hello'>, false>,
  Ts.Test.equal<IsEmpty<{ a: 1 }>, false>,
  Ts.Test.equal<IsEmpty<{}>, false> // {} = non-nullish, not empty!
>
```
