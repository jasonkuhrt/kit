import { FileSystem } from '@effect/platform'
import { Data, Effect } from 'effect'
import * as Path from 'node:path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import type { Package } from './discovery.js'

const execAsync = promisify(exec)

/**
 * Minimal release info needed for publishing.
 */
export interface ReleaseInfo {
  readonly package: Package
  readonly nextVersion: string
}

/**
 * Error during publish process.
 */
export class PublishError extends Data.TaggedError('PublishError')<{
  readonly message: string
  readonly package: string
  readonly cause?: unknown
}> {}

/**
 * Options for publishing.
 */
export interface PublishOptions {
  /** npm dist-tag (default: 'latest') */
  readonly tag?: string
  /** Registry URL */
  readonly registry?: string
  /** Skip actual npm publish (dry run) */
  readonly dryRun?: boolean
}

/**
 * Read a package.json file using Effect's FileSystem service.
 */
const readPackageJson = (
  pkgPath: string,
): Effect.Effect<Record<string, unknown>, PublishError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const filePath = Path.join(pkgPath, 'package.json')

    const content = yield* fs.readFileString(filePath).pipe(
      Effect.mapError((error) =>
        new PublishError({
          message: 'Failed to read package.json',
          package: pkgPath,
          cause: error,
        })
      ),
    )

    return yield* Effect.try({
      try: () => JSON.parse(content) as Record<string, unknown>,
      catch: (error) =>
        new PublishError({
          message: 'Failed to parse package.json',
          package: pkgPath,
          cause: error,
        }),
    })
  })

/**
 * Write a package.json file using Effect's FileSystem service.
 */
const writePackageJson = (
  pkgPath: string,
  content: Record<string, unknown>,
): Effect.Effect<void, PublishError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const filePath = Path.join(pkgPath, 'package.json')
    const jsonContent = JSON.stringify(content, null, 2) + '\n'

    yield* fs.writeFileString(filePath, jsonContent).pipe(
      Effect.mapError((error) =>
        new PublishError({
          message: 'Failed to write package.json',
          package: pkgPath,
          cause: error,
        })
      ),
    )
  })

/**
 * Inject version into package.json, returning the original version.
 */
export const injectVersion = (
  pkgPath: string,
  version: string,
): Effect.Effect<string, PublishError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const pkg = yield* readPackageJson(pkgPath)
    const originalVersion = pkg['version'] as string

    // Update version
    pkg['version'] = version

    // Also update workspace dependency versions to real versions
    // This is needed for packages to correctly reference each other
    yield* writePackageJson(pkgPath, pkg)

    return originalVersion
  })

/**
 * Restore package.json to its original version.
 */
export const restoreVersion = (
  pkgPath: string,
  originalVersion: string,
): Effect.Effect<void, PublishError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const pkg = yield* readPackageJson(pkgPath)
    pkg['version'] = originalVersion
    yield* writePackageJson(pkgPath, pkg)
  })

/**
 * Run npm publish for a package.
 */
export const npmPublish = (
  pkgPath: string,
  options?: PublishOptions,
): Effect.Effect<void, PublishError> =>
  Effect.gen(function* () {
    if (options?.dryRun) {
      yield* Effect.log(`[dry-run] Would publish ${pkgPath}`)
      return
    }

    const args = ['publish', '--access', 'public']

    if (options?.tag) {
      args.push('--tag', options.tag)
    }

    if (options?.registry) {
      args.push('--registry', options.registry)
    }

    const command = `npm ${args.join(' ')}`

    yield* Effect.tryPromise({
      try: async () => {
        await execAsync(command, { cwd: pkgPath })
      },
      catch: (error) =>
        new PublishError({
          message: `npm publish failed: ${error}`,
          package: pkgPath,
          cause: error,
        }),
    })
  })

/**
 * Publish a single package with version injection and restoration.
 */
export const publishPackage = (
  release: ReleaseInfo,
  options?: PublishOptions,
): Effect.Effect<void, PublishError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const pkgPath = release.package.path

    // 1. Inject the new version
    const originalVersion = yield* injectVersion(pkgPath, release.nextVersion)

    // 2. Publish (with guaranteed cleanup)
    yield* Effect.ensuring(
      npmPublish(pkgPath, options),
      // Always restore version, even on failure
      Effect.catchAll(restoreVersion(pkgPath, originalVersion), () => Effect.void),
    )
  })

/**
 * Publish all packages in a release plan.
 *
 * Packages are published sequentially to handle dependency ordering.
 */
export const publishAll = (
  releases: ReleaseInfo[],
  options?: PublishOptions,
): Effect.Effect<void, PublishError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    for (const release of releases) {
      yield* publishPackage(release, options)
    }
  })
