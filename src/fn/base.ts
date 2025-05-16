import { Language } from '../language/index.js'
import type { Prom } from '../prom/index.js'

export type AnyAny = (...args: any[]) => any
export type NonEmptyParametersAnyAny = (...args: [any, ...any[]]) => any

export type AnyAny2 = (arg1: any, arg2: any) => any

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

export type AnyAny2Curried = (arg1: any) => (arg2: any) => any

export const flipCurried = <fn extends AnyAny2Curried>(fn: fn): flipCurried<fn> => {
  const flipped = (arg1: any) => (arg2: any) => fn(arg2)(arg1)
  return flipped as any
}

export type flipCurried<$Fn extends AnyAny2Curried> = $Fn extends
  (...args: infer __args1__) => (...args: infer __args2__) => infer __return__
  ? (...args: __args2__) => (...args: __args1__) => __return__
  : never

export const curry = <fn extends AnyAny2>(fn: fn): curry<fn> => {
  const curried = (arg1: any) => (arg2: any) => fn(arg1, arg2)
  return curried as any
}

// dprint-ignore
export type curry<$Fn extends AnyAny2> =
  $Fn extends (...args: infer __args__) => infer __return__
    ? (...args: [__args__[0]]) => (...args: [__args__[1]]) => __return__
    : never

export const uncurry = <fn extends AnyAny2Curried>(fn: fn): uncurry<fn> => {
  const uncurried = (arg1: any) => (arg2: any) => fn(arg1)(arg2)
  return uncurried as any
}

export type uncurry<$Fn extends AnyAny2Curried> = $Fn extends
  (...args: infer __arg1__) => (...args: infer __arg2__) => infer __return__
  ? (...args: [...__arg1__, ...__arg2__]) => __return__
  : never

// Binding

export const bind = <fn extends NonEmptyParametersAnyAny>(fn: fn, arg: Parameter0<fn>): bind<fn> => {
  return fn.bind(null, arg) as any
}

// dprint-ignore
export type bind<$Fn extends NonEmptyParametersAnyAny> =
  $Fn extends (...args: [infer __arg1__, ...infer __args__]) => infer __return__
    ? (...args: __args__) => __return__
    : never

// Parameters

// dprint-ignore
export type Parameter0<$Fn extends NonEmptyParametersAnyAny> =
  $Fn extends (...args: [infer __arg__]) => infer __return__
    ? __arg__
    : never
