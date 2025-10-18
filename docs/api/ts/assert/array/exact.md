# Ts.Assert.array.exact

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Assert.array.exact.someFunction()
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
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, any[], false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L222" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `bigint`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, bigint, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L78" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boolean`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, boolean, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L94" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Date`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, Date, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L158" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Error`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, Error, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L190" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `null`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, null, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L126" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `number`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, number, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L62" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `of`

```typescript
InputMatcherArgFactory<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L30" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Promise`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, Promise<any>, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L206" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `RegExp`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, RegExp, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L174" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `string`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, string, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L46" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `symbol`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, symbol, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L142" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `undefined`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, ExactKind>, undefined, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L110" />

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Array`

```typescript
type Array_<$Actual> = Kind.Apply<ExactKind, [any[], Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L221" />

Pre-curried matcher for any[]. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.Array<any[][]>

// ✗ Fail
type _ = Assert.array.exact.Array<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `bigint`

```typescript
type bigint_<$Actual> = Kind.Apply<ExactKind, [bigint, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L77" />

Pre-curried matcher for bigint. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.bigint<bigint[]>

// ✗ Fail
type _ = Assert.array.exact.bigint<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `boolean`

```typescript
type boolean_<$Actual> = Kind.Apply<ExactKind, [boolean, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L93" />

Pre-curried matcher for boolean. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.boolean<boolean[]>

// ✗ Fail
type _ = Assert.array.exact.boolean<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Date`

```typescript
type Date_<$Actual> = Kind.Apply<ExactKind, [Date, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L157" />

Pre-curried matcher for Date. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.Date<Date[]>

// ✗ Fail
type _ = Assert.array.exact.Date<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Error`

```typescript
type Error_<$Actual> = Kind.Apply<ExactKind, [Error, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L189" />

Pre-curried matcher for Error. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.Error<Error[]>

// ✗ Fail
type _ = Assert.array.exact.Error<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `null`

```typescript
type null_<$Actual> = Kind.Apply<ExactKind, [null, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L125" />

Pre-curried matcher for null. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.null<null[]>

// ✗ Fail
type _ = Assert.array.exact.null<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `number`

```typescript
type number_<$Actual> = Kind.Apply<ExactKind, [number, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L61" />

Pre-curried matcher for number. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.number<number[]>

// ✗ Fail
type _ = Assert.array.exact.number<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `of`

```typescript
type of_<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L29" />

array + exact relation matchers.

Extraction: extracts the element type from an array Relation: exact structural equality

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Promise`

```typescript
type Promise_<$Actual> = Kind.Apply<ExactKind, [Promise<any>, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L205" />

Pre-curried matcher for Promise. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.Promise<Promise<any>[]>

// ✗ Fail
type _ = Assert.array.exact.Promise<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RegExp`

```typescript
type RegExp_<$Actual> = Kind.Apply<ExactKind, [RegExp, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L173" />

Pre-curried matcher for RegExp. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.RegExp<RegExp[]>

// ✗ Fail
type _ = Assert.array.exact.RegExp<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `string`

```typescript
type string_<$Actual> = Kind.Apply<ExactKind, [string, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L45" />

Pre-curried matcher for string. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.string<string[]>

// ✗ Fail
type _ = Assert.array.exact.string<number[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `symbol`

```typescript
type symbol_<$Actual> = Kind.Apply<ExactKind, [symbol, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L141" />

Pre-curried matcher for symbol. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.symbol<symbol[]>

// ✗ Fail
type _ = Assert.array.exact.symbol<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `undefined`

```typescript
type undefined_<$Actual> = Kind.Apply<ExactKind, [undefined, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/exact.ts#L109" />

Pre-curried matcher for undefined. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.exact.undefined<undefined[]>

// ✗ Fail
type _ = Assert.array.exact.undefined<string[]>
```
