import type * as Kind from '../../../kind.js'
import type { Awaited$ } from '../../kinds/extractors.js'
import type { ExactKind, EquivKind, SubKind } from '../../kinds/relators.js'
import { runtime } from '../../builder/runtime.js'

export * as exact from './exact.js'
export * as equiv from './equiv.js'
export * as sub from './sub.js'
export * as not from './not/$$.js'
// Value-level extractor chaining via runtime proxy
export const returned = runtime.awaited.returned
export const array = runtime.awaited.array
export const parameters = runtime.awaited.parameters
export const parameter1 = runtime.awaited.parameter1
export const parameter2 = runtime.awaited.parameter2
export const parameter3 = runtime.awaited.parameter3
export const parameter4 = runtime.awaited.parameter4
export const parameter5 = runtime.awaited.parameter5
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Awaited$, [$Actual]>]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Awaited$, [$Actual]>]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Awaited$, [$Actual]>]>
