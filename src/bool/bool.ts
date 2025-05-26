import { Fn } from '#fn/index.js'
import { Language } from '#language/index.js'

export const not = <value extends boolean>(value: value): not<value> => {
  return !value as any
}

export type not<value extends boolean> = value extends true ? false : true

export const negate = <predicate extends Predicate>(predicate: predicate): predicate => {
  const negated = (value: any) => {
    return !predicate(value)
  }
  return negated as any
}

// Predicate

export type Predicate<$Value = unknown> = (value: $Value) => boolean

export type TypePredicate<$Type> = (value: unknown) => value is $Type

export type PredicateMaybe<$Value> = $Value | Predicate<$Value>

export const ensurePredicate = <predicateMaybe extends PredicateMaybe<any>>(
  predicateMaybe: predicateMaybe,
): ensurePredicate<predicateMaybe> => {
  const predicate = Fn.is(predicateMaybe) ? predicateMaybe : Language.constant(predicateMaybe)
  return predicate as any
}

// dprint-ignore
export type ensurePredicate<$PredicateMaybe extends PredicateMaybe<any>> =
  $PredicateMaybe extends Predicate
    ? $PredicateMaybe
    : Predicate<$PredicateMaybe>
