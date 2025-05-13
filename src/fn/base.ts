import type { Prom } from '../prom/index.js'

export type AnyAny = (...args: any[]) => any

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

export const is = (value: unknown): value is AnyAny => {
  return typeof value === `function`
}
