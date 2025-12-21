/**
 * Phantom type helper that makes a type parameter covariant.
 *
 * @remarks
 * Covariance allows subtypes to be assigned to supertypes (natural direction).
 * Example: `Phantom<Covariant<1>>` can be assigned to `Phantom<Covariant<number>>`.
 *
 * Use this when you want narrower types to flow to wider types:
 * - Literal types → base types (`1` → `number`, `'hello'` → `string`)
 * - Subclasses → base classes
 * - More specific → more general
 *
 * @example
 * ```ts
 * interface Container<T> {
 *   readonly __type?: Covariant<T>
 * }
 *
 * let narrow: Container<1> = {}
 * let wide: Container<number> = {}
 *
 * wide = narrow  // ✅ Allowed (1 extends number)
 * narrow = wide  // ❌ Error (number does not extend 1)
 * ```
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/type-compatibility.html | TypeScript Type Compatibility}
 */
export type Co<$T> = () => $T

/**
 * Phantom type helper that makes a type parameter contravariant.
 *
 * @remarks
 * Contravariance allows supertypes to be assigned to subtypes (opposite direction).
 * Example: `Phantom<Contravariant<number>>` can be assigned to `Phantom<Contravariant<1>>`.
 *
 * This is useful for function parameters where a handler that accepts wider types
 * can substitute for one that accepts narrower types.
 *
 * @example
 * ```ts
 * interface Handler<T> {
 *   readonly __type?: Contravariant<T>
 * }
 *
 * let narrow: Handler<1> = {}
 * let wide: Handler<number> = {}
 *
 * narrow = wide  // ✅ Allowed (reversed direction!)
 * wide = narrow  // ❌ Error
 * ```
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/type-compatibility.html#function-parameter-bivariance | Function Parameter Bivariance}
 */
export type Contra<$T> = (value: $T) => void

/**
 * Phantom type helper that makes a type parameter invariant.
 *
 * @remarks
 * Invariance requires exact type matches - no subtype or supertype assignments allowed.
 * This is the strictest variance, useful when you need precise type guarantees.
 *
 * @example
 * ```ts
 * interface Exact<T> {
 *   readonly __type?: Invariant<T>
 * }
 *
 * let one: Exact<1> = {}
 * let num: Exact<number> = {}
 *
 * num = one  // ❌ Error (no direction works)
 * one = num  // ❌ Error (no direction works)
 * ```
 */
export type In<$T> = (value: $T) => $T

/**
 * Phantom type helper that makes a type parameter bivariant (unsafe).
 *
 * @remarks
 * Bivariance allows assignments in BOTH directions. This is generally unsafe as it
 * can allow runtime type errors. Only use when absolutely necessary.
 *
 * @example
 * ```ts
 * interface Unsafe<T> {
 *   readonly __type?: Bivariant<T>
 * }
 *
 * let one: Unsafe<1> = {}
 * let num: Unsafe<number> = {}
 *
 * num = one  // ⚠️ Allowed (both directions work)
 * one = num  // ⚠️ Allowed (unsafe!)
 * ```
 */
export type Bi<$T> = { bivariantHack(value: $T): void }['bivariantHack']
