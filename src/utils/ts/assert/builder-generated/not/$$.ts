import type * as Kind from '../../../kind.js'
import type { EquivKind, ExactKind, SubKind } from '../../kinds/relators.js'

export { any } from './any.js'
export { empty } from './empty.js'
export * as equiv from './equiv.js'
export * as exact from './exact.js'
export { never } from './never.js'
export * as sub from './sub.js'
export { unknown } from './unknown.js'
export type exact<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, $Actual, true]>
export type equiv<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, $Actual, true]>
export type sub<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, $Actual, true]>
