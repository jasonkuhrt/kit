import type * as Kind from '../../../../kind.js'
import type { Parameter2 } from '../../../kinds/extractors.js'
import type { ExactKind, EquivKind, SubKind } from '../../../kinds/relators.js'

export * as exact from './exact.js'
export * as equiv from './equiv.js'
export * as sub from './sub.js'
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Parameter2, [$Actual]>, true]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Parameter2, [$Actual]>, true]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Parameter2, [$Actual]>, true]>
