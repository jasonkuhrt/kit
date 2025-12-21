/**
 * Endomorphism - a function from a type to itself.
 *
 * Unlike {@link identity}, this doesn't preserve the exact value,
 * just ensures the output type matches the input type.
 *
 * @category Endomorphisms
 * @example
 * ```typescript
 * // Builder pattern
 * type BuilderOp = Fn.endo<StringBuilder>
 * const addText: BuilderOp = sb => sb.append('text')
 *
 * // Transformations
 * type StringTransform = Fn.endo<string>
 * const uppercase: StringTransform = s => s.toUpperCase()
 * const trim: StringTransform = s => s.trim()
 *
 * // Chainable operations
 * type ChainOp = Fn.endo<ChainableAPI>
 * const configure: ChainOp = api => api.setOption('key', 'value')
 * ```
 */
export type endo<$T = any> = ($value: $T) => $T

/**
 * The identity endomorphism - returns the value unchanged.
 * This is both an endomorphism and the identity function.
 *
 * @category Endomorphisms
 * @example
 * ```typescript
 * const result = endo(5) // returns 5
 * const obj = { a: 1 }
 * const same = endo(obj) // returns the same object reference
 * ```
 */
export const endo: endo = (value) => value
