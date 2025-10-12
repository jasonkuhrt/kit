// @ts-expect-error Duplicate identifier
export * as Kind from './kind.js'
/**
 * Higher-kinded type utilities for type-level programming.
 * Provides type-level functions and utilities for simulating higher-kinded types in TypeScript.
 *
 * @category Higher-Kinded Types
 */
export namespace Kind {}

export * from './print.js'

// @ts-expect-error Duplicate identifier
export * as Test from './test.js'
/**
 * Type-level assertion utilities for testing type correctness.
 * Provides compile-time type checking and assertions for tests.
 *
 * @category Type Testing
 */
export namespace Test {}

export * from './ts.js'
export * from './type-guards.js'

// @ts-expect-error Duplicate identifier
export * as Union from './union.js'
/**
 * Utilities for working with union types at the type level.
 *
 * @category Union Types
 */
export namespace Union {}

// @ts-expect-error Duplicate identifier
export * as VariancePhantom from './variance-phantom.js'
/**
 * Phantom type helpers for controlling type variance (covariance, contravariance, invariance, bivariance).
 *
 * @category Variance
 */
export namespace VariancePhantom {}

/**
 * @deprecated Use {@link VariancePhantom} instead. This alias will be removed in a future version.
 */
export { VariancePhantom as Variance }
