# Num.Int

_Num_ / **Int**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Int.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.Int.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/int/int.ts#L42" />

**Parameters:**

- `value` - The value to check

**Returns:** True if value is an integer

Type predicate to check if value is an integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): Int
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/int/int.ts#L64" />

**Parameters:**

- `value` - The number to convert to Int

**Returns:** The value as an Int

**Throws:**

- Error if value is not an integer

Construct an Int. Throws if the value is not an integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): Int | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/int/int.ts#L85" />

**Parameters:**

- `value` - The number to try converting

**Returns:** The Int or null

Try to construct an Int. Returns null if the value is not an integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `parse`

```typescript
(value: string): Int | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/int/int.ts#L107" />

**Parameters:**

- `value` - The string to parse

**Returns:** The parsed Int or null

Parse a string to an Int. Uses parseInt with base 10.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `round`

```typescript
(value: number): Int
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/int/int.ts#L127" />

**Parameters:**

- `value` - The number to round

**Returns:** The rounded integer

Round a number to the nearest integer. Uses standard rounding rules (0.5 rounds up).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Int`

```typescript
type Int = number & { [IntBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/int/int.ts#L25" />

Integer number.

Integers are whole numbers without fractional parts. They can be positive, negative, or zero. In JavaScript, integers are represented as floating-point numbers but are guaranteed to have no decimal part.
