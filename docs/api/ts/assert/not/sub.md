# Ts.Assert.not.sub

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Assert.not.sub
```

```typescript [Barrel]
import { sub } from '@wollybeard/kit/ts'
```

:::

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Array`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L208" /> {#c-array-208}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, any[], false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `bigint`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L73" /> {#c-bigint-73}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, bigint, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boolean`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L88" /> {#c-boolean-88}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, boolean, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Date`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L148" /> {#c-date-148}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, Date, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Error`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L178" /> {#c-error-178}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, Error, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `null`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L118" /> {#c-null-118}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, null, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `number`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L58" /> {#c-number-58}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, number, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `of`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L28" /> {#c-of-28}

```typescript
InputMatcherArgFactory<State.SetRelator<State.SetNegated<State.Empty>, SubKind>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Promise`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L193" /> {#c-promise-193}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, Promise<any>, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `RegExp`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L163" /> {#c-reg-exp-163}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, RegExp, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `string`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L43" /> {#c-string-43}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, string, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `symbol`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L133" /> {#c-symbol-133}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, symbol, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `undefined`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L103" /> {#c-undefined-103}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.SetNegated<State.Empty>, SubKind>, undefined, false, false>>
```

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Array`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L207" /> {#t-array-207}

```typescript
type Array_<$Actual> = Kind.Apply<SubKind, [any[], $Actual, true]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `bigint`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L72" /> {#t-bigint-72}

```typescript
type bigint_<$Actual> = Kind.Apply<SubKind, [bigint, $Actual, true]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `boolean`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L87" /> {#t-boolean-87}

```typescript
type boolean_<$Actual> = Kind.Apply<SubKind, [boolean, $Actual, true]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Date`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L147" /> {#t-date-147}

```typescript
type Date_<$Actual> = Kind.Apply<SubKind, [Date, $Actual, true]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Error`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L177" /> {#t-error-177}

```typescript
type Error_<$Actual> = Kind.Apply<SubKind, [Error, $Actual, true]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `null`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L117" /> {#t-null-117}

```typescript
type null_<$Actual> = Kind.Apply<SubKind, [null, $Actual, true]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `number`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L57" /> {#t-number-57}

```typescript
type number_<$Actual> = Kind.Apply<SubKind, [number, $Actual, true]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `of`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L27" /> {#t-of-27}

```typescript
type of_<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, $Actual, true]>
```

base + sub relation matchers.

Direct type assertion Relation: subtype relation (extends)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Promise`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L192" /> {#t-promise-192}

```typescript
type Promise_<$Actual> = Kind.Apply<SubKind, [Promise<any>, $Actual, true]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RegExp`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L162" /> {#t-reg-exp-162}

```typescript
type RegExp_<$Actual> = Kind.Apply<SubKind, [RegExp, $Actual, true]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `string`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L42" /> {#t-string-42}

```typescript
type string_<$Actual> = Kind.Apply<SubKind, [string, $Actual, true]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `symbol`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L132" /> {#t-symbol-132}

```typescript
type symbol_<$Actual> = Kind.Apply<SubKind, [symbol, $Actual, true]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `undefined`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/not/sub.ts#L102" /> {#t-undefined-102}

```typescript
type undefined_<$Actual> = Kind.Apply<SubKind, [undefined, $Actual, true]>
```

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
