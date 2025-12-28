import { Err } from '@kitz/core'
import { Semver } from '@kitz/semver'
import { Effect } from 'effect'

// ============================================================================
// Errors
// ============================================================================

/**
 * Npm registry operation names for structured error context.
 */
export type NpmRegistryOperation = 'getVersions' | 'getLatestVersion'

/**
 * Npm registry operation error.
 */
export const NpmRegistryError = Err.TaggedContextualError('NpmRegistryError').constrain<{
  readonly operation: NpmRegistryOperation
  readonly packageName: string
  readonly detail?: string
}>({
  message: (ctx) =>
    `npm registry ${ctx.operation} for ${ctx.packageName} failed${ctx.detail ? `: ${ctx.detail}` : ''}`,
}).constrainCause<Error>()

export type NpmRegistryError = InstanceType<typeof NpmRegistryError>

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
    catch: (cause) =>
      new NpmRegistryError({
        context: { operation: 'getVersions', packageName },
        cause: cause instanceof Error ? cause : new Error(String(cause)),
      }),
  })

/**
 * Get the latest published version of a package.
 *
 * @example
 * ```ts
 * const latest = await Effect.runPromise(getLatestVersion('@kitz/core'))
 * // Semver.Semver or null if not published
 * ```
 */
export const getLatestVersion = (
  packageName: string,
  options?: RegistryOptions,
): Effect.Effect<Semver.Semver | null, NpmRegistryError> =>
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
      const latest = data['dist-tags']?.latest
      return latest ? Semver.fromString(latest) : null
    },
    catch: (cause) =>
      new NpmRegistryError({
        context: { operation: 'getLatestVersion', packageName },
        cause: cause instanceof Error ? cause : new Error(String(cause)),
      }),
  })
