import { Codec } from '#codec/index.js'
import { ZodAid } from '#zod-aid/index.js'
import { z } from 'zod'

export const Primitive = z.union([z.string(), z.number(), z.boolean(), z.null()])
export type Primitive = z.infer<typeof Primitive>
export const isPrimitive = ZodAid.typeGuard(Primitive)

export const Value: z.ZodType<Value> = z.lazy(() => z.union([Primitive, z.array(Value), z.record(Value)]))
export type Value = Primitive | { [key: string]: Value } | Value[]
export const isValue = ZodAid.typeGuard(Value)

const Obj: z.ZodType<Obj> = z.record(Value)
type Obj = { [key: string]: Value }
export const isObject = ZodAid.typeGuard(Obj)

// If we name this "Object" then Vitest fails with "cannot reference Object before initialization"
// TODO: open issue with Vitest team
export { Obj as Object }

export const codec = Codec.create<Value>({
  serialize: json => JSON.stringify(json, null, 2),
  deserialize: JSON.parse,
})

export const codecAs = <$Type>() =>
  Codec.create<$Type>({
    serialize: json => JSON.stringify(json, null, 2),
    deserialize: JSON.parse,
  })
