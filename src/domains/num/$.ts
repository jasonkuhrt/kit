// @ts-expect-error Duplicate identifier
export * as Num from './$$.js'

/**
 * Numeric types and utilities with branded types for mathematical constraints.
 *
 * Provides branded number types (Positive, Negative, Even, Odd, etc.) with
 * runtime validation, mathematical operations, range types, and specialized
 * numeric domains like Complex, Ratio, and BigInt. Includes type guards,
 * ordering, and equivalence utilities.
 *
 * @category Domains
 */
export namespace Num {}
