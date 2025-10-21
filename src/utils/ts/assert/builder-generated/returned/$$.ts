import type * as Kind from '../../../kind.js'
import type { Returned } from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/$$.js'
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
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Returned, [$Actual]>]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Returned, [$Actual]>]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Returned, [$Actual]>]>
