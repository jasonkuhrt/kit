import type { Fn } from '#fn'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/__.js'
export * as sub from './sub.js'
// Value-level extractor chaining via builder proxy
export const awaited = builder.parameter5.awaited
export const returned = builder.parameter5.returned
export const array = builder.parameter5.array
export const parameters = builder.parameter5.parameters
export const parameter1 = builder.parameter5.parameter1
export const parameter2 = builder.parameter5.parameter2
export const parameter3 = builder.parameter5.parameter3
export const parameter4 = builder.parameter5.parameter4
export type exact<$Expected, $Actual> = Fn.Kind.Apply<ExactKind, [$Expected, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
export type equiv<$Expected, $Actual> = Fn.Kind.Apply<EquivKind, [$Expected, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
export type sub<$Expected, $Actual> = Fn.Kind.Apply<SubKind, [$Expected, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
