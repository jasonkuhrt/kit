import { Cache } from '#cache'
import type { Codec } from '#codec'
import { Fs } from '#fs'
import { Json } from '#json'
import { Language } from '#language'
import { Path } from '#path'
import { Value } from '#value'
import * as Errors from './errors.ts'

/**
 * A file-based resource that provides cached read/write operations with comprehensive error handling.
 *
 * Resources are used to manage configuration files, data files, or any JSON-serializable data
 * that needs to be persisted to disk with type safety and error handling.
 *
 * Features:
 * - Type-safe read/write operations
 * - Automatic caching with cache invalidation on writes
 * - Distinguishes between different error types (not found, decode failed, validation failed)
 * - Support for custom codecs and schema validation
 * - Atomic writes with optional hard sync
 *
 * @typeParam $Name - The name of the resource (used for error messages)
 * @typeParam $Type - The type of data stored in the resource
 *
 * @example
 * ```ts
 * // Create a config resource
 * const config = Resource.create({
 *   name: 'app-config',
 *   path: './config.json',
 *   emptyValue: { theme: 'dark', lang: 'en' }
 * })
 *
 * // Read with error handling
 * const result = await config.read()
 * if (Resource.Errors.isNotFound(result)) {
 *   console.log('Config not found, using defaults')
 * } else if (Resource.Errors.isDecodeFailed(result)) {
 *   console.error('Invalid config format')
 * } else {
 *   console.log('Config loaded:', result)
 * }
 * ```
 */
export interface Resource<$Name extends string = string, $Type = any> {
  /**
   * The name of the resource.
   */
  name: $Name

  /**
   * The file path for the resource.
   */
  path: string

  /**
   * The codec used to encode/decode the resource data.
   */
  codec: Codec.Codec<$Type>

  /**
   * Read the resource from disk with caching.
   *
   * @param dir - Optional directory to prepend to the resource path
   * @returns The parsed data or an error:
   *   - {@link Errors.ResourceErrorNotFound} if the file doesn't exist
   *   - {@link Errors.ResourceErrorDecodeFailed} if the file content cannot be decoded
   *   - {@link Errors.ResourceErrorValidationFailed} if schema validation fails
   *
   * @example
   * ```ts
   * const data = await resource.read()
   * if (Err.is(data)) {
   *   // Handle error
   * } else {
   *   // Use data
   * }
   * ```
   */
  read: (dir?: string) => Promise<$Type | Errors.ResourceErrorAny>

  /**
   * Read the resource from disk, returning the empty value if not found.
   * This is useful for resources that should be auto-initialized.
   *
   * @param dir - Optional directory to prepend to the resource path
   * @returns The parsed data, empty value if not found, or decode error
   *
   * @example
   * ```ts
   * // Always returns data or decode error, never "not found"
   * const config = await resource.readOrEmpty()
   * if (Resource.Errors.isDecodeFailed(config)) {
   *   console.error('Config file is corrupted')
   * } else {
   *   // config is guaranteed to be the data type
   * }
   * ```
   */
  readOrEmpty: (dir?: string) => Promise<$Type | Errors.ResourceErrorDecodeFailed>

  /**
   * Check if the resource file exists without reading its contents.
   *
   * @param dir - Optional directory to prepend to the resource path
   * @returns void if file exists, or ResourceErrorNotFound if it doesn't
   *
   * @example
   * ```ts
   * const exists = await resource.assertExists()
   * if (Resource.Errors.isNotFound(exists)) {
   *   console.log('Resource needs to be created')
   * }
   * ```
   */
  assertExists: (dir?: string) => Promise<void | Errors.ResourceErrorNotFound>

  /**
   * Update the resource by reading it, applying an updater function, and writing it back.
   * Uses readOrEmpty so missing files are initialized with empty value before updating.
   *
   * @param updater - Function to modify the data (can be async)
   * @param dir - Optional directory to prepend to the resource path
   * @param hard - If true, ensures data is synced to disk (fsync)
   * @returns void on success, or ResourceErrorDecodeFailed if the file exists but is invalid
   *
   * @example
   * ```ts
   * // Update existing or create new with empty value
   * const result = await resource.update(data => {
   *   data.lastUpdated = Date.now()
   *   data.counter++
   * })
   *
   * if (Resource.Errors.isDecodeFailed(result)) {
   *   console.error('Existing file has invalid format')
   * }
   * ```
   */
  update: (
    updater: (data: $Type) => void | Promise<void>,
    dir?: string,
    hard?: boolean,
  ) => Promise<void | Errors.ResourceErrorDecodeFailed>

  /**
   * Ensure the resource file exists, creating it with the empty value if it doesn't.
   * This is useful for initialization routines.
   *
   * @param dir - Optional directory to prepend to the resource path
   *
   * @example
   * ```ts
   * // Initialize config file if it doesn't exist
   * await resource.ensureInit()
   * ```
   */
  ensureInit: (dir?: string) => Language.SideEffectAsync

  /**
   * Write data to the resource file, replacing any existing content.
   * Automatically clears the cache to ensure subsequent reads get fresh data.
   *
   * @param contents - The data to write
   * @param dir - Optional directory to prepend to the resource path
   * @param hard - If true, ensures data is synced to disk (fsync)
   *
   * @example
   * ```ts
   * await resource.write({
   *   theme: 'light',
   *   lang: 'fr',
   *   lastSaved: new Date().toISOString()
   * })
   * ```
   */
  write: (contents: $Type, dir?: string, hard?: boolean) => Language.SideEffectAsync
}

/**
 * Configuration for creating a resource.
 */
export interface ResourceConfig<$Name extends string, $Type> {
  /**
   * The name of the resource (used in error messages).
   */
  name: $Name

  /**
   * The file path for the resource (relative or absolute).
   */
  path: string

  /**
   * Optional codec for encoding/decoding. Defaults to JSON codec.
   * Use custom codecs for formats like YAML, TOML, or validated JSON.
   *
   * @example
   * ```ts
   * codec: Codec.fromZod(ConfigSchema)
   * ```
   */
  codec?: Codec.Codec<$Type>

  /**
   * The empty value to use when the resource doesn't exist.
   * Can be a value or a factory function for dynamic defaults.
   *
   * @example
   * ```ts
   * emptyValue: { version: 1, entries: [] }
   * // or
   * emptyValue: () => ({ id: uuid(), created: Date.now() })
   * ```
   */
  emptyValue: Value.LazyMaybe<NoInfer<$Type>>
}

/**
 * Create a new file-based resource with comprehensive error handling.
 *
 * Resources provide a high-level abstraction for managing file-based data with:
 * - Type safety through TypeScript generics
 * - Automatic caching with proper invalidation
 * - Detailed error types for different failure modes
 * - Support for custom codecs and validation
 * - Atomic writes with optional fsync
 *
 * @param config - Configuration for the resource
 * @returns A resource instance with read/write operations
 *
 * @example
 * ```ts
 * // Simple JSON config file
 * const config = Resource.create({
 *   name: 'app-config',
 *   path: './config.json',
 *   emptyValue: { theme: 'dark', debug: false }
 * })
 *
 * // With Zod validation
 * const UserSchema = z.object({
 *   id: z.string().uuid(),
 *   name: z.string().min(1),
 *   role: z.enum(['admin', 'user'])
 * })
 *
 * const users = Resource.create({
 *   name: 'users',
 *   path: './data/users.json',
 *   codec: Codec.fromZod(z.array(UserSchema)),
 *   emptyValue: []
 * })
 *
 * // Handle errors appropriately
 * const data = await users.read()
 * if (Resource.Errors.isNotFound(data)) {
 *   await users.ensureInit()
 * } else if (Resource.Errors.isValidationFailed(data)) {
 *   console.error('Data corruption detected:', data.errors)
 * } else if (!Err.is(data)) {
 *   // data is properly typed as User[]
 *   console.log(`Loaded ${data.length} users`)
 * }
 * ```
 */
export const create = <name extends string, type>(
  config: ResourceConfig<name, type>,
): Resource<name, type> => {
  const codec = config.codec ?? (Json.codec as Codec.Codec<type>)
  const emptyValue = Value.resolveLazyFactory(config.emptyValue)

  // Shared cache for all read operations
  const sharedCache = new Map<unknown, unknown>()

  // Create the base read function that will be memoized
  const readBase = async (dir?: string) => {
    const filePath = Path.ensureAbsoluteWith(dir)(config.path)
    const content = await Fs.read(filePath)

    if (content === null) {
      return Errors.notFound(config.name, filePath)
    }

    try {
      const decoded = codec.decode(content)
      return decoded
    } catch (cause) {
      // Check if this is a Zod validation error
      if (cause && typeof cause === 'object' && 'issues' in cause) {
        return Errors.validationFailed(config.name, filePath, cause)
      }
      return Errors.decodeFailed(config.name, filePath, cause)
    }
  }

  // Create the readOrEmpty function that will be memoized
  const readOrEmptyBase = async (dir?: string) => {
    const filePath = Path.ensureAbsoluteWith(dir)(config.path)
    const content = await Fs.read(filePath)

    if (content === null) {
      return emptyValue()
    }

    try {
      const decoded = codec.decode(content)
      return decoded
    } catch (cause) {
      return Errors.decodeFailed(config.name, filePath, cause)
    }
  }

  // Helper for cache key generation with punning
  // Works for any function where first arg is the cache key
  const createKeyFromFirstArg = (args: readonly unknown[]) => args[0] ?? 'default'

  // Memoize the read functions with shared cache (errors are not cached by default)
  const readMemoized = Cache.memoize(readBase, {
    createKey: createKeyFromFirstArg,
    cache: sharedCache,
  })

  const readOrEmptyMemoized = Cache.memoize(readOrEmptyBase, {
    createKey: createKeyFromFirstArg,
    cache: sharedCache,
  })

  const resource: Resource<name, type> = {
    name: config.name,
    path: config.path,
    codec,

    assertExists: async (dir) => {
      const filePath = Path.ensureAbsoluteWith(dir)(config.path)
      const exists = await Fs.exists(filePath)

      if (!exists) {
        return Errors.notFound(config.name, filePath)
      }

      return undefined
    },

    read: readMemoized,
    readOrEmpty: readOrEmptyMemoized,

    ensureInit: async (dir) => {
      const filePath = Path.ensureAbsoluteWith(dir)(config.path)
      const exists = await Fs.exists(filePath)
      if (!exists) {
        await resource.write(emptyValue(), dir)
      }
    },

    write: async (contents, dir, hard) => {
      const filePath = Path.ensureAbsoluteWith(dir)(config.path)
      const encoded = codec.encode(contents)
      await Fs.write({ path: filePath, content: encoded, hard })
      // Clear shared cache after write to ensure fresh reads
      sharedCache.delete(dir ?? 'default')
    },

    update: async (updater, dir, hard) => {
      const result = await resource.readOrEmpty(dir)

      if (result instanceof Errors.ResourceErrorDecodeFailed) {
        return result
      }

      await updater(result)
      await resource.write(result, dir, hard)

      return undefined
    },
  }

  return resource
}
