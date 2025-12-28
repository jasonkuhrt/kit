import { Err } from '@kitz/core'
import { Pkg } from '@kitz/pkg'
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
  message: (ctx) => `npm registry ${ctx.operation} for ${ctx.packageName} failed${ctx.detail ? `: ${ctx.detail}` : ''}`,
}).constrainCause<Error>()

export type NpmRegistryError = InstanceType<typeof NpmRegistryError>

/**
 * Error parsing a version string from the registry.
 */
export const SemverParseError = Err.TaggedContextualError('SemverParseError').constrain<{
  readonly version: string
  readonly packageName: string
}>({
  message: (ctx) => `invalid semver "${ctx.version}" from package ${ctx.packageName}`,
}).constrainCause<Error>()

export type SemverParseError = InstanceType<typeof SemverParseError>

// ============================================================================
// Options & Helpers
// ============================================================================

/**
 * Options for registry queries.
 */
export interface RegistryOptions {
  /** Registry URL (defaults to https://registry.npmjs.org) */
  readonly registry?: string
}

const DEFAULT_REGISTRY = 'https://registry.npmjs.org'

/**
 * Fetch package metadata from npm registry.
 */
const fetchPackageMetadata = <$data>(
  moniker: Pkg.Moniker.Moniker,
  operation: NpmRegistryOperation,
  options: RegistryOptions | undefined,
): Effect.Effect<$data | null, NpmRegistryError> =>
  Effect.tryPromise({
    try: async () => {
      const registry = options?.registry ?? DEFAULT_REGISTRY
      const response = await fetch(`${registry}/${moniker.encoded}`)

      if (response.status === 404) {
        return null
      }

      if (!response.ok) {
        throw new Error(`Registry returned ${response.status}`)
      }

      return (await response.json()) as $data
    },
    catch: (cause) =>
      new NpmRegistryError({
        context: { operation, packageName: moniker.moniker },
        cause: cause instanceof Error ? cause : new Error(String(cause)),
      }),
  })

/**
 * Parse a version string, returning an Effect that fails with SemverParseError.
 */
const parseVersion = (version: string, packageName: string): Effect.Effect<Semver.Semver, SemverParseError> =>
  Effect.try({
    try: () => Semver.fromString(version),
    catch: (cause) =>
      new SemverParseError({
        context: { version, packageName },
        cause: cause instanceof Error ? cause : new Error(String(cause)),
      }),
  })

// ============================================================================
// Public API
// ============================================================================

/**
 * Get all published versions of a package.
 *
 * @example
 * ```ts
 * const versions = await Effect.runPromise(getVersions('@kitz/core'))
 * // [Semver.Semver, Semver.Semver, ...]
 * ```
 */
export const getVersions = (
  packageName: string,
  options?: RegistryOptions,
): Effect.Effect<Semver.Semver[], NpmRegistryError | SemverParseError> => {
  const moniker = Pkg.Moniker.parse(packageName)

  return fetchPackageMetadata<{ versions?: Record<string, unknown> }>(moniker, 'getVersions', options).pipe(
    Effect.flatMap((data) => {
      if (data === null) return Effect.succeed([])
      const versionStrings = Object.keys(data.versions ?? {})
      return Effect.all(versionStrings.map((v) => parseVersion(v, packageName)))
    }),
  )
}

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
): Effect.Effect<Semver.Semver | null, NpmRegistryError | SemverParseError> => {
  const moniker = Pkg.Moniker.parse(packageName)

  return fetchPackageMetadata<{ 'dist-tags'?: { latest?: string } }>(moniker, 'getLatestVersion', options).pipe(
    Effect.flatMap((data) => {
      const latest = data?.['dist-tags']?.latest
      if (!latest) return Effect.succeed(null)
      return parseVersion(latest, packageName)
    }),
  )
}
