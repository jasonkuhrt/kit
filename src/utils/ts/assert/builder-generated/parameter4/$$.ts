import type * as Kind from '../../../kind.js'
import type { Parameter4 } from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/$$.js'
export * as sub from './sub.js'
// Value-level extractor chaining via builder proxy
export const awaited = builder.parameter4.awaited
export const returned = builder.parameter4.returned
export const array = builder.parameter4.array
export const parameters = builder.parameter4.parameters
export const parameter1 = builder.parameter4.parameter1
export const parameter2 = builder.parameter4.parameter2
export const parameter3 = builder.parameter4.parameter3
export const parameter5 = builder.parameter4.parameter5
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Parameter4, [$Actual]>]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Parameter4, [$Actual]>]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Parameter4, [$Actual]>]>
