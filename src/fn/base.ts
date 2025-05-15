import { Language } from '../language/index.js'
import type { Prom } from '../prom/index.js'

export type AnyAny = (...args: any[]) => any

export const is = Language.typeGuard<AnyAny>(value => typeof value === Language.TypeofTypesEnum.function)

export type AnyAnyAsync = (...args: any[]) => Prom.AnyAny

/**
 * Modify function such that it only returns the given type.
 * Assumes that the given type is among the possible return types of the function.
 */
// dprint-ignore
export type ReturnExtract<$Type, $Fn extends AnyAny> =
	$Fn extends (...args: infer __args__) => infer __return__
			? (...args: __args__) =>
        __return__ extends Prom.AnyAny
          ? Promise<Extract<Awaited<__return__>, $Type>>
          : Extract<__return__, $Type>
			: never

/**
 * Modify function such that it does not return the given type.
 * If function does not return the given the type, then this is effectively an identity function.
 */
// dprint-ignore
export type ReturnExclude<$Type, $Fn extends AnyAny> =
  $Fn extends (...args: infer __args__) => infer __return__
    ? (...args: __args__) => (
        __return__ extends Prom.AnyAny
          ? Promise<Exclude<Awaited<__return__>, $Type>>
          : Exclude<__return__, $Type>
    )
    : never

export type ReturnExcludeNull<$Fn extends AnyAny> = ReturnExclude<null, $Fn>

// Currying

export type CurriedFn = (arg1: any) => (arg2: any) => any

export type flipCurry<$Fn extends CurriedFn> = $Fn extends
  (...args: infer __args1__) => (...args: infer __args2__) => infer __return__
  ? (...args: __args2__) => (...args: __args1__) => __return__
  : never

export const flipCurry = <fn extends CurriedFn>(fn: fn): flipCurry<fn> => {
  const flipped = (arg1: any) => (arg2: any) => fn(arg2)(arg1)
  return flipped as any
}
