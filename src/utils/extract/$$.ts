/**
 * Extract namespace - Pre-composed extractors for type assertions.
 *
 * Extractors combine runtime extraction with type-level transformations,
 * enabling both value extraction and type inference in `Ts.Assert`.
 *
 * @module
 *
 * @example
 * ```ts
 * import { Extract, Ts } from '@wollybeard/kit'
 *
 * // Use extractors in assertions
 * const promise: Promise<number> = Promise.resolve(42)
 * Ts.Assert.extract(Extract.awaited).exact.of(42).on(promise)
 *
 * // Compose extractors
 * const composed = Fn.compose(Extract.awaited, Extract.array)
 * ```
 */

export * from './runtime.js'
export * from './types.js'
