# Ts.Assert.equiv

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Assert.equiv
```

```typescript [Barrel]
import { equiv } from '@wollybeard/kit/ts'
```

:::

## Namespaces

| Namespace                                        | Description |
| ------------------------------------------------ | ----------- |
| [**`noExcess`**](/api/ts/assert/equiv/no-excess) | —           |

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Array`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L210" /> {#c-array-210}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, any[], false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `bigint`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L75" /> {#c-bigint-75}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, bigint, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boolean`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L90" /> {#c-boolean-90}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, boolean, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Date`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L150" /> {#c-date-150}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, Date, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Error`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L180" /> {#c-error-180}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, Error, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `null`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L120" /> {#c-null-120}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, null, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `number`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L60" /> {#c-number-60}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, number, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `of`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L30" /> {#c-of-30}

```typescript
InputMatcherArgFactory<State.SetRelator<State.Empty, EquivKind>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Promise`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L195" /> {#c-promise-195}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, Promise<any>, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `RegExp`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L165" /> {#c-reg-exp-165}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, RegExp, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `string`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L45" /> {#c-string-45}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, string, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `symbol`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L135" /> {#c-symbol-135}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, symbol, false, false>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `undefined`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L105" /> {#c-undefined-105}

```typescript
InputActualFactory<State.SetMatcher<State.SetRelator<State.Empty, EquivKind>, undefined, false, false>>
```

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Array`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L209" /> {#t-array-209}

```typescript
type Array_<$Actual> = Kind.Apply<EquivKind, [any[], $Actual]>
```

Pre-curried matcher for any[].

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.Array<any[]>

// ✗ Fail
type _ = Assert.equiv.Array<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `bigint`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L74" /> {#t-bigint-74}

```typescript
type bigint_<$Actual> = Kind.Apply<EquivKind, [bigint, $Actual]>
```

Pre-curried matcher for bigint.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.bigint<bigint>

// ✗ Fail
type _ = Assert.equiv.bigint<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `boolean`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L89" /> {#t-boolean-89}

```typescript
type boolean_<$Actual> = Kind.Apply<EquivKind, [boolean, $Actual]>
```

Pre-curried matcher for boolean.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.boolean<boolean>

// ✗ Fail
type _ = Assert.equiv.boolean<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Date`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L149" /> {#t-date-149}

```typescript
type Date_<$Actual> = Kind.Apply<EquivKind, [Date, $Actual]>
```

Pre-curried matcher for Date.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.Date<Date>

// ✗ Fail
type _ = Assert.equiv.Date<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Error`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L179" /> {#t-error-179}

```typescript
type Error_<$Actual> = Kind.Apply<EquivKind, [Error, $Actual]>
```

Pre-curried matcher for Error.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.Error<Error>

// ✗ Fail
type _ = Assert.equiv.Error<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `null`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L119" /> {#t-null-119}

```typescript
type null_<$Actual> = Kind.Apply<EquivKind, [null, $Actual]>
```

Pre-curried matcher for null.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.null<null>

// ✗ Fail
type _ = Assert.equiv.null<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `number`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L59" /> {#t-number-59}

```typescript
type number_<$Actual> = Kind.Apply<EquivKind, [number, $Actual]>
```

Pre-curried matcher for number.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.number<number>

// ✗ Fail
type _ = Assert.equiv.number<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `of`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L29" /> {#t-of-29}

```typescript
type of_<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, $Actual]>
```

base + equiv relation matchers.

Direct type assertion Relation: mutual assignability (equivalent types)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Promise`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L194" /> {#t-promise-194}

```typescript
type Promise_<$Actual> = Kind.Apply<EquivKind, [Promise<any>, $Actual]>
```

Pre-curried matcher for Promise.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.Promise<Promise<any>>

// ✗ Fail
type _ = Assert.equiv.Promise<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RegExp`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L164" /> {#t-reg-exp-164}

```typescript
type RegExp_<$Actual> = Kind.Apply<EquivKind, [RegExp, $Actual]>
```

Pre-curried matcher for RegExp.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.RegExp<RegExp>

// ✗ Fail
type _ = Assert.equiv.RegExp<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `string`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L44" /> {#t-string-44}

```typescript
type string_<$Actual> = Kind.Apply<EquivKind, [string, $Actual]>
```

Pre-curried matcher for string.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.string<string>

// ✗ Fail
type _ = Assert.equiv.string<number>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `symbol`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L134" /> {#t-symbol-134}

```typescript
type symbol_<$Actual> = Kind.Apply<EquivKind, [symbol, $Actual]>
```

Pre-curried matcher for symbol.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.symbol<symbol>

// ✗ Fail
type _ = Assert.equiv.symbol<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `undefined`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/builder-generated/equiv/$$.ts#L104" /> {#t-undefined-104}

```typescript
type undefined_<$Actual> = Kind.Apply<EquivKind, [undefined, $Actual]>
```

Pre-curried matcher for undefined.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// ✓ Pass
type _ = Assert.equiv.undefined<undefined>

// ✗ Fail
type _ = Assert.equiv.undefined<string>
```
