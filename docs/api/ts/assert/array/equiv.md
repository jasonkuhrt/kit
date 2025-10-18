# Ts.Assert.array.equiv

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Assert.array.equiv.someFunction()
```

```typescript [Barrel]
import { equiv } from '@wollybeard/kit/ts'

// Access via direct import
equiv.someFunction()
```

:::

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Array`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, any[], false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L222" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `bigint`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, bigint, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L78" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boolean`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, boolean, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L94" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Date`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, Date, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L158" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Error`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, Error, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L190" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `null`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, null, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L126" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `number`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, number, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L62" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `of`

```typescript
InputMatcherArgFactory<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L30" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Promise`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, Promise<any>, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L206" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `RegExp`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, RegExp, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L174" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `string`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, string, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L46" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `symbol`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, symbol, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L142" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `undefined`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, ArrayElement>, EquivKind>, undefined, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L110" />

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Array`

```typescript
type Array_<$Actual> = Kind.Apply<EquivKind, [any[], Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L221" />

Pre-curried matcher for any[]. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.Array<any[][]>

// ✗ Fail
type _ = Assert.array.equiv.Array<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `bigint`

```typescript
type bigint_<$Actual> = Kind.Apply<EquivKind, [bigint, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L77" />

Pre-curried matcher for bigint. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.bigint<bigint[]>

// ✗ Fail
type _ = Assert.array.equiv.bigint<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `boolean`

```typescript
type boolean_<$Actual> = Kind.Apply<EquivKind, [boolean, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L93" />

Pre-curried matcher for boolean. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.boolean<boolean[]>

// ✗ Fail
type _ = Assert.array.equiv.boolean<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Date`

```typescript
type Date_<$Actual> = Kind.Apply<EquivKind, [Date, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L157" />

Pre-curried matcher for Date. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.Date<Date[]>

// ✗ Fail
type _ = Assert.array.equiv.Date<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Error`

```typescript
type Error_<$Actual> = Kind.Apply<EquivKind, [Error, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L189" />

Pre-curried matcher for Error. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.Error<Error[]>

// ✗ Fail
type _ = Assert.array.equiv.Error<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `null`

```typescript
type null_<$Actual> = Kind.Apply<EquivKind, [null, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L125" />

Pre-curried matcher for null. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.null<null[]>

// ✗ Fail
type _ = Assert.array.equiv.null<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `number`

```typescript
type number_<$Actual> = Kind.Apply<EquivKind, [number, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L61" />

Pre-curried matcher for number. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.number<number[]>

// ✗ Fail
type _ = Assert.array.equiv.number<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `of`

```typescript
type of_<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L29" />

array + equiv relation matchers.

Extraction: extracts the element type from an array Relation: mutual assignability (equivalent types)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Promise`

```typescript
type Promise_<$Actual> = Kind.Apply<EquivKind, [Promise<any>, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L205" />

Pre-curried matcher for Promise. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.Promise<Promise<any>[]>

// ✗ Fail
type _ = Assert.array.equiv.Promise<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RegExp`

```typescript
type RegExp_<$Actual> = Kind.Apply<EquivKind, [RegExp, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L173" />

Pre-curried matcher for RegExp. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.RegExp<RegExp[]>

// ✗ Fail
type _ = Assert.array.equiv.RegExp<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `string`

```typescript
type string_<$Actual> = Kind.Apply<EquivKind, [string, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L45" />

Pre-curried matcher for string. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.string<string[]>

// ✗ Fail
type _ = Assert.array.equiv.string<number[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `symbol`

```typescript
type symbol_<$Actual> = Kind.Apply<EquivKind, [symbol, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L141" />

Pre-curried matcher for symbol. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.symbol<symbol[]>

// ✗ Fail
type _ = Assert.array.equiv.symbol<string[]>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `undefined`

```typescript
type undefined_<$Actual> = Kind.Apply<EquivKind, [undefined, Kind.Apply<ArrayElement, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/array/equiv.ts#L109" />

Pre-curried matcher for undefined. Extraction chain: T[] → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.array.equiv.undefined<undefined[]>

// ✗ Fail
type _ = Assert.array.equiv.undefined<string[]>
```
