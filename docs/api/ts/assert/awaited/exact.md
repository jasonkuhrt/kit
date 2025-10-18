# Ts.Assert.awaited.exact

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Assert.awaited.exact.someFunction()
```

```typescript [Barrel]
import { exact } from '@wollybeard/kit/ts'

// Access via direct import
exact.someFunction()
```

:::

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Array`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, any[], false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L222" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `bigint`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, bigint, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L78" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boolean`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, boolean, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L94" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Date`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, Date, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L158" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Error`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, Error, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L190" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `null`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, null, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L126" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `number`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, number, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L62" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `of`

```typescript
InputMatcherArgFactory<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L30" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Promise`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, Promise<any>, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L206" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `RegExp`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, RegExp, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L174" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `string`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, string, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L46" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `symbol`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, symbol, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L142" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `undefined`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Awaited$>, ExactKind>, undefined, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L110" />

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Array`

```typescript
type Array_<$Actual> = Kind.Apply<ExactKind, [any[], Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L221" />

Pre-curried matcher for any[]. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.Array<Promise<any[]>>

// ✗ Fail
type _ = Assert.awaited.exact.Array<Promise<string>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `bigint`

```typescript
type bigint_<$Actual> = Kind.Apply<ExactKind, [bigint, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L77" />

Pre-curried matcher for bigint. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.bigint<Promise<bigint>>

// ✗ Fail
type _ = Assert.awaited.exact.bigint<Promise<string>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `boolean`

```typescript
type boolean_<$Actual> = Kind.Apply<ExactKind, [boolean, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L93" />

Pre-curried matcher for boolean. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.boolean<Promise<boolean>>

// ✗ Fail
type _ = Assert.awaited.exact.boolean<Promise<string>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Date`

```typescript
type Date_<$Actual> = Kind.Apply<ExactKind, [Date, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L157" />

Pre-curried matcher for Date. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.Date<Promise<Date>>

// ✗ Fail
type _ = Assert.awaited.exact.Date<Promise<string>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Error`

```typescript
type Error_<$Actual> = Kind.Apply<ExactKind, [Error, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L189" />

Pre-curried matcher for Error. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.Error<Promise<Error>>

// ✗ Fail
type _ = Assert.awaited.exact.Error<Promise<string>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `null`

```typescript
type null_<$Actual> = Kind.Apply<ExactKind, [null, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L125" />

Pre-curried matcher for null. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.null<Promise<null>>

// ✗ Fail
type _ = Assert.awaited.exact.null<Promise<string>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `number`

```typescript
type number_<$Actual> = Kind.Apply<ExactKind, [number, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L61" />

Pre-curried matcher for number. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.number<Promise<number>>

// ✗ Fail
type _ = Assert.awaited.exact.number<Promise<string>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `of`

```typescript
type of_<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L29" />

awaited + exact relation matchers.

Extraction: extracts the resolved type from a Promise Relation: exact structural equality

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Promise`

```typescript
type Promise_<$Actual> = Kind.Apply<ExactKind, [Promise<any>, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L205" />

Pre-curried matcher for Promise. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.Promise<Promise<Promise<any>>>

// ✗ Fail
type _ = Assert.awaited.exact.Promise<Promise<string>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RegExp`

```typescript
type RegExp_<$Actual> = Kind.Apply<ExactKind, [RegExp, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L173" />

Pre-curried matcher for RegExp. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.RegExp<Promise<RegExp>>

// ✗ Fail
type _ = Assert.awaited.exact.RegExp<Promise<string>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `string`

```typescript
type string_<$Actual> = Kind.Apply<ExactKind, [string, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L45" />

Pre-curried matcher for string. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.string<Promise<string>>

// ✗ Fail
type _ = Assert.awaited.exact.string<Promise<number>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `symbol`

```typescript
type symbol_<$Actual> = Kind.Apply<ExactKind, [symbol, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L141" />

Pre-curried matcher for symbol. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.symbol<Promise<symbol>>

// ✗ Fail
type _ = Assert.awaited.exact.symbol<Promise<string>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `undefined`

```typescript
type undefined_<$Actual> = Kind.Apply<ExactKind, [undefined, Kind.Apply<Awaited$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/awaited/exact.ts#L109" />

Pre-curried matcher for undefined. Extraction chain: Promise → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.awaited.exact.undefined<Promise<undefined>>

// ✗ Fail
type _ = Assert.awaited.exact.undefined<Promise<string>>
```
