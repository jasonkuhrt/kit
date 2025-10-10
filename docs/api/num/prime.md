# Num.Prime

_Num_ / **Prime**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Prime.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.Prime.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown) => value is Prime
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L41" />

Type predicate to check if value is a prime number. Uses trial division optimization up to sqrt(n).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
;((value: Natural) => Prime)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L74" />

Construct a Prime number. Throws if the value is not prime.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
;((value: Natural) => Prime | null)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L96" />

Try to construct a Prime number. Returns null if the value is not prime.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `next`

```typescript
;((value: number) => Prime)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L114" />

Find the next prime number after the given value.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prev`

```typescript
;((value: number) => Prime | null)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L141" />

Find the previous prime number before the given value. Returns null if no prime exists before the value (i.e., value = 2).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `nth`

```typescript
;((n: Natural) => Prime)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L173" />

Get the nth prime number (1-indexed). Uses a simple sieve for small n, trial division for larger.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `factorize`

```typescript
;((value: Natural) => Map<Prime, Natural>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/prime/prime.ts#L211" />

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
