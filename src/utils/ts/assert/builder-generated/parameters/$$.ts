import type * as Kind from '../../../kind.js'
import type { Parameters$ } from '../../kinds/extractors.js'
import type { ExactKind, EquivKind, SubKind } from '../../kinds/relators.js'
import { runtime } from '../../builder/runtime.js'

export * as exact from './exact.js'
export * as equiv from './equiv.js'
export * as sub from './sub.js'
export * as not from './not/$$.js'
// Value-level extractor chaining via runtime proxy
export const awaited = runtime.parameters.awaited
export const returned = runtime.parameters.returned
export const array = runtime.parameters.array
export const parameter1 = runtime.parameters.parameter1
export const parameter2 = runtime.parameters.parameter2
export const parameter3 = runtime.parameters.parameter3
export const parameter4 = runtime.parameters.parameter4
export const parameter5 = runtime.parameters.parameter5
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Parameters$, [$Actual]>]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Parameters$, [$Actual]>]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Parameters$, [$Actual]>]>
