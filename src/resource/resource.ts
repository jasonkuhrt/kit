import type { Codec } from '../codec/index.js'
import { Fs } from '../fs/index.js'
import { write } from '../fs/mutation.js'
import { exists } from '../fs/query.js'
import type { Language } from '../language/index.js'
import { Path } from '../path/index.js'

export interface Resource<$Name extends string = string, $Type = any> {
  name: $Name
  codec: Codec.Codec<$Type>
  cache: {
    value: undefined | $Type
  }
  read: (dir?: string) => Promise<$Type | undefined>
  readOrEmpty: (dir?: string) => Promise<$Type>
  update: (updater: (data: $Type) => void | Promise<void>, dir?: string, hard?: boolean) => Language.SideEffectAsync
  ensureInit: (dir?: string) => Language.SideEffectAsync
  write: (contents: $Type, dir?: string, hard?: boolean) => Language.SideEffectAsync
}

export const create = <name extends string, type>({
  name,
  path,
  codec,
  emptyValue,
}: {
  name: name
  path: string
  codec: Codec.Codec<type>
  emptyValue: () => NoInfer<type>
}): Resource<name, type> => {
  const cache = <fn extends (...args: any[]) => Promise<type | undefined>>(fn: fn): fn => {
    // @ts-expect-error
    const fn_: fn = async (...args) => {
      if (resource.cache.value !== undefined) return resource.cache.value
      const result = await fn(...args)
      if (result === undefined) return undefined
      resource.cache.value = result
      return result
    }
    return fn_
  }

  const resource: Resource<name, type> = {
    name,
    codec,
    cache: {
      value: undefined,
    },
    ensureInit: async (dir) => {
      const filePath = Path.absolutify(dir)(path)
      const isExists = await exists(filePath)
      if (isExists) return
      await resource.write(emptyValue())
    },
    read: cache(async (dir) => {
      const filePath = Path.absolutify(dir)(path)
      try {
        const content = await Fs.read(filePath)
        if (content === null) return undefined
        const value = codec.deserialize(content)
        return value
      } catch {
        return undefined
      }
    }),
    readOrEmpty: cache(async (dir) => {
      const filePath = Path.absolutify(dir)(path)
      const content = await Fs.read(filePath)
      if (content === null) {
        return emptyValue()
      }
      const value = codec.deserialize(content)
      return value
    }),
    write: async (contents, dir, hard) => {
      const filePath = Path.absolutify(dir)(path)
      const serialized = codec.serialize(contents)
      await write({ path: filePath, content: serialized, hard })
    },
    update: async (updater, dir, hard) => {
      const value = await resource.readOrEmpty(dir)
      await updater(value)
      await resource.write(value, dir, hard)
    },
  }

  return resource
}
