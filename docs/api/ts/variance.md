# Ts.Variance

_Ts_ / **Variance**

Phantom type helper that makes a type parameter covariant.

@remarks
Covariance allows subtypes to be assigned to supertypes (natural direction).
Example: `Phantom<Covariant<1>>` can be assigned to `Phantom<Covariant<number>>`.

Use this when you want narrower types to flow to wider types:

- Literal types → base types (`1` → `number`, `'hello'` → `string`)
- Subclasses → base classes
- More specific → more general

@example

```ts
interface Container<T> {
  readonly __type?: Covariant<T>
}

let narrow: Container<1> = {}
let wide: Container<number> = {}

wide = narrow // ✅ Allowed (1 extends number)
narrow = wide // ❌ Error (number does not extend 1)
```

@see {@link https://www.typescriptlang.org/docs/handbook/type-compatibility.html | TypeScript Type Compatibility}

## Import

```typescript
import { Ts } from '@wollybeard/kit/ts'

// Access via namespace
Ts.Variance.someFunction()
```

## Types

### Co <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/variance.ts#L28)</sub>

Phantom type helper that makes a type parameter covariant.

```typescript
export type Co<$T> = () => $T
```

**Examples:**

```ts twoslash
readonly __type?: Covariant<T>
}

let narrow: Container<1> = {}
let wide: Container<number> = {}

wide = narrow  // ✅ Allowed (1 extends number)
narrow = wide  // ❌ Error (number does not extend 1)
```

### Contra <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/variance.ts#L55)</sub>

Phantom type helper that makes a type parameter contravariant.

```typescript
export type Contra<$T> = (value: $T) => void
```

**Examples:**

```ts twoslash
readonly __type?: Contravariant<T>
}

let narrow: Handler<1> = {}
let wide: Handler<number> = {}

narrow = wide  // ✅ Allowed (reversed direction!)
wide = narrow  // ❌ Error
```

### In <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/variance.ts#L77)</sub>

Phantom type helper that makes a type parameter invariant.

```typescript
export type In<$T> = (value: $T) => $T
```

**Examples:**

```ts twoslash
readonly __type?: Invariant<T>
}

let one: Exact<1> = {}
let num: Exact<number> = {}

num = one  // ❌ Error (no direction works)
one = num  // ❌ Error (no direction works)
```

### Bi <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/variance.ts#L99)</sub>

Phantom type helper that makes a type parameter bivariant (unsafe).

```typescript
export type Bi<$T> = { bivariantHack(value: $T): void }['bivariantHack']
```

**Examples:**

```ts twoslash
readonly __type?: Bivariant<T>
}

let one: Unsafe<1> = {}
let num: Unsafe<number> = {}

num = one  // ⚠️ Allowed (both directions work)
one = num  // ⚠️ Allowed (unsafe!)
```
