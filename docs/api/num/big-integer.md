# Num.BigInteger

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.BigInteger
```

```typescript [Barrel]
import { BigInteger } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L48" /> {#f-is-48}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a BigInteger

Type predicate to check if value is a BigInteger.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L73" /> {#f-from-73}

```typescript
(value: string | number | bigint): BigInteger
```

**Parameters:**

- `value` - The value to convert (number, string, or bigint)

**Returns:** The BigInteger representation

Construct a BigInteger from various input types.

Accepts numbers, strings, and existing bigints, providing a safe way to create arbitrary precision integers from different sources.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `add`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L108" /> {#f-add-108}

```typescript
(a: BigInteger, b: BigInteger): BigInteger
```

**Parameters:**

- `a` - First BigInteger to add
- `b` - Second BigInteger to add

**Returns:** The exact sum as a BigInteger

Add two BigIntegers together.

Performs exact addition without precision loss, regardless of the size of the numbers involved.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `subtract`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L161" /> {#f-subtract-161}

```typescript
(a: BigInteger, b: BigInteger): BigInteger
```

**Parameters:**

- `a` - First BigInteger (minuend)
- `b` - Second BigInteger (subtrahend)

**Returns:** The exact difference as a BigInteger

Subtract two BigIntegers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `multiply`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L210" /> {#f-multiply-210}

```typescript
(a: BigInteger, b: BigInteger): BigInteger
```

**Parameters:**

- `a` - First BigInteger
- `b` - Second BigInteger

**Returns:** The exact product as a BigInteger

Multiply two BigIntegers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `divide`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L262" /> {#f-divide-262}

```typescript
(a: BigInteger, b: BigInteger): BigInteger
```

**Parameters:**

- `a` - First BigInteger (dividend)
- `b` - Second BigInteger (divisor, must be non-zero)

**Returns:** The quotient as a BigInteger (truncated)

**Throws:**

- Error if divisor is zero

Divide two BigIntegers using integer division (truncates toward zero).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `remainder`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L315" /> {#f-remainder-315}

```typescript
(a: BigInteger, b: BigInteger): BigInteger
```

**Parameters:**

- `a` - First BigInteger (dividend)
- `b` - Second BigInteger (divisor, must be non-zero)

**Returns:** The remainder as a BigInteger

**Throws:**

- Error if divisor is zero

Get the remainder of BigInteger division.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `power`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L368" /> {#f-power-368}

```typescript
(base: BigInteger, exponent: BigInteger): BigInteger
```

**Parameters:**

- `base` - The BigInteger base
- `exponent` - The BigInteger exponent (must be non-negative)

**Returns:** base raised to the power of exponent

**Throws:**

- Error if exponent is negative

Raise a BigInteger to a power.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `abs`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L419" /> {#f-abs-419}

```typescript
(value: BigInteger): BigInteger
```

**Parameters:**

- `value` - The BigInteger

**Returns:** The absolute value as a BigInteger

Get the absolute value of a BigInteger.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `compare`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L437" /> {#f-compare-437}

```typescript
(a: BigInteger, b: BigInteger): 0 | 1 | -1
```

**Parameters:**

- `a` - First BigInteger
- `b` - Second BigInteger

**Returns:** -1 if a b, 0 if a = b, 1 if a b

Compare two BigIntegers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isEven`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L487" /> {#f-is-even-487}

```typescript
(value: BigInteger): boolean
```

**Parameters:**

- `value` - The BigInteger to check

**Returns:** True if the BigInteger is even

Check if a BigInteger is even.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isOdd`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L502" /> {#f-is-odd-502}

```typescript
(value: BigInteger): boolean
```

**Parameters:**

- `value` - The BigInteger to check

**Returns:** True if the BigInteger is odd

Check if a BigInteger is odd.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isPositive`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L517" /> {#f-is-positive-517}

```typescript
(value: BigInteger): boolean
```

**Parameters:**

- `value` - The BigInteger to check

**Returns:** True if the BigInteger is positive

Check if a BigInteger is positive ( 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isNegative`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L532" /> {#f-is-negative-532}

```typescript
(value: BigInteger): boolean
```

**Parameters:**

- `value` - The BigInteger to check

**Returns:** True if the BigInteger is negative

Check if a BigInteger is negative ( 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isZero`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L546" /> {#f-is-zero-546}

```typescript
(value: BigInteger): boolean
```

**Parameters:**

- `value` - The BigInteger to check

**Returns:** True if the BigInteger is zero

Check if a BigInteger is zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toNumber`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L564" /> {#f-to-number-564}

```typescript
(value: BigInteger): number
```

**Parameters:**

- `value` - The BigInteger to convert

**Returns:** The number representation

**Throws:**

- Error if the BigInteger is too large for safe conversion

Convert BigInteger to regular number.

WARNING: May lose precision if the BigInteger is larger than Number.MAX_SAFE_INTEGER.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toString`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L588" /> {#f-to-string-588}

```typescript
(value: BigInteger, radix?: number = 10): string
```

**Parameters:**

- `value` - The BigInteger to convert
- `radix` - The base to use (default: 10)

**Returns:** String representation

Convert BigInteger to string representation.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ZERO`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L84" /> {#c-zero-84}

```typescript
BigInteger
```

BigInteger constants for common values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ONE`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L85" /> {#c-one-85}

```typescript
BigInteger
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `TWO`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L86" /> {#c-two-86}

```typescript
BigInteger
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L129" /> {#c-add-on-129}

```typescript
(a: BigInteger) => (b: BigInteger) => BigInteger
```

Create a function that operates on a specific BigInteger by adding to it. Data-first pattern: the fixed value is the first parameter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L147" /> {#c-add-with-147}

```typescript
(b: BigInteger) => (a: BigInteger) => BigInteger
```

Create a function that adds with a specific BigInteger value. Data-second pattern: the fixed value is the second parameter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L177" /> {#c-subtract-with-177}

```typescript
(b: BigInteger) => (a: BigInteger) => BigInteger
```

Create a function that subtracts with a specific BigInteger. Data-second pattern: the fixed value is the second parameter (subtrahend).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L191" /> {#c-subtract-on-191}

```typescript
(a: BigInteger) => (b: BigInteger) => BigInteger
```

Create a function that operates on a specific BigInteger by subtracting from it. Data-first pattern: the fixed value is the first parameter (minuend).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L227" /> {#c-multiply-on-227}

```typescript
(a: BigInteger) => (b: BigInteger) => BigInteger
```

Create a function that operates on a specific BigInteger by multiplying it. Data-first pattern: the fixed value is the first parameter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L244" /> {#c-multiply-with-244}

```typescript
(b: BigInteger) => (a: BigInteger) => BigInteger
```

Create a function that multiplies with a specific BigInteger. Data-second pattern: the fixed value is the second parameter (multiplier).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L281" /> {#c-divide-on-281}

```typescript
(a: BigInteger) => (b: BigInteger) => BigInteger
```

Create a function that operates on a specific BigInteger by dividing it. Data-first pattern: the fixed value is the first parameter (dividend).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L298" /> {#c-divide-with-298}

```typescript
(b: BigInteger) => (a: BigInteger) => BigInteger
```

Create a function that divides by a specific BigInteger. Data-second pattern: the fixed value is the second parameter (divisor).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `remainderOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L335" /> {#c-remainder-on-335}

```typescript
(a: BigInteger) => (b: BigInteger) => BigInteger
```

Create a function that operates on a specific BigInteger to get its remainder. Data-first pattern: the fixed value is the first parameter (dividend).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `remainderWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L351" /> {#c-remainder-with-351}

```typescript
(b: BigInteger) => (a: BigInteger) => BigInteger
```

Create a function that gets remainder with a specific divisor. Data-second pattern: the fixed value is the second parameter (divisor).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `powerOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L388" /> {#c-power-on-388}

```typescript
(base: BigInteger) => (exponent: BigInteger) => BigInteger
```

Create a function that operates on a specific BigInteger base by raising it to powers. Data-first pattern: the fixed value is the first parameter (base).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `powerWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L406" /> {#c-power-with-406}

```typescript
(exponent: BigInteger) => (base: BigInteger) => BigInteger
```

Create a function that raises to a specific power. Data-second pattern: the fixed value is the second parameter (exponent).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L456" /> {#c-compare-on-456}

```typescript
(a: BigInteger) => (b: BigInteger) => 0 | 1 | -1
```

Create a function that operates on a specific BigInteger by comparing it. Data-first pattern: the fixed value is the first parameter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L474" /> {#c-compare-with-474}

```typescript
(b: BigInteger) => (a: BigInteger) => 0 | 1 | -1
```

Create a function that compares with a specific BigInteger. Data-second pattern: the fixed value is the second parameter.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `BigInteger`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L34" /> {#intersection-big-integer-34}

```typescript
type BigInteger = bigint & { [BigIntegerBrand]: true }
```

BigInteger

- arbitrary precision integer with branded type safety.

Provides exact arithmetic for integers of any size, without the limitations of JavaScript's Number type (which loses precision beyond 2^53-1).

Common uses:

- **Cryptography**: Large prime numbers, key generation, modular arithmetic
- **Financial systems**: Precise monetary calculations without rounding errors
- **Mathematical computing**: Factorials, combinatorics, number theory
- **Blockchain**: Transaction values, block numbers, hash computations
- **Scientific computing**: Large dataset indexing, ID generation
