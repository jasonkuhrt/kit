import type * as Kind from '../../../kind.js'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/$$.js'
export * as sub from './sub.js'
// Value-level extractor chaining via builder proxy
export const awaited = builder.parameters.awaited
export const returned = builder.parameters.returned
export const array = builder.parameters.array
export const parameter1 = builder.parameters.parameter1
export const parameter2 = builder.parameters.parameter2
export const parameter3 = builder.parameters.parameter3
export const parameter4 = builder.parameters.parameter4
export const parameter5 = builder.parameters.parameter5
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Path.Parameters$, [$Actual]>]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Path.Parameters$, [$Actual]>]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Path.Parameters$, [$Actual]>]>
