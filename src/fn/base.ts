import { Language } from '#language'
import type { Obj } from '#obj'
import type { Prom } from '#prom'

export type AnyAny = (...args: any[]) => any

export type AnyAnyParameters2 = (arg1: any, arg2: any) => any

export type AnyAnyParametersMin1 = (...args: [any, ...any[]]) => any

export type AnyAnyParametersMin2 = (...args: [any, any, ...any[]]) => any

export type AnyAnyParametersMin3 = (...args: [any, any, any, ...any[]]) => any

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

// Binding

export const bind = <fn extends AnyAny>(
  fn: AnyAnyParametersMin1 extends fn ? fn
    : {
      Error: 'Given function must have at least one parameter'
    },
  arg: Parameters<fn>[0],
): bind<fn> => {
  const fn_ = fn as AnyAny
  return fn_.bind(null, arg) as any
}

// dprint-ignore
export type bind<$Fn extends AnyAnyParametersMin1> =
  $Fn extends (...args: [any, ...infer __args_tail__]) => infer __return__
    ? (...args: __args_tail__) => __return__
    : never

export const noop = () => {}

export const $identityPartial = <value>(value: Obj.PartialDeep<value>): value => value as any
