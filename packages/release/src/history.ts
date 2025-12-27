import { Git, GitError } from '@kitz/git/__'
import * as Semver from '@kitz/semver/__'
import { Data, Effect } from 'effect'
import { auditPackageHistory, type AuditResult, validateAdjacent, type ValidationResult } from './monotonic.js'

/**
 * Options for setting a release tag.
 */
export interface SetOptions {
  /** Git commit SHA to tag */
  readonly sha: string
  /** Package name (e.g., '@kitz/core' or 'core') */
  readonly pkg: string
  /** Semver version */
  readonly ver: Semver.Semver
  /** Auto-push tag to remote (default: true) */
  readonly push?: boolean
  /** Move existing tag if it exists at different SHA (default: false) */
  readonly move?: boolean
  /** Remote name for push (default: 'origin') */
  readonly remote?: string
}

/**
 * Result of a history set operation.
 */
export interface SetResult {
  readonly tag: string
  readonly sha: string
  readonly version: Semver.Semver
  readonly action: 'created' | 'moved' | 'unchanged'
  readonly pushed: boolean
}

/**
 * Error for history operations.
 */
export class HistoryError extends Data.TaggedError('HistoryError')<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Error when a tag already exists at a different SHA.
 */
export class TagExistsError extends Data.TaggedError('TagExistsError')<{
  readonly tag: string
  readonly existingSha: string
  readonly requestedSha: string
}> {}

/**
 * Error when monotonic validation fails.
 */
export class MonotonicViolationError extends Data.TaggedError('MonotonicViolationError')<{
  readonly validation: ValidationResult
}> {}

/**
 * Normalize package name to full form.
 *
 * Accepts either full name ('@kitz/core') or scope ('core').
 */
const normalizePackageName = (pkg: string): string => {
  if (pkg.startsWith('@')) return pkg
  return `@kitz/${pkg}`
}

/**
 * Create the tag name for a package version.
 */
const makeTagName = (packageName: string, version: Semver.Semver): string =>
  `${packageName}@${version.version.toString()}`

/**
 * Set a release tag at a specific commit.
 *
 * Validates monotonic versioning before creating the tag.
 *
 * @example
 * ```ts
 * import * as Semver from '@kitz/semver/__'
 *
 * // Set a release tag
 * const result = await Effect.runPromise(
 *   Effect.provide(
 *     set({
 *       sha: 'abc1234',
 *       pkg: '@kitz/core',
 *       ver: Semver.fromString('1.0.0'),
 *     }),
 *     GitLive,
 *   )
 * )
 * ```
 */
export const set = (
  options: SetOptions,
): Effect.Effect<SetResult, HistoryError | TagExistsError | MonotonicViolationError | GitError, Git> =>
  Effect.gen(function*() {
    const git = yield* Git
    const packageName = normalizePackageName(options.pkg)
    const version = options.ver
    const versionString = version.version.toString()
    const tag = makeTagName(packageName, version)
    const push = options.push ?? true
    const move = options.move ?? false
    const remote = options.remote ?? 'origin'

    // Verify SHA exists in repository
    const shaExists = yield* git.commitExists(options.sha)
    if (!shaExists) {
      return yield* Effect.fail(new HistoryError({ message: `Commit ${options.sha} does not exist in repository` }))
    }

    // Get all tags to check for conflicts and validate monotonicity
    const tags = yield* git.getTags()

    // Check if tag already exists
    const existingTagIndex = tags.indexOf(tag)
    if (existingTagIndex !== -1) {
      // Tag exists - check if it's at the same SHA
      const existingSha = yield* git.getTagSha(tag)
      if (existingSha.startsWith(options.sha) || options.sha.startsWith(existingSha)) {
        // Same SHA - idempotent, no-op
        return { tag, sha: options.sha, version, action: 'unchanged' as const, pushed: false }
      }

      // Different SHA - need --move flag
      if (!move) {
        return yield* Effect.fail(
          new TagExistsError({
            tag,
            existingSha,
            requestedSha: options.sha,
          }),
        )
      }

      // Move the tag: delete old, create new
      yield* git.deleteTag(tag)
      yield* git.deleteRemoteTag(tag, remote).pipe(Effect.ignore) // May not exist on remote
    }

    // Validate monotonic versioning (adjacent check)
    const validation = yield* validateAdjacent(options.sha, packageName, version, tags)
    if (!validation.valid) {
      return yield* Effect.fail(new MonotonicViolationError({ validation }))
    }

    // Create the tag
    yield* git.createTagAt(tag, options.sha, `Release ${packageName}@${versionString}`)

    // Push if requested
    if (push) {
      yield* git.pushTag(tag, remote, move) // Force push if moving
    }

    const action = existingTagIndex !== -1 ? 'moved' : 'created'
    return { tag, sha: options.sha, version, action, pushed: push }
  })

/**
 * Options for auditing release history.
 */
export interface AuditOptions {
  /** Specific package to audit (default: all packages) */
  readonly pkg?: string
}

/**
 * Audit release history for monotonic violations.
 *
 * @example
 * ```ts
 * // Audit all packages
 * const results = await Effect.runPromise(
 *   Effect.provide(audit(), GitLive)
 * )
 *
 * // Audit specific package
 * const result = await Effect.runPromise(
 *   Effect.provide(audit({ pkg: '@kitz/core' }), GitLive)
 * )
 * ```
 */
export const audit = (
  options: AuditOptions = {},
): Effect.Effect<AuditResult[], GitError, Git> =>
  Effect.gen(function*() {
    const git = yield* Git
    const tags = yield* git.getTags()

    // Find all packages with release tags
    const packageNames = new Set<string>()
    for (const tag of tags) {
      const atIndex = tag.lastIndexOf('@')
      if (atIndex > 0) {
        // Has @ after position 0 (scoped package)
        const packageName = tag.slice(0, atIndex)
        packageNames.add(packageName)
      }
    }

    // Filter to specific package if requested
    const packagesToAudit = options.pkg
      ? [normalizePackageName(options.pkg)]
      : Array.from(packageNames)

    // Audit each package
    const results: AuditResult[] = []
    for (const packageName of packagesToAudit) {
      const result = yield* auditPackageHistory(packageName, tags)
      results.push(result)
    }

    return results
  })

/**
 * Format a SetResult for display.
 */
export const formatSetResult = (result: SetResult): string => {
  const lines: string[] = []

  switch (result.action) {
    case 'created':
      lines.push(`✓ Created tag ${result.tag} at ${result.sha.slice(0, 7)}`)
      break
    case 'moved':
      lines.push(`✓ Moved tag ${result.tag} to ${result.sha.slice(0, 7)}`)
      break
    case 'unchanged':
      lines.push(`○ Tag ${result.tag} already exists at ${result.sha.slice(0, 7)}`)
      break
  }

  if (result.pushed) {
    lines.push(`  Pushed to remote`)
  }

  return lines.join('\n')
}

/**
 * Format a TagExistsError for display.
 */
export const formatTagExistsError = (error: TagExistsError): string => {
  const lines = [
    `Error: Tag ${error.tag} already exists at ${error.existingSha.slice(0, 7)}`,
    ``,
    `  You requested to set it at ${error.requestedSha.slice(0, 7)}.`,
    `  Use --move to relocate the tag.`,
    ``,
    `  ⚠️  Moving tags may break GitHub releases if immutable releases are enabled.`,
  ]
  return lines.join('\n')
}

/**
 * Format a MonotonicViolationError for display.
 */
export const formatMonotonicViolationError = (error: MonotonicViolationError): string => {
  const { validation } = error
  const lines = [
    `Error: Cannot set ${validation.version.version} at ${validation.sha.slice(0, 7)}`,
    ``,
  ]

  for (const violation of validation.violations) {
    lines.push(`  ${violation.message}`)
  }

  lines.push(``)
  lines.push(`  Hint: Versions must increase with commit order (monotonic versioning).`)

  return lines.join('\n')
}

/**
 * Format AuditResult for display.
 */
export const formatAuditResult = (result: AuditResult): string => {
  const lines: string[] = []

  lines.push(`${result.packageName}:`)

  if (result.valid) {
    lines.push(`  ✓ All ${result.releases.length} releases in valid order`)
  } else {
    for (const violation of result.violations) {
      lines.push(`  ✗ ${violation.message}`)
    }
  }

  return lines.join('\n')
}

/**
 * Format multiple AuditResults for display.
 */
export const formatAuditResults = (results: AuditResult[]): string => {
  const lines: string[] = []

  lines.push(`Auditing release history...`)
  lines.push(``)

  for (const result of results) {
    lines.push(formatAuditResult(result))
  }

  const invalidCount = results.filter((r) => !r.valid).length
  if (invalidCount > 0) {
    lines.push(``)
    lines.push(`${invalidCount} package(s) with violations`)
  } else {
    lines.push(``)
    lines.push(`All packages have valid release history`)
  }

  return lines.join('\n')
}
