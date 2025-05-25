import { Obj } from '#obj/index.js'

export const isShape = Obj.isShape<Promise<unknown>>({
  then: `function`,
  catch: `function`,
  finally: `function`,
})

export type Maybe<$Type> = $Type | Promise<$Type>

export type AnyAny = Promise<any>

export type Any = Promise<unknown>
