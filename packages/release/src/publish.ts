import { FileSystem } from '@effect/platform'
import { Err } from '@kitz/core'
import { Fs } from '@kitz/fs'
import { Effect } from 'effect'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import type { Package } from './discovery.js'

const execAsync = promisify(exec)

// Shared typed path for package.json
const packageJsonRelFile = Fs.Path.RelFile.fromString('./package.json')

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
export const PublishError = Err.TaggedContextualError('PublishError').constrain<{
  readonly package: Fs.Path.AbsDir
  readonly operation: 'read' | 'write' | 'parse' | 'publish'
}>({
  message: (ctx) => `Failed to ${ctx.operation} package at ${Fs.Path.toString(ctx.package)}`,
})

export type PublishError = InstanceType<typeof PublishError>

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
  pkgDir: Fs.Path.AbsDir,
): Effect.Effect<Record<string, unknown>, PublishError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem

    const filePath = Fs.Path.join(pkgDir, packageJsonRelFile)
    const filePathStr = Fs.Path.toString(filePath)

    const content = yield* fs.readFileString(filePathStr).pipe(
      Effect.mapError((cause) =>
        new PublishError({
          context: { package: pkgDir, operation: 'read' },
          cause: cause as any,
        })
      ),
    )

    return yield* Effect.try({
      try: () => JSON.parse(content) as Record<string, unknown>,
      catch: (cause) =>
        new PublishError({
          context: { package: pkgDir, operation: 'parse' },
          cause: cause instanceof Error ? cause : new Error(String(cause)),
        }),
    })
  })

/**
 * Write a package.json file using Effect's FileSystem service.
 */
const writePackageJson = (
  pkgDir: Fs.Path.AbsDir,
  content: Record<string, unknown>,
): Effect.Effect<void, PublishError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem

    const filePath = Fs.Path.join(pkgDir, packageJsonRelFile)
    const filePathStr = Fs.Path.toString(filePath)
    const jsonContent = JSON.stringify(content, null, 2) + '\n'

    yield* fs.writeFileString(filePathStr, jsonContent).pipe(
      Effect.mapError((cause) =>
        new PublishError({
          context: { package: pkgDir, operation: 'write' },
          cause: cause as any,
        })
      ),
    )
  })

/**
 * Inject version into package.json, returning the original version.
 */
export const injectVersion = (
  pkgDir: Fs.Path.AbsDir,
  version: string,
): Effect.Effect<string, PublishError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const pkg = yield* readPackageJson(pkgDir)
    const originalVersion = pkg['version'] as string

    // Update version
    pkg['version'] = version

    // Also update workspace dependency versions to real versions
    // This is needed for packages to correctly reference each other
    yield* writePackageJson(pkgDir, pkg)

    return originalVersion
  })

/**
 * Restore package.json to its original version.
 */
export const restoreVersion = (
  pkgDir: Fs.Path.AbsDir,
  originalVersion: string,
): Effect.Effect<void, PublishError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const pkg = yield* readPackageJson(pkgDir)
    pkg['version'] = originalVersion
    yield* writePackageJson(pkgDir, pkg)
  })

/**
 * Run npm publish for a package.
 */
export const npmPublish = (
  pkgDir: Fs.Path.AbsDir,
  options?: PublishOptions,
): Effect.Effect<void, PublishError> =>
  Effect.gen(function* () {
    const pkgPath = Fs.Path.toString(pkgDir)

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
      catch: (cause) =>
        new PublishError({
          context: { package: pkgDir, operation: 'publish' },
          cause: cause instanceof Error ? cause : new Error(String(cause)),
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
    const pkgDir = release.package.path

    // 1. Inject the new version
    const originalVersion = yield* injectVersion(pkgDir, release.nextVersion)

    // 2. Publish (with guaranteed cleanup)
    yield* Effect.ensuring(
      npmPublish(pkgDir, options),
      // Always restore version, even on failure
      Effect.catchAll(restoreVersion(pkgDir, originalVersion), () => Effect.void),
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
