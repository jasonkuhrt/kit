import type { Arr } from "../arr/index.js"
import type { AnyAny, AnyAnyParametersMin1 } from "./base.js"

export type AnyAny2Curried = (arg1: any) => (arg2: any) => any

export const curry = <fn extends AnyAny>(
  fn: AnyAnyParametersMin1 extends fn 
    ? fn
    : {
        Error: 'Given function must have at least one parameter'
      }
): curry<fn> => {
  const fn_ = fn as AnyAny
  const curried = (arg1: any) => (arg2: any) => fn_(arg1, arg2)
  return curried as any
}

// dprint-ignore
export type curry<fn extends AnyAny> =
  fn extends (...args: infer __args__) => infer __return__
    ? Curry__Signature<__args__, __return__>
    : never

type params = Parameters<(x?:1, y?:2) => void>

type l = params extends { length: 1|2 } ? 1 : 0

type x<x extends Arr.Any> = x extends [...infer args, any] ? 1 : 0

type _ = [a?:1,b?:2,c?:3] extends [...infer args, x?:any] ? args : never

type h = [a?:1] extends [] ? 1 : 0

type w = x<params>
type y = Curry__Signature<params, void>

type i = LastAsTuple<[a?:1,b?:2,c?:3]>


// type aa = LastParameterAsTuple<params>
  

/**
 * Note: This curry presrves the parameter names in the new signature.
 * Thanks to a user who shared the following to me on Discord.
 * @see https://www.typescriptlang.org/play/?noImplicitAny=false&target=6&jsx=0&ts=5.8.3#code/PQKhAIChwgLAXeAHAzgLmMAJgSxQYwHsAnLAOiIFth9YBDAOwYFMAbFYATgFYB2XzrwBMARlEAGAMziRANgAs3ABzARa+bJmyhkoUu6zeSkZyGrJwzpO4GlS+fM4j5vZdDiJ0mAOY54sAFcAIwpCajpYYgArOmJiZkR3cCFxIW4AWnEMuSgYYEhIeABPJGZwABU6AGtmAB5ygBpwADlwZgAPeGYGLBRwBgDKIOZiAD5c8ABeCrbO7t7wAG9wVm7vfzQW8AAfcHFwAF9wAH4K6HBN8tmunr6AbUYiprIXnAYAMxHwAAkAXROKtU6t8ms1RudNndfgViqVwAAFWIoZgAQWI3hQtQAyk0APIBeDjaaVGrYpoicYdG4LN6fYjgFHXeZ9R5QgFYpm3cB3F5kWlfRrgR7-U6I4jItEY+pNAAUvIA+pDeSjfgBKKbjfGEi7gLU6lgANxGBQ6SBI8HAsLKAGEAnEirUAGIMInnZ2chZyl6xDGbfn0lHqybjf3gABKALFEvRmJRTTD402huNhRKZQ68pkU3AtvttRldE2IiaQU2Qia+E2kiD43k4Mw4EbAD1jpAgA
 */
// dprint-ignore
type Curry__Signature<$Parameters extends Arr.Any, $Return> =
  LastAsTuple<$Parameters> extends infer __last_arg_as_tuple__ extends Arr.Any
    ? Leading<$Parameters> extends infer __leading_parameters__ extends Arr.Any
      ? __leading_parameters__ extends []
        ? (...args: __last_arg_as_tuple__) => $Return
        : Curry__Signature<__leading_parameters__, (...args: __last_arg_as_tuple__) => $Return>
    : $Return
  : never

// dprint-ignore
type Leading<$Array extends Arr.Any> =
  $Array extends [...infer leading extends Arr.Any, arg?:any]
    ? leading
    : []

// dprint-ignore
type LastAsTuple<$Array extends Arr.Any> =
  $Array extends { length: 1 | 0 }
    ? $Array
    : $Array extends [item?: any, ...infer __tail__]
      ? LastAsTuple<__tail__>
      : never

// uncurry

export const uncurry = <fn extends AnyAny2Curried>(fn: fn): uncurry<fn> => {
  const uncurried = (arg1: any) => (arg2: any) => fn(arg1)(arg2)
  return uncurried as any
}

export type uncurry<$Fn extends AnyAny2Curried> = $Fn extends
  (...args: infer __arg1__) => (...args: infer __arg2__) => infer __return__
  ? (...args: [...__arg1__, ...__arg2__]) => __return__
  : never

// flip

export const flipCurried = <fn extends AnyAny2Curried>(fn: fn): flipCurried<fn> => {
  const flipped = (arg1: any) => (arg2: any) => fn(arg2)(arg1)
  return flipped as any
}

export type flipCurried<$Fn extends AnyAny2Curried> = $Fn extends
  (...args: infer __args1__) => (...args: infer __args2__) => infer __return__
  ? (...args: __args2__) => (...args: __args1__) => __return__
  : never
