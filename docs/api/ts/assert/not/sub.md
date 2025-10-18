# Ts.Assert.not.sub

_Ts.Assert.not_ / **sub**

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Assert.not.sub.someFunction()
```

```typescript [Barrel]
import * as Ts from '@wollybeard/kit/ts'

// Access via namespace
Ts.Assert.not.sub.someFunction()
```

:::

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Array`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, any[], false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L208" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `bigint`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, bigint, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L73" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boolean`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, boolean, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L88" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Date`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, Date, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L148" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Error`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, Error, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L178" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `null`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, null, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L118" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `number`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, number, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L58" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `of`

```typescript
InputMatcherArgFactory<State.SetRelator<State.SetNegated<State.Empty>, SubKind>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L28" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Promise`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, Promise<any>, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L193" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `RegExp`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, RegExp, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L163" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `string`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, string, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L43" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `symbol`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, symbol, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L133" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `undefined`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, undefined, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L103" />

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Array`

```typescript
type Array_<$Actual> = Kind.Apply<SubKind, [any[], $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L207" />

Pre-curried matcher for any[].

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.Array<any[]>

// ✗ Fail
type _ = Assert.sub.Array<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `bigint`

```typescript
type bigint_<$Actual> = Kind.Apply<SubKind, [bigint, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L72" />

Pre-curried matcher for bigint.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.bigint<bigint>

// ✗ Fail
type _ = Assert.sub.bigint<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `boolean`

```typescript
type boolean_<$Actual> = Kind.Apply<SubKind, [boolean, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L87" />

Pre-curried matcher for boolean.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.boolean<boolean>

// ✗ Fail
type _ = Assert.sub.boolean<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Date`

```typescript
type Date_<$Actual> = Kind.Apply<SubKind, [Date, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L147" />

Pre-curried matcher for Date.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.Date<Date>

// ✗ Fail
type _ = Assert.sub.Date<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Error`

```typescript
type Error_<$Actual> = Kind.Apply<SubKind, [Error, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L177" />

Pre-curried matcher for Error.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.Error<Error>

// ✗ Fail
type _ = Assert.sub.Error<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `null`

```typescript
type null_<$Actual> = Kind.Apply<SubKind, [null, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L117" />

Pre-curried matcher for null.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.null<null>

// ✗ Fail
type _ = Assert.sub.null<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `number`

```typescript
type number_<$Actual> = Kind.Apply<SubKind, [number, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L57" />

Pre-curried matcher for number.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.number<number>

// ✗ Fail
type _ = Assert.sub.number<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `of`

```typescript
type of_<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L27" />

base + sub relation matchers.

Direct type assertion Relation: subtype relation (extends)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Promise`

```typescript
type Promise_<$Actual> = Kind.Apply<SubKind, [Promise<any>, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L192" />

Pre-curried matcher for Promise.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.Promise<Promise<any>>

// ✗ Fail
type _ = Assert.sub.Promise<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RegExp`

```typescript
type RegExp_<$Actual> = Kind.Apply<SubKind, [RegExp, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L162" />

Pre-curried matcher for RegExp.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.RegExp<RegExp>

// ✗ Fail
type _ = Assert.sub.RegExp<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `string`

```typescript
type string_<$Actual> = Kind.Apply<SubKind, [string, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L42" />

Pre-curried matcher for string.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.string<string>

// ✗ Fail
type _ = Assert.sub.string<number>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `symbol`

```typescript
type symbol_<$Actual> = Kind.Apply<SubKind, [symbol, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L132" />

Pre-curried matcher for symbol.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.symbol<symbol>

// ✗ Fail
type _ = Assert.sub.symbol<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `undefined`

```typescript
type undefined_<$Actual> = Kind.Apply<SubKind, [undefined, $Actual, true]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L102" />

Pre-curried matcher for undefined.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.sub.undefined<undefined>

// ✗ Fail
type _ = Assert.sub.undefined<string>
```
