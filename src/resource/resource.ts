import type { Codec } from '#codec/index.js'
import { Fs } from '#fs/index.js'
import { Language } from '#language/index.js'
import { Path } from '#path/index.js'
import { Value } from '#value/index.js'

/**
 * Resource represents a file-based resource with built-in codec support and caching.
 *
 * @template $Name - The name of the resource.
 * @template $Type - The type of data stored in the resource.
 *
 * @example
 * ```ts
 * // create and use a json resource
 * const config = Resource.create({
 *   name: 'config',
 *   path: 'config.json',
 *   codec: Json.codec,
 *   emptyValue: { settings: {} }
 * })
 *
 * // read the resource
 * const data = await config.read()
 *
 * // update the resource
 * await config.update(data => {
 *   data.settings.theme = 'dark'
 * })
 * ```
 */
export interface Resource<$Name extends string = string, $Type = any> {
  /**
   * The name of the resource.
   */
  name: $Name
  /**
   * The codec used to encode/decode the resource data.
   */
  codec: Codec.Codec<$Type>
  /**
   * Internal cache for the resource value.
   */
  cache: {
    value: undefined | $Type
  }
  /**
   * Read the resource from disk. Returns undefined if the file doesn't exist or can't be decoded.
   * The result is cached for subsequent reads.
   *
   * @param dir - Optional directory to read from. Defaults to current working directory.
   * @returns The decoded resource data or undefined.
   */
  read: (dir?: string) => Promise<$Type | undefined>
  /**
   * Read the resource from disk, returning the empty value if the file doesn't exist.
   * The result is cached for subsequent reads.
   *
   * @param dir - Optional directory to read from. Defaults to current working directory.
   * @returns The decoded resource data or the empty value.
   */
  readOrEmpty: (dir?: string) => Promise<$Type>
  /**
   * Update the resource by reading it, applying an updater function, and writing it back.
   *
   * @param updater - Function that modifies the resource data.
   * @param dir - Optional directory to read/write from. Defaults to current working directory.
   * @param hard - Whether to create parent directories if they don't exist.
   */
  update: (updater: (data: $Type) => void | Promise<void>, dir?: string, hard?: boolean) => Language.SideEffectAsync
  /**
   * Ensure the resource file exists, creating it with the empty value if it doesn't.
   *
   * @param dir - Optional directory to check/create in. Defaults to current working directory.
   */
  ensureInit: (dir?: string) => Language.SideEffectAsync
  /**
   * Write data to the resource file.
   *
   * @param contents - The data to write.
   * @param dir - Optional directory to write to. Defaults to current working directory.
   * @param hard - Whether to create parent directories if they don't exist.
   */
  write: (contents: $Type, dir?: string, hard?: boolean) => Language.SideEffectAsync
}

/**
 * Create a new file-based resource with codec support and caching.
 *
 * @template name - The name of the resource.
 * @template type - The type of data stored in the resource.
 *
 * @param configInput - Configuration for the resource.
 * @param configInput.name - The name of the resource.
 * @param configInput.path - The file path for the resource.
 * @param configInput.codec - The codec for encoding/decoding the resource data.
 * @param configInput.emptyValue - The empty value to use when the resource doesn't exist. Can be a value or a factory function.
 *
 * @returns A new Resource instance.
 *
 * @example
 * ```ts
 * // create a json configuration resource
 * const config = create({
 *   name: 'config',
 *   path: 'config.json',
 *   codec: Json.codec,
 *   emptyValue: { theme: 'light', language: 'en' }
 * })
 *
 * // create a text file resource with lazy empty value
 * const notes = create({
 *   name: 'notes',
 *   path: 'notes.txt',
 *   codec: { encode: String, decode: String },
 *   emptyValue: () => `Created on ${new Date().toISOString()}`
 * })
 * ```
 */
export const create = <name extends string, type>(configInput: {
  name: name
  path: string
  codec: Codec.Codec<type>
  emptyValue: Value.LazyMaybe<NoInfer<type>>
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
  const emptyValue = Value.resolveLazyFactory(configInput.emptyValue)

  const config = {
    name: configInput.name,
    path: configInput.path,
    codec: configInput.codec,
    emptyValue: configInput.emptyValue,
  }

  const resource: Resource<name, type> = {
    name: config.name,
    codec: config.codec,
    cache: {
      value: undefined,
    },
    ensureInit: async (dir) => {
      const filePath = Path.ensureAbsoluteWith(dir)(config.path)
      const isExists = await Fs.exists(filePath)
      if (isExists) return
      await resource.write(emptyValue())
    },
    read: cache(async (dir) => {
      const filePath = Path.ensureAbsoluteWith(dir)(config.path)
      try {
        const content = await Fs.read(filePath)
        if (content === null) return undefined
        const decoded = config.codec.decode(content)
        return decoded
      } catch {
        return undefined
      }
    }),
    readOrEmpty: cache(async (dir) => {
      const filePath = Path.ensureAbsoluteWith(dir)(config.path)
      const content = await Fs.read(filePath)
      if (content === null) {
        return emptyValue()
      }
      const value = config.codec.decode(content)
      return value
    }),
    write: async (contents, dir, hard) => {
      const filePath = Path.ensureAbsoluteWith(dir)(config.path)
      const encoded = config.codec.encode(contents)
      await Fs.write({ path: filePath, content: encoded, hard })
    },
    update: async (updater, dir, hard) => {
      const value = await resource.readOrEmpty(dir)
      await updater(value)
      await resource.write(value, dir, hard)
    },
  }

  return resource
}
