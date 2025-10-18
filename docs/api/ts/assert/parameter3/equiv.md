# Ts.Assert.parameter3.equiv

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Assert.parameter3.equiv.someFunction()
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
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, any[], false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L222" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `bigint`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, bigint, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L78" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boolean`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, boolean, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L94" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Date`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, Date, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L158" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Error`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, Error, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L190" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `null`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, null, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L126" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `number`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, number, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L62" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `of`

```typescript
InputMatcherArgFactory<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L30" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Promise`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, Promise<any>, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L206" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `RegExp`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, RegExp, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L174" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `string`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, string, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L46" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `symbol`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, symbol, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L142" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `undefined`

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.AddExtractor<State.Empty, Parameter3>, EquivKind>, undefined, false, false>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L110" />

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Array`

```typescript
type Array_<$Actual> = Kind.Apply<EquivKind, [any[], Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L221" />

Pre-curried matcher for any[]. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.Array<(arg: any[]) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.Array<(arg: string) => any>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `bigint`

```typescript
type bigint_<$Actual> = Kind.Apply<EquivKind, [bigint, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L77" />

Pre-curried matcher for bigint. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.bigint<(arg: bigint) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.bigint<(arg: string) => any>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `boolean`

```typescript
type boolean_<$Actual> = Kind.Apply<EquivKind, [boolean, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L93" />

Pre-curried matcher for boolean. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.boolean<(arg: boolean) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.boolean<(arg: string) => any>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Date`

```typescript
type Date_<$Actual> = Kind.Apply<EquivKind, [Date, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L157" />

Pre-curried matcher for Date. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.Date<(arg: Date) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.Date<(arg: string) => any>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Error`

```typescript
type Error_<$Actual> = Kind.Apply<EquivKind, [Error, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L189" />

Pre-curried matcher for Error. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.Error<(arg: Error) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.Error<(arg: string) => any>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `null`

```typescript
type null_<$Actual> = Kind.Apply<EquivKind, [null, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L125" />

Pre-curried matcher for null. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.null<(arg: null) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.null<(arg: string) => any>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `number`

```typescript
type number_<$Actual> = Kind.Apply<EquivKind, [number, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L61" />

Pre-curried matcher for number. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.number<(arg: number) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.number<(arg: string) => any>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `of`

```typescript
type of_<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L29" />

parameter3 + equiv relation matchers.

Extraction: extracts the third parameter type from a function Relation: mutual assignability (equivalent types)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Promise`

```typescript
type Promise_<$Actual> = Kind.Apply<EquivKind, [Promise<any>, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L205" />

Pre-curried matcher for Promise. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.Promise<(arg: Promise<any>) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.Promise<(arg: string) => any>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RegExp`

```typescript
type RegExp_<$Actual> = Kind.Apply<EquivKind, [RegExp, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L173" />

Pre-curried matcher for RegExp. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.RegExp<(arg: RegExp) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.RegExp<(arg: string) => any>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `string`

```typescript
type string_<$Actual> = Kind.Apply<EquivKind, [string, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L45" />

Pre-curried matcher for string. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.string<(arg: string) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.string<(arg: number) => any>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `symbol`

```typescript
type symbol_<$Actual> = Kind.Apply<EquivKind, [symbol, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L141" />

Pre-curried matcher for symbol. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.symbol<(arg: symbol) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.symbol<(arg: string) => any>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `undefined`

```typescript
type undefined_<$Actual> = Kind.Apply<EquivKind, [undefined, Kind.Apply<Parameter3, [$Actual]>]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/parameter3/equiv.ts#L109" />

Pre-curried matcher for undefined. Extraction chain: (p1: any, p2: any, p3: T, ...) = any → T

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.parameter3.equiv.undefined<(arg: undefined) => any>

// ✗ Fail
type _ = Assert.parameter3.equiv.undefined<(arg: string) => any>
```
