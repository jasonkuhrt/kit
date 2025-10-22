import type * as Kind from '../../../../kind.js'
import type * as Path from '../../../../path.js'
import { builder } from '../../../builder-singleton.js'
import type { EquivKind, ExactKind, SubKind } from '../../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as sub from './sub.js'

// Unary relators (negated)
export const any = builder.not.awaited.any
export const unknown = builder.not.awaited.unknown
export const never = builder.not.awaited.never
export const empty = builder.not.awaited.empty
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Path.Awaited$, [$Actual]>, true]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Path.Awaited$, [$Actual]>, true]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Path.Awaited$, [$Actual]>, true]>
