import { Git, GitError } from '@kitz/git/__'
import * as Semver from '@kitz/semver/__'
import { Effect } from 'effect'

/**
 * Result of monotonic validation for a single release.
 */
export interface ValidationResult {
  readonly valid: boolean
  readonly version: Semver.Semver
  readonly sha: string
  readonly violations: readonly Violation[]
}

/**
 * A violation of monotonic versioning.
 */
export interface Violation {
  readonly existingVersion: Semver.Semver
  readonly existingSha: string
  readonly relationship: 'ancestor' | 'descendant'
  readonly message: string
}

/**
 * Tag info with its commit SHA.
 */
export interface TagInfo {
  readonly tag: string
  readonly version: Semver.Semver
  readonly sha: string
}

/**
 * Get the SHA for a git tag.
 */
export const getTagSha = (tag: string): Effect.Effect<string, GitError, Git> =>
  Effect.gen(function*() {
    const git = yield* Git
    return yield* git.getTagSha(tag)
  })

/**
 * Check if sha1 is an ancestor of sha2.
 *
 * Returns true if sha1 is reachable from sha2 following parent links.
 */
export const isAncestor = (sha1: string, sha2: string): Effect.Effect<boolean, GitError, Git> =>
  Effect.gen(function*() {
    const git = yield* Git
    return yield* git.isAncestor(sha1, sha2)
  })

/**
 * Parse release tags for a package and get their SHAs.
 *
 * Returns tags sorted by version descending.
 */
export const getPackageTagInfos = (
  packageName: string,
  tags: string[],
): Effect.Effect<TagInfo[], GitError, Git> =>
  Effect.gen(function*() {
    const prefix = `${packageName}@`
    const tagInfos: TagInfo[] = []

    for (const tag of tags) {
      if (tag.startsWith(prefix)) {
        const versionPart = tag.slice(prefix.length)
        try {
          // Only consider stable versions (no prerelease)
          const version = Semver.fromString(versionPart)
          if (!versionPart.includes('-')) {
            const sha = yield* getTagSha(tag)
            tagInfos.push({ tag, version, sha })
          }
        } catch {
          // Skip invalid version tags
        }
      }
    }

    // Sort by version descending
    tagInfos.sort((a, b) => -Semver.order(a.version, b.version))
    return tagInfos
  })

/**
 * Validate that a new version can be set at a given SHA without violating
 * monotonic versioning.
 *
 * Uses adjacent-only validation: checks that the new version fits between
 * the immediately preceding and following releases.
 */
export const validateAdjacent = (
  sha: string,
  packageName: string,
  newVersion: Semver.Semver,
  tags: string[],
): Effect.Effect<ValidationResult, GitError, Git> =>
  Effect.gen(function*() {
    const tagInfos = yield* getPackageTagInfos(packageName, tags)

    const violations: Violation[] = []

    // Find all tags that are ancestors (came before) and descendants (came after)
    let highestAncestor: TagInfo | undefined
    let lowestDescendant: TagInfo | undefined

    for (const info of tagInfos) {
      // Check if this tag's commit is an ancestor of the target SHA
      const tagIsAncestor = yield* isAncestor(info.sha, sha)
      if (tagIsAncestor) {
        // This version came before - it should be < newVersion
        if (!highestAncestor || Semver.order(info.version, highestAncestor.version) > 0) {
          highestAncestor = info
        }
      }

      // Check if the target SHA is an ancestor of this tag's commit
      const shaIsAncestor = yield* isAncestor(sha, info.sha)
      if (shaIsAncestor) {
        // This version came after - it should be > newVersion
        if (!lowestDescendant || Semver.order(info.version, lowestDescendant.version) < 0) {
          lowestDescendant = info
        }
      }
    }

    // Validate against highest ancestor (must be < newVersion)
    if (highestAncestor && Semver.order(highestAncestor.version, newVersion) >= 0) {
      violations.push({
        existingVersion: highestAncestor.version,
        existingSha: highestAncestor.sha,
        relationship: 'ancestor',
        message: `Version ${highestAncestor.version.version} at ${highestAncestor.sha.slice(0, 7)} is on an EARLIER commit but has version >= ${newVersion.version}`,
      })
    }

    // Validate against lowest descendant (must be > newVersion)
    if (lowestDescendant && Semver.order(lowestDescendant.version, newVersion) <= 0) {
      violations.push({
        existingVersion: lowestDescendant.version,
        existingSha: lowestDescendant.sha,
        relationship: 'descendant',
        message: `Version ${lowestDescendant.version.version} at ${lowestDescendant.sha.slice(0, 7)} is on a LATER commit but has version <= ${newVersion.version}`,
      })
    }

    return {
      valid: violations.length === 0,
      version: newVersion,
      sha,
      violations,
    }
  })

/**
 * Result of a full history audit.
 */
export interface AuditResult {
  readonly packageName: string
  readonly valid: boolean
  readonly releases: readonly TagInfo[]
  readonly violations: readonly AuditViolation[]
}

/**
 * A violation found during audit.
 */
export interface AuditViolation {
  readonly earlier: TagInfo
  readonly later: TagInfo
  readonly message: string
}

/**
 * Audit the entire release history for a package.
 *
 * Verifies that versions are strictly monotonically increasing with commit order.
 */
export const auditPackageHistory = (
  packageName: string,
  tags: string[],
): Effect.Effect<AuditResult, GitError, Git> =>
  Effect.gen(function*() {
    const tagInfos = yield* getPackageTagInfos(packageName, tags)
    const violations: AuditViolation[] = []

    // For each pair of releases, verify ordering
    for (let i = 0; i < tagInfos.length; i++) {
      for (let j = i + 1; j < tagInfos.length; j++) {
        const a = tagInfos[i]!
        const b = tagInfos[j]!

        // Check if a is ancestor of b (a came before b)
        const aIsAncestorOfB = yield* isAncestor(a.sha, b.sha)
        // Check if b is ancestor of a (b came before a)
        const bIsAncestorOfA = yield* isAncestor(b.sha, a.sha)

        if (aIsAncestorOfB) {
          // a came before b, so a.version should be < b.version
          if (Semver.order(a.version, b.version) >= 0) {
            violations.push({
              earlier: a,
              later: b,
              message: `${a.version.version} at ${a.sha.slice(0, 7)} comes BEFORE ${b.version.version} at ${b.sha.slice(0, 7)}, but has higher/equal version`,
            })
          }
        } else if (bIsAncestorOfA) {
          // b came before a, so b.version should be < a.version
          if (Semver.order(b.version, a.version) >= 0) {
            violations.push({
              earlier: b,
              later: a,
              message: `${b.version.version} at ${b.sha.slice(0, 7)} comes BEFORE ${a.version.version} at ${a.sha.slice(0, 7)}, but has higher/equal version`,
            })
          }
        }
        // If neither is ancestor of the other, they're on parallel branches - no violation
      }
    }

    return {
      packageName,
      valid: violations.length === 0,
      releases: tagInfos,
      violations,
    }
  })
