import type { Fn } from '#fn'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/__.js'
export * as sub from './sub.js'
// Value-level extractor chaining via builder proxy
export const awaited = builder.returned.awaited
export const array = builder.returned.array
export const parameters = builder.returned.parameters
export const parameter1 = builder.returned.parameter1
export const parameter2 = builder.returned.parameter2
export const parameter3 = builder.returned.parameter3
export const parameter4 = builder.returned.parameter4
export const parameter5 = builder.returned.parameter5
export type exact<$Expected, $Actual> = Fn.Kind.Apply<ExactKind, [$Expected, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
export type equiv<$Expected, $Actual> = Fn.Kind.Apply<EquivKind, [$Expected, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
export type sub<$Expected, $Actual> = Fn.Kind.Apply<SubKind, [$Expected, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
