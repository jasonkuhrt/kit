import { Data, Effect } from 'effect'

/**
 * Error fetching from npm registry.
 */
export class NpmRegistryError extends Data.TaggedError('NpmRegistryError')<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Package version info from npm.
 */
export interface PackageVersion {
  readonly version: string
  readonly publishedAt: string
}

/**
 * Options for registry queries.
 */
export interface RegistryOptions {
  /** Registry URL (defaults to https://registry.npmjs.org) */
  readonly registry?: string
}

const DEFAULT_REGISTRY = 'https://registry.npmjs.org'

/**
 * Get all published versions of a package.
 *
 * @example
 * ```ts
 * const versions = await Effect.runPromise(getVersions('@kitz/core'))
 * // ['0.0.1', '0.0.2', '0.1.0']
 * ```
 */
export const getVersions = (
  packageName: string,
  options?: RegistryOptions,
): Effect.Effect<string[], NpmRegistryError> =>
  Effect.tryPromise({
    try: async () => {
      const registry = options?.registry ?? DEFAULT_REGISTRY
      const encodedName = packageName.replace('/', '%2f')
      const response = await fetch(`${registry}/${encodedName}`)

      if (response.status === 404) {
        return [] // Package not published yet
      }

      if (!response.ok) {
        throw new Error(`Registry returned ${response.status}`)
      }

      const data = (await response.json()) as { versions?: Record<string, unknown> }
      return Object.keys(data.versions ?? {})
    },
    catch: (error) =>
      new NpmRegistryError({
        message: `Failed to fetch versions for ${packageName}`,
        cause: error,
      }),
  })

/**
 * Get the latest published version of a package.
 *
 * @example
 * ```ts
 * const latest = await Effect.runPromise(getLatestVersion('@kitz/core'))
 * // Option.some('0.1.0') or Option.none() if not published
 * ```
 */
export const getLatestVersion = (
  packageName: string,
  options?: RegistryOptions,
): Effect.Effect<string | null, NpmRegistryError> =>
  Effect.tryPromise({
    try: async () => {
      const registry = options?.registry ?? DEFAULT_REGISTRY
      const encodedName = packageName.replace('/', '%2f')
      const response = await fetch(`${registry}/${encodedName}`)

      if (response.status === 404) {
        return null // Package not published yet
      }

      if (!response.ok) {
        throw new Error(`Registry returned ${response.status}`)
      }

      const data = (await response.json()) as { 'dist-tags'?: { latest?: string } }
      return data['dist-tags']?.latest ?? null
    },
    catch: (error) =>
      new NpmRegistryError({
        message: `Failed to fetch latest version for ${packageName}`,
        cause: error,
      }),
  })
