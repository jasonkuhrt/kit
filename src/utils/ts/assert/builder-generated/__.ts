import type { Fn } from '#fn'
import type { EquivKind, ExactKind, SubKind } from '../kinds/relators.js'

export * as array from './array/__.js'
export * as awaited from './awaited/__.js'
export * as equiv from './equiv.js'
export * as exact from './exact.js'
export * as not from './not/__.js'
export * as parameter1 from './parameter1/__.js'
export * as parameter2 from './parameter2/__.js'
export * as parameter3 from './parameter3/__.js'
export * as parameter4 from './parameter4/__.js'
export * as parameter5 from './parameter5/__.js'
export * as parameters from './parameters/__.js'
export * as returned from './returned/__.js'
export * as sub from './sub.js'
export type exact<$Expected, $Actual> = Fn.Kind.Apply<ExactKind, [$Expected, $Actual]>
export type equiv<$Expected, $Actual> = Fn.Kind.Apply<EquivKind, [$Expected, $Actual]>
export type sub<$Expected, $Actual> = Fn.Kind.Apply<SubKind, [$Expected, $Actual]>
