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
export * as SimpleSignature from './simple-signature.js'
/**
 * Utilities for working with the `__simpleSignature` phantom type pattern.
 * Allows complex generic functions to provide simpler signatures for type inference.
 *
 * @category SimpleSignature
 */
export namespace SimpleSignature {}

export * as Assert from './assert/$$.js'

export * from './ts.js'
export * from './type-guards.js'

// @ts-expect-error Duplicate identifier
export * as Ts from './ts.js'
/**
 * TypeScript type utilities and helpers.
 *
 * @category Type System
 */
export namespace Ts {}

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
