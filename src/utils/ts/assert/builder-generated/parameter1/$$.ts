import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { Parameter1 } from '../../../path.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/$$.js'
export * as sub from './sub.js'
// Value-level extractor chaining via runtime proxy
export const awaited = runtime.parameter1.awaited
export const returned = runtime.parameter1.returned
export const array = runtime.parameter1.array
export const parameters = runtime.parameter1.parameters
export const parameter2 = runtime.parameter1.parameter2
export const parameter3 = runtime.parameter1.parameter3
export const parameter4 = runtime.parameter1.parameter4
export const parameter5 = runtime.parameter1.parameter5
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Parameter1, [$Actual]>]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Parameter1, [$Actual]>]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Parameter1, [$Actual]>]>
