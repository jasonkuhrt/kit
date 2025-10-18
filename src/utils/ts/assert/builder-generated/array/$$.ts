import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { ArrayElement } from '../../kinds/extractors.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/$$.js'
export * as sub from './sub.js'
// Value-level extractor chaining via runtime proxy
export const awaited = runtime.array.awaited
export const returned = runtime.array.returned
export const parameters = runtime.array.parameters
export const parameter1 = runtime.array.parameter1
export const parameter2 = runtime.array.parameter2
export const parameter3 = runtime.array.parameter3
export const parameter4 = runtime.array.parameter4
export const parameter5 = runtime.array.parameter5
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<ArrayElement, [$Actual]>]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<ArrayElement, [$Actual]>]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<ArrayElement, [$Actual]>]>
