import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { Parameter4 } from '../../kinds/extractors.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/$$.js'
export * as sub from './sub.js'
// Value-level extractor chaining via runtime proxy
export const awaited = runtime.parameter4.awaited
export const returned = runtime.parameter4.returned
export const array = runtime.parameter4.array
export const parameters = runtime.parameter4.parameters
export const parameter1 = runtime.parameter4.parameter1
export const parameter2 = runtime.parameter4.parameter2
export const parameter3 = runtime.parameter4.parameter3
export const parameter5 = runtime.parameter4.parameter5
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Parameter4, [$Actual]>]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Parameter4, [$Actual]>]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Parameter4, [$Actual]>]>
