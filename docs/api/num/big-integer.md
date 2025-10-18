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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L48" />

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a BigInteger

Type predicate to check if value is a BigInteger.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: string | number | bigint): BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L73" />

**Parameters:**

- `value` - The value to convert (number, string, or bigint)

**Returns:** The BigInteger representation

Construct a BigInteger from various input types.

Accepts numbers, strings, and existing bigints, providing a safe way to create arbitrary precision integers from different sources.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `add`

```typescript
(a: BigInteger, b: BigInteger): BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L108" />

**Parameters:**

- `a` - First BigInteger to add
- `b` - Second BigInteger to add

**Returns:** The exact sum as a BigInteger

Add two BigIntegers together.

Performs exact addition without precision loss, regardless of the size of the numbers involved.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `subtract`

```typescript
(a: BigInteger, b: BigInteger): BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L161" />

**Parameters:**

- `a` - First BigInteger (minuend)
- `b` - Second BigInteger (subtrahend)

**Returns:** The exact difference as a BigInteger

Subtract two BigIntegers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `multiply`

```typescript
(a: BigInteger, b: BigInteger): BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L210" />

**Parameters:**

- `a` - First BigInteger
- `b` - Second BigInteger

**Returns:** The exact product as a BigInteger

Multiply two BigIntegers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `divide`

```typescript
(a: BigInteger, b: BigInteger): BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L262" />

**Parameters:**

- `a` - First BigInteger (dividend)
- `b` - Second BigInteger (divisor, must be non-zero)

**Returns:** The quotient as a BigInteger (truncated)

**Throws:**

- Error if divisor is zero

Divide two BigIntegers using integer division (truncates toward zero).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `remainder`

```typescript
(a: BigInteger, b: BigInteger): BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L315" />

**Parameters:**

- `a` - First BigInteger (dividend)
- `b` - Second BigInteger (divisor, must be non-zero)

**Returns:** The remainder as a BigInteger

**Throws:**

- Error if divisor is zero

Get the remainder of BigInteger division.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `power`

```typescript
(base: BigInteger, exponent: BigInteger): BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L368" />

**Parameters:**

- `base` - The BigInteger base
- `exponent` - The BigInteger exponent (must be non-negative)

**Returns:** base raised to the power of exponent

**Throws:**

- Error if exponent is negative

Raise a BigInteger to a power.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `abs`

```typescript
(value: BigInteger): BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L419" />

**Parameters:**

- `value` - The BigInteger

**Returns:** The absolute value as a BigInteger

Get the absolute value of a BigInteger.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `compare`

```typescript
(a: BigInteger, b: BigInteger): 0 | 1 | -1
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L437" />

**Parameters:**

- `a` - First BigInteger
- `b` - Second BigInteger

**Returns:** -1 if a b, 0 if a = b, 1 if a b

Compare two BigIntegers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isEven`

```typescript
(value: BigInteger): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L487" />

**Parameters:**

- `value` - The BigInteger to check

**Returns:** True if the BigInteger is even

Check if a BigInteger is even.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isOdd`

```typescript
(value: BigInteger): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L502" />

**Parameters:**

- `value` - The BigInteger to check

**Returns:** True if the BigInteger is odd

Check if a BigInteger is odd.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isPositive`

```typescript
(value: BigInteger): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L517" />

**Parameters:**

- `value` - The BigInteger to check

**Returns:** True if the BigInteger is positive

Check if a BigInteger is positive ( 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isNegative`

```typescript
(value: BigInteger): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L532" />

**Parameters:**

- `value` - The BigInteger to check

**Returns:** True if the BigInteger is negative

Check if a BigInteger is negative ( 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isZero`

```typescript
(value: BigInteger): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L546" />

**Parameters:**

- `value` - The BigInteger to check

**Returns:** True if the BigInteger is zero

Check if a BigInteger is zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toNumber`

```typescript
(value: BigInteger): number
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L564" />

**Parameters:**

- `value` - The BigInteger to convert

**Returns:** The number representation

**Throws:**

- Error if the BigInteger is too large for safe conversion

Convert BigInteger to regular number.

WARNING: May lose precision if the BigInteger is larger than Number.MAX_SAFE_INTEGER.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toString`

```typescript
(value: BigInteger, radix?: number = 10): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L588" />

**Parameters:**

- `value` - The BigInteger to convert
- `radix` - The base to use (default: 10)

**Returns:** String representation

Convert BigInteger to string representation.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ZERO`

```typescript
BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L84" />

BigInteger constants for common values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ONE`

```typescript
BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L85" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `TWO`

```typescript
BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L86" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addOn`

```typescript
(a: BigInteger) => (b: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L129" />

Create a function that operates on a specific BigInteger by adding to it. Data-first pattern: the fixed value is the first parameter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addWith`

```typescript
(b: BigInteger) => (a: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L147" />

Create a function that adds with a specific BigInteger value. Data-second pattern: the fixed value is the second parameter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractWith`

```typescript
(b: BigInteger) => (a: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L177" />

Create a function that subtracts with a specific BigInteger. Data-second pattern: the fixed value is the second parameter (subtrahend).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractOn`

```typescript
(a: BigInteger) => (b: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L191" />

Create a function that operates on a specific BigInteger by subtracting from it. Data-first pattern: the fixed value is the first parameter (minuend).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyOn`

```typescript
(a: BigInteger) => (b: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L227" />

Create a function that operates on a specific BigInteger by multiplying it. Data-first pattern: the fixed value is the first parameter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyWith`

```typescript
(b: BigInteger) => (a: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L244" />

Create a function that multiplies with a specific BigInteger. Data-second pattern: the fixed value is the second parameter (multiplier).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideOn`

```typescript
(a: BigInteger) => (b: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L281" />

Create a function that operates on a specific BigInteger by dividing it. Data-first pattern: the fixed value is the first parameter (dividend).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideWith`

```typescript
(b: BigInteger) => (a: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L298" />

Create a function that divides by a specific BigInteger. Data-second pattern: the fixed value is the second parameter (divisor).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `remainderOn`

```typescript
(a: BigInteger) => (b: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L335" />

Create a function that operates on a specific BigInteger to get its remainder. Data-first pattern: the fixed value is the first parameter (dividend).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `remainderWith`

```typescript
(b: BigInteger) => (a: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L351" />

Create a function that gets remainder with a specific divisor. Data-second pattern: the fixed value is the second parameter (divisor).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `powerOn`

```typescript
(base: BigInteger) => (exponent: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L388" />

Create a function that operates on a specific BigInteger base by raising it to powers. Data-first pattern: the fixed value is the first parameter (base).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `powerWith`

```typescript
(exponent: BigInteger) => (base: BigInteger) => BigInteger
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L406" />

Create a function that raises to a specific power. Data-second pattern: the fixed value is the second parameter (exponent).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareOn`

```typescript
(a: BigInteger) => (b: BigInteger) => 0 | 1 | -1
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L456" />

Create a function that operates on a specific BigInteger by comparing it. Data-first pattern: the fixed value is the first parameter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareWith`

```typescript
(b: BigInteger) => (a: BigInteger) => 0 | 1 | -1
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L474" />

Create a function that compares with a specific BigInteger. Data-second pattern: the fixed value is the second parameter.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `BigInteger`

```typescript
type BigInteger = bigint & { [BigIntegerBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/big-integer/big-integer.ts#L34" />

BigInteger

- arbitrary precision integer with branded type safety.

Provides exact arithmetic for integers of any size, without the limitations of JavaScript's Number type (which loses precision beyond 2^53-1).

Common uses:

- **Cryptography**: Large prime numbers, key generation, modular arithmetic
- **Financial systems**: Precise monetary calculations without rounding errors
- **Mathematical computing**: Factorials, combinatorics, number theory
- **Blockchain**: Transaction values, block numbers, hash computations
- **Scientific computing**: Large dataset indexing, ID generation
