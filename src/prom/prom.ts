import { Obj } from '#obj/index.js'

export type Any = Promise<unknown>

export type AnyAny = Promise<any>

export type Maybe<$Type> = $Type | Promise<$Type>

export const isShape = Obj.isShape<AnyAny>({
  then: `function`,
  catch: `function`,
  finally: `function`,
})
