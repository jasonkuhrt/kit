import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { Parameter2 } from '../../../path.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/$$.js'
export * as sub from './sub.js'
// Value-level extractor chaining via runtime proxy
export const awaited = runtime.parameter2.awaited
export const returned = runtime.parameter2.returned
export const array = runtime.parameter2.array
export const parameters = runtime.parameter2.parameters
export const parameter1 = runtime.parameter2.parameter1
export const parameter3 = runtime.parameter2.parameter3
export const parameter4 = runtime.parameter2.parameter4
export const parameter5 = runtime.parameter2.parameter5
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Parameter2, [$Actual]>]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Parameter2, [$Actual]>]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Parameter2, [$Actual]>]>
