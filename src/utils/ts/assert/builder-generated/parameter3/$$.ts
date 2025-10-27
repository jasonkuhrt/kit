import type { Fn } from '#fn'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/$$.js'
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
export type exact<$Expected, $Actual> = Fn.Kind.Apply<ExactKind, [$Expected, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
export type equiv<$Expected, $Actual> = Fn.Kind.Apply<EquivKind, [$Expected, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
export type sub<$Expected, $Actual> = Fn.Kind.Apply<SubKind, [$Expected, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
