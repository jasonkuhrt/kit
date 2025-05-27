import { isShape as Obj_isShape } from '#obj/obj.js'

export type Any = Promise<unknown>

export type AnyAny = Promise<any>

export type Maybe<$Type> = $Type | Promise<$Type>

export const isShape = Obj_isShape<AnyAny>({
  then: `function`,
  catch: `function`,
  finally: `function`,
})
