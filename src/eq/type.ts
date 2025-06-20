import { Ts } from '#ts'

// dprint-ignore
export const isTypeWith =
  <reference>(reference: reference) => {
    return <valueGiven>(
        value: ValidateIsSupertype<reference, valueGiven>
        ): value is reference extends valueGiven ? reference : never => {
      return value === reference as any
    }
  }

// dprint-ignore
export const isntTypeWith =
  <reference>(reference: reference) => {
    return <valueGiven>(
        value: ValidateIsSupertype<reference, valueGiven>
        ): value is reference extends valueGiven ? Exclude<valueGiven, reference> : never => {
      return value !== reference as any
    }
  }

type ValidateIsSupertype<$Reference, $Value> =
  // dprint-ignore
  $Reference extends $Value
    ? $Value
    : Ts.Simplify<StaticErrorGuardNotSubtype<$Reference, $Value>>

export interface StaticErrorGuardNotSubtype<$Reference, $Value> extends
  // dprint-ignore
  Ts.StaticError<
    `This type guard for ${Ts.ShowInTemplate<$Reference>} cannot be used against the given value ${Ts.ShowInTemplate<$Value>} because it is not a supertype.`,
    { guard: $Reference; value: $Value },
    `Since your value type has no overlap with ${Ts.Show<$Reference>} this will always return false.`
  >
{}
