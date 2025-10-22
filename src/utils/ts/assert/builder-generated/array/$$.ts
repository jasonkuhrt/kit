import type * as Kind from '../../../kind.js'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/$$.js'
export * as sub from './sub.js'
// Value-level extractor chaining via builder proxy
export const awaited = builder.array.awaited
export const returned = builder.array.returned
export const parameters = builder.array.parameters
export const parameter1 = builder.array.parameter1
export const parameter2 = builder.array.parameter2
export const parameter3 = builder.array.parameter3
export const parameter4 = builder.array.parameter4
export const parameter5 = builder.array.parameter5
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Path.ArrayElement, [$Actual]>]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Path.ArrayElement, [$Actual]>]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Path.ArrayElement, [$Actual]>]>
