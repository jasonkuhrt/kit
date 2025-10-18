# Ts.VariancePhantom

Phantom type helper that makes a type parameter covariant.

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.VariancePhantom.someFunction()
```

```typescript [Barrel]
import { VariancePhantom } from '@wollybeard/kit/ts'

// Access via direct import
VariancePhantom.someFunction()
```

:::

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Co`

```typescript
type Co<$T> = () => $T
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/variance-phantom.ts#L28" />

Phantom type helper that makes a type parameter covariant.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
interface Container<T> {
  readonly __type?: Covariant<T>
}

let narrow: Container<1> = {}
let wide: Container<number> = {}

wide = narrow  // ✅ Allowed (1 extends number)
narrow = wide  // ❌ Error (number does not extend 1)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Contra`

```typescript
type Contra<$T> = (value: $T) => void
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/variance-phantom.ts#L55" />

Phantom type helper that makes a type parameter contravariant.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
interface Handler<T> {
  readonly __type?: Contravariant<T>
}

let narrow: Handler<1> = {}
let wide: Handler<number> = {}

narrow = wide  // ✅ Allowed (reversed direction!)
wide = narrow  // ❌ Error
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `In`

```typescript
type In<$T> = (value: $T) => $T
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/variance-phantom.ts#L77" />

Phantom type helper that makes a type parameter invariant.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
interface Exact<T> {
  readonly __type?: Invariant<T>
}

let one: Exact<1> = {}
let num: Exact<number> = {}

num = one  // ❌ Error (no direction works)
one = num  // ❌ Error (no direction works)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Bi`

```typescript
type Bi<$T> = { bivariantHack(value: $T): void }['bivariantHack']
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/variance-phantom.ts#L99" />

Phantom type helper that makes a type parameter bivariant (unsafe).

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
interface Unsafe<T> {
  readonly __type?: Bivariant<T>
}

let one: Unsafe<1> = {}
let num: Unsafe<number> = {}

num = one  // ⚠️ Allowed (both directions work)
one = num  // ⚠️ Allowed (unsafe!)
```
