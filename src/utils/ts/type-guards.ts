import type { Show, ShowInTemplate, Simplify, StaticError } from './ts.ts'

/**
 * Create a type guard that checks if a value equals a reference value.
 *
 * @param reference - The reference value to compare against
 * @returns A type guard function that narrows to the reference type
 *
 * @example
 * ```ts
 * const isNull = isTypeWith(null)
 * const value: string | null = getString()
 * if (isNull(value)) {
 *   // value is narrowed to null
 * }
 * ```
 */
export const isTypeWith = <reference>(reference: reference) => {
  return <valueGiven>(
    value: ValidateIsSupertype<reference, valueGiven>,
  ): value is reference extends valueGiven ? reference : never => {
    return value === reference as any
  }
}

/**
 * Create a type guard that checks if a value does not equal a reference value.
 *
 * @param reference - The reference value to compare against
 * @returns A type guard function that narrows by excluding the reference type
 *
 * @example
 * ```ts
 * const isntNull = isntTypeWith(null)
 * const value: string | null = getString()
 * if (isntNull(value)) {
 *   // value is narrowed to string
 * }
 * ```
 */
export const isntTypeWith = <reference>(reference: reference) => {
  return <valueGiven>(
    value: ValidateIsSupertype<reference, valueGiven>,
  ): value is reference extends valueGiven ? Exclude<valueGiven, reference> : never => {
    return value !== reference as any
  }
}

type ValidateIsSupertype<$Reference, $Value> =
  // dprint-ignore
  $Reference extends $Value
    ? $Value
    : Simplify<StaticErrorGuardNotSubtype<$Reference, $Value>>

interface StaticErrorGuardNotSubtype<$Reference, $Value> extends
  // dprint-ignore
  StaticError<
    `This type guard for ${ShowInTemplate<$Reference>} cannot be used against the given value ${ShowInTemplate<$Value>} because it is not a supertype.`,
    { guard: $Reference; value: $Value },
    `Since your value type has no overlap with ${Show<$Reference>} this will always return false.`
  >
{}
