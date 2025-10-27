import type { Fn } from '#fn'
import type { EquivKind, ExactKind, SubKind } from '../kinds/relators.js'

export * as array from './array/$$.js'
export * as awaited from './awaited/$$.js'
export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/$$.js'
export * as parameter1 from './parameter1/$$.js'
export * as parameter2 from './parameter2/$$.js'
export * as parameter3 from './parameter3/$$.js'
export * as parameter4 from './parameter4/$$.js'
export * as parameter5 from './parameter5/$$.js'
export * as parameters from './parameters/$$.js'
export * as returned from './returned/$$.js'
export * as sub from './sub.js'
export type exact<$Expected, $Actual> = Fn.Kind.Apply<ExactKind, [$Expected, $Actual]>
export type equiv<$Expected, $Actual> = Fn.Kind.Apply<EquivKind, [$Expected, $Actual]>
export type sub<$Expected, $Actual> = Fn.Kind.Apply<SubKind, [$Expected, $Actual]>
