import type { Fn } from '#fn'
import type { Either } from 'effect'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/__.js'
export * as sub from './sub.js'
// Value-level extractor chaining via builder proxy
export const awaited = builder.parameter3.awaited
export const returned = builder.parameter3.returned
export const array = builder.parameter3.array
export const parameters = builder.parameter3.parameters
export const parameter1 = builder.parameter3.parameter1
export const parameter2 = builder.parameter3.parameter2
export const parameter4 = builder.parameter3.parameter4
export const parameter5 = builder.parameter3.parameter5
// dprint-ignore
export type exact<
  $Expected,
  $Actual,
  __$ActualExtracted = Fn.Kind.Apply<Path.Parameter3, [$Actual]>,
> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [$Expected, __actual__]>
                                                                         : never

// dprint-ignore
export type equiv<
  $Expected,
  $Actual,
  __$ActualExtracted = Fn.Kind.Apply<Path.Parameter3, [$Actual]>,
> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<EquivKind, [$Expected, __actual__]>
                                                                         : never

// dprint-ignore
export type sub<
  $Expected,
  $Actual,
  __$ActualExtracted = Fn.Kind.Apply<Path.Parameter3, [$Actual]>,
> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<SubKind, [$Expected, __actual__]>
                                                                         : never
