import { Err } from '@kitz/core'
import { Git } from '@kitz/git'
import { Effect } from 'effect'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import type { ReleaseInfo } from './publish.js'

const execAsync = promisify(exec)

/**
 * Error during preflight checks.
 */
export const PreflightError = Err.TaggedContextualError('PreflightError').constrain<{
  readonly check: 'npm-auth' | 'git-clean' | 'git-remote' | 'tag-exists'
  readonly detail: string
}>({
  message: (ctx) => `Preflight check failed (${ctx.check}): ${ctx.detail}`,
})

export type PreflightError = InstanceType<typeof PreflightError>

/**
 * Result of preflight checks.
 */
export interface PreflightResult {
  readonly npmUser: string
  readonly gitRemote: string
  readonly existingTags: string[]
}

/**
 * Check npm authentication.
 *
 * Runs `npm whoami` to verify that npm auth is configured.
 */
export const checkNpmAuth = (
  registry?: string,
): Effect.Effect<string, PreflightError> =>
  Effect.gen(function*() {
    const args = ['whoami']
    if (registry) {
      args.push('--registry', registry)
    }

    const command = `npm ${args.join(' ')}`

    const result = yield* Effect.tryPromise({
      try: async () => {
        const { stdout } = await execAsync(command)
        return stdout.trim()
      },
      catch: (cause) =>
        new PreflightError({
          context: {
            check: 'npm-auth',
            detail: `npm auth failed. Run 'npm login' to authenticate. ${
              cause instanceof Error ? cause.message : String(cause)
            }`,
          },
          ...(cause instanceof Error && { cause }),
        }),
    })

    if (!result) {
      return yield* Effect.fail(
        new PreflightError({
          context: {
            check: 'npm-auth',
            detail: 'npm whoami returned empty - check your npm authentication',
          },
        }),
      )
    }

    yield* Effect.log(`Preflight: npm authenticated as '${result}'`)
    return result
  })

/**
 * Check that git working directory is clean.
 */
export const checkGitClean = (): Effect.Effect<void, PreflightError | Git.GitError, Git.Git> =>
  Effect.gen(function*() {
    const git = yield* Git.Git
    const isClean = yield* git.isClean()

    if (!isClean) {
      return yield* Effect.fail(
        new PreflightError({
          context: {
            check: 'git-clean',
            detail: 'Working directory has uncommitted changes',
          },
        }),
      )
    }

    yield* Effect.log('Preflight: git working directory is clean')
  })

/**
 * Check that git remote is reachable.
 */
export const checkGitRemote = (
  remote = 'origin',
): Effect.Effect<string, PreflightError | Git.GitError, Git.Git> =>
  Effect.gen(function*() {
    const git = yield* Git.Git
    const url = yield* git.getRemoteUrl(remote)

    yield* Effect.log(`Preflight: git remote '${remote}' is reachable at ${url}`)
    return url
  })

/**
 * Check that planned tags don't already exist.
 */
export const checkTagsNotExist = (
  releases: ReleaseInfo[],
): Effect.Effect<string[], PreflightError, Git.Git> =>
  Effect.gen(function*() {
    const git = yield* Git.Git

    const existingTags = yield* git.getTags().pipe(
      Effect.mapError((e) =>
        new PreflightError({
          context: {
            check: 'tag-exists',
            detail: `Failed to get existing tags: ${e.message}`,
          },
          cause: e,
        })
      ),
    )

    const existingTagSet = new Set(existingTags)
    const plannedTags = releases.map((r) => `${r.package.name}@${r.nextVersion.version}`)
    const conflicts = plannedTags.filter((tag) => existingTagSet.has(tag))

    if (conflicts.length > 0) {
      return yield* Effect.fail(
        new PreflightError({
          context: {
            check: 'tag-exists',
            detail: `Tags already exist: ${conflicts.join(', ')}. Use a different version or delete the existing tags.`,
          },
        }),
      )
    }

    yield* Effect.log(`Preflight: ${plannedTags.length} tags verified not to exist`)
    return existingTags
  })

/**
 * Options for preflight checks.
 */
export interface PreflightOptions {
  /** npm registry URL */
  readonly registry?: string
  /** git remote name (default: 'origin') */
  readonly remote?: string
  /** Skip npm auth check (e.g., for dry run) */
  readonly skipNpmAuth?: boolean
  /** Skip git clean check */
  readonly skipGitClean?: boolean
}

/**
 * Run all preflight checks.
 *
 * Validates that the environment is ready for a release:
 * - npm authentication works
 * - git working directory is clean
 * - git remote is reachable
 * - planned tags don't already exist
 *
 * @example
 * ```ts
 * const preflight = await Effect.runPromise(
 *   Effect.provide(Preflight.run(plan.releases), GitLive)
 * )
 * console.log(`Publishing as ${preflight.npmUser}`)
 * ```
 */
export const run = (
  releases: ReleaseInfo[],
  options?: PreflightOptions,
): Effect.Effect<PreflightResult, PreflightError | Git.GitError, Git.Git> =>
  Effect.gen(function*() {
    yield* Effect.log('Running preflight checks...')

    // Run checks in parallel where possible
    const [npmUser, gitRemote, existingTags] = yield* Effect.all(
      [
        options?.skipNpmAuth
          ? Effect.succeed('(skipped)')
          : checkNpmAuth(options?.registry),
        checkGitRemote(options?.remote),
        checkTagsNotExist(releases),
      ],
      { concurrency: 'unbounded' },
    )

    // Git clean check runs separately (doesn't need to be parallel)
    if (!options?.skipGitClean) {
      yield* checkGitClean()
    }

    yield* Effect.log('All preflight checks passed')

    return {
      npmUser,
      gitRemote,
      existingTags,
    }
  })
