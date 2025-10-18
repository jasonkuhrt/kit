# Ts.Assert.parameters.equiv

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Assert.parameters.equiv.someFunction()
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
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, any[], false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L222" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `bigint`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, bigint, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L78" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boolean`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, boolean, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L94" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Date`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, Date, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L158" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Error`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, Error, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L190" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `null`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, null, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L126" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `number`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, number, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L62" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `of`

```typescript
InputMatcherArgFactory<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L30" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Promise`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, Promise<any>, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L206" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `RegExp`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, RegExp, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L174" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `string`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, string, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L46" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `symbol`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, symbol, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L142" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `undefined`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameters$>, EquivKind>, undefined, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L110" />

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Array`

```typescript
type Array_<$Actual> = Kind.Apply<EquivKind, [any[], Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L221" />

Pre-curried matcher for any[]. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.Array<(...args: any[]) => any[]>

// ✗ Fail
type _ = Assert.parameters.equiv.Array<(...args: any[]) => string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `bigint`

```typescript
type bigint_<$Actual> = Kind.Apply<EquivKind, [bigint, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L77" />

Pre-curried matcher for bigint. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.bigint<(...args: any[]) => bigint>

// ✗ Fail
type _ = Assert.parameters.equiv.bigint<(...args: any[]) => string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `boolean`

```typescript
type boolean_<$Actual> = Kind.Apply<EquivKind, [boolean, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L93" />

Pre-curried matcher for boolean. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.boolean<(...args: any[]) => boolean>

// ✗ Fail
type _ = Assert.parameters.equiv.boolean<(...args: any[]) => string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Date`

```typescript
type Date_<$Actual> = Kind.Apply<EquivKind, [Date, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L157" />

Pre-curried matcher for Date. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.Date<(...args: any[]) => Date>

// ✗ Fail
type _ = Assert.parameters.equiv.Date<(...args: any[]) => string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Error`

```typescript
type Error_<$Actual> = Kind.Apply<EquivKind, [Error, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L189" />

Pre-curried matcher for Error. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.Error<(...args: any[]) => Error>

// ✗ Fail
type _ = Assert.parameters.equiv.Error<(...args: any[]) => string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `null`

```typescript
type null_<$Actual> = Kind.Apply<EquivKind, [null, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L125" />

Pre-curried matcher for null. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.null<(...args: any[]) => null>

// ✗ Fail
type _ = Assert.parameters.equiv.null<(...args: any[]) => string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `number`

```typescript
type number_<$Actual> = Kind.Apply<EquivKind, [number, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L61" />

Pre-curried matcher for number. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.number<(...args: any[]) => number>

// ✗ Fail
type _ = Assert.parameters.equiv.number<(...args: any[]) => string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `of`

```typescript
type of_<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L29" />

parameters + equiv relation matchers.

Extraction: extracts the parameters tuple from a function Relation: mutual assignability (equivalent types)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Promise`

```typescript
type Promise_<$Actual> = Kind.Apply<EquivKind, [Promise<any>, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L205" />

Pre-curried matcher for Promise. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.Promise<(...args: any[]) => Promise<any>>

// ✗ Fail
type _ = Assert.parameters.equiv.Promise<(...args: any[]) => string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RegExp`

```typescript
type RegExp_<$Actual> = Kind.Apply<EquivKind, [RegExp, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L173" />

Pre-curried matcher for RegExp. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.RegExp<(...args: any[]) => RegExp>

// ✗ Fail
type _ = Assert.parameters.equiv.RegExp<(...args: any[]) => string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `string`

```typescript
type string_<$Actual> = Kind.Apply<EquivKind, [string, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L45" />

Pre-curried matcher for string. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.string<(...args: any[]) => string>

// ✗ Fail
type _ = Assert.parameters.equiv.string<(...args: any[]) => number>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `symbol`

```typescript
type symbol_<$Actual> = Kind.Apply<EquivKind, [symbol, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L141" />

Pre-curried matcher for symbol. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.symbol<(...args: any[]) => symbol>

// ✗ Fail
type _ = Assert.parameters.equiv.symbol<(...args: any[]) => string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `undefined`

```typescript
type undefined_<$Actual> = Kind.Apply<EquivKind, [undefined, Kind.Apply<Parameters$, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameters/equiv.ts#L109" />

Pre-curried matcher for undefined. Extraction chain: (...args: any[]) = T → Parameters

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameters.equiv.undefined<(...args: any[]) => undefined>

// ✗ Fail
type _ = Assert.parameters.equiv.undefined<(...args: any[]) => string>
```
