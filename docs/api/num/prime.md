# Num.Prime

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Prime
```

```typescript [Barrel]
import { Prime } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L41" />

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a prime number

Type predicate to check if value is a prime number. Uses trial division optimization up to sqrt(n).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: Natural): Prime
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L74" />

**Parameters:**

- `value` - The number to convert to Prime

**Returns:** The value as a Prime number

**Throws:**

- Error if value is not prime

Construct a Prime number. Throws if the value is not prime.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: Natural): Prime | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L96" />

**Parameters:**

- `value` - The number to try converting

**Returns:** The Prime number or null

Try to construct a Prime number. Returns null if the value is not prime.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `next`

```typescript
(value: number): Prime
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L114" />

**Parameters:**

- `value` - Starting point (exclusive)

**Returns:** The next prime number

Find the next prime number after the given value.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prev`

```typescript
(value: number): Prime | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L141" />

**Parameters:**

- `value` - Starting point (exclusive)

**Returns:** The previous prime number or null

Find the previous prime number before the given value. Returns null if no prime exists before the value (i.e., value = 2).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `nth`

```typescript
(n: Natural): Prime
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L173" />

**Parameters:**

- `n` - Which prime to get (1 = first prime = 2)

**Returns:** The nth prime number

**Throws:**

- Error if n 1

Get the nth prime number (1-indexed). Uses a simple sieve for small n, trial division for larger.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `factorize`

```typescript
(value: Natural): Map<Prime, Natural>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L211" />

**Parameters:**

- `value` - The number to factorize (must be = 2)

**Returns:** Map of prime factors to exponents

**Throws:**

- Error if value 2

Prime factorization of a number. Returns a map of prime factors to their exponents.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Prime`

```typescript
type Prime = Natural & { [PrimeBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L26" />

Prime number (natural number

1 with no divisors except 1 and itself).

Prime numbers are fundamental in mathematics and essential for:

- Cryptography (RSA keys, Diffie-Hellman)
- Hash table sizing (reduces collisions)
- Random number generation
- Number theory algorithms
