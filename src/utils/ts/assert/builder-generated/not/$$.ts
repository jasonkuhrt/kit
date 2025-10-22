import type * as Kind from '../../../kind.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as sub from './sub.js'

// Unary relators (negated)
export const any = builder.not.any
export const unknown = builder.not.unknown
export const never = builder.not.never
export const empty = builder.not.empty
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, $Actual, true]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, $Actual, true]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, $Actual, true]>
