export * from './ts.js'

export * from './traits/display.js'

// @ts-expect-error Duplicate identifier
export * as SimpleSignature from './simple-signature.js'
/**
 * Utilities for working with the `__simpleSignature` phantom type pattern.
 * Allows complex generic functions to provide simpler signatures for type inference.
 *
 * @category SimpleSignature
 */
export namespace SimpleSignature {}

// @ts-expect-error Duplicate identifier
export * as Extract from '../extract/__.js'
/**
 * Pre-composed extractors for type assertions and value extraction.
 * Combine runtime extraction with type-level transformations.
 *
 * @category Extract
 */
export namespace Extract {}

// @ts-expect-error Duplicate identifier
export * as Inhabitance from './inhabitance.js'
/**
 * Type utilities for classifying types by their inhabitance in TypeScript's type lattice.
 *
 * @category Type Inhabitance
 */
export namespace Inhabitance {}

export * from './ts.js'
export * from './type-guards.js'

// @ts-expect-error Duplicate identifier
export * as Simplify from './simplify.js'
/**
 * Type simplification utilities for flattening and expanding types.
 * All functions automatically preserve globally registered types from {@link KitLibrarySettings.Ts.PreserveTypes}.
 *
 * @category Type Simplification
 */
export namespace Simplify {}

// @ts-expect-error Duplicate identifier
export * as Err from './err.js'
/**
 * Error utilities for working with static type-level errors.
 *
 * @category Error Utilities
 */
export namespace Err {}

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

export * as Settings from './global-settings.js'
