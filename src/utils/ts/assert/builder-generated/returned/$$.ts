import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { Returned } from '../../kinds/extractors.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/$$.js'
export * as sub from './sub.js'
// Value-level extractor chaining via runtime proxy
export const awaited = runtime.returned.awaited
export const array = runtime.returned.array
export const parameters = runtime.returned.parameters
export const parameter1 = runtime.returned.parameter1
export const parameter2 = runtime.returned.parameter2
export const parameter3 = runtime.returned.parameter3
export const parameter4 = runtime.returned.parameter4
export const parameter5 = runtime.returned.parameter5
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Returned, [$Actual]>]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Returned, [$Actual]>]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Returned, [$Actual]>]>
